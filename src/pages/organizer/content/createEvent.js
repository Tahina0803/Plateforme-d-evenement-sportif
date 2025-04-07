import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Modal,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importer le style par défaut


const CreateEvent = () => {
  const [openModal, setOpenModal] = useState(false); // État pour ouvrir/fermer le modal
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clicked] = useState(false); // État pour gérer le clic

  const [eventDetails, setEventDetails] = useState({
    nom_event: '',
    nom_sport: '',
    type_event: '',
    lieu_event: '',
    nbr_participant: '01',
    genre_participant: '',
    date_debut: '',
    date_fin: '',
    frais_inscription: '',
    date_creationEvent: new Date().toISOString().slice(0, 10),
    statut_event: '',
    categorie_participant: '',
    description_accueil: '',
    description_detail: '',
    id_challenge: '',
    tickets: [],
  });

  // Fonction pour gérer les changements dans ReactQuill
  const handleEditorChange = (value) => {
    setEventDetails({
      ...eventDetails,
      description_detail: value, // Mettre à jour l'état avec la valeur de l'éditeur
    });
  };

  const [images, setImages] = useState({
    logo: null,
    accueil: null,
    contenu: null,
  });

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prevImages) => ({ ...prevImages, [type]: file }));
    }
  };

  const removeImage = (type) => {
    setImages((prevImages) => ({ ...prevImages, [type]: null }));
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalImage(null);
  };

  const handleClick = async (e) => {
    setLoading(true); // Activer l'indicateur de chargement
    await handleSubmit(e); // Appeler la fonction de création
    // Simule une action asynchrone (exemple : appel API)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false); // Désactiver l'indicateur de chargement
  };

  const [newTicket, setNewTicket] = useState({ type_ticket: '', prix_ticket: '', nbr_ticket_disponible: '' });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleTicketChange = (event) => {
    const { name, value } = event.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const addTicket = () => {
    if (newTicket.type_ticket && newTicket.prix_ticket && newTicket.nbr_ticket_disponible) {
      setEventDetails({
        ...eventDetails,
        tickets: [...eventDetails.tickets, newTicket],
      });
      setNewTicket({ type_ticket: '', prix_ticket: '', nbr_ticket_disponible: '' });
    }
  };

  const removeTicket = (index) => {
    const updatedTickets = eventDetails.tickets.filter((_, i) => i !== index);
    setEventDetails({ ...eventDetails, tickets: updatedTickets });
  };
  const generateChallengeId = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/challenges/latest");
      if (response.status === 200 && response.data.latestId) {
        return response.data.latestId + 1; // Incrémentation
      }
      return 1; // Si aucun challenge trouvé, commencer à 1
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier id_challenge :", error);
      return 1; // Par défaut si l'API échoue
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log("Token récupéré:", token);

      const formData = new FormData();

      // Attendre la résolution si generateChallengeId() est asynchrone
      const id_challenge = eventDetails.id_challenge && !isNaN(eventDetails.id_challenge)
        ? parseInt(eventDetails.id_challenge, 10)
        : await generateChallengeId(); // Ajout de "await" ici

      console.log("Valeur finale de id_challenge envoyée:", id_challenge);

      Object.keys(eventDetails).forEach((key) => {
        if (key === 'genre_participant' && !['Masculin', 'Féminin', 'Mixte'].includes(eventDetails[key])) {
          console.error("Valeur invalide détectée pour genre_participant:", eventDetails[key]);
          alert("Erreur : genre_participant doit être 'Masculin', 'Féminin' ou 'Mixte'.");
          setLoading(false);
          return;
        }

        if (key === 'tickets') {
          console.log("Ajout des tickets:", eventDetails[key]);
          formData.append(key, JSON.stringify(eventDetails[key]));
        } else if (key === 'id_challenge') {
          console.log("Ajout de id_challenge dans formData:", id_challenge);
          formData.append(key, id_challenge);
        } else {
          console.log(`Ajout de ${key} dans formData:`, eventDetails[key]);
          formData.append(key, eventDetails[key]);
        }
      });

      // Ajout des fichiers
      if (images.logo) {
        console.log("Ajout du logo:", images.logo);
        formData.append('logo_event', images.logo);
      }
      if (images.accueil) {
        console.log("Ajout de l'image d'accueil:", images.accueil);
        formData.append('images_accueil', images.accueil);
      }
      if (images.contenu) {
        console.log("Ajout de l'image de contenu:", images.contenu);
        formData.append('images_contenu', images.contenu);
      }

      console.log("Données envoyées au backend:", formData);

      const response = await axios.post('http://localhost:3001/api/organizer/create-event', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Réponse du backend:", response);

      if (response.status === 201) {
        alert('Événement créé avec succès !');
        setEventDetails({
          nom_event: '',
          nom_sport: '',
          type_event: '',
          lieu_event: '',
          nbr_participant: '01',
          genre_participant: '',
          date_debut: '',
          date_fin: '',
          frais_inscription: '',
          date_creationEvent: new Date().toISOString().slice(0, 10),
          statut_event: '',
          categorie_participant: '',
          description_accueil: '',
          description_detail: '',
          id_challenge: '',
          tickets: [],
        });
        setImages({
          logo: null,
          accueil: null,
          contenu: null,
        });
      } else {
        alert("Une erreur inattendue s'est produite.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'événement :", error);
      alert("Erreur lors de la création de l'événement.");
    }
    setLoading(false);
  };

  const getEventTypes = () => {
    switch (eventDetails.nom_sport) {
      case 'Basketball':
      case 'Football':
        return ['Tournois', 'Championnat', 'Match amicaux', 'Playoffs'];
      case 'Pétanque':
        return ['Tête à Tête', 'Tournois doublette', 'Tournois triplette', 'Championnat individuel', 'Tournois mixte'];
      default:
        return [];
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 5 }}>
        Création d'un évènement
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Nom de l'évènement */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nom de l’évènement"
              name="nom_event"
              value={eventDetails.nom_event}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          {/* Nombre de participants et genre */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Nombre de participants"
                name="nbr_participant"
                value={eventDetails.nbr_participant}
                onChange={handleInputChange}
                type="number" // Permet de limiter les entrées aux chiffres uniquement
                variant="outlined"
                fullWidth
                InputProps={{
                  inputProps: { min: 1 }, // Optionnel : Définit la valeur minimale (par exemple, 1)
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  name="genre_participant"
                  value={eventDetails.genre_participant}
                  onChange={handleInputChange}
                  label="Genre de paricipant"
                >
                  <MenuItem value="Masculin">Masculin</MenuItem>
                  <MenuItem value="Féminin">Féminin</MenuItem>
                  <MenuItem value="Mixte">Mixte</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {/* Nom du sport */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Nom du sport</InputLabel>
              <Select
                name="nom_sport"
                value={eventDetails.nom_sport}
                onChange={handleInputChange}
                label="Nom du sport"
                sx={{
                  textAlign: 'left', // S'assure que le texte est aligné à gauche
                }}
              >
                <MenuItem value="Basketball">Basketball</MenuItem>
                <MenuItem value="Pétanque">Pétanque</MenuItem>
                <MenuItem value="Football">Football</MenuItem>
              </Select>
            </FormControl>
          </Grid>


          {/* Dates côte à côte */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Date début"
                name="date_debut"
                type="date"
                value={eventDetails.date_debut}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Date fin"
                name="date_fin"
                type="date"
                value={eventDetails.date_fin}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Type d'évènement */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type_event"
                value={eventDetails.type_event}
                onChange={handleInputChange}
                label="Type"
                disabled={!eventDetails.nom_sport} // Désactiver si "Nom du sport" n'est pas sélectionné
                sx={{
                  textAlign: 'left', // S'assure que le texte est aligné à gauche
                }}
              >
                {getEventTypes().map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>


          {/* Lieu */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lieu"
              name="lieu_event"
              value={eventDetails.lieu_event}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>



          {/* Frais */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Frais d'inscription (Ar)"
              name="frais_inscription"
              value={eventDetails.frais_inscription}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          {/* Catégorie */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Catégorie de participant"
              name="categorie_participant"
              value={eventDetails.categorie_participant}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          {/* Date de création */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date de création"
              name="date_creationEvent"
              type="date"
              value={eventDetails.date_creationEvent}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Statut */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut_event"
                value={eventDetails.statut_event || ''} // Défaut à une chaîne vide si `statut_event` est null ou indéfini
                onChange={handleInputChange}
                label="Statut"
                sx={{
                  textAlign: 'left', // S'assure que le texte est aligné à gauche
                }}
              >
                <MenuItem value="en cours">En cours</MenuItem>
                <MenuItem value="a venir">A venir</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* gestion des tickets */}
          <Grid item xs={12}>
            <Typography variant="h6">Gestion des Tickets</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="Type de Ticket" name="type_ticket" value={newTicket.type_ticket} onChange={handleTicketChange} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Prix" name="prix_ticket" type="number" value={newTicket.prix_ticket} onChange={handleTicketChange} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Quantité" name="nbr_ticket_disponible" type="number" value={newTicket.nbr_ticket_disponible} onChange={handleTicketChange} fullWidth />
              </Grid>
            </Grid>
            <Button onClick={addTicket} variant="contained" sx={{ mt: 2 }}>Ajouter Ticket</Button>
            <Box sx={{ mt: 2 }}>
              {eventDetails.tickets.map((ticket, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, p: 1, border: '1px solid #ccc' }}>
                  <Typography>{ticket.type_ticket} - {ticket.prix_ticket} Ar - {ticket.nbr_ticket_disponible} places</Typography>
                  <Button onClick={() => removeTicket(index)} color="error">Supprimer</Button>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description pour l'accueil"
              name="description_accueil"
              value={eventDetails.description_accueil}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              inputProps={{ maxLength: 75 }} // Limite à 75 caractères
            />
          </Grid>
          <Grid item xs={12}>
            <ReactQuill
              value={eventDetails.description_detail} // Assurez-vous que la valeur de l'éditeur est liée à l'état
              onChange={handleEditorChange} // Gérer le changement de texte dans l'éditeur
              theme="snow"
              placeholder="Entrez votre description détaillée"
              style={{ height: '200px', width: '100%' }}
            />
          </Grid>

          {/* Ajout d'images */}
          <Box
            sx={{
              display: 'flex', // Utilisation de flexbox
              justifyContent: 'center', // Centrer horizontalement
              alignItems: 'center', // Centrer verticalement
              flexWrap: 'wrap',  // Permet de passer à la ligne si nécessaire
              gap: 4, // Espacement horizontal entre les éléments
              mt: 4, // Marge au-dessus des éléments
              margin: 'auto',

            }}
          >
            {/* Images Section */}
            {['logo', 'accueil', 'contenu'].map((type) => (
              <Box
                key={type}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  height: { xs: '100px', sm: '120px', md: '150px' }, // Taille adaptative en fonction de l'écran
                  width: { xs: '200px', sm: '220px', md: '250px' }, // Taille adaptative en fonction de l'écran
                  // border: '1px dashed #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: '10px',
                  marginTop: 10,
                  marginBottom: { xs: 2, sm: 2, md: 0 }, // Espace vertical pour petits écrans
                }}
              >
                {images[type] ? (
                  <>
                    {/* Légende */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        textAlign: 'center',
                        fontSize: { xs: '12px', sm: '14px', md: '16px' }, // Texte adaptatif
                      }}
                    >
                      Image {type.toLowerCase()}
                    </Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        width: { xs: '230px', sm: '300px' }, // Taille adaptative en fonction de l'écran
                        height: { xs: '130px', sm: '120px' }, // Taille adaptative en fonction de l'écran
                      }}
                    >
                      {/* Image avec effet de flou au survol */}
                      <img
                        src={URL.createObjectURL(images[type])}
                        alt={type}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          transition: 'filter 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleImageClick(URL.createObjectURL(images[type]))} // Ouvrir l'image en taille réelle
                      />

                      {/* Bouton "X" */}
                      <Button
                        onClick={() => removeImage(type)}
                        sx={{
                          position: 'absolute',
                          top: '0px',
                          right: '25px',
                          minWidth: '24px',
                          minHeight: '24px',
                          padding: 0,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(231, 225, 225,0.9)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          '&:hover': { backgroundColor: 'grey' },
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px', textTransform: 'none' }, // Taille de texte adaptative
                    }}
                  >
                    Ajouter image {type.toLowerCase()}
                    <input type="file" hidden onChange={(e) => handleImageUpload(e, type)} />
                  </Button>
                )}
              </Box>
            ))}
          </Box>

          {/* Modal pour afficher l'image en taille réelle */}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(5px)', // Floute le fond
            }}
          >
            <Box
              sx={{
                position: 'relative',
                bgcolor: 'white',
                boxShadow: 24,
                p: 1,
                borderRadius: '3px',
              }}
            >
              <img
                src={modalImage}
                alt="Modal"
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
              <Button
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  minWidth: '32px',
                  minHeight: '32px',
                  padding: 0,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(231, 225, 225,0.9)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: 'grey' },
                }}
              >
                ✕
              </Button>
            </Box>
          </Modal>

          {/* Bouton */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 3 }}>
              {/* Ligne horizontale */}
              <Box sx={{ width: '100%', borderTop: '1px solid #ccc', mb: 5 }}></Box>
              {/* Bouton aligné à gauche */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading} // Désactive le bouton pendant le chargement
                sx={{
                  backgroundColor: clicked ? 'yellow' : '#1976d2', // Couleur après clic ou par défaut
                  ':hover': {
                    backgroundColor: clicked ? 'black' : '#1565c0', // Couleur au survol
                  },
                  maxWidth: '300px', // Largeur maximale du bouton
                  color: 'white', // Couleur du texte
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  gap: 1, // Espacement entre le texte et l'icône de chargement
                  textTransform: 'none', // Désactiver toute transformation de texte
                  fontFamily: 'inherit', // S'assurer que le style de police ne change pas
                }}
                onClick={handleClick} // Gestion de clic
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" /> // Indicateur de chargement
                ) : (
                  'Créer et publier un évènement'// Conversion du texte en minuscule
                )}
              </Button>

            </Box>
          </Grid>

        </Grid>
      </Box>
    </Container>
  );
};

export default CreateEvent;

















