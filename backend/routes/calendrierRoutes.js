const express = require('express');
const router = express.Router();
const CalendrierControler = require('../controlers/CalendrierControler');

// ✅ Route publique pour récupérer les rencontres d'un événement
router.get('/eventcalendrier/:eventId/matches', CalendrierControler.getEventMatches);

// ✅ Nouvelle route pour récupérer tous les matchs de tous les événements
router.get('/allmatches', CalendrierControler.getAllMatches);

// Route pour récupérer les poules et les participants d'un événement
router.get('/eventcalendrier/:eventId/pools', CalendrierControler.getEventPools);


module.exports = router;
