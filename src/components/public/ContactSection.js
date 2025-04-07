import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './style/contactStyle.css';

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState(null); // success | error

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('http://localhost:3001/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        console.error(result.error || "Erreur d'envoi");
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact section mb-3">
      <Container className="section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <p>« N'hésitez pas à nous contacter, nous sommes là pour vous aider ! »</p>
      </Container>

      <Container data-aos="fade-up" data-aos-delay="100">
        <Row className="gy-4">
          <Col lg={5}>
            <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="200">
              <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" className='contactIcon' />
              <h3>Address</h3>
              <p>BR108 Campus Universitaire, Diego Suarez, DS 201</p>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="300">
              <FontAwesomeIcon icon={faPhone} size="2x" className='contactIcon' />
              <h3>Contacter nous</h3>
              <p>+261 344804984</p>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="400">
              <FontAwesomeIcon icon={faEnvelope} size="2x" className='contactIcon'/>
              <h3>Contactez-nous </h3>
              <p>hajaniainarakotomalala@gmail.com</p>
            </div>
          </Col>
        </Row>

        <Row className="gy-4 mt-1">
          <Col lg={6} data-aos="fade-up" data-aos-delay="300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
              frameBorder="0"
              style={{ border: 0, width: '100%', height: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Col>

          <Col lg={6}>
            <Form onSubmit={handleSubmit} className="php-email-form">
              <Row className="gy-4">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={12}>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Objet"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={12}>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={6}
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={12} className="text-center">
                  {loading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <Button type="submit">Envoyer</Button>
                  )}
                  {status === 'success' && (
                    <div className="text-success mt-2">✅ Message envoyé avec succès !</div>
                  )}
                  {status === 'error' && (
                    <div className="text-danger mt-2">❌ Erreur lors de l'envoi du message.</div>
                  )}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactSection;
