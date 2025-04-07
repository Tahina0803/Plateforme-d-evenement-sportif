// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     Box,
//     Button,
//     CircularProgress,
//     Grid,
//     MenuItem,
//     Select,
//     Typography,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     InputLabel,
//     FormControl,
//     useMediaQuery, useTheme
// } from '@mui/material';
// import SendEmailDialog from './SendEmailNotify';

// const Notifications = () => {
//     const [events, setEvents] = useState([]);
//     const [selectedEvent, setSelectedEvent] = useState('');
//     const [participants, setParticipants] = useState([]);
//     const [loadingEvents, setLoadingEvents] = useState(true);
//     const [loadingParticipants, setLoadingParticipants] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedParticipant, setSelectedParticipant] = useState(null);
//     const [openEmailDialog, setOpenEmailDialog] = useState(false);
//     const [allParticipants, setAllParticipants] = useState([]);
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     useEffect(() => {
//         const fetchEventsAndParticipants = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const eventsResponse = await axios.get('http://localhost:3001/api/organizer/events', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setEvents(eventsResponse.data);

//                 const participantsResponse = await axios.get('http://localhost:3001/api/organizer/participants/all', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 setAllParticipants(participantsResponse.data);
//                 setParticipants(participantsResponse.data);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération des données:', error);
//             } finally {
//                 setLoadingEvents(false);
//             }
//         };

//         fetchEventsAndParticipants();
//     }, []);

//     const handleSelectEvent = (eventId) => {
//         setSelectedEvent(eventId);

//         if (eventId === '') {
//             setParticipants(allParticipants);
//         } else {
//             setLoadingParticipants(true);
//             try {
//                 const filteredParticipants = allParticipants.filter(participant => participant.id_evenement === eventId);
//                 setParticipants(filteredParticipants);
//             } catch (error) {
//                 console.error('Erreur lors du filtrage des participants :', error);
//                 setParticipants([]);
//             } finally {
//                 setLoadingParticipants(false);
//             }
//         }
//     };

//     const handleViewParticipant = async (participantId) => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.get(`http://localhost:3001/api/organizer/participant/${participantId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setSelectedParticipant(response.data);
//             setOpenDialog(true);
//         } catch (error) {
//             console.error('Erreur lors de la récupération des informations du participant:', error);
//         }
//     };

//     const handleCloseDialog = () => {
//         setOpenDialog(false);
//         setSelectedParticipant(null);
//     };

//     return (
//         <Box sx={{ maxWidth: '900px', margin: 'auto', padding: 2 }}>
//             <Typography variant="h5" align="center" gutterBottom>
//                 Liste des participants
//             </Typography>

//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//                 <FormControl sx={{ width: '300px', mb: 2 }}>
//                     <InputLabel>Sélectionner Événement</InputLabel>
//                     <Select
//                         value={selectedEvent}
//                         onChange={(e) => handleSelectEvent(e.target.value)}
//                         label="Sélectionner Événement"
//                     >
//                         {loadingEvents ? (
//                             <MenuItem disabled>Chargement...</MenuItem>
//                         ) : events.length > 0 ? (
//                             events.map(event => (
//                                 <MenuItem key={event.id_evenement} value={event.id_evenement}>
//                                     {event.nom_event}
//                                 </MenuItem>
//                             ))
//                         ) : (
//                             <MenuItem disabled>Aucun événement disponible</MenuItem>
//                         )}
//                     </Select>
//                 </FormControl>
//             </Box>

//             {loadingParticipants ? (
//                 <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
//             ) : (
//                 <Grid container spacing={2} justifyContent="center">
//                     {participants.map(participant => (
//                         <Grid item key={participant.id_participant}>
//                             <Box
//                                 sx={{
//                                     width: '190px',
//                                     padding: 1,
//                                     backgroundColor: '#f0f0f0',
//                                     textAlign: 'center',
//                                     cursor: "pointer",
//                                     '&:hover': {
//                                         backgroundColor: '#e0e0e0',
//                                     }
//                                 }}
//                                 onClick={() => handleViewParticipant(participant.id_participant)}
//                             >
//                                 <Typography>{participant.nom_part}</Typography>
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}

//             <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth={isMobile ? "xs" : "sm"}>
//                 <DialogTitle>Détails du participant</DialogTitle>
//                 {selectedParticipant ? (
//                     <>
//                         <DialogContent>
//                             <Typography><strong>Nom :</strong> {selectedParticipant.nom_part}</Typography>
//                             <Typography><strong>Email :</strong> {selectedParticipant.email_part}</Typography>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={() => setOpenEmailDialog(true)} variant="contained">Envoyer email</Button>
//                             <Button onClick={handleCloseDialog} color="error" variant="contained">Fermer</Button>
//                         </DialogActions>
//                     </>
//                 ) : (
//                     <DialogContent>
//                         <CircularProgress />
//                     </DialogContent>
//                 )}
//             </Dialog>

//             <SendEmailDialog
//                 open={openEmailDialog}
//                 onClose={() => setOpenEmailDialog(false)}
//                 participants={selectedParticipant}
//                 token={localStorage.getItem('token')}
//             />
//         </Box>
//     );
// };

// export default Notifications;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Select,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    FormControl,
    useMediaQuery, useTheme
} from '@mui/material';
import SendEmailNotify from './SendEmailNotify';

const Notifications = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [participants, setParticipants] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [openEmailDialog, setOpenEmailDialog] = useState(false);
    const [allParticipants, setAllParticipants] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchEventsAndParticipants = async () => {
            const token = localStorage.getItem('token');
            try {
                const eventsResponse = await axios.get('http://localhost:3001/api/organizer/events', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(eventsResponse.data);

                const participantsResponse = await axios.get(`http://localhost:3001/api/organizer/participants/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAllParticipants(participantsResponse.data);
                setParticipants(participantsResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEventsAndParticipants();
    }, []);

    const handleSelectEvent = (eventId) => {
        setSelectedEvent(eventId);

        if (eventId === '') {
            setParticipants(allParticipants);
        } else {
            setLoadingParticipants(true);
            try {
                const filteredParticipants = allParticipants.filter(participant => participant.id_evenement === eventId);
                setParticipants(filteredParticipants);
            } catch (error) {
                console.error('Erreur lors du filtrage des participants :', error);
                setParticipants([]);
            } finally {
                setLoadingParticipants(false);
            }
        }
    };

    const handleViewParticipant = async (participantId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:3001/api/organizer/participant/${participantId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSelectedParticipant(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations du participant:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedParticipant(null);
    };

    return (
        <Box sx={{ maxWidth: '900px', margin: 'auto', padding: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Liste des participants
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <FormControl sx={{ width: '300px', mb: 2 }}>
                    <InputLabel>Sélectionner Événement</InputLabel>
                    <Select
                        value={selectedEvent}
                        onChange={(e) => handleSelectEvent(e.target.value)}
                        label="Sélectionner Événement"
                    >
                        {loadingEvents ? (
                            <MenuItem disabled>Chargement...</MenuItem>
                        ) : events.length > 0 ? (
                            events.map(event => (
                                <MenuItem key={event.id_evenement} value={event.id_evenement}>
                                    {event.nom_event}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Aucun événement disponible</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>

            {loadingParticipants ? (
                <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            ) : (
                <Grid container spacing={2} justifyContent="center">
                    {participants.map(participant => (
                        <Grid item key={participant.id_participant}>
                            <Box
                                sx={{
                                    width: '190px',
                                    padding: 1,
                                    backgroundColor: '#f0f0f0',
                                    textAlign: 'center',
                                    cursor: "pointer",
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    }
                                }}
                                onClick={() => handleViewParticipant(participant.id_participant)}
                            >
                                <Typography>{participant.nom_part}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth={isMobile ? "xs" : "sm"}>
                <DialogTitle>Détails du participant</DialogTitle>
                {selectedParticipant ? (
                    <>
                        <DialogContent>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {[
                                    { label: "Nom du participant", value: selectedParticipant.nom_part },
                                    { label: "Nom de l'équipe", value: selectedParticipant.nom_equipe || "Aucune équipe" },
                                    { label: "Email du participant", value: selectedParticipant.email_part },
                                    { label: "Téléphone", value: `0${selectedParticipant.telephone_part}` },
                                    { label: "Ville", value: selectedParticipant.ville_part },
                                    { label: "Code postal", value: selectedParticipant.codepostal_part },
                                    { label: "Catégorie d'équipe", value: selectedParticipant.categorie_equipe || "Non spécifié" },
                                ].map((item, index) => (
                                    <Grid container key={index} spacing={0} sx={{ padding: "8px 0" }}>
                                        <Grid item xs={5}>
                                            <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
                                                {item.label}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
                                                :
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Typography sx={{ textAlign: "left" }}>
                                                {item.value}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
                            <Button onClick={() => setOpenEmailDialog(true)} variant="contained">
                                Envoyer email
                            </Button>
                            <Button onClick={handleCloseDialog} color="error" variant="contained">
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </DialogContent>
                )}
            </Dialog>

            <SendEmailNotify
                open={openEmailDialog}
                onClose={() => setOpenEmailDialog(false)}
                participant={selectedParticipant}
                token={localStorage.getItem('token')}
            />
        </Box>
    );
};

export default Notifications;
