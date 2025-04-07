import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {   faArrowRight, faCalendarAlt, faTasksAlt, faChartBar, faGears } from '@fortawesome/free-solid-svg-icons';
import './style/organisation.css';


const Organisation = () => {
  const services = [
    {
      icon : faCalendarAlt,
      title: 'Organisation de votre événement',
      description: 'Planifiez facilement tous les aspects de votre événement sportif, de la réservation des lieux à la coordination des équipes.',
      color: 'item-cyan',
    },
    {
      icon: faTasksAlt,
      title: 'Gestion de votre événement',
      description: "Contrôlez chaque détail de l'événement depuis une plateforme unique : inscriptions, horaires et communication.",
      color: 'item-orange',
    },
    {
      icon: faChartBar,
      title: 'Statistiques sur votre événement',
      description: 'Analysez les performances et la participation avec des rapports détaillés pour améliorer vos futurs événements.',
      color: 'item-teal',
    },
    {
      icon: faGears,
      title: 'Assistance et support aux utilisateurs',
      description: "Bénéficiez d'une aide rapide et efficace pour résoudre vos problèmes et optimiser l'utilisation de la plateforme.",
      color: 'item-red',
    }
  ];

  return (
    <section id="services" className="services section light-background mt-5">
      <Container>
        <div className="section-title" data-aos="fade-up">
          <h2>Organisez et promouvez vos événements sportifs</h2>
          <h3>En seulement 4 étapes</h3>
        </div>
        <Row className="g-5">
          {services.map((service, index) => (
            <Col lg={6} key={index} data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
              <Card className={`service-item ${service.color} position-relative`}>
                <div className="icon">
                  <FontAwesomeIcon icon={service.icon} size="2x" />
                </div>
                <Card.Body>
                  <Card.Title as="h3">{service.title}</Card.Title>
                  <Card.Text>{service.description}</Card.Text>
                  <a href="#" className="read-more stretched-link">
                  En savoir plus <FontAwesomeIcon icon={faArrowRight} className="learnmore" />
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Organisation;
