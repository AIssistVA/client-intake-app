import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { FormData } from '../MultiStepForm';

interface Props {
  formData: FormData;
  submitting: boolean;
}

const ReviewSubmitStep: React.FC<Props> = ({ formData, submitting }) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" color="primary">Review & Submit</Typography>
      <List>
        <ListItem><ListItemText primary="Name" secondary={formData.name} /></ListItem>
        <ListItem><ListItemText primary="Email" secondary={formData.email} /></ListItem>
        <ListItem><ListItemText primary="Phone" secondary={formData.phone} /></ListItem>
        <ListItem><ListItemText primary="Company" secondary={formData.company} /></ListItem>
        <ListItem><ListItemText primary="Industry" secondary={formData.industry} /></ListItem>
        <ListItem><ListItemText primary="Requirements" secondary={formData.requirements} /></ListItem>
        <ListItem><ListItemText primary="Timeline" secondary={formData.timeline} /></ListItem>
        <ListItem><ListItemText primary="Budget" secondary={formData.budget} /></ListItem>
        <ListItem>
          <ListItemText
            primary="Files"
            secondary={formData.files.length > 0 ? formData.files.map(f => f.name).join(', ') : 'No files uploaded'}
          />
        </ListItem>
      </List>
      <Divider />
      {submitting && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={24} />
          <Typography>Submitting...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReviewSubmitStep;