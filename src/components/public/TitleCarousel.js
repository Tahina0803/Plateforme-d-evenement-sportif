import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import quickEventImage from '../../assets/img/xxx.webp'; // Image pour Quick Event
import basketballImage from '../../assets/img/b1.jpg'; // Image pour Basketball
import petanqueImage from '../../assets/img/P3.jpg'; // Ajoutez votre image pour Pétanque
import footballImage from '../../assets/img/F5.jpg'; // Ajoutez votre image pour Football

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Composant pour chaque section
const EventSection = ({ title, backgroundImage, subtitle }) => {
  return (
    <Box
      sx={{
        height: '40vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        textAlign: 'right',  // Texte aligné à gauche
        color: '#00FFB5',
        padding: '20px',  
        marginTop: '50px'  // Padding pour espacer légèrement le texte des bords
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',    // Position à 20% du bas de l'image (pour correspondre à votre capture)
          right: '5%',       // Alignement vers la gauche (ou ajuster selon votre besoin)
          zIndex: 1,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {`[ ${title} ]`}
        </Typography>
        {subtitle && (
          <Typography variant="h6" sx={{ marginTop: '10px', color: '#fff' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0)', // Overlay sombre
          zIndex: 0,
        }}
      />
    </Box>
  );
};

// Page principale avec carousel
const TitleCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <Slider {...settings}>
      <EventSection 
        title="Quick Event" 
        backgroundImage={quickEventImage} 
        subtitle="Une expérience riche et diversifiée" // Sous-titre pour cette section
      />
      <EventSection title="Basketball" backgroundImage={basketballImage} />
      <EventSection title="Pétanque" backgroundImage={petanqueImage} />
      <EventSection title="Football" backgroundImage={footballImage} />
    </Slider>
  );
};

export default TitleCarousel;
