import React, { useEffect, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const [mailLink, setMailLink] = useState('https://mail.google.com');
  const email = location.state?.email || ''; // Récupère l'email depuis l'état de navigation

  useEffect(() => {
    if (email) {
      const domain = email.split('@')[1];
      if (domain === 'gmail.com') {
        setMailLink('https://mail.google.com');
      } else if (domain === 'yahoo.com') {
        setMailLink('https://mail.yahoo.com');
      } else if (domain === 'outlook.com' || domain === 'hotmail.com') {
        setMailLink('https://outlook.live.com');
      } else {
        setMailLink(`https://${domain}`);
      }
    }
  }, [email]);

  return (
    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4">Vérifiez votre email</Typography>
      <Typography variant="body1" sx={{ marginTop: '10px' }}>
        Un lien d'activation a été envoyé à votre adresse email : {email}
      </Typography>
      <Link 
        href={mailLink} 
        target="_blank" 
        rel="noopener noreferrer"
        sx={{ display: 'block', marginTop: '10px' }}
      >
        Accéder à votre boîte mail
      </Link>
    </Box>
  );
};

export default ConfirmationPage;
