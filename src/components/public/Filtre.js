import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faTasksAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';



const services = [
    {
        icon: faCalendarAlt,
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
]

const Filtre = () => {


    return (
        <Container>
            <Row>
                <Col>
                    <div class="input-group mb-2">
                        <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Recherche" />
                        <div class="input-group-prepend">
                            <div class="input-group-text"><SearchIcon /></div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="section-title" data-aos="fade-up">
                <h2>Calendrier</h2>
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
    );
};

export default Filtre;