import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ListIcon from '@mui/icons-material/List';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { LocalActivity, MailOutline, School } from '@mui/icons-material';


export const NAVIGATION = [
  {
    segment: 'Dashboardcontent',
    title: 'Tableau de Bord',
    icon: <DashboardIcon />,
  },
  {
    kind: 'header',
    title: 'Administrateurs',
  },
  {
    segment: 'OrganisationAdmin',
    title: 'Administrateurs',
    icon: <AdminPanelSettingsIcon />,
  },
  {
    kind: 'header',
    title: 'Organisateurs',
  },
  {
    segment: 'AdminOrganizerList',
    title: 'Liste',
    icon: <ListIcon />,
  },

  {
    segment: 'AdminOrganizerEvent',
    title: 'Evenements',
    icon: <EventIcon/>,
  },
  
  {
    kind: 'header',
    title: 'Participants',
  },
  {
    segment: 'ParticipantsList',
    title: 'Liste',
    icon: <GroupIcon />,
  },
  {
    segment: 'CertificatesList',
    title: 'Liste des Certificats',
    icon: <School/>,
  },
  
  {
    kind: 'header',
    title: 'Paiements',
  },
  {
    segment: 'TicketSalesManagement',
    title: 'Billeterie',
    icon: <LocalActivity/>
  },
  {
    kind: 'header',
    title: 'Paramètres Généraux',
  },
  {
    title: 'List FAQ',
    segment: 'ContactMessagesList',
    icon: <EventIcon />,
  },
  {
    segment: 'FAQComponent',
    title: 'FAQ',
    icon: <EventIcon />,
  },
  {
    segment: 'Newsletter',
    title: 'Newsletter',
    icon: <MailOutline/>,
  },
  {
    segment: 'parametres',
    title: 'Paramètres',
    icon: <SettingsIcon />,
  },
];
