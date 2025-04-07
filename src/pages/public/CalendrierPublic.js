

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import {
//   Box, Typography, FormControl, InputLabel, Select, MenuItem,
//   CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, List, ListItem, Paper
// } from '@mui/material';

// const CalendrierPublic = () => {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(''); // Initialisé à une chaîne vide
//   const [matches, setMatches] = useState([]);
//   const [pools, setPools] = useState([]); // Nouvel état pour les poules
//   const [loadingEvents, setLoadingEvents] = useState(true);
//   const [loadingMatches, setLoadingMatches] = useState(false);
//   const [loadingPools, setLoadingPools] = useState(false); // Loading pour les poules
//   const [showPools, setShowPools] = useState(false); // Contrôle l'affichage des poules

//   // ✅ Récupération des événements
//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/organizer/public/events');
//       setEvents(response.data);
//       if (response.data.length > 0) {
//         setSelectedEvent('');
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération des événements :", error);
//     } finally {
//       setLoadingEvents(false);
//     }
//   };

//   // ✅ Récupération de tous les matchs
//   const fetchAllMatches = async () => {
//     setLoadingMatches(true);
//     try {
//       const response = await axios.get('http://localhost:3001/api/public/allmatches');
//       setMatches(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des rencontres :", error);
//     } finally {
//       setLoadingMatches(false);
//     }
//   };

//   // ✅ Récupération des matchs d'un événement spécifique
//   const fetchMatches = async (eventId) => {
//     if (!eventId) return; // Ne rien faire si aucun événement n'est sélectionné
//     setLoadingMatches(true);
//     try {
//       const response = await axios.get(`http://localhost:3001/api/public/eventcalendrier/${eventId}/matches`);
//       setMatches(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des rencontres :", error);
//     } finally {
//       setLoadingMatches(false);
//     }
//   };

//   // ✅ Récupération des poules d'un événement spécifique
//   const fetchPools = async (eventId) => {
//     if (!eventId) return;
//     setLoadingPools(true);
//     try {
//       const response = await axios.get(`http://localhost:3001/api/public/eventcalendrier/${eventId}/pools`);
//       setPools(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des poules :", error);
//     } finally {
//       setLoadingPools(false);
//     }
//   };

//   // ✅ Charger les événements et les matchs dès le montage du composant
//   useEffect(() => {
//     fetchEvents();
//     fetchAllMatches(); // Charger tous les matchs par défaut
//   }, []);

//   // ✅ Ajouter un useEffect pour réagir à la sélection d'un événement
//   useEffect(() => {
//     if (selectedEvent) {
//       fetchMatches(selectedEvent);  // Récupérer les matchs de l'événement sélectionné
//       fetchPools(selectedEvent);    // Charger les poules de l'événement sélectionné
//     }
//   }, [selectedEvent]);

//   // ✅ Gestion du changement d'événement
//   const handleEventChange = (eventId) => {
//     setSelectedEvent(eventId);
//   };

//   // ✅ Regroupement des matchs pour affichage organisé
//   const matchesGroupedByEventPhaseDayTour = matches.reduce((acc, match) => {
//     const key = `${match.eventName}-${match.phase}-${match.journee || 'N/A'}-${match.tour_final || 'N/A'}`;
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(match);
//     return acc;
//   }, {});

//   return (
//     <Box sx={{ padding: { xs: "16px", sm: "32px" }, width: { xs: "100%", md: "75%" }, margin: "auto" }}>
//       <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, mt: 4 }}>
//         Calendrier des rencontres
//       </Typography>

//       <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
//         <FormControl sx={{ minWidth: { xs: "100%", sm: "300px" } }}>
//           <InputLabel>Choisir un événement</InputLabel>
//           <Select
//             value={selectedEvent}
//             onChange={(e) => handleEventChange(e.target.value)}
//             label="Choisir un événement"
//           >
//             {loadingEvents ? (
//               <MenuItem disabled>Chargement...</MenuItem>
//             ) : events.length > 0 ? (
//               [
//                 <MenuItem key="default" value="">Sélectionner un événement</MenuItem>,
//                 ...events.map(event => (
//                   <MenuItem key={event.id_evenement} value={event.id_evenement}>
//                     {event.nom_event}
//                   </MenuItem>
//                 ))
//               ]
//             ) : (
//               <MenuItem disabled>Aucun événement disponible</MenuItem>
//             )}
//           </Select>
//         </FormControl>
//       </Box>

//       <Box sx={{ borderBottom: "2px solid #1976d2", marginBottom: 4, marginTop: 2 }} />

//       {/* Affichage des poules */}
//       {showPools && pools.length > 0 && (
//         < Box sx={{ mt: 4, mb: 8 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
//         <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: '', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
//           Classement des Poules pour{" "} {events.find((e) => e.id_evenement === selectedEvent)?.nom_event}
//         </Typography>
//         {/* Texte Retour avec soulignement */}
//         <Typography
//           sx={{
//             cursor: 'pointer',
//             color: 'blue',
//             fontWeight: '',
//             textDecoration: 'underline',
//             display: { xs: 'none', sm: 'block' },  // Afficher à partir de l'écran sm
//             '@media (max-width: 600px)': {
//               display: 'none !important', // Forcer l'affichage sur petits écrans
//             },
//           }}
//             onClick={() => setShowPools(false)} // Cacher les poules au clic sur retour
//         >
//           Retour
//         </Typography>
//       </Box>

//       <Box sx={{ overflowX: "auto" }}>
//         <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: "100%", mx: "auto" }}>
//           {pools
//             .sort((a, b) => a.nom_poule.localeCompare(b.nom_poule))
//             .map((pool) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={pool.id_poule} sx={{ display: "flex", justifyContent: "center" }}>
//                 <Paper sx={{ textAlign: "center", p: { xs: 1, sm: 2 }, border: "1px solid #ddd", width: "250px" }}>
//                   <Typography sx={{ fontWeight: "bold", backgroundColor: "#ddd", py: 0.5, borderBottom: "2px solid #ddd" }}>
//                     Poule {pool.nom_poule}
//                   </Typography>

//                   <List sx={{ flexGrow: 1, p: 0 }}>
//                     {pool.participants.map((participant, idx) => (
//                       <ListItem key={participant.id_participant} sx={{ py: 0.5, borderBottom: "1px solid #ddd" }}>
//                         <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
//                           {participant.nom_equipe}
//                         </Typography>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Paper>
//               </Grid>
//             ))}
//         </Grid>
//       </Box>
//     </Box>

//   )
// }

// {/* Affichage des matchs */ }
// {
//   !showPools && loadingMatches ? (
//     <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
//   ) : !showPools && Object.keys(matchesGroupedByEventPhaseDayTour).length > 0 ? (
//     Object.keys(matchesGroupedByEventPhaseDayTour).map((key, index) => {
//       const [eventName, phase, journee, tour_final] = key.split('-');
//       const matchesInGroup = matchesGroupedByEventPhaseDayTour[key];
//       return (
//         <Box key={index} sx={{ mb: 4 }}>
//           <Typography sx={{ mb: 2, fontWeight: "bold", fontSize: { xs: "14px", md: "20px" } }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <span>
//                 {selectedEvent ? events.find(event => event.id_evenement === selectedEvent)?.nom_event || 'Inconnu' : eventName}
//               </span>
//               {selectedEvent && (
//                 <Typography
//                   sx={{
//                     cursor: 'pointer',
//                     color: 'blue',
//                     textDecoration: 'underline',
//                     ml: 0, // Marges à gauche pour un peu d'espace
//                   }}
//                   onClick={() => setShowPools(!showPools)}
//                 >
//                   Voir les poules
//                 </Typography>
//               )}
//             </Box>
//           </Typography>

//           <Typography sx={{ mb: 2, fontSize: { xs: "12px", md: "14px" } }}>
//             <span style={{ fontWeight: "bold" }}>Phase :</span> {phase}
//             {journee && journee !== 'N/A' && ` || Journée : ${journee}`}
//             {tour_final && tour_final !== 'N/A' && ` || Tour final : ${tour_final}`}
//           </Typography>

//           <TableContainer component={Paper} sx={{ border: "none" }}>
//             <Table sx={{ border: "none" }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#e0e7ff", color: "white", textTransform: "uppercase" }}>
//                   <TableCell sx={{ border: "none", borderRight: "1px solid white ", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }}>Date</TableCell>
//                   <TableCell sx={{ border: "none", borderRight: "1px solid white ", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }} colSpan={3}>Rencontre</TableCell>
//                   <TableCell sx={{ border: "none", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }}>Lieu</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {matchesInGroup.map((match, idx) => (
//                   <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f9" }}>
//                     <TableCell sx={{ border: "none", textAlign: "center", padding: "4px 5px", fontSize: { xs: "12px", md: "12px" } }}>
//                       {
//                         new Date(match.date_rencontre).toLocaleDateString("fr-FR", {
//                           weekday: "long",
//                           day: "numeric",
//                           month: "long"
//                         }).replace(/janvier/i, 'jan.')
//                           .replace(/février/i, 'fév.')
//                           .replace(/mars/i, 'mar.')
//                           .replace(/avril/i, 'avr.')
//                           .replace(/mai/i, 'mai.')
//                           .replace(/juin/i, 'juin.')
//                           .replace(/juillet/i, 'juil.')
//                           .replace(/août/i, 'août.')
//                           .replace(/septembre/i, 'sept.')
//                           .replace(/octobre/i, 'oct.')
//                           .replace(/novembre/i, 'nov.')
//                           .replace(/décembre/i, 'déc.')
//                       }
//                     </TableCell>
//                     <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "right", padding: "4px 5px" }}>{match.participant_a}</TableCell>
//                     <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "center", padding: "4px 5px", fontWeight: "bold", color: "#f50057" }}>
//                       {match.heure_rencontre ? match.heure_rencontre.split(":").slice(0, 2).join("h") : "--h--"}
//                     </TableCell>
//                     <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "left", padding: "4px 5px" }}>{match.participant_b}</TableCell>
//                     <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "center", padding: "4px 5px" }}>{match.lieu_rencontre}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       );
//     })
//   ) : (
//   <Typography sx={{ textAlign: 'center' }}></Typography>
// )
// }
//     </Box >
//   );
// };

// export default CalendrierPublic;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, List, ListItem, Paper
} from '@mui/material';

const CalendrierPublic = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(''); // Initialisé à une chaîne vide
  const [matches, setMatches] = useState([]);
  const [pools, setPools] = useState([]); // Nouvel état pour les poules
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingPools, setLoadingPools] = useState(false); // Loading pour les poules
  const [showPools, setShowPools] = useState(false); // Contrôle l'affichage des poules

  // ✅ Récupération des événements
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/organizer/public/events');
      setEvents(response.data);
      if (response.data.length > 0) {
        setSelectedEvent('');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // ✅ Récupération de tous les matchs
  const fetchAllMatches = async () => {
    setLoadingMatches(true);
    try {
      const response = await axios.get('http://localhost:3001/api/public/allmatches');
      setMatches(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des rencontres :", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  // ✅ Récupération des matchs d'un événement spécifique
  const fetchMatches = async (eventId) => {
    if (!eventId) return; // Ne rien faire si aucun événement n'est sélectionné
    setLoadingMatches(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/public/eventcalendrier/${eventId}/matches`);
      setMatches(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des rencontres :", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  // ✅ Récupération des poules d'un événement spécifique
  const fetchPools = async (eventId) => {
    if (!eventId) return;
    setLoadingPools(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/public/eventcalendrier/${eventId}/pools`);
      setPools(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des poules :", error);
    } finally {
      setLoadingPools(false);
    }
  };

  // ✅ Charger les événements et les matchs dès le montage du composant
  useEffect(() => {
    fetchEvents();
    fetchAllMatches(); // Charger tous les matchs par défaut
  }, []);

  // ✅ Ajouter un useEffect pour réagir à la sélection d'un événement
  useEffect(() => {
    if (selectedEvent) {
      fetchMatches(selectedEvent);  // Récupérer les matchs de l'événement sélectionné
      fetchPools(selectedEvent);    // Charger les poules de l'événement sélectionné
    }
  }, [selectedEvent]);

  // ✅ Gestion du changement d'événement
  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);
  };

  // ✅ Regroupement des matchs pour affichage organisé
  const matchesGroupedByEventPhaseDayTour = matches.reduce((acc, match) => {
    const key = `${match.eventName}-${match.phase}-${match.journee || 'N/A'}-${match.tour_final || 'N/A'}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(match);
    return acc;
  }, {});

  return (
    <Box sx={{ padding: { xs: "16px", sm: "32px" }, width: { xs: "100%", md: "75%" }, margin: "auto" }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, mt: 4 }}>
        Calendrier des rencontres
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <FormControl sx={{ minWidth: { xs: "100%", sm: "300px" } }}>
          <InputLabel>Choisir un événement</InputLabel>
          <Select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            label="Choisir un événement"
          >
            {loadingEvents ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : events.length > 0 ? (
              [
                <MenuItem key="default" value="">Sélectionner un événement</MenuItem>,
                ...events.map(event => (
                  <MenuItem key={event.id_evenement} value={event.id_evenement}>
                    {event.nom_event}
                  </MenuItem>
                ))
              ]
            ) : (
              <MenuItem disabled>Aucun événement disponible</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ borderBottom: "2px solid #1976d2", marginBottom: 4, marginTop: 2 }} />

      {/* Affichage des poules */}
      {showPools && pools.length > 0 && (
        <Box sx={{ mt: 4, mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: '', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
              Classement des Poules pour{" "} {events.find((e) => e.id_evenement === selectedEvent)?.nom_event}
            </Typography>
            {/* Texte Retour avec soulignement */}
            <Typography
              sx={{
                cursor: 'pointer',
                color: 'blue',
                fontWeight: '',
                textDecoration: 'underline',
                display: { xs: 'none', sm: 'block' },  // Afficher à partir de l'écran sm
                '@media (max-width: 600px)': {
                  display: 'none !important', // Forcer l'affichage sur petits écrans
                },
              }}
              onClick={() => setShowPools(false)} // Cacher les poules au clic sur retour
            >
              Retour
            </Typography>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: "100%", mx: "auto" }}>
              {pools
                .sort((a, b) => a.nom_poule.localeCompare(b.nom_poule))
                .map((pool) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={pool.id_poule} sx={{ display: "flex", justifyContent: "center" }}>
                    <Paper sx={{ textAlign: "center", p: { xs: 1, sm: 2 }, border: "1px solid #ddd", width: "250px" }}>
                      <Typography sx={{ fontWeight: "bold", backgroundColor: "#ddd", py: 0.5, borderBottom: "2px solid #ddd" }}>
                        Poule {pool.nom_poule}
                      </Typography>

                      <List sx={{ flexGrow: 1, p: 0 }}>
                        {pool.participants.map((participant, idx) => (
                          <ListItem key={participant.id_participant} sx={{ py: 0.5, borderBottom: "1px solid #ddd" }}>
                            <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                              {participant.nom_equipe}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Affichage des matchs */}
      {!showPools && loadingMatches ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : !showPools && Object.keys(matchesGroupedByEventPhaseDayTour).length > 0 ? (
        Object.keys(matchesGroupedByEventPhaseDayTour).map((key, index) => {
          const [eventName, phase, journee, tour_final] = key.split('-');
          const matchesInGroup = matchesGroupedByEventPhaseDayTour[key];
          return (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography sx={{ mb: 2, fontWeight: "bold", fontSize: { xs: "14px", md: "20px" } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    {selectedEvent ? events.find(event => event.id_evenement === selectedEvent)?.nom_event || 'Inconnu' : eventName}
                  </span>
                  {selectedEvent && journee !== "N/A" && (
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        color: 'blue',
                        textDecoration: 'underline',
                        ml: 0, // Marges à gauche pour un peu d'espace
                      }}
                      onClick={() => setShowPools(!showPools)}
                    >
                      Voir les poules
                    </Typography>
                  )}
                </Box>
              </Typography>

              <Typography sx={{ mb: 2, fontSize: { xs: "12px", md: "14px" } }}>
                <span style={{ fontWeight: "bold" }}>Phase :</span> {phase}
                {journee && journee !== 'N/A' && ` || Journée : ${journee}`}
                {tour_final && tour_final !== 'N/A' && ` || Tour final : ${tour_final}`}
              </Typography>

              <TableContainer component={Paper} sx={{ border: "none" }}>
                <Table sx={{ border: "none" }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e0e7ff", color: "white", textTransform: "uppercase" }}>
                      <TableCell sx={{ border: "none", borderRight: "1px solid white ", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }}>Date</TableCell>
                      <TableCell sx={{ border: "none", borderRight: "1px solid white ", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }} colSpan={3}>Rencontre</TableCell>
                      <TableCell sx={{ border: "none", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }}>Lieu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchesInGroup.map((match, idx) => (
                      <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f9" }}>
                        <TableCell sx={{ border: "none", textAlign: "center", padding: "4px 5px", fontSize: { xs: "12px", md: "12px" } }}>
                          {
                            new Date(match.date_rencontre).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long"
                            }).replace(/janvier/i, 'jan.').replace(/février/i, 'fév.')
                              .replace(/mars/i, 'mar.').replace(/avril/i, 'avr.').replace(/mai/i, 'mai.')
                              .replace(/juin/i, 'juin.').replace(/juillet/i, 'juil.').replace(/août/i, 'août.')
                              .replace(/septembre/i, 'sept.').replace(/octobre/i, 'oct.').replace(/novembre/i, 'nov.')
                              .replace(/décembre/i, 'déc.')
                          }
                        </TableCell>
                        <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "right", padding: "4px 5px" }}>{match.participant_a}</TableCell>
                        <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "center", padding: "4px 5px", fontWeight: "bold", color: "#f50057" }}>
                          {match.heure_rencontre ? match.heure_rencontre.split(":").slice(0, 2).join("h") : "--h--"}
                        </TableCell>
                        <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "left", padding: "4px 5px" }}>{match.participant_b}</TableCell>
                        <TableCell sx={{ border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "center", padding: "4px 5px" }}>{match.lieu_rencontre}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })
      ) : (
        <Typography sx={{ textAlign: 'center' }}></Typography>
      )}
    </Box>
  );
};

export default CalendrierPublic;

