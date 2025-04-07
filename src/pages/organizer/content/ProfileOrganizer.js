import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';

const ProfileOrganizer = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    tel_organisateur: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/organizer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          prenom: response.data.prenom,
          email: response.data.email,
          tel_organisateur: response.data.tel_organisateur,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.put(
        'http://localhost:3001/api/organizer/profile',
        {
          name: formData.name,
          prenom: formData.prenom,
          email: formData.email,
          tel_organisateur: String(formData.tel_organisateur), // Conversion en string
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setProfile({
        ...profile,
        name: formData.name,
        prenom: formData.prenom,
        email: formData.email,
        tel_organisateur: formData.tel_organisateur,
      });
  
      setEditMode(false);
      alert("Profil mis à jour avec succès");
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };
  

  if (!profile) {
    return <Typography>Chargement des informations de profil...</Typography>;
  }

  const registrationDate = profile.date_inscription
    ? new Date(profile.date_inscription).toLocaleDateString("fr-FR")
    : 'Non disponible';

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <Typography variant="h4" gutterBottom>PROFIL DE L'ORGANISATEUR</Typography>
      {editMode ? (
        <>
          <TextField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Téléphone"
            name="tel_organisateur"
            value={formData.tel_organisateur}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ancien mot de passe"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Entrez votre ancien mot de passe pour le changer"
          />
          <TextField
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Laissez vide si vous ne souhaitez pas le changer"
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            Enregistrer
          </Button>
          <Button variant="text" onClick={() => setEditMode(false)} sx={{ mt: 2, ml: 4 }}>
            Annuler
          </Button>
        </>
      ) : (
        <>
          <Grid container spacing={1} rowSpacing={3} sx={{ mt: 1.5, ml:4 }}>
            <Grid item xs={4}>
              <Typography><strong>Nom</strong></Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography><strong>:</strong></Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>{profile.name}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography><strong>Prénom</strong></Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography><strong>:</strong></Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>{profile.prenom}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography><strong>Email</strong></Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography><strong>:</strong></Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>{profile.email}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography><strong>Téléphone</strong></Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography><strong>:</strong></Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>{profile.tel_organisateur}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography><strong>Date d'inscription</strong></Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography><strong>:</strong></Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>{registrationDate}</Typography>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 6, ml:4 }}>
            Modifier le profil
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProfileOrganizer;