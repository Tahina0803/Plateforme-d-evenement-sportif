// // import React, { useState } from 'react';
// // import { AppBar, Toolbar, Typography, Button, Box, Card, CardMedia, Grid, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
// // import MenuIcon from '@mui/icons-material/Menu';
// // import { Navbar } from 'react-bootstrap';
// // import AccessTimeIcon from '@mui/icons-material/AccessTime';
// // import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
// // import LocationOnIcon from '@mui/icons-material/LocationOn';
// // import logo from './../../assets/img/logo.png';
// // import Footer from '../../components/public/Footer';
// // import bannerImage from './../../assets/img/p1.jpg';  // Remplacez 'your-image.jpg' par le nom de votre image



// // const DetailEvent = () => {
// //     const [drawerOpen, setDrawerOpen] = useState(false);

// //     // Fonction pour ouvrir/fermer le drawer
// //     const toggleDrawer = (open) => (event) => {
// //         if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
// //             return;
// //         }
// //         setDrawerOpen(open);
// //     };

// //     // Menu pour les petits écrans (drawer)
// //     const drawerMenu = (
// //         <Box
// //             sx={{ width: 250 }}
// //             role="presentation"
// //             onClick={toggleDrawer(false)}
// //             onKeyDown={toggleDrawer(false)}
// //         >
// //             <List>
// //                 <ListItem button>
// //                     <ListItemText primary="INFO" />
// //                 </ListItem>
// //                 <ListItem button>
// //                     <ListItemText primary="PRÉ-INSCRIPTION" />
// //                 </ListItem>
// //                 <ListItem button>
// //                     <ListItemText primary="INSCRIT" />
// //                 </ListItem>
// //                 <ListItem button>
// //                     <ListItemText primary="RÉSULTATS" />
// //                 </ListItem>
// //                 <ListItem button>
// //                     <ListItemText primary="VOTRE AVIS" />
// //                 </ListItem>
// //             </List>
// //         </Box>
// //     );

// //     return (
// //         <>
// //             {/* Barre de navigation */}
// //             <AppBar position="fixed" color="default" >
// //                 <Toolbar maxWidth="lg" sx={{
// //                     marginLeft: { xs: '0px', sm: '20px', md: '200px',  
// //                     justifyContent: 'space-between' 
// //                 },
// //                     marginRight: {xs: '0px', sm: '20px', md: '200px',}

// //                 }}>
// //                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
// //                         <Typography>
// //                             <Navbar.Brand href="/">
// //                                 <Box
// //                                     component="img"
// //                                     src={logo}
// //                                     alt="Logo"
// //                                     sx={{
// //                                         maxHeight: { xs: '40px', sm: '50px', md: '60px' },
// //                                         marginRight: { xs: '20px', md: '60px' },
// //                                         width: 'auto',
// //                                     }}
// //                                 />
// //                             </Navbar.Brand>
// //                         </Typography>
// //                     </Box>

// //                     {/* Menu pour les grands écrans */}
// //                     <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
// //                         <Button sx={{ color: '#00A0C6', fontWeight: 'bold', textTransform: 'none' }}>INFO</Button>
// //                         <Button sx={{ color: '#00A0C6', fontWeight: 'bold', textTransform: 'none' }}>INSCRIT</Button>
// //                         <Button sx={{ color: '#00A0C6', fontWeight: 'bold', textTransform: 'none' }}>CALENDRIER</Button>
// //                         <Button sx={{ color: '#00A0C6', fontWeight: 'bold', textTransform: 'none' }}>RÉSULTATS</Button>
// //                         <Button sx={{ color: '#00A0C6', fontWeight: 'bold', textTransform: 'none' }}>VOTRE AVIS</Button>
// //                     </Box>

// //                     {/* Menu hamburger pour les petits écrans */}
// //                     <IconButton
// //                         edge="start"
// //                         color="inherit"
// //                         aria-label="menu"
// //                         sx={{ display: { xs: 'block', md: 'none' } }}
// //                         onClick={toggleDrawer(true)}
// //                     >
// //                         <MenuIcon />
// //                     </IconButton>

// //                     {/* Drawer pour le menu hamburger */}
// //                     <Drawer
// //                         anchor="right"
// //                         open={drawerOpen}
// //                         onClose={toggleDrawer(false)}
// //                     >
// //                         {drawerMenu}
// //                     </Drawer>
// //                 </Toolbar>
// //             </AppBar>

// //             <Box maxWidth="lg" sx={{
// //                 marginLeft: { xs: '10px', sm: '20px', md: '220px' },
// //                 marginRight: { xs: '10px', sm: '20px', md: '220px' }, marginTop: '100px', marginBottom: '100px',
// //             }}>

// //                 {/* Bannière de l'événement */}
// //                 <Card>
// //                     <CardMedia
// //                         component="img"
// //                         alt="Marathon Nourane"
// //                         height="300"
// //                         image={bannerImage} // Remplacez par l'URL de votre image
// //                         title="Marathon Nourane"
// //                     />
// //                 </Card>

// //                 {/* Titre de l'événement */}

// //                 {/* Section de contenu principale */}
// //                 <Grid container spacing={4} sx={{ marginTop: '30px' }}>
// //                     {/* Description principale */}
// //                     <Grid item xs={12} md={8}>
// //                         <Card sx={{ padding: '0px 15px' }}>
// //                             <Box sx={{ textAlign: 'left' }}>
// //                                 <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
// //                                     Championnat de Pétanque 2024
// //                                 </Typography>
// //                                 <Typography variant="body1" sx={{ color: 'gray', marginBottom: '20px', marginTop: '20px', }}>
// //                                     <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
// //                                     03 Novembre 2024 |<DirectionsRunIcon sx={{ verticalAlign: 'middle', mr: 1, ml: 1 }} />
// //                                     Pétanque
// //                                 </Typography>
// //                             </Box>

// //                             <Typography variant="body1" sx={{ fontSize: '18px' }}>
// //                                 L'association a lancé dès les premiers mois de sa création en 2016, un marathon annuel, le Marathon de Nourane,
// //                                 dont l'objectif est de répandre la culture de l'activité sportive parmi toutes les catégories de la population,
// //                                 qu'elles soient concernées ou pas par les pathologies cancéreuses.
// //                             </Typography>
// //                             <Typography variant="body1" sx={{ marginTop: '10px', fontSize: '18px' }}>
// //                                 Le Marathon de Nourane organisé en concertation avec les autorités sanitaires et dont la 9ème session se déroulera
// //                                 le 3 novembre 2024, continue d'avoir un grand succès et une participation accrue. Son but est incitatif mais il vise
// //                                 également à collecter des fonds pour l'acquisition de matériel.
// //                             </Typography>
// //                         </Card>
// //                     </Grid>

// //                     {/* Section de pré-inscription et informations */}
// //                     <Grid item xs={12} md={4}>
// //                         <Box>
// //                             <Button variant="contained" color="secondary" fullWidth sx={{ padding: '10px', fontSize: '13px', mb: 3 }}>
// //                                 PRÉ-INSCRIPTION
// //                             </Button>
// //                             <Card sx={{ padding: '10px' }}>
// //                                 <Typography variant="h6" sx={{ marginBottom: '15px' }}>
// //                                     Le championnat de pétanque attire des joueurs de tout le pays !
// //                                 </Typography>
// //                                 <Box>
// //                                     <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
// //                                     <Typography variant="body2" sx={{ display: 'inline' }}>
// //                                         Diégo Suarez, Centre-ville
// //                                     </Typography>
// //                                 </Box>
// //                                 <Box sx={{ marginTop: '10px' }}>
// //                                     <iframe
// //                                         title="Google Map"
// //                                         src="https://www.google.com/maps/embed?pb=..."
// //                                         width="100%"
// //                                         height="200"
// //                                         style={{ border: 0 }}
// //                                         allowFullScreen=""
// //                                         loading="lazy"
// //                                     ></iframe>
// //                                 </Box>
// //                             </Card>
// //                         </Box>
// //                     </Grid>
// //                 </Grid>
// //             </Box>
// //             <Footer />
// //         </>
// //     );
// // };

// // export default DetailEvent;
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     AppBar, Toolbar, Typography, Button, Box, Grid,
//     Container, Divider, Drawer, List, ListItem, ListItemText
// } from '@mui/material';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import MenuIcon from '@mui/icons-material/Menu';
// import axios from 'axios';
// import { useParams, Link } from 'react-router-dom';
// import Signuppart from './../../components/participant/SignUpPart';
// import Imagedisplay from './../../components/participant/ImageDisplay';
// import ContenuPrincipal from './../../components/participant/ContenuPrincipal';

// import Footer from '../../components/public/Footer';
// import logo from './../../assets/img/logo.png';
// import EventTicketsList from './EventTicketsList';
// const DetailEvent = () => {
//     // Hooks React
//     const { id_evenement } = useParams();
//     const [event, setEvent] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activePage, setActivePage] = useState('INFO');
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     // Référence pour défiler jusqu'à la section "S'INSCRIRE"
//     const inscrireRef = useRef(null);

//     //  zety
//     const parsedTickets = (() => {
//         if (!event || !event.types_tickets) {
//             console.warn("⚠️ Aucune donnée de tickets trouvée !");
//             return [];
//         }

//         let tickets;
//         try {
//             console.log("🛠 Tickets bruts de DetailEvent :", event.types_tickets);

//             tickets = JSON.parse(event.types_tickets); // Premier parsing

//             if (typeof tickets === "string") {
//                 tickets = JSON.parse(tickets); // Deuxième parsing si nécessaire
//             }

//             tickets = tickets.map(ticket => ({
//                 ...ticket,
//                 nbr_ticket_disponible: ticket.nbr_ticket_disponible !== undefined && ticket.nbr_ticket_disponible !== 0
//                     ? parseInt(ticket.nbr_ticket_disponible, 10) || 0
//                     : parseInt(ticket.quantite, 10) || 0, // 🔹 Prendre `quantite` si `nbr_ticket_disponible` est absent ou 0
//                 prix_ticket: parseInt(ticket.prix, 10) || 0 // 🔹 Utiliser `prix` car `prix_ticket` peut être manquant
//             }));

//             console.log("✅ Tickets après correction :", tickets);
//         } catch (error) {
//             console.error("❌ Erreur lors du parsing des tickets :", error);
//             return [];
//         }

//         return Array.isArray(tickets) ? tickets : [];
//     })();
//     // Fonction pour défiler jusqu'à "S'INSCRIRE"
//     const scrollToInscrire = () => {
//         inscrireRef.current?.scrollIntoView({ behavior: 'smooth' });
//         setActivePage("S'INSCRIRE");
//     };
//     // Fonction pour gérer la navigation
//     const handleNavigation = (page) => {
//         setActivePage(page);
//     };

//     // Fonction pour ouvrir/fermer le Drawer (menu mobile)
//     const toggleDrawer = (open) => (event) => {
//         if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//             return;
//         }
//         setDrawerOpen(open);
//     };

//     // Effet pour récupérer les détails de l'événement
//     useEffect(() => {
//         const fetchEventDetails = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3001/api/organizer/event/${id_evenement}`);
//                 console.log('Données récupérées depuis l\'API :', response.data); // LOG ICI
//                 setEvent(response.data);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération de l\'événement :', error.response?.data || error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEventDetails();
//     }, [id_evenement]);

//     // Drawer pour les petits écrans
//     const drawer = (
//         <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
//             <List>
//                 {['INFO', "S'INSCRIRE", 'CALENDRIER', 'RÉSULTATS', 'AVIS'].map((text) => (
//                     <ListItem button key={text} onClick={() => handleNavigation(text)}>
//                         <ListItemText primary={text} />
//                     </ListItem>
//                 ))}
//             </List>
//         </Box>
//     );

//     // Contenu principal basé sur la page active
//     const renderContent = () => {
//         if (loading) {
//             return (
//                 <Typography variant="h6" align="center" sx={{ mt: 5 }}>
//                     Chargement des détails de l'événement...
//                 </Typography>
//             );
//         }

//         if (!event) {
//             return (
//                 <Typography variant="h6" align="center" sx={{ mt: 5 }}>
//                     Événement introuvable.
//                 </Typography>
//             );
//         }

//         switch (activePage) {
//             case 'INFO':
//                 return (
//                     <Box sx={{
//                         position: 'relative',
//                         width: '100%',
//                         margin: 0,
//                         padding: 0,
//                     }}>

//                         {/* Affichage de l'image via le composant ImageDisplay */}
//                         <Imagedisplay event={event} />
//                         <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, padding: 0, mt: -5 }}>
//                             <ContenuPrincipal event={event} onScrollToInscrire={scrollToInscrire} />

//                             {/* 🔹 Ajout des billets sous la description */}
//                             <Box sx={{ mt: 5, px: 2 }}>
//                                 <EventTicketsList tickets={parsedTickets} event={event} />
//                             </Box>
//                         </Container>
//                     </Box>
//                 );



//             case "S'INSCRIRE":
//                 return (
//                     <Box
//                         sx={{
//                             position: 'relative',
//                             width: '100%',
//                             margin: 0,
//                             padding: 0,
//                         }}
//                     >
//                         {/* Affichage de l'image via le composant ImageDisplay */}
//                         <Imagedisplay event={event} />

//                         <Container
//                             maxWidth="md"
//                             sx={{
//                                 position: 'relative',
//                                 zIndex: 2,
//                                 padding: 0,

//                             }}
//                         >
//                             {/* Texte principal */}
//                             <Grid item xs={12} md={8} sx={{
//                                 marginLeft: { md: 8, xs: 1 }, paddingTop: 4

//                             }}>
//                                 <Box sx={{ textAlign: 'left' }}>
//                                     <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//                                         {event.nom_event}
//                                     </Typography>
//                                     <Typography
//                                         variant="body1"
//                                         sx={{ color: 'gray', marginBottom: '20px', marginTop: '20px' }}
//                                     >
//                                         <DateRangeIcon
//                                             sx={{
//                                                 verticalAlign: 'middle',
//                                                 mr: 1,
//                                                 width: 18,
//                                                 height: 18,
//                                                 color: '#f50057',
//                                             }}
//                                         />
//                                         <span style={{ fontSize: '12px', paddingRight: '10px' }}>
//                                             {new Date(event.date_debut).toLocaleDateString('fr-FR', {
//                                                 day: '2-digit',
//                                                 month: 'long',
//                                                 year: 'numeric',
//                                             })}
//                                         </span>{' '}
//                                         |{' '}
//                                         <HelpOutlineIcon
//                                             sx={{
//                                                 verticalAlign: 'middle',
//                                                 mr: 1,
//                                                 ml: 1,
//                                                 width: 18,
//                                                 height: 18,
//                                                 color: ' #f50057',
//                                             }}
//                                         />
//                                         <span style={{ fontSize: '12px', paddingRight: '10px' }}>
//                                             {event.nom_sport}
//                                         </span>{' '}
//                                         |{' '}
//                                         <InfoOutlinedIcon
//                                             sx={{
//                                                 verticalAlign: 'middle',
//                                                 mr: 1,
//                                                 ml: 1,
//                                                 width: 18,
//                                                 height: 18,
//                                                 color: ' #f50057',
//                                             }}
//                                         />
//                                         <span style={{ fontSize: '12px' }}>{event.type_event}</span>
//                                     </Typography>
//                                     <Divider
//                                         sx={{
//                                             borderColor: '#898D8F',
//                                             marginY: 2,
//                                         }}
//                                     />
//                                 </Box>
//                             </Grid>

//                             {/* Affichage du formulaire via le composant Signuppart */}
//                             <Signuppart />
//                         </Container>
//                     </Box>
//                 );


//             case 'CALENDRIER':
//                 return (

//                     <Box sx={{
//                         position: 'relative',
//                         width: '100%',
//                         margin: 0,
//                         padding: 0,
//                     }}>
//                         {/* Affichage de l'image via le composant ImageDisplay */}
//                         <Imagedisplay event={event} />
//                         <Container
//                             maxWidth="md"
//                             sx={{
//                                 position: 'relative',
//                                 zIndex: 2,
//                                 padding: 0,
//                             }}
//                         >
//                             <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', paddingTop: 4 }}>
//                                 {event.nom_event}
//                             </Typography>
//                             <Typography variant="body1">
//                                 Date de début : {new Date(event.date_debut).toLocaleDateString('fr-FR')}
//                             </Typography>
//                             <Typography variant="body1">
//                                 Date de fin : {new Date(event.date_fin).toLocaleDateString('fr-FR')}
//                             </Typography>
//                         </Container>
//                     </Box>
//                 );

//             case 'RÉSULTATS':
//                 return (
//                     <Box sx={{
//                         position: 'relative',
//                         width: '100%',
//                         margin: 0,
//                         padding: 0,
//                     }}>
//                         {/* Affichage de l'image via le composant ImageDisplay */}
//                         <Imagedisplay event={event} />
//                         <Container
//                             maxWidth="md"
//                             sx={{
//                                 position: 'relative',
//                                 zIndex: 2,
//                                 padding: 0,
//                             }}
//                         >
//                             <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', paddingTop: 4 }}>
//                                 {event.nom_event}
//                             </Typography>
//                             <Typography variant="body1">
//                                 Les résultats seront publiés ici une fois disponibles.
//                             </Typography>
//                         </Container>
//                     </Box>
//                 );


//             case 'AVIS':
//                 return (
//                     <Box sx={{
//                         position: 'relative',
//                         width: '100%',
//                         margin: 0,
//                         padding: 0,
//                     }}>
//                         {/* Affichage de l'image via le composant ImageDisplay */}
//                         <Imagedisplay event={event} />
//                         <Container
//                             maxWidth="md"
//                             sx={{
//                                 position: 'relative',
//                                 zIndex: 2,
//                                 padding: 0,
//                             }}
//                         >
//                             <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', paddingTop: 4 }}>
//                                 Votre avis
//                             </Typography>
//                             <Typography variant="body1" sx={{ textAlign: 'center' }}>
//                                 Déposez un commentaire !
//                             </Typography>
//                         </Container>
//                     </Box>
//                 );

//             default:
//                 return null;
//         }
//     };

//     return (
//         <>
//             {/* AppBar (barre de navigation) */}
//             <AppBar position="fixed" color="default" sx={{ paddingX: { xs: '10px', sm: '20px', md: '180px' } }}>
//                 <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Box>
//                         <Link to="/pagevent">
//                             <Box
//                                 component="img"
//                                 src={logo}
//                                 alt="Logo"
//                                 sx={{
//                                     maxHeight: { xs: '40px', md: '50px' },
//                                     width: 'auto',
//                                 }}
//                             />
//                         </Link>
//                     </Box>
//                     <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
//                         {['INFO', "S'INSCRIRE", 'CALENDRIER', 'RÉSULTATS', 'AVIS'].map((page) => (
//                             <Button
//                                 key={page}
//                                 onClick={() => handleNavigation(page)}
//                                 sx={{ color: activePage === page ? '#f50057' : '#00A0C6' }}
//                             >
//                                 {page}
//                             </Button>
//                         ))}
//                     </Box>
//                     <Box sx={{ display: { xs: 'block', md: 'none' } }}>
//                         <Button
//                             onClick={toggleDrawer(true)}
//                             sx={{
//                                 color: '#00A0C6',
//                                 padding: 0,
//                             }}
//                         >
//                             <MenuIcon sx={{ fontSize: '32px' }} /> {/* Taille ajustée ici */}
//                         </Button>
//                         <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
//                             {drawer}
//                         </Drawer>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* Contenu principal */}
//             <Container disableGutters sx={{
//                 marginTop: '65px', padding: 0,
//                 margin: 0,
//                 width: '100vw',
//             }}>{renderContent()}</Container>

//             <Footer />
//         </>
//     );
// };

// export default DetailEvent;

import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, Grid,
    Container, Divider, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Signuppart from './../../components/participant/SignUpPart';
import Imagedisplay from './../../components/participant/ImageDisplay';
import ContenuPrincipal from './../../components/participant/ContenuPrincipal';

import Footer from '../../components/public/Footer';
import logo from './../../assets/img/logo.png';
import EventTicketsList from './EventTicketsList';
import CalendrierPublic from './CalendrierPublic';
import ResultatSpecific from './ResultatSpecific';
const DetailEvent = () => {
    // Hooks React
    const { id_evenement } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState('INFO');
    const [drawerOpen, setDrawerOpen] = useState(false);
    // Référence pour défiler jusqu'à la section "S'INSCRIRE"
    const inscrireRef = useRef(null);

    //  zety
    const parsedTickets = (() => {
        if (!event || !event.types_tickets) {
            console.warn("⚠️ Aucune donnée de tickets trouvée !");
            return [];
        }

        let tickets;
        try {
            console.log("🛠 Tickets bruts de DetailEvent :", event.types_tickets);

            tickets = JSON.parse(event.types_tickets); // Premier parsing

            if (typeof tickets === "string") {
                tickets = JSON.parse(tickets); // Deuxième parsing si nécessaire
            }

            tickets = tickets.map(ticket => ({
                ...ticket,
                nbr_ticket_disponible: ticket.nbr_ticket_disponible !== undefined && ticket.nbr_ticket_disponible !== 0
                    ? parseInt(ticket.nbr_ticket_disponible, 10) || 0
                    : parseInt(ticket.quantite, 10) || 0, // 🔹 Prendre `quantite` si `nbr_ticket_disponible` est absent ou 0
                prix_ticket: parseInt(ticket.prix, 10) || 0 // 🔹 Utiliser `prix` car `prix_ticket` peut être manquant
            }));

            console.log("✅ Tickets après correction :", tickets);
        } catch (error) {
            console.error("❌ Erreur lors du parsing des tickets :", error);
            return [];
        }

        return Array.isArray(tickets) ? tickets : [];
    })();
    // Fonction pour défiler jusqu'à "S'INSCRIRE"
    const scrollToInscrire = () => {
        inscrireRef.current?.scrollIntoView({ behavior: 'smooth' });
        setActivePage("S'INSCRIRE");
    };
    // Fonction pour gérer la navigation
    const handleNavigation = (page) => {
        setActivePage(page);
    };

    // Fonction pour ouvrir/fermer le Drawer (menu mobile)
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Effet pour récupérer les détails de l'événement
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/organizer/event/${id_evenement}`);
                console.log('Données récupérées depuis l\'API :', response.data); // LOG ICI
                setEvent(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'événement :', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id_evenement]);

    // Drawer pour les petits écrans
    const drawer = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                {['INFO', "S'INSCRIRE", 'CALENDRIER', 'RÉSULTATS'].map((text) => (
                    <ListItem button key={text} onClick={() => handleNavigation(text)}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Contenu principal basé sur la page active
    const renderContent = () => {
        if (loading) {
            return (
                <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                    Chargement des détails de l'événement...
                </Typography>
            );
        }

        if (!event) {
            return (
                <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                    Événement introuvable.
                </Typography>
            );
        }

        switch (activePage) {
            case 'INFO':
                return (
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        margin: 0,
                        padding: 0,
                    }}>

                        {/* Affichage de l'image via le composant ImageDisplay */}
                        <Imagedisplay event={event} />
                        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, padding: 0, mt: -5 }}>
                            <ContenuPrincipal event={event} onScrollToInscrire={scrollToInscrire} />

                            {/* 🔹 Ajout des billets sous la description */}
                            <Box sx={{ mt: 5, px: 2 }}>
                                <EventTicketsList tickets={parsedTickets} event={event} />
                            </Box>
                        </Container>
                    </Box>
                );



            case "S'INSCRIRE":
                return (
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {/* Affichage de l'image via le composant ImageDisplay */}
                        <Imagedisplay event={event} />

                        <Container
                            maxWidth="md"
                            sx={{
                                position: 'relative',
                                zIndex: 2,
                                padding: 0,

                            }}
                        >
                            {/* Texte principal */}
                            <Grid item xs={12} md={8} sx={{
                                marginLeft: { md: 8, xs: 1 }, paddingTop: 4

                            }}>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {event.nom_event}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'gray', marginBottom: '20px', marginTop: '20px' }}
                                    >
                                        <DateRangeIcon
                                            sx={{
                                                verticalAlign: 'middle',
                                                mr: 1,
                                                width: 18,
                                                height: 18,
                                                color: '#f50057',
                                            }}
                                        />
                                        <span style={{ fontSize: '12px', paddingRight: '10px' }}>
                                            {new Date(event.date_debut).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>{' '}
                                        |{' '}
                                        <HelpOutlineIcon
                                            sx={{
                                                verticalAlign: 'middle',
                                                mr: 1,
                                                ml: 1,
                                                width: 18,
                                                height: 18,
                                                color: ' #f50057',
                                            }}
                                        />
                                        <span style={{ fontSize: '12px', paddingRight: '10px' }}>
                                            {event.nom_sport}
                                        </span>{' '}
                                        |{' '}
                                        <InfoOutlinedIcon
                                            sx={{
                                                verticalAlign: 'middle',
                                                mr: 1,
                                                ml: 1,
                                                width: 18,
                                                height: 18,
                                                color: ' #f50057',
                                            }}
                                        />
                                        <span style={{ fontSize: '12px' }}>{event.type_event}</span>
                                    </Typography>
                                    <Divider
                                        sx={{
                                            borderColor: '#898D8F',
                                            marginY: 2,
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* Affichage du formulaire via le composant Signuppart */}
                            <Signuppart />
                        </Container>
                    </Box>
                );


            case 'CALENDRIER':
                return (

                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        margin: 0,
                        padding: 0,
                    }}>
                        {/* Affichage de l'image via le composant ImageDisplay */}
                        <Imagedisplay event={event} />
                        <Container
                            maxWidth=""
                            sx={{
                                position: 'relative',
                                zIndex: 2,
                            marginLeft:'80px'
                            }}
                        >
                          
                            <CalendrierPublic/>
                        </Container>
                    </Box>
                );

            case 'RÉSULTATS':
                return (
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        marginLeft:'80px',
                        padding: 0,
                    }}>
                        {/* Affichage de l'image via le composant ImageDisplay */}
                        <Imagedisplay event={event} />
                        <Container
                            maxWidth=""
                            sx={{
                                position: 'relative',
                                zIndex: 2,
                                padding: 0,
                            }}
                        >
                            <ResultatSpecific/>
                        </Container>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* AppBar (barre de navigation) */}
            <AppBar position="fixed" color="default" sx={{ paddingX: { xs: '10px', sm: '20px', md: '180px' } }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Link to="/pagevent">
                            <Box
                                component="img"
                                src={logo}
                                alt="Logo"
                                sx={{
                                    maxHeight: { xs: '40px', md: '50px' },
                                    width: 'auto',
                                }}
                            />
                        </Link>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                        {['INFO', "S'INSCRIRE", 'CALENDRIER', 'RÉSULTATS'].map((page) => (
                            <Button
                                key={page}
                                onClick={() => handleNavigation(page)}
                                sx={{ color: activePage === page ? '#f50057' : '#00A0C6' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Button
                            onClick={toggleDrawer(true)}
                            sx={{
                                color: '#00A0C6',
                                padding: 0,
                            }}
                        >
                            <MenuIcon sx={{ fontSize: '32px' }} /> {/* Taille ajustée ici */}
                        </Button>
                        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                            {drawer}
                        </Drawer>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Contenu principal */}
            <Container disableGutters sx={{
                marginTop: '65px', padding: 0,
                margin: 0,
                width: '100vw',
            }}>{renderContent()}</Container>

            <Footer />
        </>
    );
};

export default DetailEvent;






