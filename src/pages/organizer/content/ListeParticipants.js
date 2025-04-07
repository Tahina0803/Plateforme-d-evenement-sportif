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
  DialogContentText,
  DialogTitle,
  InputLabel,
  FormControl,
  useMediaQuery, useTheme
} from '@mui/material';

const OrganizerEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [allParticipants, setAllParticipants] = useState([]); // Stocke tous les participant
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    const fetchEventsAndParticipants = async () => {
      const token = localStorage.getItem('token');
      try {
        // Récupération des événements
        const eventsResponse = await axios.get('http://localhost:3001/api/organizer/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(eventsResponse.data);

        // Récupération de tous les participants liés aux événements de l'organisateur
        const participantsResponse = await axios.get('http://localhost:3001/api/organizer/participants/all', {
          headers: { Authorization: `Bearer ${token}` },
        });


        setAllParticipants(participantsResponse.data); // Stocker tous les participants
        setParticipants(participantsResponse.data); // Afficher tous les participants au départ
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEventsAndParticipants();
  }, []);


  // Ouvrir la boîte de dialogue de confirmation
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  // Fermer la boîte de dialogue de confirmation
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvent(eventId);

    if (eventId === '') {
      setParticipants(allParticipants); // Si aucun événement sélectionné, afficher tous les participants
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

      // Stocker les données du participant avec son équipe
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

  const handleConfirmDelete = async () => {
    if (!selectedParticipant) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/api/organizer/participants/${selectedParticipant.id_participant}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipants(participants.filter(p => p.id_participant !== selectedParticipant.id_participant));
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error);
    } finally {
      handleCloseDialog();
      handleCloseConfirmDialog();
    }
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

      <Box sx={{ borderBottom: "2px solid #1976d2", marginBottom: 4, marginTop: 2 }} />

      {loadingParticipants ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : participants.length === 0 ? (
        <Typography align="center" sx={{ color: "#888" }}>
          Aucun participant disponible
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {participants.map(participant => (
            <Grid item key={participant.id_participant}>
              <Box
                sx={{
                  width: '190px',
                  color: 'black',
                  padding: 1,
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: "background-color 0.3s",
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                  cursor: "pointer"
                }}
                onClick={() => handleViewParticipant(participant.id_participant)}
              >
                <Typography sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {participant.nom_part}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal pour afficher les détails du participant */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={isMobile ? "xs" : "sm"} // S'adapte aux petits écrans
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: isMobile ? '1.1rem' : '1.5rem' }}>
          Détails du participant
        </DialogTitle>
        {selectedParticipant ? (
          <>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { label: "Nom du participant", value: selectedParticipant.nom_part },
                  { label: "Nom de l'équipe", value: selectedParticipant.nom_equipe || "Aucune équipe" },
                  { label: "Email du participant", value: selectedParticipant.email_part },
                  { label: "Téléphone", value: `${selectedParticipant.telephone_part}` },
                  { label: "Ville", value: selectedParticipant.ville_part },
                  { label: "Code postal", value: selectedParticipant.codepostal_part },
                  { label: "Catégorie d'équipe", value: selectedParticipant.categorie_equipe || "Non spécifié" },
                ].map((item, index) => (
                  <Grid container key={index} spacing={0} sx={{ padding: "8px 0" }}>
                    <Grid item xs={5}>
                      <Typography sx={{ fontWeight: "bold", textAlign: "right", fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        {item.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontWeight: "bold", textAlign: "center", fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        :
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography sx={{ textAlign: "left", fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        {item.value}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
              <Button onClick={handleCloseDialog} variant="contained" sx={{ flex: 1, mr: 1 }}>
                Fermer
              </Button>
              <Button onClick={handleOpenConfirmDialog} color="error" variant="contained" sx={{ flex: 1 }}>
                Supprimer
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        )}
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        fullWidth
        maxWidth={isMobile ? "xs" : "sm"} // Responsive
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: isMobile ? '1.1rem' : '1.5rem' }}>
          Confirmation de suppression
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', padding: isMobile ? 2 : 3 }}>
          <Typography fontSize={isMobile ? '1rem' : '1.2rem'}>
            Êtes-vous sûr de vouloir supprimer <b>{selectedParticipant?.nom_part}</b> ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
          <Button onClick={handleCloseConfirmDialog} variant="outlined" sx={{ flex: 1, mr: 1 }}>
            Non
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ flex: 1 }}
            disabled={loadingDelete}
          >
            {loadingDelete ? <CircularProgress size={24} /> : "Oui"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizerEvents;