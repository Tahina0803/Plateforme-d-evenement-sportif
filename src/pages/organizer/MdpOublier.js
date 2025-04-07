import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const MdpOublier = () => {
  const [step, setStep] = useState(1); // Étape actuelle : 1, 2, ou 3
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Étape 1 : Envoyer le code de réinitialisation
  const handleSendCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/organizer/send-reset-code', { email });
      setMessage(response.data.message);
      setStep(2); // Passer à l'étape 2
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Étape 2 : Vérifier le code
  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/organizer/verify-reset-code', { email, code });
      setMessage(response.data.message);
      setStep(3); // Passer à l'étape 3
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  // Étape 3 : Réinitialiser le mot de passe
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/organizer/reset-password', {
        email,
        password: newPassword,
      });
      setMessage(response.data.message);
      setStep(1); // Réinitialisation terminée, revenir à l'étape initiale
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '25px',
        width: '350px',
        margin: '0 auto',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <Typography variant="h5">Réinitialisation du mot de passe</Typography>
      
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}

      {step === 1 && (
        <>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSendCode}>
            Envoyer le code
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <TextField
            label="Code de réinitialisation"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleVerifyCode}>
            Vérifier le code
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <TextField
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleResetPassword}>
            Réinitialiser le mot de passe
          </Button>
        </>
      )}
    </Box>
  );
};

export default MdpOublier;
