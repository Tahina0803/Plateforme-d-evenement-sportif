// import React from 'react';
// import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate

// const EventCard = ({ event }) => {
//   const navigate = useNavigate(); // Initialiser le hook

//   const handleDetailsClick = () => {
//     // Redirige vers la page MarathonPage
//     navigate('/marathon'); // Assurez-vous que le chemin correspond à la route définie dans App.js
//   };

//   return (
//     <Card sx={{ bgcolor: '#e0f2f1', borderRadius: 0 }} elevation={1}>
//       <CardMedia
//         component="img"
//         alt={event.title}
//         height="200"
//         image={event.image}
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           {event.title}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {event.description}
//         </Typography>
//         <Typography variant="body1" component="div" sx={{ marginTop: 1 }}>
//           {event.lieu}
//         </Typography>
//         <Typography variant="body2" component="div" sx={{ marginTop: 1 }}>
//           {event.date}
//         </Typography>
//         <Button
//           size="small"
//           variant="contained"
//           color="primary"
//           sx={{ textTransform: 'none', mt: 2 }} 
//           onClick={handleDetailsClick} // Appel de la fonction lors du clic
//         >
//           Plus de détails
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default EventCard;

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    // Redirection vers la page DetailEvent
    const handleDetailsClick = () => {
        navigate(`/DetailEvent/${event.id_evenement}`); // Chemin relatif pour accéder à DetailEvent
    };

    return (
        <Card
            onClick={handleDetailsClick} // Rend toute la carte cliquable
            sx={{
                position: 'relative',
                borderRadius: 0,
                overflow: 'hidden',
                maxWidth: { xs: '100%', sm: '300px', md: '260px' }, // Responsive: largeur adaptative
                margin: { xs: 1, sm: 2 }, // Espacement responsive
                cursor: 'pointer', // Curseur pointeur pour indiquer que c'est cliquable
                '&:hover': {
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Effet visuel au survol
                    transform: 'scale(1.02)', // Mise à l'échelle au survol
                    transition: 'transform 0.2s, box-shadow 0.2s', // Transition douce
                },
            }}
            elevation={0}
        >
            {/* Conteneur de l'image et de la date */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 150, sm: 200 }, // Responsive: hauteur de l'image
                }}
            >
                {/* Image */}
                <Box
                    component="img"
                    src={event.images_accueil}
                    alt={event.nom_event}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.9)',
                    }}
                />

                {/* Conteneur de la date */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#000',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {/* Jour */}
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '20px', sm: '28px' }, // Responsive: taille du texte
                            marginRight: '8px',
                            color: '#f50057',
                        }}
                    >
                        {new Date(event.date_debut).getDate().toString().padStart(2, '0')}
                    </Typography>

                    {/* Mois et année */}
                    <Box sx={{ textAlign: 'left' }}>
                        {/* Année */}
                        <Typography
                            variant="subtitle2"
                            component="div"
                            sx={{
                                fontSize: '12px',
                                lineHeight: 1,
                            }}
                        >
                            {new Date(event.date_debut).getFullYear()}
                        </Typography>
                        {/* Mois */}
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{
                                textTransform: 'capitalize',
                                fontSize: '12px',
                                lineHeight: 1,
                            }}
                        >
                            {new Date(event.date_debut).toLocaleDateString('fr-FR', { month: 'long' })}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Contenu de l'événement */}
            <CardContent
                sx={{
                    margin: 0,
                    padding: 0,
                    mt: 3,
                }}
            >
                {/* Nom de l'événement */}
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                        transition: 'color 0.3s',
                        fontSize: { xs: '14px', sm: '16px' }, // Responsive: taille du titre
                        '&:hover': {
                            color: '#f50057', // Effet de survol
                        },
                    }}
                >
                    {event.nom_event}
                </Typography>
                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: { xs: '12px', sm: '14px' }, // Responsive: taille du texte
                    }}
                >
                    {event.description_accueil}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    {/* Icône de localisation */}
                    <LocationOnIcon
                        sx={{
                            marginBottom: 1,
                            marginRight: 1,
                            color: '#f50057',
                            fontSize: { xs: '16px', sm: '20px' }, // Responsive: taille de l'icône
                        }}
                    />
                    {/* Nom du lieu */}
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{
                            fontSize: { xs: '12px', sm: '14px' }, // Responsive: taille du texte
                        }}
                    >
                        {event.lieu_event}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EventCard;








