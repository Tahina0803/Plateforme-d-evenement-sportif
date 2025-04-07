import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import  { DeleteOutline } from '@mui/icons-material';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Button, IconButton, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const groupResultsByPhaseAndTour = (results) => {
  if (!Array.isArray(results)) {
    return {};
  }

  return results.reduce((acc, match) => {
    let groupKey = `${match.nom_event} | ${match.phase}`;
    let details = [];

    if (match.journee && match.journee !== 'N/A' && match.journee !== 0) {
      details.push(`Journée: ${match.journee}`);
    }

    if (match.tour_final && match.tour_final !== 'N/A' && match.tour_final !== 0) {
      details.push(`Tour Final: ${match.tour_final}`);
    }

    if (details.length > 0) {
      groupKey += ` | ${details.join(' | ')}`;
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(match);
    return acc;
  }, {});
};

const ResultatRencontre = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newScoreA, setNewScoreA] = useState('');
  const [newScoreB, setNewScoreB] = useState('');

  const fetchAllResults = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/organizer/all-resultats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (typeof response.data === "object" && response.data !== null) {
        const extractedResults = Object.values(response.data).flat();
        setAllResults(extractedResults);
        setResults(extractedResults);
      } else {
        setAllResults([]);
        setResults([]);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des résultats :", error);
      setAllResults([]);
      setResults([]);
    }
  };

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
    fetchAllResults();
  }, []);

  const fetchResults = async (eventId) => {
    if (!eventId) {
      setResults(allResults);
      return;
    }
    setLoadingResults(true);

    try {
      const response = await axios.get(`http://localhost:3001/api/organizer/event/${eventId}/resultats/filtered`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (typeof response.data === "object" && response.data !== null) {
        const extractedResults = Object.values(response.data).flat();
        setResults(extractedResults);
      } else {
        setResults([]);
      }

    } catch (error) {
      console.error("❌ Erreur lors de la récupération des résultats :", error);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleEventChange = async (eventId) => {
    setSelectedEvent(eventId);

    if (eventId === "") {
      if (allResults.length > 0) {
        setResults(allResults);
      } else {
        await fetchAllResults();
      }
    } else {
      await fetchResults(eventId);
    }
  };

  const handleEditClick = (match) => {
    console.log("🔍 Match sélectionné :", match);

    if (!match.id_rencontre) {
      console.error("❌ Erreur : L'ID du match est introuvable !");
    } else {
      console.log("✅ ID du match :", match.id_rencontre);
    }

    setSelectedMatch(match);
    setNewScoreA(match.score_A);
    setNewScoreB(match.score_B);
    setOpenModal(true);
  };


  const handleUpdateScore = async () => {
    if (!selectedMatch || !selectedMatch.id_rencontre) {
      alert("Erreur : ID du match introuvable !");
      return;
    }

    console.log("🛠️ Mise à jour du match :", selectedMatch);
    console.log("📡 URL de la requête :", `http://localhost:3001/api/organizer/match/${selectedMatch.id_rencontre}/update-score`);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/organizer/match/${selectedMatch.id_rencontre}/update-score`,
        { score_A: newScoreA, score_B: newScoreB },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        alert("✅ Score mis à jour avec succès !");
        fetchAllResults();
        setOpenModal(false);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du score :", error);
      alert("Erreur lors de la mise à jour du score.");
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (!resultId) {
      console.error("❌ Erreur : L'ID du résultat est introuvable !");
      alert("Erreur : ID du résultat introuvable !");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce résultat ?")) {
      return;
    }

    console.log("🛠️ Suppression du résultat avec ID :", resultId);
    console.log("📡 URL de la requête :", `http://localhost:3001/api/organizer/match/resultat/${resultId}/delete`);

    try {
      const response = await axios.delete(
        `http://localhost:3001/api/organizer/match/resultat/${resultId}/delete`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        alert("✅ Résultat supprimé avec succès !");
        fetchAllResults(); // Rafraîchir la liste après suppression
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du résultat :", error);
      alert("Erreur lors de la suppression du résultat.");
    }
  };



  return (
    <Box
      sx={{
        padding: { xs: "0px 8px", sm: "0px 16px", md: "0px 32px", lg: "0px 48px" }, // Padding dynamique
        width: "100%", // Toujours 100% de largeur
        maxWidth: "1400px", // Évite d'être trop large sur grand écran
        margin: "0 auto", // Centre le contenu sur les grands écrans
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: { xs: 1, sm: 2 }, // Espacement plus petit sur mobile
          fontSize: { xs: "20px", sm: "24px", md: "28px", lg: "32px" }, // Taille dynamique
          fontWeight: "bold", // Met en valeur le titre
          color: "primary", // Adapte la couleur au thème
        }}
      >
        Résultats des Rencontres
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: { xs: 2, sm: 3 }, // Espacement réduit sur mobile
          px: { xs: 1, sm: 2, md: 3 }, // Padding latéral pour éviter que l'élément touche les bords
          flexWrap: "wrap", // Permet de s'adapter aux petits écrans
        }}
      >
        <FormControl
          sx={{
            width: { xs: "100%", sm: "80%", md: 300 }, // Largeur adaptée à l'écran
            maxWidth: 400, // Empêche que le champ soit trop large
          }}
        >
          <InputLabel>Choisir un événement</InputLabel>
          <Select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            label="Choisir un événement"
          >
            <MenuItem value="">Tous les événements</MenuItem>
            {loadingEvents ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : events.length > 0 ? (
              events.map((event) => (
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

      {loadingResults ? (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 2 }} />
      ) : results.length > 0 ? (
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {Object.entries(groupResultsByPhaseAndTour(results)).map(([groupKey, matches], index) => {
            const parts = groupKey.split(" | ");
            const nomEvent = parts[0];
            const phase = parts[1] || "";
            const journee = parts.find((p) => p.startsWith("Journée")) || "";
            const tourFinal = parts.find((p) => p.startsWith("Tour Final")) || "";

            return (
              <Box key={index} sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  }}
                >
                  {nomEvent}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: "left",
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: "10px", sm: "12px", md: "14px" },
                  }}
                >
                  <b>Phase :</b> {phase} {journee && `| ${journee}`} {tourFinal && `| ${tourFinal}`}
                </Typography>

                <TableContainer component={Paper} sx={{ mb: 2, overflowX: "auto", width: "100%" }}>
                  <Table sx={{ minWidth: { xs: 600, sm: 800, md: 900 }, tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                        <TableCell sx={{ textAlign: "center",borderRight:"2px solid white",color:"black", fontWeight: "bold", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "5%" }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ textAlign: "center",borderRight:"2px solid white",color:"black", fontWeight: "bold", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "5%" }}>
                          Heure
                        </TableCell>
                        <TableCell sx={{ textAlign: "center",borderRight:"2px solid white",color:"black", fontWeight: "bold", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "25%" }} colSpan={3}>
                          Résultats
                        </TableCell>
                        <TableCell sx={{ textAlign: "center",borderRight:"2px solid white",color:"black", fontWeight: "bold", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "10%" }}>
                          Lieu
                        </TableCell>
                        <TableCell sx={{ textAlign: "center",borderRight:"2px solid white",color:"black", fontWeight: "bold", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "10%" }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matches.map((match, i) => (
                        <TableRow key={match.id_rencontre || i} sx={{ backgroundColor: i % 2 === 0 ? "white" : "#f5f5f9" }}>
                          <TableCell sx={{ textAlign: "center", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "15%", color:"black" }}>
                            {new Date(match.date_rencontre).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "10%", color:"black" }}>
                            {match.heure_rencontre ? match.heure_rencontre.split(":").slice(0, 2).join(":") : "--:--"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "25%", color:"black" }}>
                            {match.participant_a}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", color: "red", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "5%" }}>
                            {match.score_A} - {match.score_B}
                          </TableCell>
                          <TableCell sx={{ textAlign: "left", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "25%", color:"black" }}>
                            {match.participant_b}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", fontSize: { xs: "9px", sm: "12px" }, padding: "5px 0px", width: "20%", color:"black" }}>
                            {match.lieu_rencontre}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", padding: "5px 0px", width: "15%" }}>
                            <IconButton size="small" color="primary" onClick={() => handleEditClick(match)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteResult(match.id_resultat)}>
                            <DeleteOutline fontSize="small"/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={{ textAlign: "center", fontSize: { xs: "14px", sm: "16px" }, mt: 2 }}>
          Aucun résultat disponible
        </Typography>
      )}


      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 400, md: 500 }, // Largeur responsive
            maxWidth: "95vw", // Empêche que la modal dépasse sur mobile
            bgcolor: "background.paper",
            padding: { xs: "24px 16px", sm: "32px 24px" }, // Padding réduit sur mobile
            boxShadow: 24,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 1.5, sm: 2 }, // Espacement ajusté
              fontWeight: "bold",
              fontSize: { xs: "18px", sm: "20px" }, // Taille responsive
            }}
          >
            Modifier le score
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: { xs: 2, sm: 3 }, // Espacement ajusté
              flexWrap: "wrap",
              gap: { xs: 1, sm: 2 }, // Évite le chevauchement sur mobile
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "12px", sm: "14px" }, // Taille réduite sur mobile
                flex: 1,
                textAlign: "right",
              }}
            >
              {selectedMatch?.participant_a || "Modifier le score"}
            </Typography>

            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={newScoreA}
              onChange={(e) => setNewScoreA(e.target.value)}
              sx={{
                width: { xs: 60, sm: 75 }, // Réduction sur mobile
                mx: 1,
                "& input": { textAlign: "center", fontSize: "16px", fontWeight: "bold" },
              }}
            />

            <Typography sx={{ fontWeight: "bold", fontSize: { xs: "16px", sm: "18px" }, mx: 1 }}>-</Typography>

            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={newScoreB}
              onChange={(e) => setNewScoreB(e.target.value)}
              sx={{
                width: { xs: 60, sm: 75 }, // Réduction sur mobile
                mx: 1,
                "& input": { textAlign: "center", fontSize: "16px", fontWeight: "bold" },
              }}
            />

            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "12px", sm: "14px" }, // Taille ajustée
                flex: 1,
                textAlign: "left",
              }}
            >
              {selectedMatch?.participant_b || "Modifier le score"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 1, sm: 2 } }}>
            <Button
              variant="outlined"
              sx={{
                minWidth: { xs: 80, sm: 100 }, // Bouton plus petit sur mobile
                fontSize: { xs: "12px", sm: "14px" },
              }}
              onClick={() => setOpenModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: { xs: 80, sm: 100 }, // Bouton ajusté
                fontSize: { xs: "12px", sm: "14px" },
              }}
              onClick={handleUpdateScore}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>

  );
};

export default ResultatRencontre;
