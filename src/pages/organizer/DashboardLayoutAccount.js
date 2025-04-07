
import React, { useEffect, useState } from 'react';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { NAVIGATION } from './Sidebar';
import { createTheme } from '@mui/material/styles';
import SidebarComponents from '../../pages/organizer/content/SidebarComponents';
import logo from '../../assets/img/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname, profile }) {
  const renderContent = () => {  
    const Component = SidebarComponents[pathname.replace('/', '')];  

    if (Component) {  
      return <Component profile={profile} />;  
    }

    return (
      <Box sx={{ textAlign: 'center', mt: 10, mb: 10 }}>
        <Avatar
          sx={{
            width: 130,
            height: 130,
            margin: 'auto',
            mb: 2,
            boxShadow: 1,
            fontSize: '8px',
          }}
          alt="Photo de profil"
        >
          Photo de profil
        </Avatar>
        
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {profile?.name || 'Organisateur'}.
        </Typography>
        
        <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', mt: 2 }}>
          Bienvenue sur le tableau de bord
        </Typography>
        
        <Typography sx={{ fontSize: '1.2rem', mt: 1 }}>
          Organisez votre événement !
        </Typography>
      </Box>
    );  
  };

  return (
    <Box  
      sx={{  
        py: 4,  
        display: 'flex',  
        flexDirection: 'column',  
        alignItems: 'center',  
        textAlign: 'center',  
      }}  
    >  
      {renderContent()}  
    </Box>  
  );  
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
  profile: PropTypes.object,
};

function DashboardLayoutAccount() {
  const [session, setSession] = useState({
    user: {
      name: '',  
      email: '',  
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/organizer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email } = response.data;
        setSession({
          user: {
            name,
            email,
            image: '',
          },
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
      }
    };
    fetchUserProfile();
  }, []);

  const authentication = React.useMemo(() => ({
    signIn: () => {
      setSession({
        user: {
          name: session?.user.name || '',  
          email: session?.user.email || '',  
          image: session?.user.image || '',
        },
      });
    },
    signOut: () => {
      localStorage.removeItem('token');
      setSession(null);
      navigate('/home');
    },
  }), [session?.user, navigate]);

  const [pathname, setPathname] = useState('/ProfileOrganizer');

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  useEffect(() => {
    const titleElement = document.querySelector('.MuiTypography-h6');
    if (titleElement) {
      titleElement.textContent = 'Organisateur';
    }
  }, []);
useEffect(() => {
    const logoElement = document.createElement('img');
    logoElement.src = logo;
    logoElement.alt = 'Logo';
    logoElement.style.height = '50px';
    logoElement.style.width = 'auto';
    logoElement.style.cursor = 'pointer';
    logoElement.style.marginRight = '30px';

  
    logoElement.onclick = () => setShowLogoutDialog(true);

    const titleElement = document.querySelector('.css-1qsfemz');
    if (titleElement) {
      titleElement.innerHTML = '';
      titleElement.appendChild(logoElement);
    }
  }, []);

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} profile={session?.user || {}} />
        
        {showLogoutDialog && (
          <Box 
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(0.3px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
            }}
          >
            <Box 
              sx={{
                bgcolor: 'white',
                padding: 4,
                boxShadow: 3,
                width: '400px',
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ fontWeight: 'bold', color: 'black', textAlign: 'left', mb: 2 }}
              >
                Déconnexion ?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: 'gray', textAlign: 'left', mb: 3 }}
              >
                Souhaitez-vous vraiment vous déconnecter ?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button 
                  variant="text" 
                  sx={{ color: 'gray' }} 
                  onClick={authentication.signOut}
                >
                  Oui
                </Button>
                <Button 
                  variant="text" 
                  sx={{ color: 'blue' }} 
                  onClick={() => setShowLogoutDialog(false)}
                >
                  Non
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutAccount;
;


