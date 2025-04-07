import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, TextField, Button, Grid } from '@mui/material';

const Profil = ({ participantId: propParticipantId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // ✅ Récupérer l'ID du participant depuis localStorage si non fourni en prop
  const participantId = propParticipantId || localStorage.getItem('participantId');

  console.log("ID du participant récupéré :", participantId); // 🔹 Debugging

  const [formData, setFormData] = useState({
    nom_part: '',
    email_part: '',
    telephone_part: '',
    genre_part: '',
    ville_part: '',
    codepostal_part: '',
    statut_part: '',
    date_inscription: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!participantId) {
      console.error("⚠️ Aucun ID de participant trouvé !");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("🔍 Token stocké:", localStorage.getItem("token"));

        if (!token) {
          console.error("⚠️ Aucun token trouvé !");
          setLoading(false);
          return;
        }

        console.log(`📡 Requête API: /api/participant/profile/${participantId}`);

        const response = await axios.get(`http://localhost:3001/api/participant/profile/${participantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Données reçues :", response.data); // 🔹 Debugging

        setProfileData(response.data);
        setFormData({
          nom_part: response.data.nom_part || '',
          email_part: response.data.email_part || '',
          telephone_part: response.data.telephone_part || '',
          genre_part: response.data.genre_part || '',
          ville_part: response.data.ville_part || '',
          codepostal_part: response.data.codepostal_part || '',
          statut_part: response.data.statut_part || '',
          date_inscription: response.data.date_inscription || '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

      } catch (error) {
        console.error('❌ Erreur lors de la récupération des données du profil :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [participantId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `http://localhost:3001/api/participant/profile/${participantId}`,
        {
          nom_part: formData.nom_part,
          email_part: formData.email_part,
          telephone_part: String(formData.telephone_part),
          genre_part: formData.genre_part,
          ville_part: formData.ville_part,
          codepostal_part: formData.codepostal_part,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfileData({
        ...profileData,
        nom_part: formData.nom_part,
        email_part: formData.email_part,
        telephone_part: formData.telephone_part,
        genre_part: formData.genre_part,
        ville_part: formData.ville_part,
        codepostal_part: formData.codepostal_part,
      });

      setEditMode(false);
      alert("✅ Profil mis à jour avec succès");
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      alert("❌ Erreur lors de la mise à jour du profil");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profileData) {
    return <Typography color="error" align="center">⚠️ Aucune donnée trouvée.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        👤 Profil du Participant
      </Typography>

      {editMode ? (
        <>
          <TextField label="Nom" name="nom_part" value={formData.nom_part} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Email" name="email_part" value={formData.email_part} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Téléphone" name="telephone_part" value={formData.telephone_part} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Genre" name="genre_part" value={formData.genre_part} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Ville" name="ville_part" value={formData.ville_part} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Code Postal" name="codepostal_part" value={formData.codepostal_part} onChange={handleChange} fullWidth margin="normal" />

          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            ✅ Enregistrer
          </Button>
          <Button variant="outlined" onClick={() => setEditMode(false)} sx={{ mt: 2, ml: 2 }}>
            ❌ Annuler
          </Button>
        </>
      ) : (
        <>
          <Grid container spacing={1} rowSpacing={2} sx={{ mt: 1.5, pl: 2 }}>
            <ProfileRow label="Nom" value={profileData.nom_part} />
            <ProfileRow label="Email" value={profileData.email_part} />
            <ProfileRow label="Téléphone" value={profileData.telephone_part} />
            <ProfileRow label="Genre" value={profileData.genre_part} />
            <ProfileRow label="Ville" value={profileData.ville_part} />
            <ProfileRow label="Code Postal" value={profileData.codepostal_part} />
            <ProfileRow label="Statut" value={profileData.statut_part} />
            <ProfileRow
              label="Date d'inscription"
              value={new Date(profileData.date_inscription).toISOString().split('T')[0]}
            />
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
              ✏️ Modifier le profil
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

const ProfileRow = ({ label, value }) => (
  <Grid container spacing={1}>
    <Grid item xs={4}>
      <Typography sx={{ textAlign: 'left', p: 1 }}><strong>{label}</strong></Typography>
    </Grid>
    <Grid item xs={1}>
      <Typography>:</Typography>
    </Grid>
    <Grid item xs={7}>
      <Typography sx={{ textAlign: 'left', p: 1 }}>{value || 'N/A'}</Typography>
    </Grid>
  </Grid>
);

export default Profil;



