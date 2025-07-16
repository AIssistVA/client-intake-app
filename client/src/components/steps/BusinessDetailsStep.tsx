import React from 'react';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FormData } from '../MultiStepForm';

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Education',
  'Manufacturing',
  'Other',
];

interface Props {
  formData: FormData;
  errors: { [key: string]: string };
  onChange: (field: keyof FormData, value: any) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const BusinessDetailsStep: React.FC<Props> = ({ formData, errors, onChange }) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" color="primary">Business Details</Typography>
      <TextField
        label="Company Name"
        value={formData.company}
        onChange={e => onChange('company', e.target.value)}
        error={!!errors.company}
        helperText={errors.company}
        required
      />
      <FormControl required error={!!errors.industry}>
        <InputLabel>Industry</InputLabel>
        <Select
          value={formData.industry}
          label="Industry"
          onChange={e => onChange('industry', e.target.value)}
        >
          {industries.map(ind => (
            <MenuItem key={ind} value={ind}>{ind}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BusinessDetailsStep;