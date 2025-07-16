import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

interface MultiStepFormProps {
  onBack: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onBack }) => {
  return (
    <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Client Intake Form (Coming Soon)
      </Typography>
      <Typography variant="body1">
        The multi-step form will appear here.
      </Typography>
      <Button sx={{ mt: 4 }} onClick={onBack}>
        Back to Landing
      </Button>
    </Paper>
  );
};

export default MultiStepForm;