import React, { useState } from 'react';
import { Paper, Typography, Button, Stepper, Step, StepLabel, Box, LinearProgress } from '@mui/material';
import ContactInfoStep from './steps/ContactInfoStep';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import ProjectRequirementsStep from './steps/ProjectRequirementsStep';
import BudgetStep from './steps/BudgetStep';
import FileUploadStep from './steps/FileUploadStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';
import axios from 'axios';

const steps = [
  'Contact Info',
  'Business Details',
  'Project Requirements',
  'Budget',
  'File Upload',
  'Review & Submit',
];

export interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  requirements: string;
  timeline: string;
  budget: string;
  files: File[];
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  requirements: '',
  timeline: '',
  budget: '',
  files: [],
};

interface MultiStepFormProps {
  onBack: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (activeStep === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    } else if (activeStep === 1) {
      if (!formData.company.trim()) newErrors.company = 'Company is required';
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    } else if (activeStep === 2) {
      if (!formData.requirements.trim()) newErrors.requirements = 'Project requirements are required';
      if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required';
    } else if (activeStep === 3) {
      if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleFileChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, files }));
  };
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'files') {
          (value as File[]).forEach((file) => form.append('files', file));
        } else {
          form.append(key, value as string);
        }
      });
      await axios.post('http://localhost:4000/submit', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitting(false);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitting(false);
      setSubmitError('Submission failed. Please try again.');
    }
  };

  const stepProps = {
    formData,
    errors,
    onChange: handleChange,
    onFileChange: handleFileChange,
    setErrors,
  };

  if (submitted) {
    return (
      <Paper elevation={4} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Thank you for your submission!
        </Typography>
        <Typography variant="body1">
          We have received your intake form and will contact you soon.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 600, mx: 'auto' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mb: 2 }}>
        <LinearProgress variant="determinate" value={((activeStep) / steps.length) * 100} />
      </Box>
      {activeStep === 0 && <ContactInfoStep {...stepProps} />}
      {activeStep === 1 && <BusinessDetailsStep {...stepProps} />}
      {activeStep === 2 && <ProjectRequirementsStep {...stepProps} />}
      {activeStep === 3 && <BudgetStep {...stepProps} />}
      {activeStep === 4 && <FileUploadStep {...stepProps} />}
      {activeStep === 5 && <ReviewSubmitStep {...stepProps} submitting={submitting} />}
      {submitError && (
        <Typography color="error" sx={{ mt: 2 }}>{submitError}</Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
        <Button onClick={onBack} color="secondary">
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default MultiStepForm;