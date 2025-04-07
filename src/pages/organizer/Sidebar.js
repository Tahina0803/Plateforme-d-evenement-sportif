
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import ListIcon from '@mui/icons-material/List';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import GroupIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsIcon from '@mui/icons-material/Sports';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { Link, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Box, Typography } from '@mui/material';
import { LocalActivity } from '@mui/icons-material';

// Définition du menu de navigation
export const NAVIGATION = [
  {
    segment: 'home',
    title: (
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit'}}>
        Accueil
      </Link>
    ),
    icon: <Link to={"/"} style={{color: 'inherit'}}><HomeIcon/></Link>
  },
  // {
  //   segment: 'dashboard',
  //   title: 'Tableau de Bord',
  //   icon: <DashboardIcon />,
  // },
  {
    segment: 'ProfileOrganizer',
    title: 'Profil',
    icon: <AccountCircleIcon />,
  },
  {
    kind: 'header',
    title: 'Planification d\'Événements',
  },
  {
    segment: 'CreateEvent',
    title: 'Créer un Événement',
    icon: <EventIcon />,
  },
  {
    segment: 'ListEvent',
    title: 'Liste des Événements',
    icon: <ListIcon />,
  },
  {
    kind: 'header',
    title: 'Participants',
  },
  {
    title: 'Liste des Participants',
    segment: 'ListeParticipants',
    icon: <GroupIcon />,
  },
  {
    kind: 'header',
    title: 'Gestion de rencontre',
  },
  {
    title: 'Créer le poule',
    segment: 'CreatePoules',
    icon: <AddCircleIcon />,
  },
  {
    title: 'Créer un rencontre',
    segment: 'CreateMatch',
    icon: <SportsIcon />,
  },
  {
    title: 'Calendrier de rencontre',
    segment: 'CalendrierRencontre',
    icon: <AddCircleIcon />,
  },
  {
    kind: 'header',
    title: 'Résultat et classement',
  },
  {
    title: 'Ajouter des Résultats',
    segment: 'Resultats',
    icon: <QueryStatsIcon />,
  },
  {
    title: 'Liste des résultats',
    segment: 'ListeResultats',
    icon: <ListIcon />,
  },
  {
    title: 'Classements des équipes',
    segment: 'ClassementEquipe',
    icon: <LeaderboardIcon />,
  },
  {
    kind: 'header',
    title: 'Gestions de paiements',
  },
  {
    title: 'Billeterie',
    segment: 'OrganizerTicketManagement',
    icon: <LocalActivity/>,
  },
  {
    kind: 'header',
    title: 'Notifications',
  },
  {
    title: 'Gérer les Notifications',
    segment: 'Notifications',
    icon: <NotificationsIcon />,
  },
  {
    kind: 'header',
    title: 'Paramètres',
  },
  {
    title: 'Paramètres',
    segment: 'parametres',
    icon: <SettingsIcon />,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  // Fonction de navigation vers la page cliquée
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ width: 250, backgroundColor: '#fff', height: '100vh', padding: 2 }}>
      <List>
        {NAVIGATION.map((item, index) => (
          item.kind === 'header' ? (
            // Affichage d'un header avec une ligne de séparation
            <React.Fragment key={index}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ paddingLeft: "10px", fontWeight: "bold", color: "#666" }}>
                {item.title}
              </Typography>
            </React.Fragment>
          ) : (
            // Affichage des éléments cliquables
            <ListItem
              button
              key={index}
              onClick={() => handleNavigation(`/${item.segment}`)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          )
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
