// import React, { useEffect, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Avatar from '@mui/material/Avatar';
// import { createTheme } from '@mui/material/styles';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { NAVIGATION } from './Sidebar';
// import DashboardComponents from './content/DashboardComponents';
// import logo from '../../assets/img/logo.png';


// const demoTheme = createTheme({
//   cssVariables: {
//     colorSchemeSelector: 'data-toolpad-color-scheme',
//   },
//   colorSchemes: { light: true, dark: true },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

// function DemoPageContent({ pathname }) {
//   const [participantId, setParticipantId] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1]));
//         setParticipantId(decodedToken.id);
//       } catch (error) {
//         console.error('Erreur lors du décodage du token :', error);
//       }
//     } else {
//       console.warn('Aucun token trouvé, redirection nécessaire ?');
//     }
//   }, []);

//   const renderContent = () => {
//     const Component = DashboardComponents[pathname.replace('/', '')]; // ✅ Utilise la prop `pathname`
//     if (Component) {
//       return <Component participantId={participantId} />;
//     }
//     return <Typography>Bienvenue sur le tableau de bord.</Typography>;
//   };

//   return (
//     <Box
//       sx={{
//         py: 4,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//       }}
//     >
//       {renderContent()}
//     </Box>
//   );
// }

// DemoPageContent.propTypes = {
//   pathname: PropTypes.string.isRequired, // ✅ S'assurer que `pathname` est bien une string et est requis
// };

// DemoPageContent.propTypes = {
//   pathname: PropTypes.string.isRequired,
// };

// function DashboardLayoutAccount(props) {
//   const [session, setSession] = useState({
//     user: {
//       name: '',
//       email: '',
//       image: 'https://avatars.githubusercontent.com/u/19550456',
//     },
//   });

  

//   const authentication = useMemo(() => ({
//     signIn: () => {
//       setSession({
//         user: {
//           name: session?.user.name || '',
//           email: session?.user.email || '',
//           image: 'https://avatars.githubusercontent.com/u/19550456',
//         },
//       });
//     },
//     signOut: () => {
//       setSession(null);
//       localStorage.removeItem('token'); // Supprime le token de stockage local
//       window.location.href = '/home'; // Redirige vers la page d'accueil
//     },
//   }), []);

//   const [pathname, setPathname] = useState('/dashboard');

//   const router = useMemo(() => ({
//     pathname,
//     searchParams: new URLSearchParams(),
//     navigate: (path) => setPathname(String(path)),
//   }), [pathname]);

//   useEffect(() => {
//     const titleElement = document.querySelector('.MuiTypography-h6');
//     if (titleElement) {
//       titleElement.textContent = 'Participant';
//     }
//   }, []);

//   useEffect(() => {
//     const logoElement = document.createElement('img');
//     logoElement.src = logo;
//     logoElement.alt = 'Logo';
//     logoElement.style.height = '50px';
//     logoElement.style.width = 'auto';

//     const titleElement = document.querySelector('.css-1qsfemz');
//     if (titleElement) {
//       titleElement.innerHTML = '';
//       titleElement.appendChild(logoElement);
//     }
//   }, []);

//   return (
//     <AppProvider
//       session={session}
//       authentication={authentication}
//       navigation={NAVIGATION}
//       router={router}
//       theme={demoTheme}
//     >
//       <DashboardLayout
//         header={
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
//             <IconButton onClick={authentication.signOut}>
//               <Avatar alt="Participant" src={session?.user?.image || ''} />
//             </IconButton>
//           </Box>
//         }
//       >
//          <DemoPageContent pathname={pathname} /> {/* ✅ Passer pathname en props */}
//       </DashboardLayout>
//     </AppProvider>
//   );
// }

// export default DashboardLayoutAccount;



import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION } from './Sidebar';
import DashboardComponents from './content/DashboardComponents';
import logo from '../../assets/img/logo.png';

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

function DemoPageContent({ pathname, participantId }) {
  const renderContent = () => {
    const Component = DashboardComponents[pathname.replace('/', '')];
    if (Component) {
      return <Component participantId={participantId} />;
    }
    return <Typography>Bienvenue sur le tableau de bord.</Typography>;
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
  participantId: PropTypes.string, // Ajouté ici
};

function DashboardLayoutAccount() {
  const [participantId, setParticipantId] = useState(null);
  const [pathname, setPathname] = useState('/dashboard');

  const [session, setSession] = useState({
    user: {
      name: '',
      email: '',
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  // 🟢 Récupère participantId depuis le token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setParticipantId(decodedToken.id);
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    } else {
      console.warn('Aucun token trouvé, redirection possible ?');
    }
  }, []);

  // 🟢 Récupère le profil utilisateur
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/participant/profile/${participantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nom_part, email_part } = response.data;

        setSession({
          user: {
            name: nom_part,
            email: email_part,
            image: 'https://avatars.githubusercontent.com/u/19550456', // ou une image par défaut
          },
        });
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du profil utilisateur :', error);
      }
    };

    if (participantId) {
      fetchUserSession();
    }
  }, [participantId]);

  const authentication = useMemo(() => ({
    signIn: () => {
      // Optionnel
    },
    signOut: () => {
      setSession(null);
      localStorage.removeItem('token');
      window.location.href = '/home';
    },
  }), []);

  const router = useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  // 🟡 Met à jour le logo Toolpad
  useEffect(() => {
    const logoElement = document.createElement('img');
    logoElement.src = logo;
    logoElement.alt = 'Logo';
    logoElement.style.height = '50px';
    logoElement.style.width = 'auto';
    logoElement.style.cursor = 'pointer';
    logoElement.style.marginRight = '30px';

  
    logoElement.onclick = () => setShowLogoutDialog(true);

    const titleElement = document.querySelector('.MuiTypography-h6');
    if (titleElement) {
      titleElement.innerHTML = '';
      titleElement.appendChild(logoElement);
    }

    const toolElement = document.querySelector('.css-1qsfemz');
    if(toolElement) {
      toolElement.innerHTML = '';
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
      <DashboardLayout
        header={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
            <IconButton onClick={authentication.signOut}>
              <Avatar alt="Participant" src={session?.user?.image || ''} />
            </IconButton>
          </Box>
        }
      >
        <DemoPageContent pathname={pathname} participantId={participantId} />
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutAccount;
