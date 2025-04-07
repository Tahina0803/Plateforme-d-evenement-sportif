// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Grid, Box, TextField, Button, MenuItem, Typography, Modal } from '@mui/material';
// import axios from 'axios';

// const countryPrefixes = [
//     { label: 'MDG (+261)', value: '+261' },
//     { label: 'MRC (+230)', value: '+230' },
//     { label: 'FR (+33)', value: '+33' },
//     { label: 'USA (+1)', value: '+1' },
// ];

// const Signuppart = () => {
//     const { id_evenement } = useParams();
//     const navigate = useNavigate();
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [loginData, setLoginData] = useState({ email: '', password: '' });

//     const handleLoginChange = (e) => {
//         const { name, value } = e.target;
//         setLoginData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleLoginSubmit = async () => {
//         try {
//             const response = await axios.post('http://localhost:3001/api/participant/registerOrLogin', {
//                 email_part: loginData.email,
//                 mdp_part: loginData.password,
//                 id_evenement,
//             });

//             if (response.data.token && response.data.participantId) {
//                 console.log("📌 Token reçu après inscription:", response.data.token);
//                 console.log("📌 ID du participant reçu après inscription:", response.data.participantId);

//                 localStorage.setItem('token', response.data.token);
//                 localStorage.setItem('participantId', response.data.participantId);

//                 alert('Connexion réussie !');
//                 setIsLoginModalOpen(false);
//                 navigate('/participant/dashboard');
//             } else {
//                 throw new Error("Données manquantes dans la réponse du serveur.");
//             }
//         } catch (error) {
//             alert('Email ou mot de passe incorrect.');
//         }
//     };

//     const [formData, setFormData] = useState({
//         nom_part: '',
//         email_part: '',
//         mdp_part: '',
//         confirm_mdp: '',
//         genre_part: '',
//         telephone_part: '',
//         ville_part: '',
//         codepostal_part: '',
//         prefixe_telephone: '+261',
//     });

//     const [errors, setErrors] = useState({});
//     const [verificationCode, setVerificationCode] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [, setCodeSent] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handlePhoneChange = (e) => {
//         const value = e.target.value.replace(/\D/g, '').slice(0, 9);
//         setFormData((prevData) => ({
//             ...prevData,
//             telephone_part: value,
//         }));
//     };

//     const validatePasswords = () => {
//         if (formData.mdp_part !== formData.confirm_mdp) {
//             setErrors({ confirm_mdp: 'Les mots de passe ne correspondent pas.' });
//             return false;
//         }
//         setErrors({});
//         return true;
//     };

//     /** 🔹 Étape 1 : Envoyer un code de validation */
//     const handleSendVerificationCode = async (e) => {
//         e.preventDefault();
//         if (!validatePasswords()) return;

//         try {
//             await axios.post('http://localhost:3001/api/participant/sendVerificationCode', {
//                 email: formData.email_part,
//             });

//             setCodeSent(true);
//             setIsModalOpen(true);
//             alert("Un code de vérification a été envoyé à votre email.");
//         } catch (error) {
//             alert("Erreur lors de l'envoi du code de vérification.");
//         }
//     };

//     /** 🔹 Étape 2 : Vérifier le code et inscrire l'utilisateur */
//     const handleVerifyCode = async () => {
//         try {
//             const response = await axios.post('http://localhost:3001/api/participant/verifyCode', {
//                 email: formData.email_part,
//                 code: verificationCode,
//             });

//             if (response.status === 200) {
//                 handleRegister();
//             } else {
//                 alert("Code invalide.");
//             }
//         } catch (error) {
//             alert("Code incorrect ou expiré.");
//         }
//     };

//     /** 🔹 Étape 3 : Inscrire l'utilisateur après validation */
//     const handleRegister = async () => {
//         try {
//             const fullPhoneNumber = `${formData.prefixe_telephone}${formData.telephone_part}`.trim();
//             const dataToSubmit = {
//                 ...formData,
//                 telephone_part: fullPhoneNumber,
//                 id_evenement,
//             };
//             delete dataToSubmit.confirm_mdp;
//             delete dataToSubmit.prefixe_telephone;

//             const response = await axios.post('http://localhost:3001/api/participant/registerOrLogin', dataToSubmit);

//             if (response.data.token && response.data.participantId) {
//                 console.log("📌 Token reçu après inscription:", response.data.token);
//                 console.log("📌 ID du participant reçu après inscription:", response.data.participantId);

//                 localStorage.setItem('token', response.data.token);
//                 localStorage.setItem('participantId', response.data.participantId);

//                 alert("Inscription réussie !");
//                 setIsModalOpen(false);
//                 navigate('/participant/dashboard');

//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 500);
//             }
//         } catch (error) {
//             alert("Erreur lors de l'inscription.");
//         }
//     };

//     return (
//         <Box component="form" onSubmit={handleSendVerificationCode} sx={{ maxWidth: 550, margin: 'auto', p: 3, boxShadow: 3, bgcolor: 'white', mt: 5, borderRadius: 2 }}>
//             <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>Inscription à l'événement</Typography>
//             <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                     <TextField label="Nom de participant" name="nom_part" value={formData.nom_part} onChange={handleChange} fullWidth required />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField label="Email" name="email_part" type="email" value={formData.email_part} onChange={handleChange} fullWidth required />
//                 </Grid>

//                 <Grid item xs={3}>
//                     <TextField select name="prefixe_telephone" value={formData.prefixe_telephone} onChange={handleChange} fullWidth>
//                         {countryPrefixes.map((prefix) => (
//                             <MenuItem key={prefix.value} value={prefix.value}>{prefix.label}</MenuItem>
//                         ))}
//                     </TextField>
//                 </Grid>
//                 <Grid item xs={9}>
//                     <TextField label="Téléphone" name="telephone_part" type="tel" value={formData.telephone_part} onChange={handlePhoneChange} inputProps={{ maxLength: 9 }} fullWidth required />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField select label="Genre" name="genre_part" value={formData.genre_part} onChange={handleChange} fullWidth required>
//                         <MenuItem value="Homme">Homme</MenuItem>
//                         <MenuItem value="Femme">Femme</MenuItem>
//                     </TextField>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField label="Ville" name="ville_part" value={formData.ville_part} onChange={handleChange} fullWidth required />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField label="Code postal" name="codepostal_part" value={formData.codepostal_part} onChange={handleChange} fullWidth required />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                     <TextField label="Mot de passe" name="mdp_part" type="password" value={formData.mdp_part} onChange={handleChange} fullWidth required />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                     <TextField label="Confirmer le mot de passe" name="confirm_mdp" type="password" value={formData.confirm_mdp} onChange={handleChange} error={!!errors.confirm_mdp} helperText={errors.confirm_mdp} fullWidth required />
//                 </Grid>
//             </Grid>

//             {/* 🔹 Bouton pour envoyer le code de vérification */}
//             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
//                 <Button type="submit" variant="contained" color="primary">Recevoir un code</Button>
//                 <Button variant="outlined" color="secondary" onClick={() => setIsLoginModalOpen(true)}>Compte existant</Button>
//             </Box>

//             {/* 🔹 Modal de connexion */}
//             {/* <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
//                 <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
//                     <Typography variant="h6">Connexion à un compte existant</Typography>
//                     <TextField label="Email" name="email" value={loginData.email} onChange={handleLoginChange} fullWidth required />
//                     <TextField label="Mot de passe" name="password" type="password" value={loginData.password} onChange={handleLoginChange} fullWidth required />
//                     <Button variant="contained" color="primary" onClick={handleLoginSubmit} fullWidth>
//                         Confirmer
//                     </Button>
//                 </Box>
//             </Modal> */}
//             <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: 400,
//                         bgcolor: 'background.paper',
//                         p: 4,
//                         borderRadius: 2,
//                         boxShadow: 3
//                     }}
//                 >
//                     <Typography variant="h6" sx={{ marginBottom: 2 }}>Connexion à un compte existant</Typography>

//                     <TextField
//                         label="Email"
//                         name="email"
//                         value={loginData.email}
//                         onChange={handleLoginChange}
//                         fullWidth
//                         required
//                         sx={{ marginBottom: 2 }}  // Ajout d'une marge en bas
//                     />

//                     <TextField
//                         label="Mot de passe"
//                         name="password"
//                         type="password"
//                         value={loginData.password}
//                         onChange={handleLoginChange}
//                         fullWidth
//                         required
//                         sx={{ marginBottom: 3 }}  // Ajout d'une marge plus grande pour bien espacer du bouton
//                     />

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleLoginSubmit}
//                         fullWidth
//                     >
//                         Confirmer
//                     </Button>
//                 </Box>
//             </Modal>


//             {/* 🔹 Modal de validation du code */}
//             <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
//                     <Typography variant="h6">Entrez le code de validation</Typography>
//                     <TextField label="Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} fullWidth required sx={{ mb: 2 }} />
//                     <Button variant="contained" color="primary" onClick={handleVerifyCode} fullWidth>Confirmer</Button>
//                 </Box>
//             </Modal>
//         </Box>
//     );
// };

// export default Signuppart;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Box, TextField, Button, MenuItem, Typography, Modal } from '@mui/material';
import axios from 'axios';

const countryPrefixes = [
    { label: 'MDG (+261)', value: '+261' },
    { label: 'MRC (+230)', value: '+230' },
    { label: 'FR (+33)', value: '+33' },
    { label: 'USA (+1)', value: '+1' },
];

const Signuppart = () => {
    const { id_evenement } = useParams();
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLoginSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/participant/registerOrLogin', {
                email_part: loginData.email,
                mdp_part: loginData.password,
                id_evenement,
            });

            if (response.data.token && response.data.participantId) {
                console.log("📌 Token reçu après inscription:", response.data.token);
                console.log("📌 ID du participant reçu après inscription:", response.data.participantId);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('participantId', response.data.participantId);

                alert('Connexion réussie !');
                setIsLoginModalOpen(false);
                navigate('/participant/dashboard');
            } else {
                throw new Error("Données manquantes dans la réponse du serveur.");
            }
        } catch (error) {
            alert('Email ou mot de passe incorrect.');
        }
    };

    const [formData, setFormData] = useState({
        nom_part: '',
        email_part: '',
        mdp_part: '',
        confirm_mdp: '',
        genre_part: '',
        telephone_part: '',
        ville_part: '',
        codepostal_part: '',
        prefixe_telephone: '+261',
    });

    const [errors, setErrors] = useState({});
    const [verificationCode, setVerificationCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
        setFormData((prevData) => ({
            ...prevData,
            telephone_part: value,
        }));
    };

    const validatePasswords = () => {
        if (formData.mdp_part !== formData.confirm_mdp) {
            setErrors({ confirm_mdp: 'Les mots de passe ne correspondent pas.' });
            return false;
        }
        setErrors({});
        return true;
    };

    /** 🔹 Étape 1 : Envoyer un code de validation */
    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        if (!validatePasswords()) return;

        try {
            await axios.post('http://localhost:3001/api/participant/sendVerificationCode', {
                email: formData.email_part,
            });

            setCodeSent(true);
            setIsModalOpen(true);
            alert("Un code de vérification a été envoyé à votre email.");
        } catch (error) {
            alert("Erreur lors de l'envoi du code de vérification.");
        }
    };

    /*/** 🔹 Étape 2 : Vérifier le code et inscrire l'utilisateur */
    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/participant/verifyCode', {
                email: formData.email_part,
                code: verificationCode,
            });

            if (response.status === 200) {
                handleRegister();
            } else {
                alert("Code invalide.");
            }
        } catch (error) {
            alert("Code incorrect ou expiré.");
        }
    };

    /** 🔹 Étape 3 : Inscrire l'utilisateur après validation */
    const handleRegister = async () => {
        try {
            // const fullPhoneNumber = `${formData.prefixe_telephone}${formData.telephone_part}`.trim();
            const fullPhoneNumber = `${formData.prefixe_telephone}${formData.telephone_part}`.trim();
            console.log("📌 Numéro envoyé :", fullPhoneNumber);
            const dataToSubmit = {
                ...formData,
                telephone_part: fullPhoneNumber,
                id_evenement,
            };
            delete dataToSubmit.confirm_mdp;
            delete dataToSubmit.prefixe_telephone;

            // 🔍 LOG pour vérifier les données envoyées
        console.log("📌 Données envoyées :", dataToSubmit);

            const response = await axios.post('http://localhost:3001/api/participant/registerOrLogin', dataToSubmit);

            if (response.data.token && response.data.participantId) {
                console.log("📌 Token reçu après inscription:", response.data.token);
                console.log("📌 ID du participant reçu après inscription:", response.data.participantId);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('participantId', response.data.participantId);

                alert("Inscription réussie !");
                setIsModalOpen(false);
                navigate('/participant/dashboard');

                setTimeout(() => {
                    window.location.reload();
                }, 250);
            }
        } catch (error) {
            alert("Erreur lors de l'inscription.");
        }
    };

    
    return (
        <Box component="form" onSubmit={handleSendVerificationCode} sx={{ maxWidth: 550, margin: 'auto', p: 3, boxShadow: 3, bgcolor: 'white', mt: 5, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>Inscription à l'événement</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField label="Nom de participant" name="nom_part" value={formData.nom_part} onChange={handleChange} fullWidth required />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Email" name="email_part" type="email" value={formData.email_part} onChange={handleChange} fullWidth required />
                </Grid>

                <Grid item xs={3}>
                    <TextField select name="prefixe_telephone" value={formData.prefixe_telephone} onChange={handleChange} fullWidth>
                        {countryPrefixes.map((prefix) => (
                            <MenuItem key={prefix.value} value={prefix.value}>{prefix.label}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={9}>
                    <TextField label="Téléphone" name="telephone_part" type="tel" value={formData.telephone_part} onChange={handlePhoneChange} inputProps={{ maxLength: 9 }} fullWidth required />
                </Grid>

                <Grid item xs={12}>
                    <TextField select label="Genre" name="genre_part" value={formData.genre_part} onChange={handleChange} fullWidth required>
                        <MenuItem value="Homme">Homme</MenuItem>
                        <MenuItem value="Femme">Femme</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Ville" name="ville_part" value={formData.ville_part} onChange={handleChange} fullWidth required />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Code postal" name="codepostal_part" value={formData.codepostal_part} onChange={handleChange} fullWidth required />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField label="Mot de passe" name="mdp_part" type="password" value={formData.mdp_part} onChange={handleChange} fullWidth required />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField label="Confirmer le mot de passe" name="confirm_mdp" type="password" value={formData.confirm_mdp} onChange={handleChange} error={!!errors.confirm_mdp} helperText={errors.confirm_mdp} fullWidth required />
                </Grid>
            </Grid>

            {/* 🔹 Bouton pour envoyer le code de vérification */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button type="submit" variant="contained" color="primary">S'inscrire</Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsLoginModalOpen(true)}>Compte existant</Button>
            </Box>

        
            <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Connexion à un compte existant</Typography>

                    <TextField
                        label="Email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}  // Ajout d'une marge en bas
                    />

                    <TextField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        fullWidth
                        required
                        sx={{ marginBottom: 3 }}  // Ajout d'une marge plus grande pour bien espacer du bouton
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginSubmit}
                        fullWidth
                    >
                        Confirmer
                    </Button>
                </Box>
            </Modal>


            {/* 🔹 Modal de validation du code */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
                    <Typography variant="h6">Entrez le code de validation</Typography>
                    <TextField label="Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} fullWidth required sx={{ mb: 2 }} />
                    <Button variant="contained" color="primary" onClick={handleVerifyCode} fullWidth>Confirmer</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Signuppart;

