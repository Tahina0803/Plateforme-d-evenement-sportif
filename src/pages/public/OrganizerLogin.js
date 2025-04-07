// import React, { useState } from "react";
// import { AppBar, Toolbar, IconButton, Typography, Container, Box, Grid, Tabs, Tab } from "@mui/material";
// import logoAirtel from './../../assets/img/logoFondB.png';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import OrganizerSignUpForm from "../../pages/organizer/SignUpFrom"; // Formulaire pour organiser
// import OrganizerLoginForm from "../../pages/organizer/LoginForm"; // Formulaire pour organiser
// import Test from './../../assets/img/test.png';
// import seConnecter from './../../assets/img/seConnecter.png';
// import { Link } from 'react-router-dom';

// const OrganizerLogin = () => {
//   const [isSignUp, setIsSignUp] = useState(false); // Contrôle de l'affichage entre Connexion et Inscription
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     setIsSignUp(newValue === 1); // Active l'inscription si l'onglet est "S'inscrire"
//   };

//   return (
//     <div>
//       {/* Barre de navigation */}
//       <AppBar position="static" color="transparent" elevation={0} sx={{ boxShadow: 3 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Logo à gauche */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Link to="/home" style={{ textDecoration: 'none' }}> {/* Enveloppez l'image avec Link */}  
//         <img src={logoAirtel} alt="Logo" style={{ width: "100px" }} />  
//       </Link>            </Box>

//           {/* Icône d'aide à droite */}
//           <Box>
//             <IconButton color="inherit">
//               <HelpOutlineIcon sx={{ fontSize: 30, color: '#2f5972' }} />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       <Container
//   maxWidth="lg"
//   sx={{
//     marginTop: '10px',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center', // Centre horizontalement
//     justifyContent: 'center', // Centre verticalement
//     minHeight: '100vh', // Hauteur minimum pour centrer verticalement
//   }}
// >
//   {/* Boutons Connexion / Inscription */}
//   <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
//     <Tabs value={value} onChange={handleChange} aria-label="auth tabs" textColor="inherit" centered>
//       <Tab
//         label="CONNEXION"
//         sx={{
//           color: value === 0 ? '#2f5972' : '#0097b2',
//           fontWeight: value === 0 ? 'bold' : 'normal',
//           borderBottom: value === 0 ? '2px solid #2f5972' : 'none',
//           minWidth: '60px'
//         }}
//       />
//       <Tab
//         label="S'INSCRIRE"
//         sx={{
//           color: value === 1 ? '#2f5972' : '#0097b2',
//           fontWeight: value === 1 ? 'bold' : 'normal',
//           borderBottom: value === 1 ? '2px solid #2f5972' : 'none',
//           minWidth: '60px'
//         }}
//       />
//     </Tabs>
//   </Grid>

//   {/* Contenu principal avec le texte et les formulaires */}
//   <Grid container spacing={4} sx={{ marginTop: '5px' }} alignItems="flex-start">
//     {/* Texte et illustration à gauche sur bureau */}
//     <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left', padding: '20px' }}>
//       <Typography variant="h4" sx={{ color: '#2f5972', fontWeight: 'bold', paddingBottom: '20px' }}>
//         {isSignUp ? "Créer votre compte" : "Gérer votre compte"}
//       </Typography>
//       {isSignUp ? <img src={Test} alt='' style={{ width: '100%' }} /> : <img src={seConnecter} alt='' style={{ width: '100%' }} />}
//     </Grid>

//     {/* Formulaire à droite */}
//     <Grid item xs={12} md={6}>
//       {isSignUp ? <OrganizerSignUpForm /> : <OrganizerLoginForm />}
//     </Grid>

//     {/* Icône en bas sur mobile */}
//     <Grid item xs={12} sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center' }}>
//       {isSignUp ? <img src={Test} alt="" style={{ width: '100%' }} /> : <img src={seConnecter} alt="" style={{ width: '100%' }} />}
//     </Grid>
//   </Grid>
// </Container>

//     </div>
//   );
// };

// export default OrganizerLogin;




// import React, { useState } from "react";
// import { AppBar, Toolbar, IconButton, Container, Box, Grid, Tabs, Tab, Typography, Paper } from "@mui/material";
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import OrganizerSignUpForm from "../../pages/organizer/SignUpFrom";
// import OrganizerLoginForm from "../../pages/organizer/LoginForm";
// import { Link } from 'react-router-dom';

// import logoAirtel from './../../assets/img/logoFondB.png';
// import seConnecter from './../../assets/img/seConnecter.png';
// import testImage from './../../assets/img/test.png';

// const OrganizerLogin = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     setIsSignUp(newValue === 1);
//   };

//   // Fonction pour changer l'onglet vers "S'inscrire"
//   const handleTabChangeToSignUp = () => {
//     setValue(1); // Change l'onglet pour sélectionner "S'inscrire"
//     setIsSignUp(true);
//   };

//   return (
//     <div style={{
//       backgroundColor: '#f5f5f5',
//       paddingBottom: '100px'
//     }} >
//       <AppBar position="static" color="transparent" elevation={0} sx={{ boxShadow: 3, backgroundColor: 'white' }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Link to="/home" style={{ textDecoration: 'none' }}>
//               <img src={logoAirtel} alt="Logo" style={{ width: "100px" }} />
//             </Link>
//           </Box>
//           <Box>
//             <IconButton color="inherit">
//               <HelpOutlineIcon sx={{ fontSize: 30, color: '#2f5972' }} />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Container
//         maxWidth="md"
//         sx={{
//           marginTop: '50px',
//           display: 'flex',
//           justifyContent: 'center',
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             padding: '30px 30px 50px 30px',
//             borderRadius: '20px',
//             width: '100%',
//             maxWidth: '850px',
//           }}
//         >
//           <Grid container justifyContent="center" sx={{ pb: '50px' }}>
//             <Tabs value={value} onChange={handleChange} aria-label="auth tabs" textColor="inherit" centered>
//               <Tab label="Se connecter" sx={{ color: value === 0 ? '#2f5972' : '#0097b2', fontWeight: value === 0 ? 'bold' : 'normal' }} />
//               <Tab label="S'inscrire" sx={{ color: value === 1 ? '#2f5972' : '#0097b2', fontWeight: value === 1 ? 'bold' : 'normal' }} />
//             </Tabs>
//           </Grid>

//           <Grid container spacing={4} alignItems="flex-start">
//             <Grid item xs={12} md={6} sx={{ textAlign: 'center', padding: '20px' }}>
//               <Typography
//                 variant="h4"
//                 sx={isSignUp
//                   ? { color: '#2f5972', fontWeight: 'bold', paddingBottom: '20px',paddingTop: '90px', fontSize: '28px' } 
//                   : { color: '#1a3d5c', fontWeight: 'bold', paddingTop: '60px',paddingBottom: '20px', fontSize: '28px' }
//                 }
//               >
//                 {isSignUp ? "Créer votre compte" : "Gérer votre compte"}
//               </Typography>
//               <img
//                 src={isSignUp ? testImage : seConnecter}
//                 alt=""
//                 style={isSignUp
//                   ? {
//                     width: '70%',
//                     height: 'auto',
//                     maxWidth: '250px',
//                     maxHeight: '250px'
//                   }
//                   : {
//                     width: '60%',
//                     height: 'auto',
//                     maxWidth: '200px',
//                     maxHeight: '200px'
//                   }
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               {/* Passer la fonction handleTabChangeToSignUp comme prop */}
//               {isSignUp 
//                 ? <OrganizerSignUpForm /> 
//                 : <OrganizerLoginForm onSignUpClick={handleTabChangeToSignUp} />}
//             </Grid>
//           </Grid>
//         </Paper>
//       </Container>
//     </div>
//   );
// };
// export default OrganizerLogin;

import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Container, Box, Grid, Tabs, Tab, Typography, Paper } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OrganizerSignUpForm from "../../pages/organizer/SignUpFrom";
import OrganizerLoginForm from "../../pages/organizer/LoginForm";
import { Link, useLocation } from 'react-router-dom';

import logoAirtel from './../../assets/img/logoFondB.png';
import seConnecter from './../../assets/img/seConnecter.png';
import testImage from './../../assets/img/test.png';

const OrganizerLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [value, setValue] = useState(0);
  const [activationMessage, setActivationMessage] = useState('');
  const [blurBackground, setBlurBackground] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Vérifiez si le paramètre 'activation' est présent dans l'URL
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('activation') === 'success') {
      setActivationMessage("Votre inscription a été validée avec succès. Vous pouvez désormais vous connecter.");
      setBlurBackground(true); // Activer le flou
    
      // Désactiver le flou après 2 secondes
      setTimeout(() => {
        setBlurBackground(false);
      }, 1000);
    
      // Supprimer le message après 4 secondes
      setTimeout(() => {
        setActivationMessage(""); // Efface le message
      }, 7000); // 4000 ms = 4 secondes
    }
    
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsSignUp(newValue === 1);
  };

  const handleTabChangeToSignUp = () => {
    setValue(1);
    setIsSignUp(true);
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      paddingBottom: '100px'
    }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ boxShadow: 3, backgroundColor: 'white' }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <img src={logoAirtel} alt="Logo" style={{ width: "100px" }} />
            </Link>
          </Box>
          <Box>
            <IconButton color="inherit">
              <HelpOutlineIcon sx={{ fontSize: 30, color: '#2f5972' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification de succès */}
      {activationMessage && (
        <Box
          sx={{
            width: '80%',
            maxWidth: '600px',
            margin: '20px auto',
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#d3d3d3',
            color: '#000',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}
        >
          <Typography variant="body1">{activationMessage}</Typography>
        </Box>
      )}

      {/* Conteneur pour le contenu avec effet de flou */}
      <Box
        sx={{
          filter: blurBackground ? 'blur(5px)' : 'none', // Appliquer le flou uniquement sur le contenu
          transition: 'filter 0.5s ease-in-out' // Transition douce pour le flou
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            marginTop: '50px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: '30px 30px 50px 30px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '850px',
            }}
          >
            <Grid container justifyContent="center" sx={{ pb: '50px' }}>
              <Tabs value={value} onChange={handleChange} aria-label="auth tabs" textColor="inherit" centered>
                <Tab label="Se connecter" sx={{ color: value === 0 ? '#2f5972' : '#0097b2', fontWeight: value === 0 ? 'bold' : 'normal' }} />
                <Tab label="S'inscrire" sx={{ color: value === 1 ? '#2f5972' : '#0097b2', fontWeight: value === 1 ? 'bold' : 'normal' }} />
              </Tabs>
            </Grid>

            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={6} sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography
                  variant="h4"
                  sx={isSignUp
                    ? { color: '#2f5972', fontWeight: 'bold', paddingBottom: '20px', paddingTop: '90px', fontSize: '28px' } 
                    : { color: '#1a3d5c', fontWeight: 'bold', paddingTop: '60px', paddingBottom: '20px', fontSize: '28px' }
                  }
                >
                  {isSignUp ? "Créer votre compte" : "Gérer votre compte"}
                </Typography>
                <img
                  src={isSignUp ? testImage : seConnecter}
                  alt=""
                  style={isSignUp
                    ? {
                      width: '70%',
                      height: 'auto',
                      maxWidth: '250px',
                      maxHeight: '250px'
                    }
                    : {
                      width: '60%',
                      height: 'auto',
                      maxWidth: '200px',
                      maxHeight: '200px'
                    }
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                {isSignUp 
                  ? <OrganizerSignUpForm /> 
                  : <OrganizerLoginForm onSignUpClick={handleTabChangeToSignUp} />}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default OrganizerLogin;







