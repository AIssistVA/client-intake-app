import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Table, TableHead, TableRow, TableCell, TableBody, Link, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

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
      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Typography variant="h5" mb={2}>Admin Login</Typography>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleLogin} fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Admin Dashboard</Typography>
      <Button variant="outlined" onClick={handleExport} sx={{ mb: 2 }}>Export CSV</Button>
      {loading ? <CircularProgress /> : (
        <Paper sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
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
        </Paper>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AdminDashboard;