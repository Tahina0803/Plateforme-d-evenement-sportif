import React, { useState } from 'react';
import Header from './../../components/public/Header';
import Footer from './../../components/public/Footer';
import ResultatsPublic from './ResultatsPublic';
import EventCarousel from '../../components/public/EventCarousel';

const ResultsPage = () => {
   
    return (
        <>
            {/* Ajout du composant Header */}
            <Header />

            <ResultatsPublic/>
            <EventCarousel />
            <Footer />
        </>
    );
};

export default ResultsPage;
