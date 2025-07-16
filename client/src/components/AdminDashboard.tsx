import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Table, TableHead, TableRow, TableCell, TableBody, Link, CircularProgress, Alert, Divider } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:4000';

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { password });
      setToken(res.data.token);
      localStorage.setItem('adminToken', res.data.token);
    } catch (e: any) {
      setError('Invalid password');
    }
    setLoading(false);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch (e: any) {
      setError('Failed to fetch submissions');
      if (e.response && e.response.status === 401) {
        setToken('');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchSubmissions();
    // eslint-disable-next-line
  }, [token]);

  const handleExport = () => {
    const csvRows = [
      ['Name', 'Email', 'Phone', 'Company', 'Industry', 'Requirements', 'Timeline', 'Budget', 'Files', 'Submitted At'],
      ...submissions.map(s => [
        s.name,
        s.email,
        s.phone,
        s.company,
        s.industry,
        s.requirements,
        s.timeline,
        s.budget,
        JSON.parse(s.files || '[]').map((f: any) => f.url).join('; '),
        s.created_at,
      ]),
    ];
    const csvContent = csvRows.map(row => row.map(field => '"' + (field || '').replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8, background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', borderRadius: 4, textAlign: 'center' }}>
        <Box mb={2}>
          <img src="/logo192.png" alt="Company Logo" style={{ height: 48 }} />
        </Box>
        <Typography variant="h5" mb={2}>Admin Login</Typography>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleLogin} fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 600 }}>
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ p: { xs: 1, sm: 4 } }}>
        <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
          <Typography variant="h4" mb={3} sx={{ fontWeight: 700, letterSpacing: 1 }}>Admin Dashboard</Typography>
          <Button variant="outlined" onClick={handleExport} sx={{ mb: 2 }}>Export CSV</Button>
          <Divider sx={{ mb: 2, opacity: 0.15 }} />
          {loading ? <CircularProgress /> : (
            <Box sx={{ overflow: 'auto' }}>
              <Table>
                <TableHead sx={{ position: 'sticky', top: 0, background: 'rgba(245,247,250,0.97)', zIndex: 1 }}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Industry</TableCell>
                    <TableCell>Requirements</TableCell>
                    <TableCell>Timeline</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Files</TableCell>
                    <TableCell>Submitted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((s, idx) => (
                    <TableRow key={s.id || idx}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>{s.company}</TableCell>
                      <TableCell>{s.industry}</TableCell>
                      <TableCell>{s.requirements}</TableCell>
                      <TableCell>{s.timeline}</TableCell>
                      <TableCell>{s.budget}</TableCell>
                      <TableCell>
                        {JSON.parse(s.files || '[]').map((f: any, i: number) => (
                          <Link key={i} href={f.url} target="_blank" rel="noopener" underline="hover">{f.originalname}</Link>
                        ))}
                      </TableCell>
                      <TableCell>{s.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
      </Box>
    </motion.div>
  );
};

export default AdminDashboard;