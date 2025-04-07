import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  List,
  ListItem,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  TextField,
  Paper, Tabs, Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
  Divider,
  IconButton
} from '@mui/material';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const GeneratePool = ({ organizerId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participantCount, setParticipantCount] = useState(0);
  const [numberOfPools, setNumberOfPools] = useState('');
  const [poolFormat, setPoolFormat] = useState('letters');
  const [poolsData, setPoolsData] = useState([]);
  const [eventsWithPools, setEventsWithPools] = useState([]);
  const [selectedEventForPools, setSelectedEventForPools] = useState(null);
  const [showPools, setShowPools] = useState(false);

  // --- NOUVEAUX états pour la création manuelle ---
  const [selectedEventManual, setSelectedEventManual] = useState('');
  const [participantCountManual, setParticipantCountManual] = useState(0);
  const [manualParticipants, setManualParticipants] = useState([]);
  const [poolNameManual, setPoolNameManual] = useState('');
  const [selectedParticipantManual, setSelectedParticipantManual] = useState('');

  // État pour le choix de la méthode de création (0 = automatique, 1 = manuel)
  const [creationType, setCreationType] = useState(0);

  const [hoveredEventId, setHoveredEventId] = useState(null);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/organizer/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((response) => setEvents(response.data))
      .catch((error) =>
        console.error('Erreur lors du chargement des événements :', error)
      );
  }, []);

  // Partie gauche : récupère le nombre de participants quand on choisit un événement
  const handleEventChange = async (eventId) => {
    setSelectedEvent(eventId);
    if (eventId) {
      axios
        .get(`http://localhost:3001/api/organizer/event/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then((response) => setParticipantCount(response.data.nbr_participant))
        .catch((error) =>
          console.error('Erreur lors de la récupération des participants :', error)
        );
    } else {
      setParticipantCount(0);
    }
  };

  // --- NOUVELLE fonction pour gérer le choix d'événement en création manuelle ---
  const handleManualEventChange = async (eventId) => {
    setSelectedEventManual(eventId);
    if (eventId) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/organizer/event/${eventId}/participants`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setParticipantCountManual(response.data.nbr_participant || 0);
        setManualParticipants(response.data.participants || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des participants (manuel) :', error);
      }
    } else {
      setParticipantCountManual(0);
      setManualParticipants([]);
    }
  };



  const fetchPoolsData = async (eventId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Aucun token trouvé, veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/organizer/event/${eventId}/pools`,  // Nouvelle route
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Données des poules reçues :', response.data);
      setPoolsData(response.data.pools);
      setSelectedEventForPools(eventId);
      setShowPools(true);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des poules :', error);
    }
  };

  // Création automatique : création et assignation des poules
  const handleCreatePoolsAndAssign = async () => {
    if (!selectedEvent) {
      alert('❌ Veuillez sélectionner un événement.');
      return;
    }
    if (!numberOfPools || isNaN(numberOfPools) || numberOfPools <= 0) {
      alert('⚠️ Veuillez entrer un nombre valide de poules.');
      return;
    }

    try {
      // Étape 1 : Créer les poules
      const poolNames = Array.from({ length: numberOfPools }, (_, i) =>
        poolFormat === 'letters'
          ? String.fromCharCode(65 + i)   // renvoie "A", "B", "C", ...
          : String(i + 1)                 // renvoie "1", "2", "3", ...
      );


      await axios.post(
        'http://localhost:3001/api/organizer/create-pools',
        {
          id_evenement: selectedEvent,
          pools: poolNames
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Étape 2 : Assigner les participants
      await axios.post(
        'http://localhost:3001/api/organizer/assign-participants',
        {
          id_evenement: selectedEvent
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Met à jour la liste des événements avec poules
      setEventsWithPools((prevEvents) => {
        if (!prevEvents.some((event) => event.id_evenement === selectedEvent)) {
          return [
            ...prevEvents,
            {
              id_evenement: selectedEvent,
              nom_event: events.find((e) => e.id_evenement === selectedEvent)
                ?.nom_event
            }
          ];
        }
        return prevEvents;
      });

      // Affiche directement le classement après la création
      await fetchPoolsData(selectedEvent);

      alert(
        '✅ Les poules ont été créées et les participants ont été répartis avec succès !'
      );
    } catch (error) {
      console.error('❌ Une erreur s\'est produite lors du processus :', error);
      alert('❌ Une erreur s\'est produite.');
    }
  };



  // Chargement initial des événements avec poules
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Aucun token trouvé, veuillez vous reconnecter.');
      return;
    }

    axios
      .get('http://localhost:3001/api/organizer/events-with-pools', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        console.log('✅ Événements avec poules de l\'organisateur :', response.data);
        setEventsWithPools(response.data);
      })
      .catch((error) =>
        console.error('Erreur lors du chargement des événements avec poules :', error)
      );
  }, []);

  const handleAddManual = async () => {
    try {
      await axios.post(
        'http://localhost:3001/api/organizer/manual-add-participant',
        {
          id_evenement: selectedEventManual,
          nom_poule: poolNameManual,
          id_participant: selectedParticipantManual
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      alert('Participant ajouté avec succès !');

      // Mise à jour de la liste en retirant le participant ajouté
      setManualParticipants(prevParticipants =>
        prevParticipants.filter(
          p => Number(p.id_participant) !== Number(selectedParticipantManual)
        )
      );
      setParticipantCountManual(prevCount => prevCount - 1);
      setSelectedParticipantManual('');

      // Mise à jour de la liste des événements avec poules
      setEventsWithPools(prevEvents => {
        if (!prevEvents.some(e => e.id_evenement === selectedEventManual)) {
          const newEvent = events.find(e => e.id_evenement === selectedEventManual);
          return newEvent ? [...prevEvents, newEvent] : prevEvents;
        }
        return prevEvents;
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout manuel :', error);
      alert(
        error.response?.data?.message ||
        '❌ Une erreur est survenue lors de l\'ajout.'
      );
    }
  };

  const handleDeletePools = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token introuvable, veuillez vous reconnecter.");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer les poules et leurs participants pour cet événement ?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/organizer/event/${eventId}/pools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mettre à jour la liste des événements avec poules
      setEventsWithPools(prev => prev.filter(e => e.id_evenement !== eventId));
      alert("Les poules et leurs participants ont été supprimés avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        py: { xs: 2, sm: 0 },
        px: { xs: 0, sm: 0, md: 0 },
      }}
    >
      {!showPools ? (
        <>
          {/* Partie gauche : Génération des poules */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography

              gutterBottom
              sx={{
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                textAlign: "center",
              }}
            >
              Génération des poules
            </Typography>
            <Tabs
              value={creationType}
              onChange={(e, newValue) => setCreationType(newValue)}
              centered
            >
              <Tab label="Génération aléatoire" />
              <Tab label="Création manuelle" />
            </Tabs>

            {creationType === 0 ? (
              // Création automatique
              <Box
                sx={{
                  mt: 2,
                  width: { xs: "90%", sm: "80%", md: "100%" },
                  mx: "auto",
                }}
              >
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                  <InputLabel>Choisir un événement</InputLabel>
                  <Select
                    value={selectedEvent || ""}
                    onChange={(e) => handleEventChange(e.target.value)}
                    label="Choisir un événement"
                    sx={{ textAlign: "left" }}
                  >
                    {events
                      .filter(
                        (event) =>
                          !eventsWithPools.some(
                            (e) => e.id_evenement === event.id_evenement
                          )
                      )
                      .map((event) => (
                        <MenuItem
                          key={event.id_evenement}
                          value={event.id_evenement}
                        >
                          {event.nom_event}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Nombre de participants"
                  value={participantCount}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Nombre de poules"
                  type="number"
                  value={numberOfPools}
                  onChange={(e) => setNumberOfPools(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Format des poules</InputLabel>
                  <Select
                    value={poolFormat || ""}
                    onChange={(e) => setPoolFormat(e.target.value)}
                    label="Format des poules"
                    sx={{ textAlign: "left" }}
                  >
                    <MenuItem value="letters">Lettres (A, B, C...)</MenuItem>
                    <MenuItem value="numbers">Chiffres (1, 2, 3...)</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreatePoolsAndAssign}
                    disabled={!selectedEvent}
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                      width: { xs: "100%", sm: "200px" },
                    }}
                  >
                    Créer les poules
                  </Button>
                </Box>
              </Box>
            ) : (
              // Création manuelle
              <Box
                sx={{
                  mt: 2,
                  width: { xs: "90%", sm: "80%", md: "100%" },
                  mx: "auto",
                }}
              >
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                  <InputLabel>Choisir un événement</InputLabel>
                  <Select
                    value={selectedEventManual || ""}
                    onChange={(e) => handleManualEventChange(e.target.value)}
                    label="Choisir un événement"
                    sx={{ textAlign: "left" }}
                  >
                    {events.map((event) => (
                      <MenuItem
                        key={event.id_evenement}
                        value={event.id_evenement}
                      >
                        {event.nom_event}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Nombre de participants"
                  value={participantCountManual}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Nom de la poule"
                  value={poolNameManual}
                  onChange={(e) => setPoolNameManual(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Nom de participant</InputLabel>
                  <Select
                    value={selectedParticipantManual || ""}
                    onChange={(e) => setSelectedParticipantManual(e.target.value)}
                    label="Nom de participant"
                    sx={{ textAlign: "left" }}
                  >
                    {manualParticipants.map((participant) => (
                      <MenuItem
                        key={participant.id_participant}
                        value={participant.id_participant}
                      >
                        {participant.nom_part}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Nom de l'équipe</InputLabel>
                  <Select
                    value={selectedParticipantManual || ""}
                    onChange={(e) => setSelectedParticipantManual(e.target.value)}
                    label="Nom de l'équipe"
                    sx={{ textAlign: "left" }}
                  >
                    {manualParticipants.map((participant) => (
                      <MenuItem
                        key={participant.id_participant}
                        value={participant.id_participant} // On stocke l'ID du participant
                      >
                        {participant.nom_equipe} {/* On affiche le nom de l'équipe */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>



                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddManual}
                    fullWidth
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                      width: { xs: "100%", sm: "200px" },
                    }}
                  >
                    Ajouter
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" }, mx: 1, mt: 4 }}
          />

          {/* Partie droite : Événements avec Poules */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.8rem" },
                  mb: { xs: 3, sm: 2 }, mt: 0,
                }}
              >
                Les Poules
              </Typography>
              <Table sx={{ width: "90%", mx: 'auto' }}>
                <TableBody>
                  {eventsWithPools.length > 0 ? (
                    eventsWithPools.map((event, index) => (
                      <TableRow
                        key={event.id_evenement}
                        onMouseEnter={() => setHoveredEventId(event.id_evenement)}
                        onMouseLeave={() => setHoveredEventId(null)}
                        sx={{
                          backgroundColor: isDarkMode
                            ? index % 2 === 0
                              ? "#5D7FA4"
                              : "#383838"
                            : index % 2 === 0
                              ? "#A4C5EA"
                              : "#E0E0E0",
                        }}
                      >
                        <TableCell
                          sx={{
                            padding: "10px 10px",
                            textTransform: "uppercase",
                            color: isDarkMode ? "white" : "black",
                            cursor: "pointer",
                          }}
                          onClick={() => fetchPoolsData(event.id_evenement)}
                        >
                          {event.nom_event}
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 0 }}>
                          {hoveredEventId === event.id_evenement && (
                            <>
                              <IconButton
                                variant="text"
                                sx={{
                                  textTransform: "none",
                                  color: isDarkMode ? "white" : "gray",
                                }}
                                onClick={() => fetchPoolsData(event.id_evenement)}
                              >
                                <VisibilityIcon sx={{ fontSize: "1.3rem" }} />
                              </IconButton>
                              <IconButton
                                variant="text"
                                sx={{
                                  textTransform: "none",
                                  color: isDarkMode ? "white" : "gray",
                                }}
                                onClick={() => handleDeletePools(event.id_evenement)}
                              >
                                <DeleteIcon sx={{ fontSize: "1.3rem" }} />
                              </IconButton>
                            </>

                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography align="center">
                          Aucun événement trouvé.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </>
      ) : (
        // Affichage du classement des poules
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            pt: [2, 4], // xs = 2, sm et plus = 4
            pr: [2, 4],
            pb: [8, 8], // xs = 4, sm et plus = 8
            pl: [2, 4],
            maxWidth: "1200px",
            mx: "auto",
            mb: 4,

          }}
        >


          <Typography
            variant="h5"
            sx={{
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            Classement des Poules pour{" "}
            <strong>
              {
                eventsWithPools.find(
                  (e) => e.id_evenement === selectedEventForPools
                )?.nom_event
              }
            </strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              position: 'absolute', // Position absolue pour ne pas bouger avec le contenu
              bottom: 0, // Décalage du haut
              right: 10, // Décalage de la gauche
              cursor: 'pointer',
              color: 'blue',
              fontWeight: 'bold',
              backgroundColor: 'white',
              p: 1,
              mx: 4,
              borderRadius: 1,
              boxShadow: 1,
              zIndex: 1000 // Assure qu'il reste au-dessus des autres éléments
            }}
            onClick={() => setShowPools(false)}
          >
            Retour
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Grid
              container
              spacing={2}
              justifyContent="left"
              sx={{ maxWidth: "100%", mx: "auto" }}
            >
              {[...poolsData]
                .sort((a, b) => {
                  if (!isNaN(a.nom_poule) && !isNaN(b.nom_poule)) {
                    return Number(a.nom_poule) - Number(b.nom_poule);
                  }
                  return a.nom_poule.localeCompare(b.nom_poule);
                })
                .map((pool) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={pool.id_poule}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Paper
                      sx={{
                        textAlign: "center",
                        p: { xs: 1, sm: 2 },
                        border: "1px solid #ddd",
                        width: "200px",  // Largeur fixe
                        minWidth: "200px",
                      
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        margin: "auto",  // Centre horizontalement
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          backgroundColor: "#ddd",
                          py: 0.5,
                          borderBottom: "2px solid #ddd",
                        }}
                      >
                        Poule {pool.nom_poule}
                      </Typography>

                      <List sx={{ flexGrow: 1, p: 0 }}>
                        {pool.participants.map((participant, idx) => (
                          <ListItem
                            key={participant.id_participant}
                            sx={{
                              justifyContent: "center",
                              py: 0.5,
                              borderBottom: "1px solid #ddd",
                              fontWeight: idx === 0 ? "bold" : "normal",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                              }}
                            >
                              {participant.nom_equipe} {/* ✅ Affiche le nom de l'équipe */}
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
    </Box>
  );

};

export default GeneratePool;
