
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material'; // ✅ Ajout de l'icône de suppression
import { IconButton } from '@mui/material'; // ✅ Ajout de IconButton pour le bouton interactif


const CalendrierRencontre = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [matches, setMatches] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Fonction pour récupérer les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/organizer/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const formatPhase = (phase) => {
    // Vérifie si la phase est "Aller-Retour" et la formate correctement
    if (phase === 'Aller-Retour') {
      return 'Aller - Retour';
    }
    return phase;  // Pour les autres phases, retournez la phase telle quelle
  };

  const fetchMatches = async (eventId) => {
    if (!eventId) {
      setMatches([]);
      return;
    }
    setLoadingMatches(true);

    console.log("ID de l'événement envoyé à l'API :", eventId); // 🔍 Vérifier l'eventId

    try {
      const response = await axios.get(`http://localhost:3001/api/organizer/eventcalendrier/${eventId}/matches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      console.log("Réponse API (matchs) :", response.data); // 🔍 Vérifier la réponse

      setMatches(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du calendrier des rencontres :", error);
    } finally {
      setLoadingMatches(false);
    }
  };



  // Fonction pour récupérer les rencontres de tous les événements
  const fetchAllMatches = async () => {
    setLoadingMatches(true);
    try {
      const allMatches = [];
      for (const event of events) {
        const response = await axios.get(`http://localhost:3001/api/organizer/eventcalendrier/${event.id_evenement}/matches`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        allMatches.push(...response.data.map(match => ({
          ...match,
          eventName: event.nom_event,  // Ajoute le nom de l'événement à chaque match
          eventId: event.id_evenement  // Ajoute aussi l'ID de l'événement
        })));
      }
      setMatches(allMatches);
    } catch (error) {
      console.error("Erreur lors de la récupération du calendrier des rencontres de tous les événements :", error);
    } finally {
      setLoadingMatches(false);
    }
  };


  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);
    fetchMatches(eventId);
  };

  // Regroupement des matchs par l'événement, la phase, la journée et le tour_final.
  const matchesGroupedByEventPhaseDayTour = matches.reduce((acc, match) => {
    const key = `${match.eventName}-${match.phase}-${match.journee || 'N/A'}-${match.tour_final || 'N/A'}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(match);
    return acc;
  }, {});

  // Récupérer toutes les rencontres dès que l'événement n'est pas sélectionné
  useEffect(() => {
    if (!selectedEvent) {
      fetchAllMatches();
    }
  }, [selectedEvent, events]);


  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette rencontre ?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/organizer/match/${matchId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMatches(matches.filter(match => match.id_rencontre !== matchId));
      alert("Rencontre supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la rencontre :", error);
      alert("Erreur lors de la suppression de la rencontre.");
    }
  };

  return (
    <Box sx={{ padding: "0px 32px", width: "100%" }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
        Calendrier des rencontres
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Choisir un événement</InputLabel>
          <Select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            label="Choisir un événement"
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

      <Box sx={{ borderBottom: "2px solid #1976d2", marginBottom: 4, marginTop: 2 }} />

      {/* Afficher les rencontres de tous les événements */}
      {loadingMatches ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : Object.keys(matchesGroupedByEventPhaseDayTour).length > 0 ? (
        Object.keys(matchesGroupedByEventPhaseDayTour).map((key, index) => {
          const [eventName, phase, journee, tour_final] = key.split('-');
          const matchesInGroup = matchesGroupedByEventPhaseDayTour[key];

          return (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {selectedEvent
                    ? events.find(event => event.id_evenement === selectedEvent)?.nom_event || 'Inconnu'
                    : eventName || 'Nom de l\'événement non disponible'}
                </span>
              </Typography>

              <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>Phase :</span>
                <span>{formatPhase(phase)}</span>

                {/* Vérification améliorée pour "Journée" : ne s'affiche pas si null, vide ou 0 */}
                {journee && journee !== '0' && journee !== '' && journee !== 'N/A' && (
                  <>
                    <span style={{ margin: "0 8px" }}>||</span>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>Journée :</span>
                    <span>{journee}</span>
                  </>
                )}

                {/* Vérification améliorée pour "Tour final" : ne s'affiche pas si null, vide ou 0 */}
                {tour_final && tour_final !== '0' && tour_final !== '' && tour_final !== 'N/A' && (
                  <>
                    <span style={{ margin: "0 8px" }}>||</span>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>Tour final :</span>
                    <span>{tour_final}</span>
                  </>
                )}
              </Typography>



              <Box sx={{ width: "100%", maxWidth: "1200px", margin: "auto" }}>
                <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
                  <Table sx={{ minWidth: 700, tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "black", borderRight: "2px solid white", padding: "8px 0px", width: "8%" }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "black", borderRight: "2px solid white", padding: "8px 0px", width: "8%" }}>
                          Heure
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "black", borderRight: "2px solid white", padding: "8px 0px", width: "30%" }} colSpan={3}>
                          Rencontre
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "black", padding: "8px 0px", width: "10%" }}>
                          Lieu
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "black", padding: "8px 0px", width: "10%" }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matchesInGroup.map((match, idx) => (
                        <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f9" }}>
                          <TableCell sx={{ textAlign: "center", color: 'black', padding: "5px 0px", borderRight: "2px solid white", width: "15%" }}>
                            {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(match.date_rencontre))}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", color: 'black', padding: "5px 0px", borderRight: "2px solid white", width: "10%" }}>
                            {match.heure_rencontre ? match.heure_rencontre.split(":").slice(0, 2).join(" : ") : "-- : --"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right", color: 'black', padding: "5px 0px", width: "20%" }}>
                            {match.participant_a}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", color: 'black', fontWeight: "bold", padding: "5px 10px", width: "5%" }}>
                            #
                          </TableCell>
                          <TableCell sx={{ textAlign: "left", color: 'black', padding: "5px 0px", borderRight: "2px solid white", width: "20%" }}>
                            {match.participant_b}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", color: "black", padding: "5px 0px", borderRight: "2px solid white", width: "15%" }}>
                            {match.lieu_rencontre}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", padding: "5px 0px", width: "15%" }}>
                            <IconButton size="small" onClick={() => handleDeleteMatch(match.id_rencontre)} sx={{ color: "red",padding: "5px 0px", }}>
                              <DeleteOutline fontSize="small"/> {/* ✅ Remplacement du "X" par une icône de suppression */}
                            </IconButton>
                          </TableCell>


                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </Box>
            </Box>
          );
        })
      ) : (
        <Typography sx={{ textAlign: 'center' }}>Aucune rencontre disponible</Typography>
      )}

    </Box>
  );
};

export default CalendrierRencontre;



