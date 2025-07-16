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
        <Routes>
          <Route
            path="/"
            element={
              <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                      <Paper elevation={4} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                        <Box mb={3}>
                          <img src="/logo192.png" alt="Company Logo" style={{ height: 64 }} />
                        </Box>
                        <Typography variant="h2" color="primary" gutterBottom>
                          Acme Consulting
                        </Typography>
                        <Typography variant="h5" color="secondary" gutterBottom>
                          Professional Client Intake
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                          Welcome to our secure client intake portal. Please click below to begin your project intake process.
                        </Typography>
                        <Button
                          variant="contained"
                          size="large"
                          color="primary"
                          onClick={() => setShowForm(true)}
                          sx={{ px: 6, py: 1.5, fontWeight: 600, fontSize: '1.1rem', borderRadius: 2 }}
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
