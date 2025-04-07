import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, Divider, Button, Grid, TableHead, Table, TableBody, TableCell, TableRow, Paper, CircularProgress
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';


const CreateMatch = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [poolsData, setPoolsData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPools, setLoadingPools] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [participantA, setParticipantA] = useState('');
  const [participantB, setParticipantB] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchLocation, setMatchLocation] = useState('');
  const [phase, setPhase] = useState(''); // Ajout du champ phase
  const phases = ["Groupe", "Éliminatoire", "Qualification", "Finale", "Barrage", "Classement", "Aller Retour"];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [journee, setJournee] = useState('');
  // Ajout du champ Tour Final dans le formulaire
  const toursFinals = ["32e de finale", "16e de finale", "8e de finale", "Quart de finale", "Demi finale", "Finale"];

  const [tourFinal, setTourFinal] = useState('');

  // Condition pour désactiver certains champs en fonction de la phase
  const isJourneeDisabled = ["Barrage", "Éliminatoire", "Finale"].includes(phase);
  const isTourFinalDisabled = ["Groupe", "Qualification", "Classement", "Barrage"].includes(phase);

  // Récupération des événements appartenant à l'organisateur
  useEffect(() => {
    console.log("Matches récupérés :", matches);
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const response = await axios.get("http://localhost:3001/api/organizer/events", {
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

  const fetchPoolsAndMatches = async (eventId) => {
    if (!eventId) {
      setPoolsData([]);
      setMatches([]);
      return;
    }
    setLoadingPools(true);
    setLoadingMatches(true);
    try {
      const params = {
        phase,
        journee: journee || '',
        tour_final: tourFinal || '',
      };

      const poolsResponse = await axios.get(`http://localhost:3001/api/organizer/event/${eventId}/pools`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const matchesResponse = await axios.get(`http://localhost:3001/api/organizer/event/${eventId}/matches`, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setPoolsData(poolsResponse.data.pools);
      // setMatches(matchesResponse.data || []); // matches est maintenant un tableau d'objets regroupés
      setMatches(matchesResponse.data);



      console.log("Données des matchs reçues:", matchesResponse.data);

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setPoolsData([]);
      setMatches([]);
    } finally {
      setLoadingPools(false);
      setLoadingMatches(false);
    }
  };

  // Sélection d'un événement et chargement des poules + rencontres
  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);
    fetchPoolsAndMatches(eventId);
  };

  const handleCreateMatch = async () => {
    if (!phase || !participantA || !participantB || !matchDate || !matchTime || !matchLocation || !selectedEvent ||
      (!isJourneeDisabled && !journee) || (!isTourFinalDisabled && !tourFinal)) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // 🔍 Vérifier si participantA et participantB existent bien dans poolsData
    const equipeA = poolsData.flatMap(pool => pool.participants)
      .find(participant => participant.nom_equipe === participantA);

    const equipeB = poolsData.flatMap(pool => pool.participants)
      .find(participant => participant.nom_equipe === participantB);

    if (!equipeA || !equipeB) {
      alert("❌ Erreur : Impossible de trouver l'équipe sélectionnée.");
      console.log("❌ Données des équipes non trouvées :");
      console.log("Participant A :", participantA, "Trouvé :", equipeA);
      console.log("Participant B :", participantB, "Trouvé :", equipeB);
      return;
    }

    // 🔹 Préparation des données envoyées (on envoie directement les noms des équipes)
    const matchData = {
      phase,
      participant_a: participantA,
      participant_b: participantB,
      lieu_rencontre: matchLocation,
      date_rencontre: matchDate,
      heure_rencontre: matchTime,
      id_evenement: selectedEvent,
      journee: isJourneeDisabled ? "" : journee, // Remplace NULL par une chaîne vide
      tour_final: isTourFinalDisabled ? "" : tourFinal // Remplace NULL par une chaîne vide
    };
    
    // 📤 Vérification avant envoi
    console.log("📤 Données envoyées à l'API :", matchData);

    try {
      setLoadingMatches(true);
      const response = await axios.post(`http://localhost:3001/api/organizer/creatematch`, matchData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      console.log("✅ Réponse du serveur :", response.data);
      await fetchPoolsAndMatches(selectedEvent);
      alert("Rencontre ajoutée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la rencontre :", error.response?.data || error);
      alert(`Erreur lors de l'ajout de la rencontre : ${error.response?.data?.message || "Erreur inconnue"}`);
    } finally {
      setLoadingMatches(false);
    }
  };



  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette rencontre ?")) {
      return;
    }
  
    try {
      await axios.delete(`http://localhost:3001/api/organizer/match/${matchId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      // 🔄 Rafraîchir la liste des matchs depuis le serveur
      await fetchPoolsAndMatches(selectedEvent);
  
      alert("Rencontre supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la rencontre :", error);
      alert("Erreur lors de la suppression de la rencontre.");
    }
  };
  


  return (
    <Box sx={{ padding: "0px 32px" }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Créer des rencontres</Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <FormControl fullWidth sx={{ mb: 2, width: '30%' }}>
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

      {loadingPools ? <CircularProgress sx={{ display: 'block', margin: 'auto' }} /> :
        (poolsData.length > 0 ? (
          <Box sx={{ overflowX: "auto", mb: 4 }}>
            <Grid
              container
              spacing={2}
              justifyContent="center"  // Pour centrer les éléments sur tous les écrans
              sx={{ maxWidth: "100%", m: 0 }}
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
                    key={pool.id_poule}
                    xs={6}  // Sur les petits écrans, chaque élément prendra 50% de la largeur
                    sm={4}  // Sur les écrans moyens, chaque élément prendra 33.33% de la largeur
                    md={3}  // Sur les écrans plus larges, chaque élément prendra 25% de la largeur
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Paper
                      sx={{
                        textAlign: "center",
                        p: { xs: 1, sm: 2 },  // Plus d'espace sur les écrans moyens et plus grands
                        border: "1px solid #ddd",
                        width: "100%",  // La largeur est 100% de l'espace alloué par Grid
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },  // Plus grande taille de texte sur les grands écrans
                          backgroundColor: "#ddd",
                          py: 1,
                          borderBottom: "2px solid #ccc",
                        }}
                      >
                        Poule {pool.nom_poule}
                      </Typography>

                      <Box sx={{ flexGrow: 1, mt: 0.5 }}>
                        {pool.participants.length > 0 ? (
                          pool.participants.map((participant, idx) => (
                            <Box
                              key={participant.id_participant}
                              sx={{
                                py: 1,
                                borderBottom: idx !== pool.participants.length - 1 ? "1px solid #eee" : "none",
                                fontWeight: idx === 0 ? "bold" : "normal",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },  // Ajustement de la taille de texte pour les petits écrans
                                }}
                              >
                                {participant.nom_equipe}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography sx={{ py: 2, fontStyle: "italic", color: "#777" }}>
                            Aucun participant
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Box>

        ) : selectedEvent && <Typography sx={{ textAlign: 'center' }}>Aucune poule disponible</Typography>)
      }

      <Box sx={{ borderBottom: "2px solid #1976d2", marginBottom: 4, marginTop: 2 }} />

      <Grid container spacing={3}>
        {/* Section "Ajouter une rencontre" -> 38% sur grands écrans */}

        <Grid item xs={12} md={4.8}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ajouter une rencontre</Typography>
          {/* Sélection de la Phase */}
          <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Phase</InputLabel>
              <Select value={phase} onChange={(e) => setPhase(e.target.value)} label="Phase">
                {phases.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Journée"
                value={journee}
                onChange={(e) => setJournee(e.target.value)}
                type="number" // Permet uniquement des nombres
                disabled={isJourneeDisabled} // Désactive ce champ si la phase correspond à l'une des phases listées
              />

            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tour Final</InputLabel>
                <Select
                  value={tourFinal}
                  onChange={(e) => setTourFinal(e.target.value)}
                  label="Tour Final"
                  disabled={isTourFinalDisabled} // Désactive ce champ si la phase correspond à l'une des phases listées
                >
                  {toursFinals.map((tour, index) => (
                    <MenuItem key={index} value={tour}>
                      {tour}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>

          </Grid>



          <Grid container spacing={2}>
            {/* Ligne 1 : Participant A | Participant B */}
            <Grid item xs={12} sm={6}>
              


              <FormControl fullWidth>
                <InputLabel>Participant A</InputLabel>
                <Select
                  value={participantA}
                  onChange={(e) => setParticipantA(e.target.value)}
                  label="Participant A"
                >
                  {poolsData.flatMap(pool => pool.participants).map((participant) => (
                    <MenuItem key={participant.id_participant} value={participant.nom_equipe}>
                      {participant.nom_equipe}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>



            </Grid>

            <Grid item xs={12} sm={6}>
            
              <FormControl fullWidth>
                <InputLabel>Participant B</InputLabel>
                <Select
                  value={participantB}
                  onChange={(e) => setParticipantB(e.target.value)}
                  label="Participant B"
                >
                  {poolsData.flatMap(pool => pool.participants).map((participant) => (
                    <MenuItem key={participant.id_participant} value={participant.nom_equipe}>
                      {participant.nom_equipe}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


            </Grid>

            {/* Ligne 2 : Heure | Date */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Heure" type="time" value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>

            {/* Ligne 3 : Lieu (pleinement étendu) */}
            <Grid item xs={12}>
              <TextField fullWidth label="Lieu" value={matchLocation}
                onChange={(e) => setMatchLocation(e.target.value)} />
            </Grid>

            {/* Bouton Ajouter aligné à droite */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={handleCreateMatch}>
                Ajouter
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Séparateur vertical */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" }, mx: 1, mt: 4 }}
        />

        {/* Section "Liste des rencontres" -> 58% sur grands écrans */}
        <Grid item xs={12} md={6.9}>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Liste des rencontres</Typography>

          {loadingMatches ? (
            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
          ) : (
            <Box sx={{ maxHeight: "500px", overflowY: "auto", paddingRight: "0px" }}>
              {Array.isArray(matches) && matches.length > 0 ? (
                matches.map((group, index) => {
                  console.log("Group data:", group); // Vérifie chaque groupe

                  // Vérification explicite pour éviter l'erreur .map() sur undefined
                  if (!group.matches || !Array.isArray(group.matches)) {
                    console.error(`Le groupe à l'index ${index} a un problème :`, group);
                    return null; // Ne pas afficher ce groupe s'il est invalide
                  }

                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                          Phase: {group.phase}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: '' }}>
                        {group.journee && (
                          <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                            Journée : {group.journee}
                          </Typography>
                        )}
                        {group.tour_final && (
                          <Typography variant="body2" sx={{ fontWeight: 'normal', ml: 2 }}>
                            Tour final : {group.tour_final}
                          </Typography>
                        )}
                      </Grid>

                      <Paper elevation={1}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                              <TableCell sx={{ fontWeight: "bold", textAlign: "center", fontSize: "12px", padding: "8px 0px", color: "black", borderRight: "2px solid white" }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: "bold", textAlign: "center", fontSize: "12px", padding: "8px 0px", color: "black", borderRight: "2px solid white" }}>Heure</TableCell>
                              <TableCell sx={{ fontWeight: "bold", textAlign: "center", fontSize: "12px", padding: "8px 0px", color: "black", borderRight: "2px solid white" }} colSpan={3}>Rencontre</TableCell>
                              <TableCell sx={{ fontWeight: "bold", textAlign: "center", fontSize: "12px", padding: "8px 0px", color: "black", borderRight: "2px solid white" }}>Lieu</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {group.matches.map((match, idx) => (
                              <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f5", position: "relative", "&:hover .delete-icon": { visibility: "visible", opacity: 1 } }}>
                                <TableCell sx={{ textAlign: "center", color: 'black', fontSize: "12px", padding: "10px 0px", borderRight: "1px solid white" }}>
                                  {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(match.date_rencontre))}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center", color: 'black', fontSize: "12px", padding: "10px 0px", borderRight: "1px solid white" }}>
                                  {match.heure_rencontre ? match.heure_rencontre.split(":").slice(0, 2).join(" : ") : "-- : --"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", color: 'black', fontSize: "11px", padding: "10px 0px", width: "20%" }}>
                                  {match.participant_a}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center", color: 'black', fontSize: "12px", padding: "10px 0px", fontWeight: "bold", width: "10%" }}>
                                  #
                                </TableCell>
                                <TableCell sx={{ textAlign: "left", color: 'black', fontSize: "11px", padding: "10px 0px", width: "20%", borderRight: "1px solid white" }}>
                                  {match.participant_b}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center", color: "black", fontSize: "12px", padding: "10px 0px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                  {match.lieu_rencontre}
                                  <Box className="delete-icon" sx={{ fontSize: "12px", p: 0, color: "red", fontWeight: "bold", cursor: "pointer", marginLeft: "8px", visibility: "hidden", opacity: 0, transition: "opacity 0.2s ease-in-out" }} onClick={() => handleDeleteMatch(match.id_rencontre)}>
                                    X
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </Box>
                  );
                })
              ) : (
                <Typography sx={{ textAlign: "center", fontStyle: "italic", color: "#777" }}>
                  Aucune rencontre disponible
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );

};

export default CreateMatch;



