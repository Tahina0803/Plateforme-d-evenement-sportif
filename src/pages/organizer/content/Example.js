// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   FormControl,
//   List,
//   ListItem,
//   Grid,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Typography,
//   TextField,
//   Paper
// } from '@mui/material';
// import axios from 'axios';

// const GeneratePool = ({ organizerId }) => {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState('');
//   const [participantCount, setParticipantCount] = useState(0);
//   const [numberOfPools, setNumberOfPools] = useState('');
//   const [poolFormat, setPoolFormat] = useState('letters');
//   const [poolsData, setPoolsData] = useState([]);
//   const [eventsWithPools, setEventsWithPools] = useState([]);
//   const [selectedEventForPools, setSelectedEventForPools] = useState(null);
//   const [showPools, setShowPools] = useState(false);

//   // --- NOUVEAUX états pour la création manuelle ---
//   const [selectedEventManual, setSelectedEventManual] = useState('');
//   const [participantCountManual, setParticipantCountManual] = useState(0);
//   const [manualParticipants, setManualParticipants] = useState([]);
//   const [poolNameManual, setPoolNameManual] = useState('');
//   const [selectedParticipantManual, setSelectedParticipantManual] = useState('');

//   useEffect(() => {
//     axios
//       .get('http://localhost:3001/api/organizer/events', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       })
//       .then((response) => setEvents(response.data))
//       .catch((error) =>
//         console.error('Erreur lors du chargement des événements :', error)
//       );
//   }, []);

//   // Partie gauche : récupère le nombre de participants quand on choisit un événement
//   const handleEventChange = async (eventId) => {
//     setSelectedEvent(eventId);
//     if (eventId) {
//       axios
//         .get(`http://localhost:3001/api/organizer/event/${eventId}/participants`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         })
//         .then((response) => setParticipantCount(response.data.nbr_participant))
//         .catch((error) =>
//           console.error('Erreur lors de la récupération des participants :', error)
//         );
//     } else {
//       setParticipantCount(0);
//     }
//   };

//   // --- NOUVELLE fonction pour gérer le choix d'événement en création manuelle ---
//   const handleManualEventChange = async (eventId) => {
//     setSelectedEventManual(eventId);
//     if (eventId) {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/organizer/event/${eventId}/participants`,
//           {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           }
//         );
//         setParticipantCountManual(response.data.nbr_participant || 0);
//         setManualParticipants(response.data.participants || []);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des participants (manuel) :', error);
//       }
//     } else {
//       setParticipantCountManual(0);
//       setManualParticipants([]);
//     }
//   };
  

//   // Récupère les poules d'un événement
//   const fetchPoolsData = async (eventId) => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       console.error('❌ Aucun token trouvé, veuillez vous reconnecter.');
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:3001/api/organizer/event/${eventId}/pools`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       console.log('✅ Données des poules reçues :', response.data);
//       setPoolsData(response.data.pools);
//       setSelectedEventForPools(eventId);
//       setShowPools(true); // Afficher les poules en plein écran
//     } catch (error) {
//       console.error('❌ Erreur lors de la récupération des poules :', error);
//     }
//   };

//   // Création automatique : création et assignation des poules
//   const handleCreatePoolsAndAssign = async () => {
//     if (!selectedEvent) {
//       alert('❌ Veuillez sélectionner un événement.');
//       return;
//     }
//     if (!numberOfPools || isNaN(numberOfPools) || numberOfPools <= 0) {
//       alert('⚠️ Veuillez entrer un nombre valide de poules.');
//       return;
//     }

//     try {
//       // Étape 1 : Créer les poules
//       const poolNames = Array.from({ length: numberOfPools }, (_, i) =>
//         poolFormat === 'letters'
//           ? `Poule ${String.fromCharCode(65 + i)}`
//           : `Poule ${i + 1}`
//       );

//       await axios.post(
//         'http://localhost:3001/api/organizer/create-pools',
//         {
//           id_evenement: selectedEvent,
//           pools: poolNames
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }
//       );

//       // Étape 2 : Assigner les participants
//       await axios.post(
//         'http://localhost:3001/api/organizer/assign-participants',
//         {
//           id_evenement: selectedEvent
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }
//       );

//       // Met à jour la liste des événements avec poules
//       setEventsWithPools((prevEvents) => {
//         if (!prevEvents.some((event) => event.id_evenement === selectedEvent)) {
//           return [
//             ...prevEvents,
//             {
//               id_evenement: selectedEvent,
//               nom_event: events.find((e) => e.id_evenement === selectedEvent)
//                 ?.nom_event
//             }
//           ];
//         }
//         return prevEvents;
//       });

//       // Affiche directement le classement après la création
//       await fetchPoolsData(selectedEvent);

//       alert(
//         '✅ Les poules ont été créées et les participants ont été répartis avec succès !'
//       );
//     } catch (error) {
//       console.error('❌ Une erreur s\'est produite lors du processus :', error);
//       alert('❌ Une erreur s\'est produite.');
//     }
//   };

//   // Chargement initial des événements avec poules
//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       console.error('❌ Aucun token trouvé, veuillez vous reconnecter.');
//       return;
//     }

//     axios
//       .get('http://localhost:3001/api/organizer/events-with-pools', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then((response) => {
//         console.log('✅ Événements avec poules de l\'organisateur :', response.data);
//         setEventsWithPools(response.data);
//       })
//       .catch((error) =>
//         console.error('Erreur lors du chargement des événements avec poules :', error)
//       );
//   }, []);

//   // --- Bouton "Ajouter" (partie manuelle) ---
//   const handleAddManual = () => {
//     // Ici, vous pouvez implémenter la logique de création manuelle (non demandée).
//     // On se contente d'un console.log pour montrer que le bouton fonctionne.
//     console.log('Ajout manuel:', {
//       selectedEventManual,
//       participantCountManual,
//       poolNameManual,
//       selectedParticipantManual
//     });
//     alert('Vous avez cliqué sur "Ajouter" (logique manuelle à implémenter).');
//   };

//   return (
//     <Box sx={{ padding: 4 }}>
//       {/* Si showPools est false, on affiche le formulaire et la liste d'événements.
//           Si showPools est true, on affiche le classement des poules. */}
//       {!showPools ? (
//         <Box>
//           {/* Premier bloc : deux colonnes (gauche = génération automatique, droite = création manuelle) */}
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: { xs: 'column', md: 'row' },
//               justifyContent: 'space-between'
//             }}
//           >
//             {/* PARTIE GAUCHE : Génération automatique (inchangée) */}
//             <Box
//               sx={{
//                 width: { xs: '100%', md: '40%', lg: '28%' },
//                 textAlign: 'center',
//                 mb: { xs: 4, md: 0 }
//               }}
//             >
//               <Typography variant="h5" gutterBottom>
//                 Génération des Poules
//               </Typography>

//               <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 4 }}>
//                 <InputLabel>Choisir un événement</InputLabel>
//                 <Select
//                   value={selectedEvent || ''}
//                   onChange={(e) => handleEventChange(e.target.value)}
//                   label="Choisir un événement"
//                   sx={{ textAlign: 'left' }}
//                 >
//                   {events.map((event) => (
//                     <MenuItem key={event.id_evenement} value={event.id_evenement}>
//                       {event.nom_event}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <TextField
//                 fullWidth
//                 label="Nombre de participants"
//                 value={participantCount}
//                 InputProps={{ readOnly: true }}
//                 sx={{ marginBottom: 2 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Nombre de poules"
//                 type="number"
//                 value={numberOfPools}
//                 onChange={(e) => setNumberOfPools(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />

//               <FormControl fullWidth sx={{ marginBottom: 2 }}>
//                 <InputLabel>Format des poules</InputLabel>
//                 <Select
//                   value={poolFormat || ''}
//                   onChange={(e) => setPoolFormat(e.target.value)}
//                   label="Format des poules"
//                   sx={{ textAlign: 'left' }}
//                 >
//                   <MenuItem value="letters">Lettres(Poule A, B, C...)</MenuItem>
//                   <MenuItem value="numbers">Chiffres (Poule 1, 2, 3...)</MenuItem>
//                 </Select>
//               </FormControl>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreatePoolsAndAssign}
//                 disabled={!selectedEvent}
//               >
//                 Créer les poules
//               </Button>
//             </Box>

//             {/* PARTIE DROITE : Création manuelle */}
//             <Box
//               sx={{
//                 width: { xs: '100%', md: '60%', lg: '68%' },
//                 textAlign: 'center',
//                 mt: { xs: 2, md: 0 }
//               }}
//             >
//               <Typography variant="h5" gutterBottom>
//                 Création manuel
//               </Typography>

//               <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 4 }}>
//                 <InputLabel>Choisir un événement</InputLabel>
//                 <Select
//                   value={selectedEventManual || ''}
//                   onChange={(e) => handleManualEventChange(e.target.value)}
//                   label="Choisir un événement"
//                   sx={{ textAlign: 'left' }}
//                 >
//                   {events.map((event) => (
//                     <MenuItem key={event.id_evenement} value={event.id_evenement}>
//                       {event.nom_event}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <TextField
//                 fullWidth
//                 label="Nombre de participants"
//                 value={participantCountManual}
//                 InputProps={{ readOnly: true }}
//                 sx={{ marginBottom: 2 }}
//               />

//               {/* Nouveau champ : Nom de la poule */}
//               <TextField
//                 fullWidth
//                 label="Nom de la poule"
//                 value={poolNameManual}
//                 onChange={(e) => setPoolNameManual(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />

//               {/* Nouveau champ : Nom de participant (liste) */}
//               <FormControl fullWidth sx={{ marginBottom: 2 }}>
//                           <InputLabel>Nom de participant</InputLabel>
//                           <Select
//                             value={selectedParticipantManual || ''}
//                             onChange={(e) => setSelectedParticipantManual(e.target.value)}
//                             label="Nom de participant"
//                             sx={{ textAlign: 'left' }}
//                           >
//                             {manualParticipants.map((participant) => (
//                               <MenuItem
//                                 key={participant.id_participant}
//                                 value={participant.id_participant}
//                               >
//                                 {participant.nom_part}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                 </FormControl>


//               <Button variant="contained" color="primary" onClick={handleAddManual}>
//                 Ajouter
//               </Button>
//             </Box>
//           </Box>

//           {/* Affichage des événements avec poules en BAS, pleine largeur */}
//           <Box sx={{ width: '100%', mt: 6, textAlign: 'center' }}>
//             <Typography variant="h5" gutterBottom>
//               Événements avec Poules
//             </Typography>
//             <Grid container spacing={2} justifyContent="center">
//               {eventsWithPools.map((event) => (
//                 <Grid item xs={12} sm={6} md={4} key={event.id_evenement}>
//                   <Paper
//                     sx={{ textAlign: 'center', padding: 2, cursor: 'pointer' }}
//                     onClick={() => fetchPoolsData(event.id_evenement)}
//                   >
//                     <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
//                       {event.nom_event}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Box>
//       ) : (
//         // SECTION : Classement des poules (si showPools = true)
//         <Box
//           sx={{
//             textAlign: 'center',
//             padding: { xs: 2, sm: 4 },
//             maxWidth: '1200px',
//             margin: 'auto'
//           }}
//         >
//           <Typography
//             variant="h5"
//             sx={{ marginBottom: 4, fontSize: { xs: '18px', sm: '24px' } }}
//           >
//             Classement des Poules pour{' '}
//             {
//               eventsWithPools.find(
//                 (e) => e.id_evenement === selectedEventForPools
//               )?.nom_event
//             }
//           </Typography>

//           <Box sx={{ overflowX: 'auto' }}>
//             <Grid
//               container
//               spacing={2}
//               justifyContent="center"
//               sx={{ maxWidth: '100%', margin: 'auto' }}
//             >
//               {poolsData.map((pool) => (
//                 <Grid
//                   item
//                   xs={12}
//                   sm={6}
//                   md={4}
//                   lg={3}
//                   key={pool.id_poule}
//                   sx={{ display: 'flex', justifyContent: 'center' }}
//                 >
//                   <Paper
//                     sx={{
//                       textAlign: 'center',
//                       padding: { xs: 1, sm: 2 },
//                       border: '1px solid #ddd',
//                       width: { xs: '90%', sm: '300px', md: '350px' },
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'space-between'
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontWeight: 'bold',
//                         fontSize: { xs: '14px', sm: '16px' },
//                         backgroundColor: '#ddd',
//                         padding: 0.5,
//                         borderBottom: '2px solid #ddd'
//                       }}
//                     >
//                       {pool.nom_poule}
//                     </Typography>

//                     <List sx={{ flexGrow: 1, padding: 0 }}>
//                       {pool.participants.map((participant, idx) => (
//                         <ListItem
//                           key={participant.id_participant}
//                           sx={{
//                             justifyContent: 'center',
//                             padding: '4px 0',
//                             borderBottom: '1px solid #ddd',
//                             fontWeight: idx === 0 ? 'bold' : 'normal'
//                           }}
//                         >
//                           <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
//                             {participant.nom_part}
//                           </Typography>
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>

//           <Box sx={{ display: 'flex', justifyContent: 'right', mt: 4 }}>
//             <Button
//               variant="contained"
//               color="secondary"
//               sx={{
//                 padding: { xs: '6px 12px', sm: '10px 20px' },
//                 fontSize: { xs: '12px', sm: '14px' }
//               }}
//               onClick={() => setShowPools(false)}
//             >
//               Retour
//             </Button>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GeneratePool;















// import React, { useEffect, useState } from 'react';
// import { Box, FormControl, List, ListItem, Grid, InputLabel, Select, MenuItem, Button, Typography, TextField, Paper } from '@mui/material';
// import axios from 'axios';



// const GeneratePool = ({ organizerId }) => {
//     const [events, setEvents] = useState([]);
//     const [selectedEvent, setSelectedEvent] = useState('');
//     const [participantCount, setParticipantCount] = useState(0);
//     const [numberOfPools, setNumberOfPools] = useState('');
//     const [poolFormat, setPoolFormat] = useState('letters');
//     const [poolsData, setPoolsData] = useState([]);
//     const [eventsWithPools, setEventsWithPools] = useState([]);
//     const [selectedEventForPools, setSelectedEventForPools] = useState(null);
//     const [showPools, setShowPools] = useState(false); // Nouvelle variable d'état


//     useEffect(() => {
//         axios.get('http://localhost:3001/api/organizer/events', {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         })
//             .then(response => setEvents(response.data))
//             .catch(error => console.error("Erreur lors du chargement des événements :", error));
//     }, []);

//     const handleEventChange = async (eventId) => {
//         setSelectedEvent(eventId);
//         if (eventId) {
//             axios.get(`http://localhost:3001/api/organizer/event/${eventId}/participants`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             })
//                 .then(response => setParticipantCount(response.data.nbr_participant))
//                 .catch(error => console.error("Erreur lors de la récupération des participants :", error));
//         } else {
//             setParticipantCount(0);
//         }
//     };

//     const fetchPoolsData = async (eventId) => {
//         const token = localStorage.getItem('token');

//         if (!token) {
//             console.error("❌ Aucun token trouvé, veuillez vous reconnecter.");
//             return;
//         }

//         try {
//             const response = await axios.get(`http://localhost:3001/api/organizer/event/${eventId}/pools`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             console.log("✅ Données des poules reçues :", response.data);
//             setPoolsData(response.data.pools);
//             setSelectedEventForPools(eventId);
//             setShowPools(true); // Afficher les poules en plein écran
//         } catch (error) {
//             console.error("❌ Erreur lors de la récupération des poules :", error);
//         }
//     };
//     const handleCreatePoolsAndAssign = async () => {
//         if (!selectedEvent) {
//             alert("❌ Veuillez sélectionner un événement.");
//             return;
//         }
//         if (!numberOfPools || isNaN(numberOfPools) || numberOfPools <= 0) {
//             alert("⚠️ Veuillez entrer un nombre valide de poules.");
//             return;
//         }

//         try {
//             // Étape 1 : Créer les poules
//             const poolNames = Array.from({ length: numberOfPools }, (_, i) =>
//                 poolFormat === 'letters' ? `Poule ${String.fromCharCode(65 + i)}` : `Poule ${i + 1}`
//             );

//             await axios.post('http://localhost:3001/api/organizer/create-pools', {
//                 id_evenement: selectedEvent,
//                 pools: poolNames
//             }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });

//             // Étape 2 : Assigner les participants
//             await axios.post('http://localhost:3001/api/organizer/assign-participants', {
//                 id_evenement: selectedEvent
//             }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });

//             // Met à jour la liste des événements avec poules
//             setEventsWithPools(prevEvents => {
//                 if (!prevEvents.some(event => event.id_evenement === selectedEvent)) {
//                     return [...prevEvents, { id_evenement: selectedEvent, nom_event: events.find(e => e.id_evenement === selectedEvent)?.nom_event }];
//                 }
//                 return prevEvents;
//             });

//             // Affiche directement le classement après la création
//             await fetchPoolsData(selectedEvent);

//             alert("✅ Les poules ont été créées et les participants ont été répartis avec succès !");
//         } catch (error) {
//             console.error("❌ Une erreur s'est produite lors du processus :", error);
//             alert("❌ Une erreur s'est produite.");
//         }
//     };

//     useEffect(() => {
//         const token = localStorage.getItem('token');

//         if (!token) {
//             console.error("❌ Aucun token trouvé, veuillez vous reconnecter.");
//             return;
//         }

//         axios.get('http://localhost:3001/api/organizer/events-with-pools', {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(response => {
//                 console.log("✅ Événements avec poules de l'organisateur :", response.data);
//                 setEventsWithPools(response.data);
//             })
//             .catch(error => console.error("Erreur lors du chargement des événements avec poules :", error));
//     }, []);

//     return (
//         <Box sx={{ padding: 4 }}>
//             {/* Affichage conditionnel : soit formulaire + événements, soit le classement des poules */}
//             {!showPools ? (
//                 <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
//                     {/* Section de gauche : Formulaire */}
//                     <Box sx={{ width: { xs: '100%', md: '40%', lg: '28%' }, textAlign: 'center', mb: { xs: 4, md: 0 } }}>
//                         <Typography variant="h5" gutterBottom>Génération des Poules</Typography>

//                         <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 4 }}>
//                             <InputLabel>Choisir un événement</InputLabel>
//                             <Select
//                                 value={selectedEvent || ''}
//                                 onChange={(e) => handleEventChange(e.target.value)}
//                                 label="Choisir un événement"
//                                 sx={{ textAlign: 'left' }}
//                             >
//                                 {events.map(event => (
//                                     <MenuItem key={event.id_evenement} value={event.id_evenement}>
//                                         {event.nom_event}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>

//                         <TextField fullWidth label="Nombre de participants" value={participantCount} InputProps={{ readOnly: true }} sx={{ marginBottom: 2 }} />
//                         <TextField fullWidth label="Nombre de poules" type="number" value={numberOfPools} onChange={(e) => setNumberOfPools(e.target.value)} sx={{ marginBottom: 2 }} />

//                         <FormControl fullWidth sx={{ marginBottom: 2 }}>
//                             <InputLabel>Format des poules</InputLabel>
//                             <Select
//                                 value={poolFormat || ''}
//                                 onChange={(e) => setPoolFormat(e.target.value)}
//                                 label="Format des poules"
//                                 sx={{ textAlign: 'left' }}
//                             >
//                                 <MenuItem value="letters">Lettres (Poule A, B, C...)</MenuItem>
//                                 <MenuItem value="numbers">Chiffres (Poule 1, 2, 3...)</MenuItem>
//                             </Select>
//                         </FormControl>

//                         <Button variant="contained" color="primary" onClick={handleCreatePoolsAndAssign} disabled={!selectedEvent}>
//                             Creer les poules
//                         </Button>
//                     </Box>
                    
//                     {/* Section de droite : Liste des événements avec poules */}
//                     <Box sx={{ width: { xs: '100%', md: '60%', lg: '68%' }, textAlign: 'center', mt: { xs: 2, md: 0 } }}>
//                         <Typography variant="h5" gutterBottom>Événements avec Poules</Typography>

//                         <Grid container spacing={2} justifyContent="center">
//                             {eventsWithPools.map(event => (
//                                 <Grid item xs={12} sm={6} md={4} key={event.id_evenement}>
//                                     <Paper
//                                         sx={{ textAlign: 'center', padding: 2, cursor: 'pointer' }}
//                                         onClick={() => fetchPoolsData(event.id_evenement)}
//                                     >
//                                         <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
//                                             {event.nom_event}
//                                         </Typography>
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Box>
//                 </Box>
//             ) : (
//                 // Section du classement des poules
//                 <Box sx={{ textAlign: 'center', padding: { xs: 2, sm: 4 }, maxWidth: '1200px', margin: 'auto' }}>
//                     {/* Titre */}
//                     <Typography variant="h5" sx={{ marginBottom: 4, fontSize: { xs: '18px', sm: '24px' } }}>
//                         Classement des Poules pour {eventsWithPools.find(e => e.id_evenement === selectedEventForPools)?.nom_event}
//                     </Typography>

//                     {/* Conteneur des poules */}
//                     <Box sx={{ overflowX: 'auto' }}>
//                         <Grid
//                             container
//                             spacing={2}
//                             justifyContent="center"
//                             sx={{ maxWidth: '100%', margin: 'auto' }}
//                         >
//                             {poolsData.map((pool, index) => (
//                                 <Grid
//                                     item
//                                     xs={12}
//                                     sm={6}
//                                     md={4}
//                                     lg={3}
//                                     key={pool.id_poule}
//                                     sx={{ display: 'flex', justifyContent: 'center' }} // Centrage des cartes
//                                 >
//                                     <Paper
//                                         sx={{
//                                             textAlign: 'center',
//                                             padding: { xs: 1, sm: 2 },
//                                             border: '1px solid #ddd',
//                                             width: { xs: '90%', sm: '300px', md: '350px' }, // Largeur responsive
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             justifyContent: 'space-between',

//                                         }}
//                                     >

//                                         {/* Nom de la poule */}
//                                         <Typography
//                                             sx={{
//                                                 fontWeight: 'bold',
//                                                 fontSize: { xs: '14px', sm: '16px' },
//                                                 backgroundColor: '#ddd',
//                                                 padding: 0.5,
//                                                 borderBottom: '2px solid #ddd'
//                                             }}
//                                         >
//                                             {pool.nom_poule}
//                                         </Typography>

//                                         {/* Liste des participants */}
//                                         <List sx={{ flexGrow: 1, padding: 0 }}>
//                                             {pool.participants.map((participant, idx) => (
//                                                 <ListItem
//                                                     key={participant.id_participant}
//                                                     sx={{
//                                                         justifyContent: 'center',
//                                                         padding: '4px 0',
//                                                         borderBottom: '1px solid #ddd',
//                                                         fontWeight: idx === 0 ? 'bold' : 'normal'
//                                                     }}
//                                                 >
//                                                     <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
//                                                         {participant.nom_part}
//                                                     </Typography>
//                                                 </ListItem>
//                                             ))}
//                                         </List>
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Box>

//                     {/* Bouton Retour */}
//                     <Box sx={{ display: "flex", justifyContent: "right", mt: 4 }}>
//                         <Button
//                             variant="contained"
//                             color="secondary"
//                             sx={{
//                                 padding: { xs: '6px 12px', sm: '10px 20px' },
//                                 fontSize: { xs: '12px', sm: '14px' }
//                             }}
//                             onClick={() => setShowPools(false)}
//                         >
//                             Retour
//                         </Button>
//                     </Box>
//                 </Box>


//             )}
//         </Box>
//     );
// };

// export default GeneratePool;
