import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import Header from './../../components/public/Header'; // Import du composant Header
import Footer from './../../components/public/Footer'; // Import du composant Footer
import EventCarousel from '../../components/public/EventCarousel';
import CalendrierPublic from './CalendrierPublic';

const CalendarPage = () => {


    return (
        <>
            {/* Ajout du composant Header */}
            <Header />

            <CalendrierPublic/>
            <EventCarousel />
            <Footer />
        </>
    );
};

export default CalendarPage;
