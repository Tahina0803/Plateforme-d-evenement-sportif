import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, Button, Grid, Table, TableBody, TableCell, TableRow, Paper, Divider
} from '@mui/material';

const Resultats = () => {
  // États pour stocker les événements, les matchs et les résultats
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [matches, setMatches] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    nom_event: '',
    details: [] // 🔥 On stocke un tableau de phases/journées/tours finaux
  });

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [scores, setScores] = useState({});
  const [points, setPoints] = useState({
    victoire: "",
    defaite: "",
    matchnul: ""
  });
  const [selectedDetail, setSelectedDetail] = useState(null);



  // 🔄 Récupération de la liste des événements au chargement du composant
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/organizer/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEvents(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des événements :", error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // 📡 Récupération des détails de l'événement sélectionné
  useEffect(() => {
    if (!selectedEvent) return;

    const fetchEventDetails = async () => {
      console.log("🚀 fetchEventDetails appelé avec :", selectedEvent);

      const token = localStorage.getItem('token');
      console.log("🔑 Token actuel :", token);

      if (!token) {
        console.error("🚨 Aucun token trouvé, l'utilisateur doit se reconnecter !");
        alert("Votre session a expiré, veuillez vous reconnecter.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/organizer/event/${selectedEvent}/detailsresultats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ Réponse API :", response.data);
        setEventDetails(response.data);
      } catch (error) {
        console.error("❌ Erreur API :", error);
      }
    };

    fetchEventDetails();
  }, [selectedEvent]);

  // 📡 Récupération des matchs de l'événement sélectionné
  useEffect(() => {
    if (!selectedEvent) return;

    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/organizer/event/${selectedEvent}/matches`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMatches(response.data || []);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des matchs :", error);
        setMatches([]);
      }
    };

    fetchMatches();
  }, [selectedEvent]);

  // 🎯 Gestion du changement d'événement sélectionné
  const handleEventChange = (eventId) => {
    console.log("🔍 Événement sélectionné :", eventId);
    setSelectedEvent(eventId);
  };
  console.log("📌 Contenu de filteredMatches :", filteredMatches);

  const fetchFilteredMatches = async (selectedPhase, selectedJournee, selectedTourFinal) => {
    if (!selectedEvent) return;

    try {
      const response = await axios.get(`http://localhost:3001/api/organizer/event/${selectedEvent}/filtered-matches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: {
          phase: selectedPhase || '',
          journee: selectedJournee || '',
          tour_final: selectedTourFinal || '',
        }
      });

      console.log("✅ Rencontres filtrées :", response.data);
      setFilteredMatches(response.data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des rencontres filtrées :", error);
      setFilteredMatches([]);
    }
  };

  const saveResults = async () => {
    if (!selectedEvent) return alert("Veuillez sélectionner un événement.");

    const formattedResults = filteredMatches.map(match => ({
      id_rencontre: match.id_rencontre,
      score_A: scores[match.id_rencontre]?.score_A || 0,
      score_B: scores[match.id_rencontre]?.score_B || 0,
      phase: match.phase,
      tour_final: match.tour_final
    }));

    try {
      const response = await axios.post(
        `http://localhost:3001/api/organizer/event/${selectedEvent}/save-results`,
        {
          results: formattedResults,
          point_victoire: points.victoire,
          point_defaite: points.defaite,
          point_matchnul: points.matchnul
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      console.log("✅ Résultats enregistrés :", response.data);

      // 🔹 Vérifier les résultats ignorés et afficher une alerte
      if (response.data.ignored.length > 0) {
        alert(`Certains résultats existent déjà et n'ont pas été enregistrés.`);
      } else {
        alert("Résultats enregistrés avec succès !");

        // 🔥 Réinitialiser les champs après l'enregistrement
        setPoints({
          victoire: "",
          defaite: "",
          matchnul: ""
        });

        setScores({});
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement des résultats.");
    }
  };

  const handleScoreChange = (matchId, field, value) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: {
        ...prevScores[matchId],
        [field]: value
      }
    }));
  };

  const isPhaseDisabled = () => {
    return filteredMatches.some(match =>
      ["Finale", "Barrage", "Aller Retour"].includes(match.phase)
    );
  };

  const handleSelection = (phase, journee, tourFinal, index) => {
    setSelectedDetail(index); // Stocke l'index de l'élément cliqué
    fetchFilteredMatches(phase, journee, tourFinal);
  };

  return (
    <Box sx={{ width: "100%", padding: "10px", margin: "auto" }}>
      {/* Titre principal */}
      <Typography variant="h5" sx={{
        textAlign: 'center', mb: { xs: 3, md: 6 }, fontWeight: 'bold'
      }}
      >        Ajouter des résultats
      </Typography>

      <Grid container spacing={2}>
        {/* Colonne Gauche - Sélection et Affichage des rencontres */}
        <Grid item xs={12} sm={12} md={5} lg={5} sx={{ borderRight: { md: "2px solid #ddd" }, paddingRight: { md: "20px" } }}>          {/* Sélection de l'événement */}
          <FormControl fullWidth sx={{ mb: 4 }}>
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

          {/* Affichage des détails de l'événement sélectionné */}
          {selectedEvent && (
            <Paper elevation={2} sx={{ padding: 2, maxWidth: "100%" }}>
              {/* Nom de l'événement */}
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: 'left' }}>
                {eventDetails.nom_event}
              </Typography>

              {/* Détails des phases, journées et tours finaux sous forme de liste */}
              {eventDetails.details.map((detail, index) => {
                // Vérifier si les valeurs sont nulles, "0", ou 0
                const phase = detail.phase && detail.phase !== "0" ? detail.phase : null;
                const journee = detail.journee && detail.journee !== "0" && detail.journee !== 0 ? detail.journee : null;
                const tourFinal = detail.tour_final && detail.tour_final !== "0" && detail.tour_final !== 0 ? detail.tour_final : null;

                // Ne pas afficher si tout est vide
                if (!phase && !journee && !tourFinal) {
                  return null;
                }

                return (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      cursor: "pointer",
                      transition: "background-color 0.3s ease-in-out",
                      backgroundColor: selectedDetail === index ? "#EDF4FC" : "transparent", // Jaune si actif
                      color: selectedDetail === index ? "blue" : "", // Jaune si actif
                      ":hover": { backgroundColor: "" } // Gris clair au survol
                    }}
                    onClick={() => handleSelection(phase, journee, tourFinal, index)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "14px",
                        padding: "8px 0px 8px 10px",
                        borderBottom: "1px solid #ccc",
                        textAlign: "left"
                      }}
                    >
                      {phase && <><strong>Phase :</strong> {phase}</>}
                      {journee && <><span style={{ padding: "0 15px" }}>||</span><strong>Journée :</strong> {journee}</>}
                      {tourFinal && <><span style={{ padding: "0 15px" }}>||</span><strong>Tour Final :</strong> {tourFinal}</>}
                    </Typography>
                  </Box>

                );
              })}
            </Paper>
          )}


        </Grid>

        {/* Colonne Droite - Entrée des résultats */}
        <Grid item xs={12} sm={12} md={7} lg={7} sx={{ paddingLeft: { md: "10px" } }}>          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Points </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Victoire"
                type="number"
                value={points.victoire}
                onChange={(e) => setPoints({ ...points, victoire: e.target.value })}
                disabled={isPhaseDisabled()} // 🔹 Désactiver si la phase est Finale, Barrage ou Aller Retour
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Défaite"
                type="number"
                value={points.defaite}
                onChange={(e) => setPoints({ ...points, defaite: e.target.value })}
                disabled={isPhaseDisabled()} // 🔹 Désactiver si la phase est Finale, Barrage ou Aller Retour
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Match nul"
                type="number"
                value={points.matchnul}
                onChange={(e) => setPoints({ ...points, matchnul: e.target.value })}
                disabled={isPhaseDisabled()} // 🔹 Désactiver si la phase est Finale, Barrage ou Aller Retour
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Scores </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: "8px", // Réduit l'espace à l'intérieur du Paper
              margin: "5px 0", // Ajoute un léger espacement autour du Paper
              maxHeight: "300px", // Hauteur maximale du tableau
              overflowY: "auto" // Ajoute un scroll vertical si nécessaire
            }}
          >
            <Table sx={{ minWidth: "100%", borderCollapse: "collapse" }}> {/* Ajustement du tableau */}
              <TableBody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => {
                    console.log("✅ Match ID:", match.id_rencontre, "Participant A:", match.participant_a, "Participant B:", match.participant_b);

                    return (
                      <TableRow key={match.id_rencontre} sx={{ height: "40px" }}> {/* Ajuste la hauteur de chaque ligne */}
                        <TableCell align="right" sx={{ padding: "6px 8px" }}> {/* Ajuste le padding des cellules */}
                          {match.participant_a}
                        </TableCell>
                        <TableCell align="center" sx={{ padding: "6px" }}>
                          <TextField
                            type="number"
                            variant="outlined" // Peut aussi être "filled" ou "standard"
                            sx={{
                              width: "60px", // Largeur du champ de texte
                              height: "40px", // Hauteur totale du composant TextField
                              "& .MuiInputBase-root": { height: "40px" }, // Ajuste la hauteur de l'input
                              "& .MuiInputBase-input": { padding: "9px", fontSize: "14px" } // Ajuste l'intérieur de l'input
                            }}
                            inputProps={{
                              style: {
                                height: "20px", // Hauteur réelle du texte saisi
                                textAlign: "center" // Centrer le texte dans l'input
                              }
                            }}
                            value={scores[match.id_rencontre]?.score_A || ""}
                            onChange={(e) => handleScoreChange(match.id_rencontre, "score_A", e.target.value)}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ padding: "6px" }}>-</TableCell>
                        <TableCell align="center" sx={{ padding: "6px" }}>
                          <TextField
                            type="number"
                            variant="outlined" // Peut aussi être "filled" ou "standard"
                            sx={{
                              width: "60px", // Largeur du champ de texte
                              height: "40px", // Hauteur totale du composant TextField
                              "& .MuiInputBase-root": { height: "40px" }, // Ajuste la hauteur de l'input
                              "& .MuiInputBase-input": { padding: "px", fontSize: "14px" } // Ajuste l'intérieur de l'input
                            }}
                            inputProps={{
                              style: {
                                height: "20px", // Hauteur réelle du texte saisi
                                textAlign: "center" // Centrer le texte dans l'input
                              }
                            }}
                            value={scores[match.id_rencontre]?.score_B || ""}
                            onChange={(e) => handleScoreChange(match.id_rencontre, "score_B", e.target.value)}
                          />
                        </TableCell>

                        <TableCell align="left" sx={{ padding: "6px 8px" }}>
                          {match.participant_b}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ padding: "10px" }}>Aucune rencontre trouvée</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>



          {/* Bouton Enregistrer */}
          <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "right" }, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "10px 20px", width: { xs: "100%", sm: "auto" } }} // ✅ Pleine largeur sur mobile
              onClick={saveResults}
            >
              Enregistrer les résultats
            </Button>
          </Box>

        </Grid>
      </Grid>
    </Box>
  );
};

export default Resultats;

