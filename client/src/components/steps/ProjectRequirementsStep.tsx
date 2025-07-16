import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { FormData } from '../MultiStepForm';

interface Props {
  formData: FormData;
  errors: { [key: string]: string };
  onChange: (field: keyof FormData, value: any) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const ProjectRequirementsStep: React.FC<Props> = ({ formData, errors, onChange }) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" color="primary">Project Requirements</Typography>
      <TextField
        label="Project Requirements"
        value={formData.requirements}
        onChange={e => onChange('requirements', e.target.value)}
        error={!!errors.requirements}
        helperText={errors.requirements}
        required
        multiline
        minRows={3}
      />
      <TextField
        label="Timeline (e.g. Q3 2024, or a date)"
        value={formData.timeline}
        onChange={e => onChange('timeline', e.target.value)}
        error={!!errors.timeline}
        helperText={errors.timeline}
        required
      />
    </Box>
  );
};

export default ProjectRequirementsStep;