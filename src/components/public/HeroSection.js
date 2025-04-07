import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './style/heroSection.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
// import backImg from '../../assets/img/back.jfif';

const HeroSection = () => {
    return (
        <section id="hero" className="hero section" style={{backgroundColor: '#e0f2f1', paddingTop:'6em', paddingBottom:'4em'}}>
            {/* <div className="hero-bg">
                <img src={backImg} alt="Hero Background" />
            </div> */}
            <Container className="text-center">
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h1 data-aos="fade-up">
                        Bienvenue sur <span>QuickEvent</span>
                    </h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                    Gérez vos événements sportifs, participez et suivez vos résultats!
                    </p>
                    <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
                        <Button href="/event" className="btn-get-started">
                        Créer un événement
                        </Button>
                        {/* <a
                            href="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                            className="glightbox btn-watch-video d-flex align-items-center">
                            <FontAwesomeIcon icon={faPlayCircle} size="2x" />
                            <span style={{ marginLeft: '8px' }}>Watch Video</span>
                        </a> */}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HeroSection;
