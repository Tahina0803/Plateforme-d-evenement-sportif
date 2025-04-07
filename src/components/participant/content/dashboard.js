import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListIcon from '@mui/icons-material/List';
import GroupsIcon from '@mui/icons-material/Groups';
import PaymentIcon from '@mui/icons-material/Payment';
import Profil from './Profil';
import MesInscriptions from './MesInscriptions';
import MonEquipe from './MonEquipe';
import Paiements from './Paiements';
import SuiviActivite from './SuiviActivite';
import Parametres from './Parametres';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';


const actions = [
  { title: 'Mon Profil', description: 'Gérer mon profil', icon: <AccountCircleIcon fontSize="large" />, color: '#20c997', component: <Profil /> },
  { title: 'Mes inscriptions', description: 'Gérer mes inscriptions', icon: <ListIcon fontSize="large" />, color: '#0d6efd', component: <MesInscriptions /> },
  { title: 'Mon équipe', description: 'Gérer mes joueurs', icon: <GroupsIcon fontSize="large" />, color: '#fd7e14', component: <MonEquipe /> },
  { title: 'Paiements', description: 'Suivi des paiements effectués', icon: <PaymentIcon fontSize="large" />, color: '#ffc107', component: <Paiements /> },
  { title: "Calendrier", description: 'Voir les calendriers', icon: <ListIcon  fontSize="large" />, color: '#6f42c1', component: <SuiviActivite /> },
  { title: 'Résultats', description: 'Vois les résultats', icon: <LeaderboardIcon fontSize="large" />, color: '#198754', component: <Parametres /> },
];

const DashboardActions = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Bouton Retour bien positionné en haut à gauche */}
        <Typography
          variant="body2"
          sx={{
            position: 'absolute', // Position absolue pour ne pas bouger avec le contenu
            top: 10, // Décalage du haut
            left: 10, // Décalage de la gauche
            cursor: 'pointer',
            color: 'blue',
            fontWeight: 'bold',
            backgroundColor: 'white',
            p: 1,
            borderRadius: 1,
            boxShadow: 1,
            zIndex: 1000 // Assure qu'il reste au-dessus des autres éléments
          }}
          onClick={() => setSelectedComponent(null)}
        >
          ←
        </Typography>


      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {!selectedComponent ? (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              Bienvenue sur le tableau de bord du participant
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {actions.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{ textAlign: 'center', backgroundColor: action.color, color: '#fff', p: 2, borderRadius: 2, cursor: 'pointer' }}
                    onClick={() => setSelectedComponent(action.component)}
                  >
                    <CardContent>
                      {action.icon}
                      <Typography variant="h6" gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="body2">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Box sx={{ width: '100%' }}>
            {/* Affichage du composant sélectionné */}
            {selectedComponent}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardActions;
