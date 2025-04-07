const express = require('express');
const router = express.Router();
const ResultatsControler = require('../controlers/ResultatsControler');

// ✅ Récupérer les résultats d'un événement spécifique
router.get('/:eventId/matches', ResultatsControler.getEventResults);  // Récupérer les résultats pour un événement spécifique

// ✅ Récupérer tous les résultats
router.get('/all', ResultatsControler.getAllResults);  // Récupérer tous les résultats

router.get('/classement/:eventId/:phase/:journee', ResultatsControler.getClassementByEventPhaseJournee);

// Route pour récupérer le classement par événement
router.get("/classement/:eventId", ResultatsControler.getClassementByEvent);

module.exports = router;
