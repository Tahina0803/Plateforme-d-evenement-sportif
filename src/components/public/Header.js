import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import quickEventImage from '../../assets/img/xxx.webp'; // Image pour Quick Event
import basketballImage from '../../assets/img/b1.jpg'; // Image pour Basketball
import petanqueImage from '../../assets/img/P3.jpg'; // Image pour Pétanque
import footballImage from '../../assets/img/F5.jpg'; // Image pour Football
import logo from './../../assets/img/logo.png';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './style/headStyle.css'; // Assuming you have additional CSS for custom styling

// Composant pour chaque section de carousel
const EventSection = ({ title, backgroundImage, subtitle }) => {
  return (
    <Box
      sx={{
        height: '50vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        color: '#00FFB5',
      }}
    >
      <Box
        className="slider-text"
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          zIndex: 1,
          display: { xs: 'none',sm: 'block' }
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
    </Box>
  );
};

// Composant du carousel
const TitleCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Slider {...settings}>
      <EventSection
        title="Quick Event"
        backgroundImage={quickEventImage}
        subtitle="Une expérience riche et diversifiée"
      />
      <EventSection title="Basketball" backgroundImage={basketballImage} />
      <EventSection title="Pétanque" backgroundImage={petanqueImage} />
      <EventSection title="Football" backgroundImage={footballImage} />
    </Slider>
  );
};

// Composant Header avec fond dynamique
function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 100); // Change la valeur selon l'endroit où tu veux déclencher le changement
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`} // Change class based on scroll
    >
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              marginRight: '80px',
              maxHeight: '40px',
              marginLeft: '10px',
              borderRadius: '20px 0 20px 0',
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className={`toggle-icon ${scrolled ? 'icon-scrolled' : 'icon-not-scrolled'}`} // Ajouter des classes pour personnaliser l'icône du toggle
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav
            className={`me-auto ${window.innerWidth < 960 ? 'text-center w-100' : ''}`} // Ajouter des classes pour centrer le texte sur les petits écrans
          >
            <LinkContainer to="/">
              <Nav.Link
                className={`navbar-link ${scrolled ? 'navbar-link-scrolled' : ''}`}
              >
                Accueil
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/pagevent">
              <Nav.Link
                className={`navbar-link ${scrolled ? 'navbar-link-scrolled' : ''}`}
              >
                Les évènements
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/calendar">
              <Nav.Link
                className={`navbar-link ${scrolled ? 'navbar-link-scrolled' : ''}`}
              >
                Calendrier
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/resultat">
              <Nav.Link
                className={`navbar-link ${scrolled ? 'navbar-link-scrolled' : ''}`}
              >
                Résultat
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/pubevent">
              <Nav.Link
                className={`navbar-link ${scrolled ? 'navbar-link-scrolled' : ''}`}
              >
                Publier un évènements
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/apropos">
              <Nav.Link
                className={`navbar-link ${scrolled ? 'navbar-link-scrolled' : ''}`}
              >
                A propos
              </Nav.Link>
            </LinkContainer>
          </Nav>
          <LinkContainer to="/login">
            <Button
              variant={scrolled ? 'primary' : 'outline-light'}
              className="login-button d-none d-md-inline" // Masquer le bouton sur les écrans < 768px
            >
              Se connecter
            </Button>
          </LinkContainer>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Page principale combinant Header et Carousel
const HomePage = () => {
  return (
    <>
      <Header />
      <Box sx={{ mt: '0px' }}> {/* Ajustement de la marge pour compenser le fixed header */}
        <TitleCarousel />
      </Box>
    </>
  );
};

export default HomePage;
