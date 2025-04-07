
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Grid,
  Divider,
  Button, // ✅ Ajout de l'importation de Button
} from "@mui/material";

const baseURL = "http://localhost:3001"; // ⚠️ URL de ton backend

// Fonction pour gérer la couleur du statut
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "en cours":
      return "green"; // ✅ Vert pour "en cours"
    case "à venir":
      return "blue"; // ✅ Bleu pour "à venir"
    case "terminé":
      return "red"; // ✅ Rouge pour "terminé"
    default:
      return "gray"; // ✅ Gris par défaut
  }
};

const MesInscriptions = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("📌 Token envoyé dans l'en-tête:", token);
            
            if (!token) {
                console.error("❌ Erreur: Aucun token trouvé.");
                alert("Vous devez vous reconnecter.");
                return;
            }

            const response = await axios.get(`${baseURL}/api/participant/events`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Événements récupérés :", response.data);

            setEvents(response.data);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des événements inscrits :", error);
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
}, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // ✅ Déplacer handleUnsubscribe **dans** MesInscriptions
  const handleUnsubscribe = async () => {
    if (!selectedEvent) return;

    const confirmUnsubscribe = window.confirm(
      `Êtes-vous sûr de vouloir annuler votre inscription à "${selectedEvent.nom_event}" ?`
    );

    if (!confirmUnsubscribe) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez vous reconnecter.");
        return;
      }

      console.log(`🔍 Annulation de l'inscription à l'événement ID: ${selectedEvent.id_evenement}`);

      const response = await axios.delete(
        `${baseURL}/api/participant/unsubscribe/${selectedEvent.id_evenement}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Réponse serveur :", response.data);

      alert("Votre inscription a été annulée avec succès.");

      // Mettre à jour la liste en supprimant l'événement annulé
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id_evenement !== selectedEvent.id_evenement)
      );

      setSelectedEvent(null); // Désélectionner l'événement
    } catch (error) {
      console.error("❌ Erreur lors de l'annulation de l'inscription :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      {/* ✅ TITRE FIXE AU-DESSUS DE TOUTES LES GRIDS */}
      <Box sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        py: 2,
        mb: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          MES INSCRIPTIONS
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ px: 2, justifyContent: "center" }}>
        {/* ✅ Colonne gauche : Liste des événements */}
        <Grid
          item
          xs={12}
          md={selectedEvent ? 5 : 12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              maxWidth: 500,
              width: "100%",
              borderRadius: "3px",
              textAlign: "center",
            }}
          >
            {events.length === 0 ? (
              <Typography color="error" align="center">
                Vous n'êtes inscrit à aucun événement.
              </Typography>
            ) : (
              <List>
                {events.map((event) => (
                  <ListItem
                    key={event.id_evenement}
                    divider
                    button
                    onClick={() => handleEventClick(event)}
                    sx={{
                      backgroundColor: selectedEvent?.id_evenement === event.id_evenement ? "#f0f0f0" : "transparent",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                      borderRadius: "0px",
                      padding: "5px",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={event.logo_event}
                        alt={event.nom_event}
                        sx={{ width: 30, height: 30 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: "bold" }}>{event.nom_event}</Typography>}
                      secondary={
                        <>
                          <Typography sx={{ display: "inline", fontSize: "12px", color: "#888" }}>
                            {new Date(event.date_debut).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </Typography>
                          {"   ||   "}
                          <Typography sx={{ display: "inline", fontSize: "12px", color: "#888" }}>
                            {event.lieu_event}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* ✅ Colonne droite : Détails de l'événement sélectionné */}
        {selectedEvent && (
          <>
            {/* Barre de séparation */}
            <Grid item xs={12} md={0.1} sx={{ display: "flex", justifyContent: "center" }}>
            </Grid>

            {/* ✅ Section de détails */}
            <Grid item xs={12} md={6.4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: "3px", position: "relative" }}>


                <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "left" }}>{selectedEvent.description_accueil}</Typography>

                {/* ✅ Statut avec Badge en haut à droite */}
                <Box sx={{ position: "absolute", top: 20, right: 15 }} display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography
                    sx={{
                      backgroundColor: getStatusColor(selectedEvent.statut_event),
                      color: "white",
                      borderRadius: "15px",
                      px: 2,
                      py: 0.5,
                      fontSize: "14px",
                    }}
                  >
                    {selectedEvent.statut_event}
                  </Typography>
                </Box>

                {/* ✅ Infos principales */}
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: "35% 2% 63%", // ✅ Ajuste la largeur des colonnes
                  alignItems: "center",
                  gap: "10px 20px",
                  mt: 3
                }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right" }}>Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>:</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{selectedEvent.type_event}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right" }}>Participants</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>:</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{selectedEvent.nbr_participant} ({selectedEvent.genre_participant})</Typography>

                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right" }}>Date Début</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>:</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{new Date(selectedEvent.date_debut).toLocaleDateString("fr-FR")}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right" }}>Date Fin</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>:</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{new Date(selectedEvent.date_fin).toLocaleDateString("fr-FR")}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right" }}>Catégorie</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>:</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{selectedEvent.categorie_participant}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right" }}>Frais d'inscription</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>:</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{selectedEvent.frais_inscription} Ar</Typography>
                </Box>



                {/* ✅ Ligne de séparation */}
                <Box sx={{ borderTop: "1px solid #ddd", mt: 2, pt: 2 }}>
                  <Typography variant="body2" sx={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: selectedEvent.description_detail }} />
                </Box>
                <Box mt={3} display="flex" justifyContent="flex-start">
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ width: "auto", px: 2 }} // Ajuste la taille et l'espacement interne
                    onClick={handleUnsubscribe}
                  >
                    Annuler l'inscription
                  </Button>
                </Box>

              </Paper>
            </Grid>

          </>
        )}
      </Grid>
    </Box>
  );
};

export default MesInscriptions;






