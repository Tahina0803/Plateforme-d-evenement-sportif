import DashboardIcon from '@mui/icons-material/Dashboard';  
// import SearchIcon from '@mui/icons-material/Search';  
import PaymentIcon from '@mui/icons-material/Payment';  
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  
import ListIcon from '@mui/icons-material/List';
import LeaderboardIcon  from '@mui/icons-material/Leaderboard';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import { Assignment } from '@mui/icons-material';

export const NAVIGATION = [  
  {
    segment: 'home',
    title: 'Accueil',
    icon: <HomeIcon />
  },
    {  
      segment: 'dashboard',  
      title: 'Dashboard',  
      icon: <DashboardIcon />,  
    },  
    {  
      kind: 'header',  
      title: 'Profil',  
    },  
    {  
      segment: 'Profil',  
      title: 'Profil',  
      icon: <AccountCircleIcon />,  
    },  
    {  
      kind: 'header',  
      title: 'Événements',  
    },  
    // {  
    //   segment: 'Recherche',  
    //   title: 'Rechercher des événements',  
    //   icon: <SearchIcon />,  
    // },  
    {  
      segment: 'MesInscriptions',  
      title: 'Mes inscriptions',  
      icon: <ListIcon />,  
    },  
    {  
      segment: 'MonEquipe',  
      title: 'Gérer équipe',  
      icon: <GroupsIcon />,  
    },
    {
      title: 'Certificats',
      segment: 'ParticipantCertificates',
      icon: <Assignment/>, 
    }
    
  ];