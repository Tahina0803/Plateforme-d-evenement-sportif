import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './style/connexion.css';
import Logo from './../../assets/img/logo.png';


const Connexion = () => {
  return (
    <Container>
      <Row className="justify-content-around gy-4">
        <Col
          lg={6}
          className="flex-column justify-content-center order-2 order-lg-1"
          data-aos="fade-up"
          data-aos-delay="100"
        >

        </Col>
        <Col lg={5} className="connexion-image order-1 order-lg-2" data-aos="fade-up" data-aos-delay="200">
          <img src={Logo} alt="feature" className="img-fluid" />
        </Col>
      </Row>
    </Container>
  );
};

export default Connexion;