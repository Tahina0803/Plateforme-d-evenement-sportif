import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import "./style/footerstyle.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!isValidEmail(email)) {
      setMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setMessage(data.message || data.error);
      setEmail('');

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage("Erreur lors de l'inscription");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="footer light-background">
      <Container className="footer-top">
        <Row className="gy-4">
          <Col lg={4} md={6} className="footer-about">
            <a href="/" className="logo d-flex align-items-center">
              <span className="sitename">QuickEvent</span>
            </a>
            <div className="footer-contact pt-3">
              <p>BR108 CUR Lazaret</p>
              <p>Diego Suarez</p>
              <p className="mt-3"><strong>Phone:</strong> <span>+261 344804984</span></p>
              <p><strong>Email:</strong> <span>hajaniainarakotomalala@gmail.com</span></p>
            </div>
            <div className="social-links d-flex mt-4">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </Col>
          <Col lg={2} md={3} className="footer-links">
            <h4>Liens utiles</h4>
            <ul>
              <li><a href="#">Accueil</a></li>
              <li><a href="#">À propos de nous</a></li>
              <li><a href="#">Conditions de service</a></li>
              <li><a href="#">Politique de confidentialité</a></li>
            </ul>
          </Col>
          <Col lg={2} md={3} className="footer-links">
            <h4>Nos services</h4>
            <ul>
              <li><a href='/event'>Organiser un événement</a></li>
              <li><a href="/login">Participer à un événement</a></li>
            </ul>
          </Col>
          <Col lg={4} md={12} className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Recevez gratuitement nos conseils et actualités destinés aux organisateurs d’événements!</p>
            <Form onSubmit={handleSubscribe}>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Entrer votre Email' 
                  required 
                />
                <input type="submit" value="S’abonner" />
              </div>
            </Form>
            {message && <p className="subscription-message">{message}</p>}
          </Col>
        </Row>
      </Container>
      <Container className="copyright text-center mt-4">
        <p>© <span>Copyright</span> <strong className="px-1 sitename">QuickEvent</strong><span> Tous droits réservés</span></p>
        <div className="credits">
          Conçu par <a href="https://IrayMarket.com/" target="_blank" rel="noopener noreferrer">Haja & Tah</a>
        </div>
        {/* Scroll Top */}
        <div id='scroll-top' className='scroll-top d-flex align-items-center justify-content-center' onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowAltCircleUp} size="2x" />
        </div>
      </Container>
    </div>
  );
};

export default Footer;
