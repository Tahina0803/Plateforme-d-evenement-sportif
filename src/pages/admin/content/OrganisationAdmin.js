// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Button,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   IconButton,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   TextField,
// //   Paper,
// //   Typography,
// //   Stack,
// //   InputAdornment,
// // } from '@mui/material';
// // import { Edit, Delete, Add, Search } from '@mui/icons-material';
// // import axios from 'axios'; // Pour faire des requêtes HTTP

// // const OrganisationAdmin = () => {
// //   // Liste des administrateurs initiale
// //   const [admins, setAdmins] = useState([
// //     { id: 1, nom: 'Doe', prenom: 'John', email: 'john@example.com', tel: '123456789' },
// //     { id: 2, nom: 'Smith', prenom: 'Jane', email: 'jane@example.com', tel: '987654321' },
// //   ]);

// //   // Variables d'état
// //   const [open, setOpen] = useState(false);
// //   const [newAdmin, setNewAdmin] = useState({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
// //   const [editMode, setEditMode] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [currentAdmin, setCurrentAdmin] = useState(null);

// //   // Ouvrir le formulaire d'ajout ou modification
// //   const handleOpen = () => {
// //     setNewAdmin({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
// //     setEditMode(false);
// //     setOpen(true);
// //     console.log('Formulaire ouvert pour ajout');
// //   };

// //   // Ouvrir le formulaire d'édition
// //   const handleEdit = (admin) => {
// //     setNewAdmin(admin);
// //     setCurrentAdmin(admin);
// //     setEditMode(true);
// //     setOpen(true);
// //     console.log('Formulaire ouvert pour édition :', admin);
// //   };

// //   // Fermer la boîte de dialogue
// //   const handleClose = () => {
// //     setOpen(false);
// //     console.log('Formulaire fermé');
// //   };

// //   // Enregistrer un nouvel admin ou modifier
// //   const handleSave = async () => {
// //     console.log('Données soumises pour sauvegarde :', newAdmin);

// //     if (newAdmin.mdp !== newAdmin.confirmMdp) {
// //       alert("Les mots de passe ne correspondent pas !");
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem('token');  // Récupérer le token JWT stocké
// //       console.log('Token récupéré:', token);

// //       if (!token) {
// //         alert('Token non trouvé, veuillez vous connecter');
// //         return;
// //       }

// //       if (editMode) {
// //         // Si nous sommes en mode édition, nous modifions un admin existant
// //         console.log('Modification de l\'admin :', currentAdmin);
// //         setAdmins((prev) =>
// //           prev.map((admin) =>
// //             admin.id === currentAdmin.id ? newAdmin : admin
// //           )
// //         );
// //       } else {
// //         // Sinon, nous ajoutons un nouvel admin et faisons une requête POST à l'API
// //         console.log('Ajout d\'un nouvel admin :', newAdmin);

// //         const response = await axios.post('http://localhost:3001/api/auth/admin/create', {
// //           nom_admin: newAdmin.nom,
// //           prenom_admin: newAdmin.prenom,
// //           email_admin: newAdmin.email,
// //           tel_admin: newAdmin.tel,
// //           mdp_admin: newAdmin.mdp,
// //         }, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,  // Inclure le token dans l'en-tête de la requête
// //           }
// //         });

// //         // Ajouter l'admin dans l'état local une fois la requête réussie
// //         const createdAdmin = response.data;
// //         console.log('Réponse du serveur après création :', createdAdmin);

// //         setAdmins((prev) => [...prev, { ...newAdmin, id: createdAdmin.id_admin }]);
// //       }
// //       setOpen(false);
// //     } catch (error) {
// //       console.error('Erreur lors de l\'ajout de l\'admin:', error.response || error.message || error);
// //       alert('Erreur lors de l\'ajout de l\'administrateur');
// //     }
// //   };

// //   // Supprimer un admin
// //   const handleDelete = (id) => {
// //     console.log('Suppression de l\'admin avec id :', id);
// //     setAdmins((prev) => prev.filter((admin) => admin.id !== id));
// //   };

// //   // Filtrer les administrateurs en fonction de la recherche
// //   const filteredAdmins = admins.filter(
// //     (admin) =>
// //       admin.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       admin.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       admin.tel.includes(searchQuery)
// //   );

// //   return (
// //     <Box sx={{ padding: 4, borderRadius: 3, margin: 'auto' }}>
// //       <Typography variant="h4" gutterBottom>
// //         Gestion des Administrateurs
// //       </Typography>

// //       {/* Barre de recherche */}
// //       <TextField
// //         label="Rechercher un admin"
// //         variant="outlined"
// //         fullWidth
// //         sx={{ marginBottom: 3 }}
// //         onChange={(e) => setSearchQuery(e.target.value)}
// //         InputProps={{
// //           startAdornment: (
// //             <InputAdornment position="start">
// //               <Search />
// //             </InputAdornment>
// //           ),
// //         }}
// //       />

// //       {/* Bouton pour ajouter un administrateur */}
// //       <Button
// //         variant="contained"
// //         startIcon={<Add />}
// //         onClick={handleOpen}
// //         sx={{ marginBottom: 3, backgroundColor: '#1976d2' }}
// //       >
// //         Ajouter un Admin
// //       </Button>

// //       {/* Table des administrateurs */}
// //       <TableContainer component={Paper} sx={{ borderRadius: 2, width: '100%' }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Nom</TableCell>
// //               <TableCell>Prénom</TableCell>
// //               <TableCell>Email</TableCell>
// //               <TableCell>Téléphone</TableCell>
// //               <TableCell align="right">Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {filteredAdmins.map((admin) => (
// //               <TableRow key={admin.id}>
// //                 <TableCell>{admin.nom}</TableCell>
// //                 <TableCell>{admin.prenom}</TableCell>
// //                 <TableCell>{admin.email}</TableCell>
// //                 <TableCell>{admin.tel}</TableCell>
// //                 <TableCell align="right">
// //                   <IconButton
// //                     aria-label="edit"
// //                     onClick={() => handleEdit(admin)}
// //                     sx={{ color: '#1976d2' }}
// //                   >
// //                     <Edit />
// //                   </IconButton>
// //                   <IconButton
// //                     aria-label="delete"
// //                     onClick={() => handleDelete(admin.id)}
// //                     sx={{ color: '#d32f2f' }}
// //                   >
// //                     <Delete />
// //                   </IconButton>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       {/* Boîte de dialogue pour ajouter ou modifier un admin */}
// //       <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
// //         <DialogTitle>{editMode ? 'Modifier Admin' : 'Ajouter Admin'}</DialogTitle>
// //         <DialogContent>
// //           <Stack spacing={2} sx={{ mt: 2 }}>
// //             <TextField
// //               label="Nom"
// //               value={newAdmin.nom}
// //               onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
// //               fullWidth
// //             />
// //             <TextField
// //               label="Prénom"
// //               value={newAdmin.prenom}
// //               onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
// //               fullWidth
// //             />
// //             <TextField
// //               label="Email"
// //               value={newAdmin.email}
// //               onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
// //               fullWidth
// //             />
// //             <TextField
// //               label="Téléphone"
// //               value={newAdmin.tel}
// //               onChange={(e) => setNewAdmin({ ...newAdmin, tel: e.target.value })}
// //               fullWidth
// //             />
// //             <TextField
// //               label="Mot de passe"
// //               type="password"
// //               value={newAdmin.mdp}
// //               onChange={(e) => setNewAdmin({ ...newAdmin, mdp: e.target.value })}
// //               fullWidth
// //             />
// //             <TextField
// //               label="Confirmation du mot de passe"
// //               type="password"
// //               value={newAdmin.confirmMdp}
// //               onChange={(e) => setNewAdmin({ ...newAdmin, confirmMdp: e.target.value })}
// //               fullWidth
// //             />
// //           </Stack>
// //         </DialogContent>
// //         <DialogActions sx={{ margin: '10px' }}>
// //           <Button onClick={handleClose}>Annuler</Button>
// //           <Button onClick={handleSave} variant="contained">
// //             {editMode ? 'Sauvegarder' : 'Ajouter'}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default OrganisationAdmin;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Paper,
//   Typography,
//   Stack,
//   InputAdornment,
// } from '@mui/material';
// import { Edit, Delete, Add, Search } from '@mui/icons-material';
// import axios from 'axios'; // Pour faire des requêtes HTTP

// const OrganisationAdmin = () => {
//   // Liste des administrateurs initiale
//   const [admins, setAdmins] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
//   const [editMode, setEditMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentAdmin, setCurrentAdmin] = useState(null);

//   // Charger la liste des admins à partir de l'API
//   useEffect(() => {
//     const fetchAdmins = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Token non trouvé');
//         return;
//       }
//       const response = await axios.get('http://localhost:3001/api/auth/admin/all', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAdmins(response.data);
//     };
//     fetchAdmins();
//   }, []);

//   // Ouvrir le formulaire d'ajout ou modification
//   const handleOpen = () => {
//     setNewAdmin({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
//     setEditMode(false);
//     setOpen(true);
//   };

//   // Ouvrir le formulaire d'édition
//   const handleEdit = (admin) => {
//     setNewAdmin(admin);
//     setCurrentAdmin(admin);
//     setEditMode(true);
//     setOpen(true);
//   };

//   // Fermer la boîte de dialogue
//   const handleClose = () => {
//     setOpen(false);
//   };

//   // Enregistrer un nouvel admin ou modifier
//   const handleSave = async () => {
//     const token = localStorage.getItem('token');

//     if (newAdmin.mdp !== newAdmin.confirmMdp) {
//       alert("Les mots de passe ne correspondent pas !");
//       return;
//     }

//     try {
//       if (editMode) {
//         // Modification de l'admin
//         const response = await axios.put(`http://localhost:3001/api/auth/admin/${currentAdmin.id}`, {
//           nom_admin: newAdmin.nom,
//           prenom_admin: newAdmin.prenom,
//           email_admin: newAdmin.email,
//           tel_admin: newAdmin.tel,
//           mdp_admin: newAdmin.mdp,
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setAdmins((prev) =>
//           prev.map((admin) => (admin.id === currentAdmin.id ? newAdmin : admin))
//         );
//       } else {
//         // Ajout d'un nouvel admin
//         const response = await axios.post('http://localhost:3001/api/auth/admin/create', {
//           nom_admin: newAdmin.nom,
//           prenom_admin: newAdmin.prenom,
//           email_admin: newAdmin.email,
//           tel_admin: newAdmin.tel,
//           mdp_admin: newAdmin.mdp,
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setAdmins((prev) => [...prev, { ...newAdmin, id: response.data.id_admin }]);
//       }
//       setOpen(false);
//     } catch (error) {
//       console.error('Erreur lors de l\'enregistrement de l\'admin:', error);
//       alert('Erreur lors de l\'enregistrement de l\'administrateur');
//     }
//   };

//   // Supprimer un admin
//   const handleDelete = async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`http://localhost:3001/api/auth/admin/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAdmins((prev) => prev.filter((admin) => admin.id !== id));
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'admin:', error);
//       alert('Erreur lors de la suppression de l\'administrateur');
//     }
//   };

//   // Filtrer les administrateurs en fonction de la recherche
//   const filteredAdmins = admins.filter(
//     (admin) =>
//       admin.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       admin.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       admin.tel.includes(searchQuery)
//   );

//   return (
//     <Box sx={{ padding: 4, borderRadius: 3, margin: 'auto' }}>
//       <Typography variant="h4" gutterBottom>
//         Gestion des Administrateurs
//       </Typography>

//       {/* Barre de recherche */}
//       <TextField
//         label="Rechercher un admin"
//         variant="outlined"
//         fullWidth
//         sx={{ marginBottom: 3 }}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Search />
//             </InputAdornment>
//           ),
//         }}
//       />

//       {/* Bouton pour ajouter un administrateur */}
//       <Button
//         variant="contained"
//         startIcon={<Add />}
//         onClick={handleOpen}
//         sx={{ marginBottom: 3, backgroundColor: '#1976d2' }}
//       >
//         Ajouter un Admin
//       </Button>

//       {/* Table des administrateurs */}
//       <TableContainer component={Paper} sx={{ borderRadius: 2, width: '100%' }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Nom</TableCell>
//               <TableCell>Prénom</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Téléphone</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredAdmins.map((admin) => (
//               <TableRow key={admin.id}>
//                 <TableCell>{admin.nom}</TableCell>
//                 <TableCell>{admin.prenom}</TableCell>
//                 <TableCell>{admin.email}</TableCell>
//                 <TableCell>{admin.tel}</TableCell>
//                 <TableCell align="right">
//                   <IconButton
//                     aria-label="edit"
//                     onClick={() => handleEdit(admin)}
//                     sx={{ color: '#1976d2' }}
//                   >
//                     <Edit />
//                   </IconButton>
//                   <IconButton
//                     aria-label="delete"
//                     onClick={() => handleDelete(admin.id)}
//                     sx={{ color: '#d32f2f' }}
//                   >
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Boîte de dialogue pour ajouter ou modifier un admin */}
//       <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
//         <DialogTitle>{editMode ? 'Modifier Admin' : 'Ajouter Admin'}</DialogTitle>
//         <DialogContent>
//           <Stack spacing={2} sx={{ mt: 2 }}>
//             <TextField
//               label="Nom"
//               value={newAdmin.nom}
//               onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Prénom"
//               value={newAdmin.prenom}
//               onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Email"
//               value={newAdmin.email}
//               onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Téléphone"
//               value={newAdmin.tel}
//               onChange={(e) => setNewAdmin({ ...newAdmin, tel: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Mot de passe"
//               type="password"
//               value={newAdmin.mdp}
//               onChange={(e) => setNewAdmin({ ...newAdmin, mdp: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Confirmation du mot de passe"
//               type="password"
//               value={newAdmin.confirmMdp}
//               onChange={(e) => setNewAdmin({ ...newAdmin, confirmMdp: e.target.value })}
//               fullWidth
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ margin: '10px' }}>
//           <Button onClick={handleClose}>Annuler</Button>
//           <Button onClick={handleSave} variant="contained">
//             {editMode ? 'Sauvegarder' : 'Ajouter'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default OrganisationAdmin;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Paper,
//   Typography,
//   Stack,
//   InputAdornment,
//   Alert // Ajout du composant Alert pour afficher des messages
// } from '@mui/material';
// import { Edit, Delete, Add, Search } from '@mui/icons-material';
// import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/adminService.js'; // Importer le service

// const OrganisationAdmin = () => {
//   const [admins, setAdmins] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
//   const [editMode, setEditMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [error, setError] = useState(''); // Utilisation d'une chaîne vide pour stocker les messages d'erreur
//   const [success, setSuccess] = useState(''); // Pour afficher un message de succès
//   const [currentAdmin, setCurrentAdmin] = useState(null);

//   // Charger la liste des admins à partir de l'API
//   useEffect(() => {
//     const fetchAdmins = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const admins = await getAllAdmins(token);
//         console.log('Admins récupérés: ', admins);
//         setAdmins(admins);
//       } catch (error) {
//         setError('Erreur lors de la récupération des administrateurs');
//         console.log('Erreur lors de la récupération des administrateur');
//       }
//     };
//     fetchAdmins();
//   }, []);

//   // Ouvrir le formulaire d'ajout
// const handleOpen = () => {
//   setNewAdmin({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
//   setError(''); // Réinitialiser l'erreur
//   setSuccess(''); // Réinitialiser le succès
//   setEditMode(false);
//   setOpen(true);
// };

// // Ouvrir le formulaire d'édition
// const handleEdit = (admin) => {
//   setNewAdmin({
//     nom: admin.nom_admin,
//     prenom: admin.prenom_admin,
//     email: admin.email_admin,
//     tel: admin.tel_admin,
//     mdp: '', // Ne pas pré-remplir le mot de passe
//     confirmMdp: '' // Ne pas pré-remplir la confirmation du mot de passe
//   });
//   setCurrentAdmin(admin); // Stocker l'admin actuel dans un état
//   setError(''); // Réinitialiser l'erreur
//   setSuccess(''); // Réinitialiser le succès
//   setEditMode(true); // Passe en mode édition
//   setOpen(true); // Ouvre la boîte de dialogue
// };

// // Fermer la boîte de dialogue
// const handleClose = () => {
//   setOpen(false);
//   setError('');
//   setSuccess('');
// };


// const fetchAdmins = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     const admins = await getAllAdmins(token); // Fonction pour récupérer tous les admins
//     setAdmins(admins); // Mettre à jour la liste des admins
//   } catch (error) {
//     console.error('Erreur lors de la récupération des administrateurs', error);
//   }
// };

// const handleSave = async () => {
//   const token = localStorage.getItem('token');

//   if (newAdmin.mdp !== newAdmin.confirmMdp) {
//     setError('Les mots de passe ne correspondent pas');
//     return;
//   }

//   try {
//     if (editMode) {
//       // Modification de l'admin
//       await updateAdmin(currentAdmin.id_admin, {
//         nom_admin: newAdmin.nom,
//         prenom_admin: newAdmin.prenom,
//         email_admin: newAdmin.email,
//         tel_admin: newAdmin.tel,
//         mdp_admin: newAdmin.mdp,
//       }, token);

//       // Appeler la fonction pour recharger la liste des admins après modification
//       await fetchAdmins();

//       setSuccess('Administrateur modifié avec succès');
//     } else {
//       // Ajout d'un nouvel admin
//       const createdAdmin = await createAdmin({
//         nom_admin: newAdmin.nom,
//         prenom_admin: newAdmin.prenom,
//         email_admin: newAdmin.email,
//         tel_admin: newAdmin.tel,
//         mdp_admin: newAdmin.mdp,
//       }, token);

//       // Ajouter le nouvel admin à la liste
//       setAdmins((prev) => [...prev, { ...newAdmin, id_admin: createdAdmin.id_admin }]);
//       setSuccess('Administrateur ajouté avec succès');
//     }

//     // Fermer la boîte de dialogue après succès
//     setOpen(false);
//   } catch (error) {
//     if (error.response?.status === 400) {
//       setError('Cet administrateur existe déjà');
//     } else {
//       setError('Erreur lors de l\'enregistrement de l\'administrateur');
//     }
//   }
// };


//   // Supprimer un admin
//   const handleDelete = async (id_admin) => {
//     const token = localStorage.getItem('token');
//     try {
//       await deleteAdmin(id_admin, token);
//       setAdmins((prev) => prev.filter((admin) => admin.id_admin !== id_admin));
//       setSuccess('Administrateur supprimé avec succès');
//     } catch (error) {
//       setError('Erreur lors de la suppression de l\'administrateur');
//     }
//   };

//   // Filtrer les administrateurs en fonction de la recherche
//   const filteredAdmins = admins.filter(
//     (admin) =>
//       admin?.nom_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       admin?.prenom_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       admin?.email_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       admin?.tel_admin?.toString().includes(searchQuery)
//   );


//   return (
//     <Box sx={{ padding: 4, borderRadius: 3, margin: 'auto' }}>
//       <Typography variant="h4" gutterBottom>
//         Gestion des Administrateurs
//       </Typography>

//       {/* Barre de recherche */}
//       <TextField
//         label="Rechercher un admin"
//         variant="outlined"
//         fullWidth
//         sx={{ marginBottom: 3 }}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Search />
//             </InputAdornment>
//           ),
//         }}
//       />

//       {/* Bouton pour ajouter un administrateur */}
//       <Button
//         variant="contained"
//         startIcon={<Add />}
//         onClick={handleOpen}
//         sx={{ marginBottom: 3, backgroundColor: '#1976d2' }}
//       >
//         Ajouter un Admin
//       </Button>

//       {/* Table des administrateurs */}
//       <TableContainer component={Paper} sx={{ borderRadius: 2, width: '100%' }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Nom</TableCell>
//             <TableCell>Prénom</TableCell>
//             <TableCell>Email</TableCell>
//             <TableCell>Téléphone</TableCell>
//             <TableCell align="right">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredAdmins.length > 0 ? (
//             filteredAdmins.map((admin) => (
//               <TableRow key={admin.id_admin}>
//                 <TableCell>{admin.nom_admin}</TableCell>
//                 <TableCell>{admin.prenom_admin}</TableCell>
//                 <TableCell>{admin.email_admin}</TableCell>
//                 <TableCell>{admin.tel_admin}</TableCell>
//                 <TableCell align="right">
//                   <IconButton
//                     aria-label="edit"
//                     onClick={() => handleEdit(admin)}
//                     sx={{ color: '#1976d2' }}
//                   >
//                     <Edit />
//                   </IconButton>
//                   <IconButton
//                     aria-label="delete"
//                     onClick={() => handleDelete(admin.id_admin)}
//                     sx={{ color: '#d32f2f' }}
//                   >
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={5} align="center">
//                 Aucun administrateur trouvé.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       </TableContainer>

//       {/* Boîte de dialogue pour ajouter ou modifier un admin */}
//       <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
//         <DialogTitle>{editMode ? 'Modifier Admin' : 'Ajouter Admin'}</DialogTitle>

//         {/* Affichage d'une alerte en cas de succès */}
//         {success && (
//           <Alert severity="success" sx={{ mt: 2 }}>
//             {success}
//           </Alert>
//         )}

//         {/* Affichage d'une alerte en cas d'erreur */}
//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <DialogContent>
//           <Stack spacing={2} sx={{ mt: 2 }}>
//             <TextField
//               label="Nom"
//               value={newAdmin.nom}
//               onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Prénom"
//               value={newAdmin.prenom}
//               onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Email"
//               value={newAdmin.email}
//               onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Téléphone"
//               value={newAdmin.tel}
//               onChange={(e) => setNewAdmin({ ...newAdmin, tel: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Mot de passe"
//               type="password"
//               value={newAdmin.mdp}
//               onChange={(e) => setNewAdmin({ ...newAdmin, mdp: e.target.value })}
//               fullWidth
//             />
//             <TextField
//               label="Confirmation du mot de passe"
//               type="password"
//               value={newAdmin.confirmMdp}
//               onChange={(e) => setNewAdmin({ ...newAdmin, confirmMdp: e.target.value })}
//               fullWidth
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ margin: '10px' }}>
//           <Button onClick={handleClose}>Annuler</Button>
//           <Button onClick={handleSave} variant="contained">
//             {editMode ? 'Sauvegarder' : 'Ajouter'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default OrganisationAdmin;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  Stack,
  InputAdornment,
  Alert
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/adminService.js'; // Importer le service
import PasswordValidator from '../../../components/tools/PasswordValidator.js';
import usePasswordValidation from '../../../components/tools/usePasswordValidator.js';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const OrganisationAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(''); // Utilisation d'une chaîne vide pour stocker les messages d'erreur
  const [success, setSuccess] = useState(''); // Pour afficher un message de succès
  const [currentAdmin, setCurrentAdmin] = useState(null);
  // Utilisation du hook pour la validation du mot de passe
  const { criteriaResults, isValid } = usePasswordValidation(newAdmin.mdp);
  const [showPassword, setShowPassword] = useState(false); // État pour afficher ou masquer le mot de passe
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev); // Fonction pour basculer l'affichage du mot de passe
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);

  
  // Charger la liste des admins à partir de l'API
  // Fonction pour récupérer la liste des admins
  const fetchAdmins = async () => {
    const token = localStorage.getItem('token');
    try {
      const admins = await getAllAdmins(token);
      console.log('Admins récupérés: ', admins);
      setAdmins(admins);
    } catch (error) {
      setError('Erreur lors de la récupération des administrateurs');
      console.log('Erreur lors de la récupération des administrateur');
    }
  };

  // Charger la liste des admins au montage du composant
  useEffect(() => {
    fetchAdmins(); // Appel initial pour charger les admins
  }, []);

  // Ouvrir le formulaire d'ajout
  const handleOpen = () => {
    setNewAdmin({ nom: '', prenom: '', tel: '', email: '', mdp: '', confirmMdp: '' });
    setError(''); // Réinitialiser l'erreur
    setSuccess(''); // Réinitialiser le succès
    setEditMode(false);
    setOpen(true);
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (admin) => {
    setNewAdmin({
      nom: admin.nom_admin,
      prenom: admin.prenom_admin,
      email: admin.email_admin,
      tel: admin.tel_admin,
      mdp: '', // Ne pas pré-remplir le mot de passe
      confirmMdp: '' // Ne pas pré-remplir la confirmation du mot de passe
    });
    setCurrentAdmin(admin); // Stocker l'admin actuel dans un état
    setError(''); // Réinitialiser l'erreur
    setSuccess(''); // Réinitialiser le succès
    setEditMode(true); // Passe en mode édition
    setOpen(true); // Ouvre la boîte de dialogue
  };

  // Fermer la boîte de dialogue
  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    if (newAdmin.mdp !== newAdmin.confirmMdp) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      if (editMode) {
        // Modification de l'admin existant
        await updateAdmin(
          currentAdmin.id_admin,
          {
            nom_admin: newAdmin.nom,
            prenom_admin: newAdmin.prenom,
            email_admin: newAdmin.email,
            tel_admin: newAdmin.tel,
            mdp_admin: newAdmin.mdp,
          },
          token
        );

        // Mise à jour de la liste locale
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id_admin === currentAdmin.id_admin
              ? { ...admin, ...newAdmin }
              : admin
          )
        );

        console.log("Admin modifie avec succès, nouvelle liste :", admins);
        setSuccess('Administrateur modifié avec succès');
      } else {
        // Ajout d'un nouvel admin
        const createdAdmin = await createAdmin(
          {
            nom_admin: newAdmin.nom,
            prenom_admin: newAdmin.prenom,
            email_admin: newAdmin.email,
            tel_admin: newAdmin.tel,
            mdp_admin: newAdmin.mdp,
          },
          token
        );

        // Vérifiez si le nouvel admin a été correctement créé
        if (createdAdmin && createdAdmin.id_admin) {
          // Ajouter le nouvel admin à la liste existante
          setAdmins((prevAdmins) =>  [...prevAdmins, createdAdmin]);
          setSuccess('Administrateur ajouté avec succès');
        } else {
          setError("Erreur lors de l'ajout de l'administrateur");
        }
      }

      // Réinitialiser le formulaire
      setNewAdmin({ nom: '', prenom: '', email: '', tel: '', mdp: '', confirmMdp: '' });


      // Fermer la boîte de dialogue après succès
      setOpen(false);
      await fetchAdmins(); // Cette fonction recharge la liste des admins sans recharger toute la page
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Cet administrateur existe déjà');
      } else {
        setError('Erreur lors de l\'enregistrement de l\'administrateur');
      }
    }
  };


  // Supprimer un admin
  const handleDelete = async (id_admin) => {
    const token = localStorage.getItem('token');
    try {
      await deleteAdmin(id_admin, token);
      setAdmins((prev) => prev.filter((admin) => admin.id_admin !== id_admin));
      setSuccess('Administrateur supprimé avec succès');
    } catch (error) {
      setError('Erreur lors de la suppression de l\'administrateur');
    }
  };

  // Filtrer les administrateurs en fonction de la recherche
  const filteredAdmins = admins.filter(
    (admin) =>
      admin?.nom_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.prenom_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.email_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.tel_admin?.toString().includes(searchQuery)
  );




  // Validation du champ "Confirmation du mot de passe"
  useEffect(() => {
    setConfirmPasswordValid(newAdmin.mdp === newAdmin.confirmMdp);
  }, [newAdmin.mdp, newAdmin.confirmMdp]);

  return (
    <Box sx={{ padding: 4, borderRadius: 3, margin: 'auto', width: '90%', maxWidth: '1200px' }}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 5, textAlign: 'left' }}>
        Gestion des Administrateurs
      </Typography>

      {/* Search and Add button in the same line */}
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              label="Rechercher un admin"
              variant="outlined"
              sx={{ width: '300px' }}
              fullWidth // Ensure the search bar takes full width on small screens
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3} container justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpen}
              sx={{ backgroundColor: '#1976d2' }}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Box>
       {/* Subtitle */}
       <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'left' }}>
        Liste des Administrateurs
      </Typography>
      {/* Table of admins */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id_admin}>
                  <TableCell>{admin.nom_admin}</TableCell>
                  <TableCell>{admin.prenom_admin}</TableCell>
                  <TableCell>{admin.email_admin}</TableCell>
                  <TableCell>{admin.tel_admin}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(admin)}
                      sx={{ color: '#1976d2' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(admin.id_admin)}
                      sx={{ color: '#d32f2f' }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun administrateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{editMode ? 'Modifier Admin' : 'Ajouter Admin'}</DialogTitle>

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Nom"
              value={newAdmin.nom}
              onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
              fullWidth
            />
            <TextField
              label="Prénom"
              value={newAdmin.prenom}
              onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Téléphone"
              value={newAdmin.tel}
              onChange={(e) => setNewAdmin({ ...newAdmin, tel: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'} // Change le type selon l'état de visibilité
              value={newAdmin.mdp}
              onChange={(e) => setNewAdmin({ ...newAdmin, mdp: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Intégration de PasswordValidator */}
            <PasswordValidator criteriaResults={criteriaResults} />

            <TextField
              label="Confirmation du mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={newAdmin.confirmMdp}
              onChange={(e) => setNewAdmin({ ...newAdmin, confirmMdp: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!confirmPasswordValid && isConfirmTouched} // N'affiche l'erreur que si le champ est touché
              helperText={!confirmPasswordValid && isConfirmTouched ? 'Les mots de passe ne correspondent pas' : ''}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ margin: '10px' }}>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" disabled={!isValid}>
            {editMode ? 'Sauvegarder' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganisationAdmin;
