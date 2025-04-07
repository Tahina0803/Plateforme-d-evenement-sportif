// import React, { useEffect } from 'react';
// import { AppProvider, DashboardLayout } from '@toolpad/core';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import { NAVIGATION } from './SideBar';
// import { createTheme } from '@mui/material/styles';
// import SidebarComponents from './content/SidebarComponents';
// import logo from '../../assets/img/logo.png';
// import axios from 'axios'; // Pour les requêtes HTTP


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
//   const renderContent = () => {
//     console.log('Chemin actuel:', pathname);  // Log pour voir le chemin actuel
//     const Component = SidebarComponents[pathname.replace('/', '')];  // Récupère le composant correspondant  

//     if (Component) {
//       return <Component />;
//     }

//     // Fallback si le composant n'est pas trouvé  
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
//   pathname: PropTypes.string.isRequired,
// };

// function AdminLayout() {
//   const [session, setSession] = React.useState({
//     user: {
//       name: '', // ajouter le nom ici
//       email: '', // ajouter l'email ici
//       image: 'https://avatars.githubusercontent.com/u/19550456',
//     },
//   });

//   const authentication = React.useMemo(() => ({
//     signIn: (adminData) => {
//       console.log('Données admin récupérées:', adminData);  // Log pour vérifier les données admin
//       setSession({
//         user: {
//           name: adminData.name,
//           email: adminData.email,
//           image: 'https://avatars.githubusercontent.com/u/19550456',
//         },
//       });
//     },
//     signOut: () => {
//       // Supprimer le token JWT du localStorage
//       localStorage.removeItem('token');
//       setSession(null);
//       // Rediriger vers la page d'accueil
//       window.location.href = '/admin';
//     },
//   }), []);

//   const [pathname, setPathname] = React.useState('/dashboard');

//   const router = React.useMemo(() => ({
//     pathname,
//     searchParams: new URLSearchParams(),
//     navigate: (path) => setPathname(String(path)),
//   }), [pathname]);

//   useEffect(() => {
//     const titleElement = document.querySelector('.MuiTypography-h6');
//     if (titleElement) {
//       titleElement.textContent = ' Administrateur';
//     }
//   }, []);

//   // Fonction de récupération des info d'admin connecté
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       const token = localStorage.getItem('token');
//       console.log('Token JWT récupéré:', token);  // Log pour vérifier le token JWT

//       if (token) {
//         try {
//           // une requête vers l'API pour obtenir les infos d'admin
//           const response = await axios.get('http://localhost:3001/api/auth/admin/profile', {
//             headers: {
//               Authorization: `Bearer ${token}`, // Envoye du token JWT dans l'en-tête
//             },
//           });
//           console.log('Données reçues de l\'API:', response.data);
//           const adminData = response.data;
//           authentication.signIn(adminData); // remplir la session avec les données de l'admin
//         } catch (error) {
//           console.error('Erreur lors de la récupération des informations de l\'admin:', error);
//         }
//       }
//     };
//     fetchAdminData();
//   }, [authentication]);

//   useEffect(() => {
//     console.log('Session actuelle:', session);  // Log pour voir les informations dans la session

//     const logoElement = document.createElement('img');  // Créez un nouvel élément image
//     logoElement.src = logo;  // Définissez le chemin de l'image
//     logoElement.alt = 'Logo';  // Ajoutez un texte alternatif
//     logoElement.style.height = '50px';  // Réglez la hauteur de l'image (ajustez si nécessaire)
//     logoElement.style.width = 'auto';  // Réglez la largeur à automatique

//     const titleElement = document.querySelector('.css-1qsfemz');
//     if (titleElement) {
//       titleElement.innerHTML = '';  // Vider le contenu précédent
//       titleElement.appendChild(logoElement);  // Insérez l'image dans l'élément
//     }
//   }, [session]);

//   return (
//     <AppProvider
//       session={session}
//       authentication={authentication}
//       navigation={NAVIGATION}
//       router={router}
//       theme={demoTheme}
//     >
//       <DashboardLayout>
//         <DemoPageContent pathname={pathname} />
//       </DashboardLayout>
//     </AppProvider>
//   );
// }

// export default AdminLayout;
import React, { useEffect, useState } from 'react';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NAVIGATION } from './SideBar';
import { createTheme, useTheme } from '@mui/material/styles';
import SidebarComponents from './content/SidebarComponents';
import logoFondB from '../../assets/img/logoFondB.png';  // logo pour le thème clair
import logoDark from '../../assets/img/logoDark.png';  // logo pour le thème sombre
import axios from 'axios';  // Pour les requêtes HTTP
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dashboard from './content/Dashboard';


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

function DemoPageContent({ pathname }) {
  const renderContent = () => {
    if (pathname === '/dashboard' || pathname === '/') {
      return <Dashboard />;  // ✅ Afficher Dashboard par défaut
    }

    const Component = SidebarComponents[pathname.replace('/', '')];

    if (Component) {
      return <Component />;
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
};

function AdminLayout() {
  const [session, setSession] = useState({
    user: {
      name: '',  // ajouter le nom ici
      email: '',  // ajouter l'email ici
      image: <AccountCircleIcon/>,
    },
  });

  const authentication = React.useMemo(() => ({
    signIn: (adminData) => {
      setSession({
        user: {
          name: adminData.name,
          email: adminData.email,
          image: <AccountCircleIcon/>,
        },
      });
    },
    signOut: () => {
      // Supprimer le token JWT du localStorage
      localStorage.removeItem('token');
      setSession(null);
      // Rediriger vers la page d'accueil
      window.location.href = '/admin';
    },
  }), []);

  const [pathname, setPathname] = useState('/dashboard');

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  useEffect(() => {
    const titleElement = document.querySelector('.MuiTypography-h6');
    if (titleElement) {
      titleElement.textContent = ' Administrateur';
    }
  }, []);

  const theme = useTheme();  // Utiliser le hook pour accéder au thème actuel
  const [logoSrc, setLogoSrc] = useState(logoFondB);  // logo par défaut

  useEffect(() => {
    // Correction ici : logoFondB pour le thème clair et logoDark pour le thème sombre
    if (theme.palette.mode === 'light') {
      setLogoSrc(logoFondB);  // Affiche le logo clair pour le thème clair
    } else {
      setLogoSrc(logoDark);  // Affiche le logo sombre pour le thème sombre
    }
  }, [theme]);

  // Fonction de récupération des info d'admin connecté
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/api/auth/admin/profile', {
            headers: {
              Authorization: `Bearer ${token}`,  // Envoyer le token JWT dans l'en-tête
            },
          });
          const adminData = response.data;
          authentication.signIn(adminData);  // remplir la session avec les données de l'admin
        } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'admin:', error);
        }
      }
    };
    fetchAdminData();
  }, [authentication]);

  useEffect(() => {
    console.log('Session actuelle:', session);  // Log pour voir les informations dans la session

    const logoElement = document.createElement('img');  // Créer un nouvel élément image
    logoElement.src = logoSrc;  // Définir le chemin de l'image
    logoElement.alt = 'Logo';  // Ajouter un texte alternatif
    logoElement.style.height = '50px';  // Régler la hauteur de l'image (ajuster si nécessaire)
    logoElement.style.width = 'auto';  // Régler la largeur à automatique

    const titleElement = document.querySelector('.css-1qsfemz');
    if (titleElement) {
      titleElement.innerHTML = '';  // Vider le contenu précédent
      titleElement.appendChild(logoElement);  // Insérer l'image dans l'élément
    }
  }, [session, logoSrc]);  // Regarder aussi le changement du logoSrc

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname}/>
      </DashboardLayout>
    </AppProvider>
  );
}

export default AdminLayout;

