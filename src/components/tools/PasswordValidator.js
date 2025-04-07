import React from 'react';
import { Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PasswordValidator = ({ criteriaResults }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" gutterBottom>
        Votre mot de passe doit contenir :
        {criteriaResults.map((criterion, index) => (
          <Box
            key={index}
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', ml: 1, color: criterion.passed ? 'green' : 'red', fontSize: '0.750rem' }}
          >
            {criterion.passed ? (
              <CheckCircleIcon sx={{ fontSize: 8, mr: 0.5 }} />
            ) : (
              <CancelIcon sx={{ fontSize: 8, mr: 0.5 }} />
            )}
            <Typography component="span" sx={{ color: 'inherit', fontSize: 'inherit' }}>
              {criterion.label}
            </Typography>
            {index < criteriaResults.length - 1 ? ',' : '.'}
          </Box>
        ))}
      </Typography>
    </Box>
  );
};

export default PasswordValidator;
