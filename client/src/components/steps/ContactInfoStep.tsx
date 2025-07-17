import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { FormData } from '../MultiStepForm';

interface Props {
  formData: FormData;
  errors: { [key: string]: string };
  onChange: (field: keyof FormData, value: any) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const ContactInfoStep: React.FC<Props> = ({ formData, errors, onChange }) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" color="primary">Contact Information</Typography>
      <TextField
        label="Full Name"
        value={formData.name}
        onChange={e => onChange('name', e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={e => onChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        required
      />
      <TextField
        label="Phone Number"
        value={formData.phone}
        onChange={e => onChange('phone', e.target.value)}
        error={!!errors.phone}
        helperText={errors.phone}
        required
      />
    </Box>
  );
};

export default ContactInfoStep;