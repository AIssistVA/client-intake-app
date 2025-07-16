import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FormData } from '../MultiStepForm';

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  'Over $50,000',
];

interface Props {
  formData: FormData;
  errors: { [key: string]: string };
  onChange: (field: keyof FormData, value: any) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const BudgetStep: React.FC<Props> = ({ formData, errors, onChange }) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" color="primary">Budget Range</Typography>
      <FormControl required error={!!errors.budget}>
        <InputLabel>Budget</InputLabel>
        <Select
          value={formData.budget}
          label="Budget"
          onChange={e => onChange('budget', e.target.value)}
        >
          {budgetRanges.map(range => (
            <MenuItem key={range} value={range}>{range}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BudgetStep;