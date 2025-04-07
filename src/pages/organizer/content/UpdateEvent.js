import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    CircularProgress,
    Select,
    Typography,
    IconButton
} from '@mui/material';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Assurez-vous d'importer ReactQuill
import 'react-quill/dist/quill.snow.css'; // Importez le style de ReactQuill
import { RemoveCircle } from '@mui/icons-material';

const UpdateEvent = ({ eventId, onClose, refreshEvents }) => {
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
        date_creationEvent: '',
        statut_event: '',
        categorie_participant: '',
        description_accueil: '',
        description_detail: '',
        tickets: []
    });

    const [images, setImages] = useState({
        logo: null,
        accueil: null,
        contenu: null,
    });

    const [newTicket, setNewTicket] = useState({
        type_ticket: '',
        prix_ticket: '',
        nbr_ticket_disponible: ''
    });

    const [loading, setLoading] = useState(false);

    // Charger les détails de l'événement
    // useEffect(() => {
    //     const fetchEventDetails = async () => {
    //         const token = localStorage.getItem('token');
    //         try {
    //             const response = await axios.get(`http://localhost:3001/api/organizer/events/${eventId}`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    //             const event = response.data;

    //             setEventDetails({
    //                 ...event,
    //                 date_creationEvent: event.date_creationEvent?.slice(0, 10) || '', // Formater la date pour les champs date
    //                 date_debut: event.date_debut?.slice(0, 10) || '',
    //                 date_fin: event.date_fin?.slice(0, 10) || '',
    //             });
    //         } catch (error) {
    //             console.error('Erreur lors de la récupération des détails de l’événement :', error);
    //         }
    //     };

    //     fetchEventDetails();
    // }, [eventId]);


    // useEffect(() => {
    //     const fetchEventDetails = async () => {
    //         console.log("Récupération des détails pour l'événement ID :", eventId);
    //         if (!eventId) return; // Assurez-vous qu'un eventId est présent
    //         setEventDetails({}); // Réinitialisez les détails de l'événement
    //         setLoading(true); // Affichez l'indicateur de chargement
    //         const token = localStorage.getItem('token');
    //         try {
    //             const response = await axios.get(`http://localhost:3001/api/organizer/events/${eventId}`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    //             console.log("Détails de l'événement récupérés :", response.data);
    //             const event = response.data;
    
    //             setEventDetails({
    //                 ...event,
    //                 date_creationEvent: event.date_creationEvent?.slice(0, 10) || '', // Formater la date pour les champs date
    //                 date_debut: event.date_debut?.slice(0, 10) || '',
    //                 date_fin: event.date_fin?.slice(0, 10) || '',
    //             });
    //         } catch (error) {
    //             console.error('Erreur lors de la récupération des détails de l’événement :', error);
    //         } finally {
    //             setLoading(false); // Arrêtez l'indicateur de chargement
    //         }
    //     };
    
    //     fetchEventDetails();
    // }, [eventId]); // Déclenchez cet effet chaque fois que `eventId` change
    
    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) return;
            setLoading(true);
            const token = localStorage.getItem('token');
    
            try {
                const response = await axios.get(`http://localhost:3001/api/organizer/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                console.log("Données de l'événement reçues :", response.data);
    
                const event = response.data;
                let parsedTickets = [];
    
                // 🔹 Vérifier et parser correctement les tickets
                try {
                    parsedTickets = event.types_tickets ? JSON.parse(event.types_tickets) : [];
                    if (!Array.isArray(parsedTickets)) {
                        console.warn("types_tickets n'est pas un tableau valide. Réinitialisation...");
                        parsedTickets = [];
                    }
                } catch (error) {
                    console.error("Erreur lors du parsing des tickets :", error);
                    parsedTickets = [];
                }
    
                // 🔹 Mettre à jour `eventDetails` avec les données récupérées
                setEventDetails({
                    nom_event: event.nom_event || '',
                    nom_sport: event.nom_sport || '',
                    type_event: event.type_event || '',
                    lieu_event: event.lieu_event || '',
                    nbr_participant: event.nbr_participant || '1',
                    genre_participant: event.genre_participant || '',
                    date_debut: event.date_debut ? event.date_debut.slice(0, 10) : '', // Formattage de la date
                    date_fin: event.date_fin ? event.date_fin.slice(0, 10) : '',       // Formattage de la date
                    frais_inscription: event.frais_inscription || '',
                    date_creationEvent: event.date_creationEvent ? event.date_creationEvent.slice(0, 10) : '',
                    statut_event: event.statut_event || '',
                    categorie_participant: event.categorie_participant || '',
                    description_accueil: event.description_accueil || '',
                    description_detail: event.description_detail || '',
                    tickets: parsedTickets // Stocker les tickets dans l'état
                });
    
                // 🔹 Mettre à jour les images si elles existent
                setImages({
                    logo: event.logo_event ? `http://localhost:3001/uploads/${event.logo_event}` : null,
                    accueil: event.images_accueil ? `http://localhost:3001/uploads/${event.images_accueil}` : null,
                    contenu: event.images_contenu ? `http://localhost:3001/uploads/${event.images_contenu}` : null,
                });
    
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l’événement :', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchEventDetails();
    }, [eventId]); // Déclencher la récupération des données à chaque changement d'ID
    // Déclenchez cet effet chaque fois que `eventId` change


    // Gestion des champs texte et Select
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails({
          ...eventDetails,
          [name]: value, // Mettre à jour l'état avec le nom du champ et sa nouvelle valeur
        });
      };

    // Gestion des fichiers
    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setImages((prevImages) => ({ ...prevImages, [type]: file }));
        }
    };

    // Obtenir les types d'événements en fonction du sport
    const getEventTypes = (nom_sport) => {
        switch (nom_sport) {
            case 'basketball':
            case 'football':
                return ['Tournois', 'Championnat', 'Match amicaux', 'Playoffs'];
            case 'petanque':
                return ['Tournois doublette', 'Tournois triplette', 'Championnat individuel', 'Tournois mixte'];
            default:
                return [];
        }
    };

    const eventTypes = getEventTypes(eventDetails.nom_sport);

    const handleNewTicketChange = (e) => {
        const { name, value } = e.target;
        setNewTicket(prevTicket => ({ ...prevTicket, [name]: value }));
    };

    const addTicket = () => {
        if (newTicket.type_ticket && newTicket.prix_ticket && newTicket.nbr_ticket_disponible) {
            setEventDetails(prevDetails => ({
                ...prevDetails,
                tickets: [...prevDetails.tickets, newTicket]
            }));
            setNewTicket({ type_ticket: '', prix_ticket: '', nbr_ticket_disponible: '' });
        } else {
            alert("Veuillez remplir tous les champs du ticket.");
        }
    };

    const removeTicket = (index) => {
        setEventDetails(prevDetails => ({
            ...prevDetails,
            tickets: prevDetails.tickets.filter((_, i) => i !== index)
        }));
    };

    // Soumettre le formulaire pour modifier l'événement
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const token = localStorage.getItem('token');
    //         const formData = new FormData();

    //         // Ajout des données textuelles
    //         Object.keys(eventDetails).forEach((key) => {
    //             formData.append(key, eventDetails[key]);
    //         });

    //         // Ajout des fichiers
    //         if (images.logo) formData.append('logo_event', images.logo);
    //         if (images.accueil) formData.append('images_accueil', images.accueil);
    //         if (images.contenu) formData.append('images_contenu', images.contenu);

    //         await axios.put(`http://localhost:3001/api/organizer/events/${eventId}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         alert('Événement modifié avec succès.');

    //         // Mettre à jour la liste des événements
    //         refreshEvents((prev) =>
    //             prev.map((event) =>
    //                 event.id_evenement === eventId ? { ...event, ...eventDetails } : event
    //             )
    //         );

    //         onClose(); // Fermer le modal après la mise à jour
    //     } catch (error) {
    //         console.error('Erreur lors de la modification de l’événement :', error);
    //         alert('Une erreur est survenue.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const token = localStorage.getItem('token');
    //         const formData = new FormData();
    
    //         Object.keys(eventDetails).forEach((key) => {
    //             if (key === 'tickets') {
    //                 formData.append(key, JSON.stringify(eventDetails.tickets));
    //             } else {
    //                 formData.append(key, eventDetails[key]);
    //             }
    //         });
    
    //         if (images.logo instanceof File) formData.append('logo_event', images.logo);
    //         if (images.accueil instanceof File) formData.append('images_accueil', images.accueil);
    //         if (images.contenu instanceof File) formData.append('images_contenu', images.contenu);
    
    //         const response = await axios.put(`http://localhost:3001/api/organizer/events/${eventId}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    
    //         console.log("🚀 Réponse de mise à jour de l'événement :", response.data);
    
    //         alert('Événement et tickets modifiés avec succès.');
    //         refreshEvents();
    //         onClose();
    //     } catch (error) {
    //         console.error('❌ Erreur lors de la modification de l’événement :', error);
    //         alert('Une erreur est survenue.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
    
            // 🧠 Calcule nbr_total_tickets de manière sûre
            const nbr_total_tickets = Array.isArray(eventDetails.tickets)
                ? eventDetails.tickets.reduce((acc, t) => acc + (parseInt(t.nbr_ticket_disponible) || 0), 0)
                : 0;
    
            Object.keys(eventDetails).forEach((key) => {
                if (key === 'tickets') {
                    formData.append('types_tickets', JSON.stringify(eventDetails.tickets));
                } else {
                    formData.append(key, eventDetails[key]);
                }
            });
    
            // 👇 Ajoute cette ligne !
            formData.append('nbr_total_tickets', nbr_total_tickets);
    
            // 📎 Ajout des fichiers
            if (images.logo instanceof File) formData.append('logo_event', images.logo);
            if (images.accueil instanceof File) formData.append('images_accueil', images.accueil);
            if (images.contenu instanceof File) formData.append('images_contenu', images.contenu);
    
            const response = await axios.put(
                `http://localhost:3001/api/organizer/events/${eventId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("🚀 Réponse de mise à jour de l'événement :", response.data);
            alert('Événement et tickets modifiés avec succès.');
            refreshEvents();
            onClose();
        } catch (error) {
            console.error('❌ Erreur lors de la modification de l’événement :', error);
            alert('Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };
    

    console.log("eventDetails:", eventDetails);
console.log("eventDetails.tickets:", eventDetails?.tickets);

    return (
        <Box component="form"
            onSubmit={handleSubmit}
            sx={{
                maxHeight: '80vh', // Limite la hauteur à 80% de la hauteur de la fenêtre
                overflowY: 'auto', // Ajoute un défilement vertical
                padding: 2, // Ajoute de l'espace autour du contenu
            }}
        >

            <Typography align="center" sx={{
                fontSize: { xs: '18px', sm: '25px', md: '30px' }, marginBottom: '30px' // Taille de texte adaptative
            }}>
                Modifier un événement
            </Typography>
            <Grid container spacing={3}>
                {/* Nom de l'événement */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nom de l’événement"
                        name="nom_event"
                        value={eventDetails.nom_event}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
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
                            type="number"
                            variant="outlined"
                            fullWidth
                             InputLabelProps={{ shrink: true }}
                            InputProps={{
                                inputProps: { min: 1 },
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Genre</InputLabel>
                            <Select
                                name="genre_participant"
                                value={eventDetails.genre_participant}
                                onChange={handleInputChange}
                                label="Genre de participant"
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
                        >
                            <MenuItem value="basketball">Basketball</MenuItem>
                            <MenuItem value="petanque">Pétanque</MenuItem>
                            <MenuItem value="football">Football</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Dates début et fin */}
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

                {/* Type d'événement */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type_event"
                            value={eventDetails.type_event}
                            onChange={handleInputChange}
                            label="Type"
                            disabled={!eventDetails.nom_sport}
                        >
                            {eventTypes.map((type) => (
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
                         InputLabelProps={{ shrink: true }}
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
                         InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Catégorie de participant */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Catégorie de participant"
                        name="categorie_participant"
                        value={eventDetails.categorie_participant}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                         InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Date de création */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Date de création"
                        name="date_creationEvent"
                        value={eventDetails.date_creationEvent}
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
                            value={eventDetails.statut_event}
                            onChange={handleInputChange}
                            label="Statut"
                        >
                            <MenuItem value="en cours">En cours</MenuItem>
                            <MenuItem value="A venir">A venir</MenuItem>
                            <MenuItem value="terminé">Terminé</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Modification des Tickets</Typography>
                    </Grid>

                    {/* Gestion des tickets */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField label="Type de Ticket" name="type_ticket" value={newTicket.type_ticket} onChange={handleNewTicketChange} fullWidth />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Prix" name="prix_ticket" type="number" value={newTicket.prix_ticket} onChange={handleNewTicketChange} fullWidth />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Quantité" name="nbr_ticket_disponible" type="number" value={newTicket.nbr_ticket_disponible} onChange={handleNewTicketChange} fullWidth />
                            </Grid>
                        </Grid>
                        <Button onClick={addTicket} variant="contained" sx={{ mt: 2 }}>Ajouter Ticket</Button>
                        {Array.isArray(eventDetails.tickets) && eventDetails.tickets.length > 0 ? (
                            eventDetails.tickets.map((ticket, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, p: 1, border: '1px solid #ccc' }}>
                                    <Typography>{ticket.type_ticket} - {ticket.prix_ticket} Ar - {ticket.nbr_ticket_disponible} places</Typography>
                                    <IconButton color="error" onClick={() => removeTicket(index)}>
                                        <RemoveCircle />
                                    </IconButton>
                                </Box>
                            ))
                        ) : (
                            <Typography>Aucun ticket ajouté.</Typography>
                        )}

                    </Grid>
                </Grid>

                {/* Description d'accueil */}
                <Grid item xs={12}>
                    <TextField
                        label="Description d'accueil"
                        name="description_accueil"
                        value={eventDetails.description_accueil}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                         InputLabelProps={{ shrink: true }}
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 75 }} // Limite à 75 caractères
                    />
                </Grid>

                {/* Description détaillée */}
                <Grid item xs={12}>
                    <ReactQuill
                        value={eventDetails.description_detail} // Liaison avec la valeur de l'état
                        onChange={(value) => handleInputChange({ target: { name: 'description_detail', value } })} // Mise à jour de l'état
                        
                        placeholder="Entrez votre description détaillée"
                        style={{ height: '200px', width: '100%' }}
                    />
                </Grid>

                {/* Ajout d'images */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        margin: 'auto',
                        marginTop: '100px'
                    }}
                >
                    {['logo', 'accueil', 'contenu'].map((type) => (
                        <Box
                            key={type}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100px',
                                width: '200px',
                                border: '1px dashed #ccc',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                padding: '10px',

                            }}
                        >
                            {images[type] ? (
                                <img
                                src={
                                    images[type] instanceof File
                                        ? URL.createObjectURL(images[type])
                                        : images[type] // C’est déjà une URL
                                }
                                    alt={type}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                            ) : (
                                <Button variant="outlined" component="label" sx={{ fontSize: '12px', textTransform: 'none' }}>
                                    Modifier image {type.toLowerCase()}
                                    <input type="file" hidden onChange={(e) => handleImageUpload(e, type)} />
                                </Button>
                            )}
                        </Box>
                    ))}
                </Box>
            </Grid>

            {/* Bouton de soumission */}
            <Box sx={{ textAlign: 'center', mt: 3, }}>
                <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: 'none' }}>
                    {loading ? <CircularProgress size={24} /> : 'Modifier et Enregistrer'}
                </Button>
            </Box>
        </Box>

    );
};

export default UpdateEvent;
