// import React, { useEffect, useState } from "react";
// import * as material from "@mui/material";
// import axios from "axios";

// const OrganizerEventList = ({ organizerId, organizerName, onClose, token }) => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/auth/admin/organizers/${organizerId}/events`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setEvents(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des événements :", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [organizerId, token]);

//   return (
//     <material.Box sx={{ mt: 4 }}>
//       <material.Typography variant="h5" gutterBottom>
//         Événements de {organizerName}
//       </material.Typography>
//       {loading ? (
//         <material.Typography>Chargement des événements...</material.Typography>
//       ) : events.length > 0 ? (
//         <material.TableContainer component={material.Paper}>
//           <material.Table>
//             <material.TableHead>
//               <material.TableRow>
//                 <material.TableCell>Nom</material.TableCell>
//                 <material.TableCell>Lieu</material.TableCell>
//                 <material.TableCell>Date de début</material.TableCell>
//                 <material.TableCell>Date de fin</material.TableCell>
//                 <material.TableCell>Statut</material.TableCell>
//               </material.TableRow>
//             </material.TableHead>
//             <material.TableBody>
//               {events.map((event) => (
//                 <material.TableRow key={event.id_evenement}>
//                   <material.TableCell>{event.nom_event}</material.TableCell>
//                   <material.TableCell>{event.lieu_event}</material.TableCell>
//                   <material.TableCell>
//                     {new Date(event.date_debut).toLocaleDateString()}
//                   </material.TableCell>
//                   <material.TableCell>
//                     {new Date(event.date_fin).toLocaleDateString()}
//                   </material.TableCell>
//                   <material.TableCell>{event.statut_event}</material.TableCell>
//                 </material.TableRow>
//               ))}
//             </material.TableBody>
//           </material.Table>
//         </material.TableContainer>
//       ) : (
//         <material.Typography>Aucun événement trouvé pour cet organisateur.</material.Typography>
//       )}
//       <material.Button
//         onClick={onClose}
//         variant="outlined"
//         color="secondary"
//         sx={{ mt: 2 }}
//       >
//         Retour
//       </material.Button>
//     </material.Box>
//   );
// };

// export default OrganizerEventList;
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Modal,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import SendEmailDialog from "./SendEmailDialog";
import DOMPurify from "dompurify";
import { Visibility, Delete, Notifications } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";

const OrganizerEventList = ({ organizerId, organizerName, onClose, token }) => {
  // States pour gérer les événements, le chargement et la pagination
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4; // Nombre d'événements affichés par page
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Récupération des événements de l'organisateur
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/auth/admin/organizers/${organizerId}/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizerId, token]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3001/api/auth/admin/organizers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrganizers(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des organisateurs :",
          error.response?.data.message || error.message
        );
      }
    };

    fetchOrganizers();
  }, [token]);

  const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = (organizer) => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
  };

  // ouverture & fermeture Modal
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setOpenModal(false);
  };

  // Supprimer un événement
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/organizer/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((event) => event.id_evenement !== id));
        alert("Événement supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression de l’événement:", error);
        alert("Une erreur s’est produite lors de la suppression.");
      }
    }
  };

  // Pagination : Calcul des événements affichés pour la page courante
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Affichage principal
  return (
    <Box sx={{ px: 2 }}>
      {/* Barre supérieure avec le bouton retour et le titre */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: "secondary.main" }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            flexGrow: 1,
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Événements de : {organizerName}
        </Typography>
        <Box sx={{ width: "48px" }} /> {/* Espace pour aligner à gauche */}
      </Box>

      {/* Affichage des événements ou message de chargement */}
      {loading ? (
        <Typography>Chargement des événements...</Typography>
      ) : currentEvents.length > 0 ? (
        <>
          {/* Grille des événements */}
          <Grid container spacing={3}>
            {currentEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id_evenement}>
                <Card>
                  {/* Image de l'événement */}
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.logo_event || "/placeholder.png"}
                    alt={event.nom_event}
                  />
                  <CardContent>
                    {/* Nom de l'événement */}
                    <Typography variant="h6">{event.nom_event}</Typography>

                    {/* Lieu et date de l'événement */}
                    <Typography variant="body2" color="text.secondary">
                      {event.lieu_event} |{" "}
                      {new Date(event.date_debut).toLocaleDateString()} -{" "}
                      {new Date(event.date_fin).toLocaleDateString()}
                    </Typography>

                    {/* Statut de l'événement */}
                    <Typography variant="body2">
                      Statut : {event.statut_event}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                      }}
                    >
                      {/* Voir Détails */}
                      <Tooltip title="Voir Détails">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenModal(event)}
                          sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": { backgroundColor: "primary.dark" },
                            width: 50,
                            height: 50,
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      {/* Supprimer */}
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(event.id_evenement)}
                          sx={{
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                            width: 50,
                            height: 50,
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>

                      {/* Notifications (pour chaque organisateur) */}
                      {organizers.map((organizer, index) => (
                        <Tooltip title="Envoyer Notification" key={index}>
                          <IconButton
                            color="secondary"
                            onClick={() => handleOpenDialog(organizer)}
                            sx={{
                              border: "1px solid",
                              borderColor: "secondary.main",
                              color: "secondary.main",
                              width: 50,
                              height: 50,
                              "&:hover": {
                                backgroundColor: "secondary.light",
                              },
                            }}
                          >
                            <Notifications />
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(events.length / eventsPerPage)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            sx={{ mt: 3, float: "right" }}
          />
        </>
      ) : (
        <Typography>Aucun événement trouvé pour cet organisateur.</Typography>
      )}
      {selectedOrganizer && (
        <SendEmailDialog
          open={openDialog}
          onClose={handleCloseDialog}
          organizer={selectedOrganizer}
          token={token}
        />
      )}

      {/* Modal pour afficher les détails */}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "900px",
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Bouton de fermeture */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedEvent && (
            <>
              {/* Logo et Nom de l'événement */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={selectedEvent.logo_event}
                    alt="Logo"
                    sx={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid #555",
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {selectedEvent.nom_event}
                  </Typography>
                </Box>
              </Box>

              {/* Ligne horizontale */}
              <Box
                sx={{
                  borderBottom: "1px solid #555",
                  marginBottom: 4,
                }}
              />

              {/* Grille principale */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 2,
                }}
              >
                {/* Colonne gauche : Informations principales */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto 1fr",
                    columnGap: "20px",
                    rowGap: "8px",
                    margin: "auto",
                  }}
                >
                  <Typography variant="body1" align="right">
                    <strong>Nom de sport</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.nom_sport}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Type</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.type_event}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Lieu</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.lieu_event}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Participants</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.nbr_participant} ({" "}
                    {selectedEvent.genre_participant} )
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Date Début</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedEvent.date_debut).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Date Fin</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedEvent.date_fin).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Date Création</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {new Date(
                      selectedEvent.date_creationEvent
                    ).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Statut</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.statut_event}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Catégorie</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.categorie_participant}
                  </Typography>

                  <Typography variant="body1" align="right">
                    <strong>Frais d'inscription</strong>
                  </Typography>
                  <Typography variant="body1">:</Typography>
                  <Typography variant="body1">
                    {selectedEvent.frais_inscription} Ar
                  </Typography>
                </Box>

                {/* Colonne droite : Images */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1" gutterBottom align="center">
                      Image d'Accueil
                    </Typography>
                    <Box
                      component="img"
                      src={selectedEvent.images_accueil}
                      alt="Image Accueil"
                      sx={{
                        width: "150px",
                        height: "100px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        backgroundColor: "#222",
                        border: "1px solid #555",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body1" gutterBottom align="center">
                      Image de Contenu
                    </Typography>
                    <Box
                      component="img"
                      src={selectedEvent.images_contenu}
                      alt="Image Contenu"
                      sx={{
                        width: "150px",
                        height: "100px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        backgroundColor: "#222",
                        border: "1px solid #555",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Ligne horizontale avant les descriptions */}
              <Box
                sx={{
                  borderBottom: "1px solid #555",
                  marginTop: 4,
                  marginBottom: 2,
                }}
              />

              {/* Descriptions */}
              <Box>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ marginBottom: "15px" }}
                >
                  <strong>Description Accueil : </strong>{" "}
                  {selectedEvent.description_accueil}
                </Typography>
                <Typography variant="body1">
                  <strong>Description Détail : </strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      selectedEvent.description_detail
                    ),
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default OrganizerEventList;
