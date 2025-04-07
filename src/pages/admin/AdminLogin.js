// src/pages/admin/AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, Avatar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [succesMessage, setSuccessMessage] = useState('');
  // const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login/admin', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      setSuccessMessage('Connexion réussie! Redirection en cours...');
      //verification du token socké et la redirection
      console.log('Token stocké avec succès :', response.data.token);
      console.log('Redirection vers /admin/dashboard');
      // Utilisation d'un délai pour garantir que tout est prêt avant la redirection
      setTimeout(() => {
         // navigate('/admin/dashboard');
       window.location.href = '/admin/dashboard';
      }, 100); // Attente de 500 ms avant la redirection
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Problème de connexion, veuillez réessayer plus tard');
        } else if (error.response.status === 404) {
          setErrorMessage('Email incorrect, veuillez réessayer.');
        } else {
          setErrorMessage('Mot de passe incorrect, veuillez réessayer.');
        }
      }
    };
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Connexion Administrateur
        </Typography>
        {errorMessage && (
          <Alert severity='error' sx={{width: '100%', mt: 2}}>
            {errorMessage}
          </Alert>
        )}
        {succesMessage && (
          <Alert security='success' sx={{width: '100%', mt: 2}}>
            {succesMessage}
          </Alert>
        )}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Se connecter
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminLogin;
