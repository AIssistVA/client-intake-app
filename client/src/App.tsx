import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Container, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import MultiStepForm from './components/MultiStepForm';
import AdminDashboard from './components/AdminDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, // blue
    secondary: { main: '#455a64' }, // gray
    background: { default: '#f4f6fb', paper: '#fff' },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h2: { fontWeight: 700 },
    h5: { fontWeight: 400 },
  },
});

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f0ff 0%, #f4f6fb 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <Container maxWidth="md" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimatePresence>
                    {!showForm && (
                      <motion.div
                        key="landing"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6 }}
                        style={{ width: '100%' }}
                      >
                        <Paper elevation={8} sx={{
                          p: 6,
                          textAlign: 'center',
                          borderRadius: 4,
                          background: 'rgba(255,255,255,0.92)',
                          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                          backdropFilter: 'blur(2px)',
                        }}>
                          <Box mb={3}>
                            <img src="/logo192.png" alt="Company Logo" style={{ height: 64 }} />
                          </Box>
                          <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 800, letterSpacing: 1 }}>
                            Acme Consulting
                          </Typography>
                          <Typography variant="h5" color="secondary" gutterBottom sx={{ fontWeight: 400, letterSpacing: 1 }}>
                            Professional Client Intake
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 4, color: '#455a64' }}>
                            Welcome to our secure client intake portal. Please click below to begin your project intake process.
                          </Typography>
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => setShowForm(true)}
                            sx={{
                              px: 6,
                              py: 1.5,
                              fontWeight: 600,
                              fontSize: '1.1rem',
                              borderRadius: 2,
                              boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                              transition: 'background 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                background: '#1565c0',
                                boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.18)',
                              },
                            }}
                          >
                            Start Intake
                          </Button>
                        </Paper>
                      </motion.div>
                    )}
                    {showForm && (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6 }}
                        style={{ width: '100%' }}
                      >
                        <MultiStepForm onBack={() => setShowForm(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Container>
              }
            />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Box component="footer" sx={{ textAlign: 'center', py: 2, color: 'grey.600', fontSize: 14, mt: 4 }}>
            &copy; {new Date().getFullYear()} Acme Consulting. All rights reserved.
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
