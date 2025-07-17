import React, { useRef } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { FormData } from '../MultiStepForm';

interface Props {
  formData: FormData;
  errors: { [key: string]: string };
  onFileChange: (files: File[]) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const FileUploadStep: React.FC<Props> = ({ formData, onFileChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileChange(Array.from(e.target.files));
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" color="primary">Upload Documents</Typography>
      <Button variant="outlined" onClick={() => inputRef.current?.click()}>
        Select Files
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,image/*"
        style={{ display: 'none' }}
        onChange={handleFiles}
      />
      {formData.files.length > 0 && (
        <List>
          {formData.files.map((file, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUploadStep;