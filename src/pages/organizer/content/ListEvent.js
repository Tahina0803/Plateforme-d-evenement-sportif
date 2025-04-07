import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import UpdateEvent from './UpdateEvent'; // Importer le composant UpdateEvent
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Modal,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate



// Thème sombre
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    error: {
      main: '#e53935',
    },
    background: {
      default: '#121212', // Couleur de fond par défaut
      paper: '#1e1e1e', // Couleur de fond des cartes
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Appliquez une police fixe
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          margin: '0',
          padding: '0',
          justifyContent: 'center', // Centre les éléments dans la grille
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          boxSizing: 'border-box', // Fixe la taille des Box
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          textAlign: 'center', // Centre le texte dans les cartes
        },
      },
    },
  },
});


const OrganizerEvents = () => {
  const navigate = useNavigate(); // Initialiser navigate
  const selectedEventRef = useRef(null); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); // ID de l'événement sélectionné pour modification
  const [openEditModal, setOpenEditModal] = useState(false); // Contrôle du modal d'édition
  
  
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return { backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' };
      case 'a venir':
        return { backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' };
      case 'terminé':
        return { backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' };
      default:
        return { backgroundColor: 'gray', color: 'white', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' };
    }
  };

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/organizer/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  
  useEffect(() => {
    console.log("🎯 selectedEvent mis à jour :", selectedEvent);
  }, [selectedEvent]);


  const refreshEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3001/api/organizer/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des événements:', error);
    }
  };

  // Ouvrir le modal pour afficher les détails d'un événement
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setOpenModal(false);
  };

  // Ouvrir le modal pour modification
  const handleOpenEditModal = (eventId) => {
    setSelectedEventId(eventId);
    setOpenEditModal(true);
  };

  // Fermer le modal
  const handleCloseEditModal = () => {
    setSelectedEventId(null);
    setOpenEditModal(false);
  };


  // Supprimer un événement
  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/api/organizer/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((event) => event.id_evenement !== id));
        alert('Événement supprimé avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression de l’événement:', error);
        alert('Une erreur s’est produite lors de la suppression.');
      }
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Typography color="text.primary" align="center">
          Chargement des événements...
        </Typography>
      </ThemeProvider>
    );
  }


  const parsedTickets = (() => {
    const event = selectedEvent || selectedEventRef.current; // Priorité à selectedEvent, sinon utiliser la référence
    if (!event || !event.types_tickets) {
      return [];
    }

    let tickets = event.types_tickets;
    console.log("🛠 Tickets bruts depuis l'événement :", tickets);

    if (typeof tickets === "string") {
      try {
        tickets = JSON.parse(tickets);  // Premier parsing
        if (typeof tickets === "string") {
          tickets = JSON.parse(tickets);  // Deuxième parsing si nécessaire
        }
      } catch (error) {
        console.error("❌ Erreur lors du parsing des tickets :", error);
        return [];
      }
    }

    console.log("✅ Tickets après parsing :", tickets);
    return Array.isArray(tickets) ? tickets : [];
  })();


  return (
    <ThemeProvider theme={darkTheme} >
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Centrer les cartes
        gap: 2, // Espacement uniforme
        maxWidth: '1200px', // Largeur fixe pour tous
        margin: '0 auto', // Centrer sur la page
        padding: '15px', // Ajout d'un padding pour éviter les coupures
      }}>
        <Typography variant="h4" gutterBottom align="center" color="text.primary">
          Mes Évènements
        </Typography>
        {events.length > 0 ? (
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id_evenement} sx={{

              }}>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    '&:hover .event-icons': {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Contenu de l'événement */}
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'background.paper',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      textAlign: 'center',
                      padding: '10px',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.4)',
                      },
                      cursor:'pointer',
                    }}
                    
                    onClick={() => handleOpenModal(event)} // Ouvre le modal avec les détails de l'événement
                   
                   >
                    {/* Logo */}
                    <Box
                      component="img"
                      src={event.logo_event}
                      alt="Logo de l'événement"
                      sx={{
                        width: '80px',
                        height: '80px',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        objectFit: 'contain',
                        display: 'block',
                        mx: 'auto', // Centrer l'image
                      }}
                    />
                    <Typography color="text.primary">
                      {event.nom_event}
                    </Typography>
                  </Box>


                  {/* Icônes */}
                  <Box
                    className="event-icons"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >

                    <Tooltip title="Modifier" arrow>
                      <IconButton
                        onClick={() => handleOpenEditModal(event.id_evenement)} // Ouvre le modal avec l'ID de l'événement
                        sx={{ color: 'blue' }}
                      >
                        <EditIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer" arrow>
                      <IconButton
                        onClick={() => handleDelete(event.id_evenement)}
                        sx={{ color: 'red' }}
                      >
                        <DeleteIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary" sx={{ width: '100%' }}>
            Aucun événement trouvé.
          </Typography>

        )}


        {/* Modal pour la modification */}
        <Modal
          open={openEditModal}
          onClose={handleCloseEditModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Box
            sx={{
              width: '90%',
              maxWidth: '800px',
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
              position: 'relative', // Pour positionner le bouton "X"
            }}
          >
            {/* Bouton de fermeture */}
            <IconButton
              onClick={handleCloseEditModal}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: 'grey.500',
              }}
            >
              <CloseIcon />
            </IconButton>

            {selectedEventId && (
              <UpdateEvent
                eventId={selectedEventId}
                onClose={handleCloseEditModal}
                refreshEvents={refreshEvents} // fonction pour recharger la liste
              />
            )}
          </Box>
        </Modal>



        {/* Modal pour afficher les détails */}


        <Modal
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Box
            sx={{
              width: '90%',
              maxWidth: '900px',
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Bouton de fermeture */}
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'grey.500',
              }}
            >
              <CloseIcon />
            </IconButton>

            {selectedEvent && (
              <>
                {/* Logo et Nom de l'événement */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Ajout pour séparer le statut à droite
                    marginBottom: 2,
                  }}
                >
                  {/* Conteneur pour le logo et le nom */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {/* Logo */}
                    <Box
                      component="img"
                      src={selectedEvent.logo_event}
                      alt="Logo"
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #555',
                      }}
                    />

                    {/* Nom de l'événement */}
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {selectedEvent.nom_event}
                    </Typography>
                  </Box>

                  {/* Statut à droite */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span style={getStatusStyle(selectedEvent.statut_event)}>
                      {selectedEvent.statut_event}
                    </span>
                  </Box>
                </Box>


                {/* Ligne horizontale */}
                <Box
                  sx={{
                    borderBottom: '1px solid #555',
                    marginBottom: 4,
                  }}
                />

                {/* Grille principale */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: 2,
                  }}
                >
                  {/* Colonne gauche : Informations principales */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto auto 1fr',
                      columnGap: '20px',
                      rowGap: '8px',
                      margin: 'auto',
                    }}
                  >
                    <Typography variant="body1" align="right"><strong>Nom de sport</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{selectedEvent.nom_sport}</Typography>

                    <Typography variant="body1" align="right"><strong>Type</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{selectedEvent.type_event}</Typography>

                    <Typography variant="body1" align="right"><strong>Lieu</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{selectedEvent.lieu_event}</Typography>

                    <Typography variant="body1" align="right"><strong>Participants</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{selectedEvent.nbr_participant} ( {selectedEvent.genre_participant} )</Typography>

                    <Typography variant="body1" align="right"><strong>Date Début</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{new Date(selectedEvent.date_debut).toLocaleDateString()}</Typography>

                    <Typography variant="body1" align="right"><strong>Date Fin</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{new Date(selectedEvent.date_fin).toLocaleDateString()}</Typography>

                    <Typography variant="body1" align="right"><strong>Date Création</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{new Date(selectedEvent.date_creationEvent).toLocaleDateString()}</Typography>

                    <Typography variant="body1" align="right"><strong>Catégorie</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{selectedEvent.categorie_participant}</Typography>

                    <Typography variant="body1" align="right"><strong>Frais d'inscription</strong></Typography>
                    <Typography variant="body1">:</Typography>
                    <Typography variant="body1">{selectedEvent.frais_inscription} Ar</Typography>
                  </Box>

                  {/* Colonne droite : Images */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
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
                          width: '150px',
                          height: '100px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          backgroundColor: '#222',
                          border: '1px solid #555',
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
                          width: '150px',
                          height: '100px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          backgroundColor: '#222',
                          border: '1px solid #555',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

{/* Tickets disponibles */}
                {/* Tickets disponibles bien structurés */}
                <Box sx={{ marginTop: 2, width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Billet disponible :
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      marginTop: 1,
                      width: '100%',
                      padding: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                    }}
                    
                  >
                    {parsedTickets && parsedTickets.length > 0 ? (
                      parsedTickets.map((ticket, index) => {
                        console.log("🔍 Ticket après parsing :", ticket); // Vérification

                        return (
                          <Box
                            key={index}
                            sx={{
                              padding: '10px',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              gap: "20px",
                              borderBottom: index !== parsedTickets.length - 1 ? '1px solid #ddd' : 'none',
                            }}
                            
                          >
                            <Typography variant="body1" >
                              <strong>Type :</strong> {ticket.type_ticket || ticket.type || "Non spécifié"}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Prix :</strong> {ticket.prix_ticket || ticket.prix || "0"} Ar
                            </Typography>
                            <Typography variant="body1">
                              <strong>Quantité :</strong> {ticket.nbr_ticket_disponible || ticket.quantite || "0"}
                            </Typography>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        Aucun ticket disponible.
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Ligne horizontale avant les descriptions */}
                <Box
                  sx={{
                    borderBottom: '1px solid #555',
                    marginTop: 4,
                    marginBottom: 2,
                  }}
                />

                {/* Descriptions */}
                <Box>
                  <Typography variant="body1" gutterBottom sx={{ marginBottom: '15px' }}>
                    <strong>Description Accueil :   </strong> {selectedEvent.description_accueil}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Description Détail :   </strong>
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: 'pre-line' }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedEvent.description_detail),
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        </Modal>




      </Box>
    </ThemeProvider>
  );
};

export default OrganizerEvents;











