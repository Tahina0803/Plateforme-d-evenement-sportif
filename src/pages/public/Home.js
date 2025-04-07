import React from 'react';
import { Container } from 'react-bootstrap';
import ContactSection from '../../components/public/ContactSection';
import Faq from '../../components/public/Faq';
import Feature from '../../components/public/Feature';
import Footer from '../../components/public/Footer';
import HeroSection from '../../components/public/HeroSection';
import Organisation from '../../components/public/organisation';
import Header from './../../components/public/Header';
import './style/home.css';

const Home = () => {
    return (
        <div className='home Container-fluid'>
            
                <Header />
            
            <div className='container-fluid'>
                <HeroSection/>
            </div>
            <Container className="container-fluid">
                <Organisation />
                <Feature />
                <Faq />
                <ContactSection />
            </Container>
            <div style={{ position: 'relative' }}>
                <Footer />
            </div>
        </div>
    );
};

export default Home;