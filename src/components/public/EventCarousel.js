import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import logoi from '../../assets/img/bbb.jpg'; 
import logoii from '../../assets/img/nnn.jpg'; 
import logot from '../../assets/img/ppp.jpg'; 
import logott from '../../assets/img/xxx.webp'; 
import logos from '../../assets/img/vvv.jpg'; 
import backgroundImage from '../../assets/img/ppp.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventCarousel = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Pour mobile
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md')); // Pour tablette

  // Paramètres du carousel, ajustés pour réactivité
  const settings = {
    dots: true,  // Ajouter des points de navigation
    infinite: true, // Défilement infini
    speed: 750, // Vitesse de défilement
    slidesToShow: isSmallScreen ? 2 : isMediumScreen ? 3 : 5, // Afficher 1 sur mobile, 2 sur tablette, 5 sur bureau
    slidesToScroll: 1, // Nombre d'éléments défilant en même temps
    autoplay: true, // Activer le défilement automatique
    autoplaySpeed: 6000, // Intervalle de 4 secondes
    centerMode: true, // Centrer les slides sur mobile et tablette
    centerPadding: isSmallScreen || isMediumScreen ? '0px' : '50px', // Pas de padding pour mobile/tablette, padding pour bureau
  };

  const events = [
    {
      title: "Semi marathon",
      image: logoi,    
    },
    {
      title: "Zriba night",
      image: logoii,    
    },
    {
      title: "Run med",
      image: logot,    
    },
    {
      title: "Marathon comare",
      image: logott,    
    },
    {
      title: "Semi marathon",
      image: logos,
    }
  ];

  return (
    <Box 
      sx={{ 
        padding: '50px', 
        backgroundColor: '#f0f0f0', 
        textAlign: 'center',// Centrer le contenu globalement
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,         
        backgroundSize: 'cover', // Assurer que l'image couvre tout le fond
        backgroundPosition: 'center', // Centrer l'image de fond
        backgroundRepeat: 'no-repeat', // Ne pas répéter l'image de fond
      }}
    >
      <Typography variant="h4" align="center" gutterBottom  sx={{   marginBottom: 5,fontWeight: 'bold', color:'white',  }}>
        Quelques références
      </Typography>
      <Slider {...settings}>
        {events.map((event, index) => (
          <Box key={index} sx={{ 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', // Assurer que l'image et le titre sont en colonne
            alignItems: 'center', // Centrer les éléments
          }}>
            <Box
              component="img"
              src={event.image} 
              alt={event.title} 
              sx={{
                width: '100%', // L'image occupe 100% de la largeur du Box
                height: isSmallScreen ? '120px' : '120px', // La hauteur sera ajustée proportionnellement à la largeur
                borderRadius: '50%', // Vous pouvez ajouter une valeur ici si vous souhaitez un arrondi
                marginBottom: 2,
                padding: isSmallScreen ? '0 50px' : '0 50px', // Ajustement réactif du padding
              }}
            />
            <Typography 
              variant="body1" 
              sx={{
                fontWeight: 'bold',
                color:'white',
                textAlign: 'center',
                fontSize: isSmallScreen ? '14px' : '16px' // Ajuster la taille du texte sur mobile
              }}
            >
              {event.title}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default EventCarousel;
