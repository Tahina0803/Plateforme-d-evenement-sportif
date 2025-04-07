// // OrganizerSignUpForm.js
// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerSignUpForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState(''); // Nouveau champ pour la confirmation du mot de passe
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [error, setError] = useState(''); // Pour afficher un message d'erreur si les mots de passe ne correspondent pas
//   const navigate = useNavigate();

//   // Fonction pour gérer la soumission du formulaire
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Vérifier si les mots de passe correspondent
//     if (password !== confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/create', {
//         email_organisateur: email,
//         mdp_organisateur: password,
//         nom_organisateur: firstName,
//         prenom_organisateur: lastName,
//         tel_organisateur: phone,
//       });

//       console.log('Inscription réussie:', response.data);

//       // Sauvegarder le token reçu pour les futures requêtes
//       localStorage.setItem('token', response.data.token);

//       // Rediriger vers le tableau de bord de l'organisateur
//       navigate('/organisateur');
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} noValidate>
//       <TextField
//         label="Nom"
//         value={firstName}
//         onChange={(e) => setFirstName(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Prénom"
//         value={lastName}
//         onChange={(e) => setLastName(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Email"
//         type="email"
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
//       />
//       <TextField
//         label="Confirmer le mot de passe"
//         type="password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Téléphone"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       {error && (
//         <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
//           {error}
//         </Typography>
//       )}
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         S'inscrire
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerSignUpForm;

// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerSignUpForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       return;
//     }
//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/create', {
//         email_organisateur: email,
//         mdp_organisateur: password,
//         nom_organisateur: firstName,
//         prenom_organisateur: lastName,
//         tel_organisateur: phone,
//       });
//       localStorage.setItem('token', response.data.token);
//       navigate('/organisateur');
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
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
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//       }}
//     >
//       <TextField label="Nom" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
//       <TextField label="Prénom" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
//       <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
//       <TextField label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
//       <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
//       <TextField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
//       {error && <Typography color="error" variant="body2">{error}</Typography>}
//       <FormControlLabel
//         control={<Checkbox />}
//         label="Accepter la politique de confidentialité"
//         sx={{ alignSelf: 'flex-start' }}
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         S'inscrire
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerSignUpForm;




// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerSignUpForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [error, setError] = useState('');
//   const [emailError, setEmailError] = useState(''); // État spécifique pour l'erreur d'email
//   const navigate = useNavigate();

//   // Fonction pour valider le format de l'email
//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation des champs
//     if (!isValidEmail(email)) {
//       setEmailError("Votre adresse email n'est pas valide");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/create', {
//         email_organisateur: email,
//         mdp_organisateur: password,
//         nom_organisateur: firstName,
//         prenom_organisateur: lastName,
//         tel_organisateur: phone,
//       });
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userEmail', email); // Stocke l'email dans le localStorage
//       navigate('/organizerconfirmation');
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
//       setError("Erreur lors de l'inscription. Veuillez réessayer.");
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
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//       }}
//     >
//       <TextField label="Nom" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
//       <TextField label="Prénom" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
//       <TextField 
//         label="Email" 
//         type="email" 
//         value={email} 
//         onChange={(e) => {
//           setEmail(e.target.value);
//           setEmailError(''); // Réinitialise l'erreur d'email lorsque l'utilisateur modifie l'email
//         }} 
//         fullWidth
//         error={!!emailError} // Affiche une bordure rouge si l'email n'est pas valide
//         helperText={emailError} // Affiche le message d'erreur sous le champ
//       />
//       <TextField label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
//       <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
//       <TextField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
//       {error && <Typography color="error" variant="body2">{error}</Typography>}
//       <FormControlLabel
//         control={<Checkbox />}
//         label="Accepter la politique de confidentialité"
//         sx={{ alignSelf: 'flex-start' }}
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         S'inscrire
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerSignUpForm;
//*************************************************************************** */
// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerSignUpForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [error, setError] = useState('');
//   const [emailError, setEmailError] = useState(''); // État spécifique pour l'erreur d'email
//   const navigate = useNavigate();

//   // Fonction pour valider le format de l'email
//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Vérification que l'email est valide
//   if (!isValidEmail(email)) {
//     setEmailError("Votre adresse email n'est pas valide");
//     return;
//   }

//   // Vérification que les mots de passe correspondent
//   if (password !== confirmPassword) {
//     setError("Les mots de passe ne correspondent pas");
//     return;
//   }

//   try {
//     const response = await axios.post('http://localhost:3001/api/organizer/create', {
//       email_organisateur: email,
//       mdp_organisateur: password,
//       nom_organisateur: firstName,
//       prenom_organisateur: lastName,
//       tel_organisateur: phone,
//     });

//     // Rediriger vers la page de confirmation avec l'email
//     navigate('/organizerconfirmation', { state: { email } });
//   } catch (error) {
//     console.error("Erreur lors de l'inscription:", error);
//     setError("Erreur lors de l'inscription. Veuillez réessayer.");
//   }
// };


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
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//       }}
//     >
//       <TextField label="Nom" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
//       <TextField label="Prénom" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
//       <TextField 
//         label="Email" 
//         type="email" 
//         value={email} 
//         onChange={(e) => {
//           setEmail(e.target.value);
//           setEmailError(''); // Réinitialise l'erreur d'email lorsque l'utilisateur modifie l'email
//         }} 
//         fullWidth
//         error={!!emailError} // Affiche une bordure rouge si l'email n'est pas valide
//         helperText={emailError} // Affiche le message d'erreur sous le champ
//       />
//       <TextField label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
//       <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
//       <TextField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
//       {error && <Typography color="error" variant="body2">{error}</Typography>}
//       <FormControlLabel
//         control={<Checkbox />}
//         label="Accepter la politique de confidentialité"
//         sx={{ alignSelf: 'flex-start' }}
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         S'inscrire
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerSignUpForm;











// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Box, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const OrganizerSignUpForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [firstName, setFirstName] = useState(''); // Prénom
//   const [lastName, setLastName] = useState('');   // Nom
//   const [phone, setPhone] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [firstNameError, setFirstNameError] = useState('');
//   const [lastNameError, setLastNameError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [error, setError] = useState('');
//   const [statusMessage, setStatusMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [privacyAccepted, setPrivacyAccepted] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isFormComplete = email && password && confirmPassword && firstName && lastName && phone;
//     const isPasswordMatch = password === confirmPassword;
//     setIsFormValid(isFormComplete && isPasswordMatch && privacyAccepted);
//   }, [email, password, confirmPassword, firstName, lastName, phone, privacyAccepted]);

//   const isValidEmail = async (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return false;
//     }
//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/check-email', { email });
//       return response.data.isAvailable;
//     } catch (error) {
//       console.error("Erreur lors de la vérification de l'email:", error);
//       return false;
//     }
//   };

//   const isValidFirstName = async (firstName) => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/check-first-name', { firstName });
//       return response.data.isAvailable;
//     } catch (error) {
//       console.error("Erreur lors de la vérification du prénom:", error);
//       return false;
//     }
//   };

//   const isValidLastName = async (lastName) => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/check-last-name', { lastName });
//       return response.data.isAvailable;
//     } catch (error) {
//       console.error("Erreur lors de la vérification du nom:", error);
//       return false;
//     }
//   };

//   const isValidPhone = (phone) => {
//     const phoneRegex = /^(032|033|034|038)\d{7}$/;
//     return phoneRegex.test(phone);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setStatusMessage('');
//     setFirstNameError(''); // Réinitialiser les erreurs de prénom
//     setLastNameError('');  // Réinitialiser les erreurs de nom
//     setEmailError('');     // Réinitialiser les erreurs d'email
//     setPhoneError('');     // Réinitialiser les erreurs de téléphone

//     if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
//       setError("Information incomplète");
//       setLoading(false);
//       return;
//     }

//     const emailAvailable = await isValidEmail(email);
//     if (!emailAvailable) {
//       setEmailError("Email déjà utilisé");
//       setLoading(false);
//       return;
//     }

//     const firstNameAvailable = await isValidFirstName(firstName);
//     if (!firstNameAvailable) {
//       setFirstNameError("Prénom déjà utilisé");
//       setLoading(false);
//       return;
//     }

//     const lastNameAvailable = await isValidLastName(lastName);
//     if (!lastNameAvailable) {
//       setLastNameError("Nom déjà utilisé");
//       setLoading(false);
//       return;
//     }

//     if (!isValidPhone(phone)) {
//       setPhoneError("Numéro incorrect !");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3001/api/organizer/create', {
//         email_organisateur: email,
//         mdp_organisateur: password,
//         nom_organisateur: lastName,  // Nom
//         prenom_organisateur: firstName,  // Prénom
//         tel_organisateur: phone,
//       });
//       console.log(response.data);
//       setStatusMessage("Inscription réussie ! Veuillez vérifier votre email pour confirmer.");
//       setTimeout(() => {
//         navigate('/organizerconfirmation', { state: { email } });
//       }, 3000);
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
//       setError("Erreur lors de l'inscription. Veuillez réessayer.");
//       setStatusMessage("Échec de l'inscription. Veuillez réessayer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneChange = (e) => {
//     const value = e.target.value.replace(/\D/g, ''); // Enlève tout sauf les chiffres
//     setPhone(value.slice(0, 10)); // Limite à 10 chiffres au total (3 chiffres pour le préfixe + 7 chiffres restants)
//     setPhoneError('');
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
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//         maxWidth: '400px',
//         margin: 'auto',
//       }}
//     >
//       <TextField
//         label="Nom"
//         value={lastName}
//         onChange={(e) => {
//           setLastName(e.target.value);
//           setLastNameError('');
//         }}
//         fullWidth
//         error={!!lastNameError}
//         helperText={lastNameError}
//       />
//       <TextField
//         label="Prénom"
//         value={firstName}
//         onChange={(e) => {
//           setFirstName(e.target.value);
//           setFirstNameError('');
//         }}
//         fullWidth
//         error={!!firstNameError}
//         helperText={firstNameError}
//       />

//       <TextField
//         label="Email"
//         type="email"
//         value={email}
//         onChange={(e) => {
//           setEmail(e.target.value);
//           setEmailError('');
//         }}
//         fullWidth
//         error={!!emailError}
//         helperText={emailError}
//       />
//       <TextField
//         label="Téléphone"
//         value={phone}
//         onChange={handlePhoneChange}
//         fullWidth
//         error={!!phoneError}
//         helperText={phoneError}
//       />
//       <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
//       <TextField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {statusMessage && <p style={{ color: 'green' }}>{statusMessage}</p>}

//       <FormControlLabel
//         control={<Checkbox checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />}
//         label="Accepter la politique de confidentialité"
//         sx={{ alignSelf: 'flex-start' }}
//       />

//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         fullWidth
//         disabled={!isFormValid || loading}
//         sx={{
//           backgroundColor: isFormValid ? 'blue' : 'lightblue',
//           ':hover': {
//             backgroundColor: isFormValid ? 'blue' : 'lightblue',
//           }, maxWidth: "200px"
//         }}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
//       </Button>
//     </Box>
//   );
// };

// export default OrganizerSignUpForm;
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Checkbox, FormControlLabel, CircularProgress, Typography, Link, Dialog, DialogContent } from '@mui/material';
import axios from 'axios';

const OrganizerSignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // Prénom
  const [lastName, setLastName] = useState('');   // Nom
  const [phone, setPhone] = useState('+261'); // Par défaut, ajouter le préfixe +261
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // Nouveau état pour afficher la confirmation
  const [mailLink, setMailLink] = useState('');

  useEffect(() => {
    const isFormComplete = email && password && confirmPassword && firstName && lastName && phone.length === 13; // Vérifie que le numéro est complet
    const isPasswordMatch = password === confirmPassword;
    setIsFormValid(isFormComplete && isPasswordMatch && privacyAccepted);
  }, [email, password, confirmPassword, firstName, lastName, phone, privacyAccepted]);

  const isValidEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/organizer/check-email', { email });
      return response.data.isAvailable;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      return false;
    }
  };

  const isValidFirstName = async (firstName) => {
    try {
      const response = await axios.post('http://localhost:3001/api/organizer/check-first-name', { firstName });
      return response.data.isAvailable;
    } catch (error) {
      console.error("Erreur lors de la vérification du prénom:", error);
      return false;
    }
  };

  const isValidLastName = async (lastName) => {
    try {
      const response = await axios.post('http://localhost:3001/api/organizer/check-last-name', { lastName });
      return response.data.isAvailable;
    } catch (error) {
      console.error("Erreur lors de la vérification du nom :", error);
      return false;
    }
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+261(32|33|34|38)\d{7}$/; // Vérifie que le numéro est au format E.164
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');

    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
      setError("Information incomplète");
      setLoading(false);
      return;
    }

    const emailAvailable = await isValidEmail(email);
    if (!emailAvailable) {
      setEmailError("Email déjà utilisé");
      setLoading(false);
      return;
    }

    const firstNameAvailable = await isValidFirstName(firstName);
    if (!firstNameAvailable) {
      setFirstNameError("Prénom déjà utilisé");
      setLoading(false);
      return;
    }

    const lastNameAvailable = await isValidLastName(lastName);
    if (!lastNameAvailable) {
      setLastNameError("Nom déjà utilisé");
      setLoading(false);
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError("Numéro incorrect ! Utilisez le format +261xxxxxxxxx");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/organizer/create', {
        email_organisateur: email,
        mdp_organisateur: password,
        nom_organisateur: lastName,
        prenom_organisateur: firstName,
        tel_organisateur: phone,
      });

      setShowConfirmation(true);
      const domain = email.split('@')[1];
      setMailLink(`https://${domain}`);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Ne garde que les chiffres
    if (!value.startsWith('261')) {
      value = `+261${value}`; // Ajoute le préfixe +261 si manquant
    } else {
      value = `+${value}`; // S'assure que le "+" est présent
    }
    setPhone(value.slice(0, 13)); // Limite à 13 caractères (E.164 pour Madagascar)
    setPhoneError('');
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
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: 'auto',
      }}
    >
      <TextField
        label="Nom"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          setLastNameError('');
        }}
        fullWidth
        error={!!lastNameError}
        helperText={lastNameError}
      />
      <TextField
        label="Prénom"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          setFirstNameError('');
        }}
        fullWidth
        error={!!firstNameError}
        helperText={firstNameError}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError('');
        }}
        fullWidth
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        label="Téléphone"
        value={phone}
        onChange={handlePhoneChange}
        fullWidth
        error={!!phoneError}
        helperText={phoneError || "Format : +261xxxxxxxxx"}
      />
      <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      <TextField label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <FormControlLabel
        control={<Checkbox checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />}
        label="Accepter la politique de confidentialité"
        sx={{ alignSelf: 'flex-start' }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!isFormValid || loading}
        sx={{
          backgroundColor: isFormValid ? 'blue' : 'lightblue',
          ':hover': {
            backgroundColor: isFormValid ? 'blue' : 'lightblue',
          }, maxWidth: "200px"
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
      </Button>

      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)} PaperProps={{ style: { borderRadius: '10px' } }}>
        <DialogContent sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}>
          <Typography variant="h6">Inscription réussie !</Typography>
          <Link
            href={mailLink}
            rel="noopener noreferrer"
            sx={{ display: 'block', marginTop: '10px', textDecoration: 'none', color: 'blue' }}
          >
            Veuillez vérifier votre email pour confirmer.
          </Link>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrganizerSignUpForm;












