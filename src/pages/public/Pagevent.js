
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid } from '@mui/material';
import EventCard from './../../components/public/EventCard';
import Header from './../../components/public/Header';
import Footer from '../../components/public/Footer';
import SearchSection from '../../components/public/SearchSection';

const Pagevent = () => {
    const [events, setEvents] = useState([]); // État pour stocker les événements
    const [loading, setLoading] = useState(true); // État pour le chargement des données

    useEffect(() => {
        // Fonction pour récupérer les événements publics
        const fetchEvents = async () => {
            try {
                // Appel à la route publique pour récupérer les événements
                const response = await axios.get('http://localhost:3001/api/organizer/public-events');
                setEvents(response.data); // Mise à jour des événements
            } catch (error) {
                console.error('Erreur lors de la récupération des événements publics:', error.response?.data || error.message);
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchEvents(); // Appel à la fonction lors du montage du composant
    }, []); // Dépendances vides : cette logique s'exécute uniquement une fois au montage

    const handleSearch = (filters) => {
        // Logique de filtrage des événements selon les critères de recherche
        console.log('Filtres appliqués :', filters);
    };

    // Si les données sont en cours de chargement, afficher un message
    if (loading) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                Chargement des événements...
            </Typography>
        );
    }

    return (
        <div>
            {/* En-tête de la page */}
            <Header />
            
            {/* Contenu principal */}
            <Container maxWidth="lg" sx={{ mt: 10 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 5 }}>
                    Évènements à venir
                </Typography>
                <SearchSection onSearch={handleSearch} />
            </Container>

            {/* Liste des événements */}
            <Container maxWidth="lg" sx={{ mx: 'auto', mt: 5, mb: 15 }} >
                <Grid container spacing={0}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={4} md={3} key={event.id_evenement}>
                            <EventCard event={event} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Pied de page */}
            <Footer />
        </div>
    );
};

export default Pagevent;

