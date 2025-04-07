import React from 'react';  
import { Box, Grid, Paper, Typography } from '@mui/material';  
import EventIcon from '@mui/icons-material/Event';  
import PeopleIcon from '@mui/icons-material/People';  
import FlagIcon from '@mui/icons-material/Flag';  
import LeaderboardIcon from '@mui/icons-material/Leaderboard';  
import LocalAtmIcon from '@mui/icons-material/LocalAtm'; // Pour les paiements ou financement  

const dashboard = () => {  
  return (  
    <Box sx={{ flexGrow: 1, padding: 2 }}>  
      <Typography variant="h4" gutterBottom>  
        Tableau de Bord  
      </Typography>  
      <Grid container spacing={2}>  
        {/* Section Événements */}  
        <Grid item xs={12} sm={6} md={3}>  
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0f7fa' }}>  
            <EventIcon sx={{ fontSize: 50, color: '#0097a7' }} />  
            <Typography variant="h6">Événements</Typography>  
            <Typography variant="h4">10</Typography>  
            <Typography variant="body2">Événements publiés</Typography>  
          </Paper>  
        </Grid>  

        {/* Section Participants */}  
        <Grid item xs={12} sm={6} md={3}>  
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e8f5e9' }}>  
            <PeopleIcon sx={{ fontSize: 50, color: '#388e3c' }} />  
            <Typography variant="h6">Participants</Typography>  
            <Typography variant="h4">250</Typography>  
            <Typography variant="body2">Participants inscrits</Typography>  
          </Paper>  
        </Grid>  

        {/* Section Résultats */}  
        <Grid item xs={12} sm={6} md={3}>  
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>  
            <FlagIcon sx={{ fontSize: 50, color: '#f57c00' }} />  
            <Typography variant="h6">Résultats</Typography>  
            <Typography variant="h4">5</Typography>  
            <Typography variant="body2">Résultats publiés</Typography>  
          </Paper>  
        </Grid>  

        {/* Section Classement */}  
        <Grid item xs={12} sm={6} md={3}>  
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fce4ec' }}>  
            <LeaderboardIcon sx={{ fontSize: 50, color: '#c2185b' }} />  
            <Typography variant="h6">Classement</Typography>  
            <Typography variant="h4">1er</Typography>  
            <Typography variant="body2">Classement actuel</Typography>  
          </Paper>  
        </Grid>  
      </Grid>  

      {/* Liste des événements publiés */}  
      <Box sx={{ marginTop: 4 }}>  
        <Typography variant="h5" gutterBottom>  
          Liste des événements publiés  
        </Typography>  
        <Paper sx={{ padding: 2 }}>  
          <Grid container>  
            <Grid item xs={3}><strong>Type</strong></Grid>  
            <Grid item xs={3}><strong>Propriétaire</strong></Grid>  
            <Grid item xs={2}><strong>Taille</strong></Grid>  
            <Grid item xs={2}><strong>Dernière Modification</strong></Grid>  
            <Grid item xs={2}><strong>Membres</strong></Grid>  
          </Grid>  
          {[  
            { type: 'Événement', owner: 'Moi', size: '2MB', modified: '3 jours', members: 5 },  
            { type: 'Atelier', owner: 'John', size: '1.5MB', modified: '1 jour', members: 3 },  
            { type: 'Conférence', owner: 'Alice', size: '3MB', modified: '1 semaine', members: 10 },  
          ].map((event, index) => (  
            <Grid container key={index}>  
              <Grid item xs={3}>{event.type}</Grid>  
              <Grid item xs={3}>{event.owner}</Grid>  
              <Grid item xs={2}>{event.size}</Grid>  
              <Grid item xs={2}>{event.modified}</Grid>  
              <Grid item xs={2}>{event.members}</Grid>  
            </Grid>  
          ))}  
        </Paper>  
      </Box>  

      {/* Suivi des défis */}  
      <Box sx={{ marginTop: 4 }}>  
        <Typography variant="h5" gutterBottom>  
          Suivi des défis  
        </Typography>  
        <Paper sx={{ padding: 2, backgroundColor: '#e3f2fd' }}>  
          <Typography variant="body1">Fichiers Documentaires : 4530</Typography>  
          <Typography variant="body1">Fichiers Médias : 2380</Typography>  
          <Typography variant="body1">Fichiers Importants : 306</Typography>  
        </Paper>  
      </Box>  
    </Box>  
  );  
};  

export default dashboard;
