import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './style/feature.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import fonctionnalite from './../../assets/img/fonctionnalite.png';

const featuresData = [
  {
    icon: <CalendarMonthIcon className="icon-style" />,
    title: 'Événements et Calendrier',
    description: "Intégration d'un calendrier d'événements où les utilisateurs peuvent trouver, s'inscrire ou planifier des événements pertinents.",
  },
  {
    icon: <ShowChartIcon className="icon-style" />,
    title: 'Analytics et Statistiques',
    description: "Outils d'analyse intégrés pour suivre les performances, y compris des rapports détaillés sur l'utilisation de l'application et les comportements des utilisateurs.",
  },
  {
    icon: <GroupIcon className="icon-style" />,
    title: 'Gestion des participants',
    description: "Fonctionnalités permettant d'ajouter, de modifier, de supprimer et de gérer des utilisateurs ou des participants facilement.",
  },
  {
    icon: <DashboardIcon className="icon-style" />,
    title: 'Tableau de bord',
    description: "Suivez le nombre de participants, les paiements et les recettes. Toutes les données essentielles sur votre événement réunies au même endroit.",
  },
];

const Feature = () => {
  return (
    <section id="more-features" className="more-features section mt-5">
      <div className="section-title" data-aos="fade-up">
        <h2>Fonctionnalités principales de l'application</h2>
      </div>
      <Container>
        <Row className="justify-content-around gy-4">
          <Col
            lg={6}
            className="flex-column justify-content-center order-2 order-lg-1"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3>Les fonctionnalités incontournables de notre application</h3>

            <Row>
              {featuresData.map((feature, index) => (
                <Col lg={6} className="icon-box d-flex" key={index}>
                  {feature.icon}
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          <Col lg={5} className="features-image order-1 order-lg-2" data-aos="fade-up" data-aos-delay="200">
            <img src={fonctionnalite} alt="feature" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Feature;
