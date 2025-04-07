// // LoginForm.js
// import React, { useState } from 'react';
// import { TextField, Button, Box } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerLoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/login/organizer', { email, password });
//       localStorage.setItem('token', response.data.token); // Stocke le token dans localStorage
//       navigate('/organisateur'); // Redirection vers le tableau de bord
//     } catch (error) {
//       console.error('Erreur lors de la connexion:', error);
//     }
//   };

//   return (
//     <Box component="form" 
//     onSubmit={handleSubmit}
//      noValidate
//      sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       gap: 2,
//       padding: '20px',
//       borderRadius: '20px',
//       boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
//       width:'400px', 
//     }}>
//       <TextField
//         label="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Mot de passe"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         fullWidth
//         margin="normal"
//         sx={{ marginTop:'25px'}}
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop:'25px'}} >
//         CONNEXION
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerLoginForm;



// import React, { useState } from 'react';
// import { TextField, Button, Box, IconButton, InputAdornment, Typography, Divider } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerLoginForm = ({ onSignUpClick }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handlePasswordReset = () => {
//     navigate('/mdpoublier');
//   };

//   const handleCreateAccount = () => {
//     // Utilisez la fonction passée en prop pour changer l'onglet
//     if (onSignUpClick) {
//       onSignUpClick();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/login/organizer', { email, password });
//       localStorage.setItem('token', response.data.token);
//       navigate('/organisateur');
//     } catch (error) {
//       console.error(error.response?.data); // Affiche l'erreur dans la console
//       setError('Mot de passe incorrect !');
//     }
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       noValidate
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 2,
//         padding: '25px 20px',
//         borderRadius: '10px',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
//         width: '350px',
//         margin: '0 auto',
//       }}
//     >
//       <TextField
//         label="Email"
//         value={email}
//         onChange={(e) => {
//           setEmail(e.target.value);
//           setError('');
//         }}
//         fullWidth
//         sx={{
//           borderRadius: '5px',
//           '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//               borderColor: 'primary',
//             },
//             '&:hover fieldset': {
//               borderColor: 'black',
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: '#1976d2',
//             },
//           },
//         }}
//       />
//       <TextField
//         label="Mot de passe"
//         type={showPassword ? 'text' : 'password'}
//         value={password}
//         onChange={(e) => {
//           setPassword(e.target.value);
//           setError('');
//         }}
//         fullWidth
//         error={!!error}
//         helperText={error}
//         sx={{
//           marginTop: 1,
//           borderRadius: '5px',
//           '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//               borderColor: error ? 'red' : 'primary',
//             },
//             '&:hover fieldset': {
//               borderColor: error ? 'red' : 'black',
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: error ? '#D32F2F' : '#1976d2',
//             },
//           },
//         }}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton
//                 onClick={handleClickShowPassword}
//                 edge="end"
//               >
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//       />

//       <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '15px' }}>
//         Se connecter
//       </Button>

//       <Typography
//         variant="body2"
//         color="primary"
//         onClick={handlePasswordReset}
//         sx={{
//           cursor: 'pointer',
//           textAlign: 'center',
//           marginTop: 1,
//           position: 'relative',
//           '&:hover::after': {
//             content: '""',
//             position: 'absolute',
//             left: 0,
//             bottom: 0,
//             width: '100%',
//             height: '1px',
//             backgroundColor: '#1976d2',
//           },
//         }}
//       >
//         Mot de passe oublié?
//       </Typography>

//       <Divider sx={{ width: '100%', backgroundColor: '#4CAF50', height: '1px' }} />

//       <Button
//         variant="contained"
//         onClick={handleCreateAccount}
//         sx={{
//           backgroundColor: 'green',
//           color: 'white',
//           textTransform: 'none',
//           '&:hover': {
//             backgroundColor: '#4CAF50',
//           },
//           width: '200px',
//           marginTop: 1,
//         }}
//       >
//         créer un nouveau compte
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerLoginForm;

import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, InputAdornment, Typography, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordReset = () => {
    navigate('/mdpoublier');
  };

  const handleCreateAccount = () => {
    if (onSignUpClick) {
      onSignUpClick();
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
  //     const { token } = response.data;

  //     // Stocker le token dans le localStorage
  //     localStorage.setItem('token', token);

  //     // Décoder le token pour extraire le rôle
  //     const decodedToken = JSON.parse(atob(token.split('.')[1]));
  //     const { role } = decodedToken;

  //     // Rediriger en fonction du rôle
  //     if (role === 'organizer') {
  //       navigate('/organisateur');
  //     } else if (role === 'participant') {
  //       navigate('/participant/dashboard');
  //     } else {
  //       throw new Error('Rôle utilisateur inconnu');
  //     }
  //   } catch (error) {
  //     console.error(error.response?.data || error.message);
  //     setError('Email ou mot de passe incorrect.');
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Test de connexion à la route de l'organisateur
      let response = await axios.post('http://localhost:3001/api/organizer/login/organizer', { email, password });
      const { token } = response.data;
  
      // Stocker le token et rediriger l'organisateur
      localStorage.setItem('token', token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
  
      if (decodedToken.role === 'organizer') {
        navigate('/organisateur');
      } else {
        throw new Error('Rôle utilisateur inconnu.');
      }
    } catch (error) {
      // Si la connexion à l'organisateur échoue, essayez avec le participant
      if (error.response && error.response.status === 404) {
        try {
          let response = await axios.post('http://localhost:3001/api/participant/login/participant', { email, password });
          const { token } = response.data;
  
          // Stocker le token et rediriger le participant
          localStorage.setItem('token', token);
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
  
          if (decodedToken.role === 'participant') {
            navigate('/participant/dashboard');
          } else {
            throw new Error('Rôle utilisateur inconnu.');
          }
        } catch (participantError) {
          // Si les deux échouent, affichez une erreur
          console.error(participantError.response?.data || participantError.message);
          setError('Email ou mot de passe incorrect.');
        }
      } else {
        console.error(error.response?.data || error.message);
        setError('Email ou mot de passe incorrect.');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '25px 20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        width: '350px',
        margin: '0 auto',
      }}
    >
      <TextField
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        fullWidth
        sx={{
          borderRadius: '5px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'primary',
            },
            '&:hover fieldset': {
              borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
      />
      <TextField
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');
        }}
        fullWidth
        error={!!error}
        helperText={error}
        sx={{
          marginTop: 1,
          borderRadius: '5px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: error ? 'red' : 'primary',
            },
            '&:hover fieldset': {
              borderColor: error ? 'red' : 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? '#D32F2F' : '#1976d2',
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '15px' }}>
        Se connecter
      </Button>

      <Typography
        variant="body2"
        color="primary"
        onClick={handlePasswordReset}
        sx={{
          cursor: 'pointer',
          textAlign: 'center',
          marginTop: 1,
          position: 'relative',
          '&:hover::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '1px',
            backgroundColor: '#1976d2',
          },
        }}
      >
        Mot de passe oublié?
      </Typography>

      <Divider sx={{ width: '100%', backgroundColor: '#4CAF50', height: '1px' }} />

      <Button
        variant="contained"
        onClick={handleCreateAccount}
        sx={{
          backgroundColor: 'green',
          color: 'white',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#4CAF50',
          },
          width: '200px',
          marginTop: 1,
        }}
      >
        créer un nouveau compte
      </Button>
    </Box>
  );
};

export default LoginForm;





