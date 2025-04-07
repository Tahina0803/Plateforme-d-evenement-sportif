const express = require('express');
const verifyToken = require('../middleware/jwtMiddleware');
const OrganizerControler = require('../controlers/OrganizerControler');
const multer = require('multer');
const path = require('path');
const upload = require(path.resolve(__dirname, '../middleware/multerConfig'));

const router = express.Router();

//*********************Organisateur**************************


// Route pour créer un nouvel organisateur (sans restriction de rôle)
router.post('/create', OrganizerControler.createOrganizer);

// Route pour récupérer les informations d'un organisateur par ID (publique, sans token)
router.get('/profile/:id', OrganizerControler.getOrganizerById);

// Route pour la connexion de l'organisateur (pas de token requis pour la connexion)
router.post('/login/organizer', OrganizerControler.login);

// Route pour accéder au profil d'un organisateur (nécessite un token)
router.get('/profile', verifyToken, OrganizerControler.getProfilOrganizer);

// Nouvelle route pour mettre à jour le profil de l'organisateur
router.put('/profile', verifyToken, OrganizerControler.updateProfilOrganizer);

router.get('/activate/:token', OrganizerControler.activateAccount); // Route pour activer le compte

// Route pour vérifier si un email est déjà utilisé
router.post('/check-email', OrganizerControler.checkEmail);

// Nouvelles routes pour vérifier le prénom et le nom
router.post('/check-last-name', OrganizerControler.checkLastName);
router.post('/check-first-name', OrganizerControler.checkFirstName);

// Route 1 : Envoyer le code de réinitialisation
router.post('/send-reset-code', OrganizerControler.sendResetCode);

// Route 2 : Valider le code
router.post('/verify-reset-code', OrganizerControler.verifyResetCode);

// Route 3 : Réinitialiser le mot de passe
router.post('/reset-password', OrganizerControler.resetPassword);

//*********************Evenement**************************

// Route pour créer un nouvel événement
// router.post('/create-event', verifyToken, OrganizerControler.createEvent);

// routes pour afficher un evenement
router.get('/events', verifyToken, OrganizerControler.getAllEvents);
router.get('/allevents', OrganizerControler.getEventAll);

router.post(
  '/create-event',
  verifyToken,
  upload.fields([
    { name: 'logo_event', maxCount: 1 },
    { name: 'images_accueil', maxCount: 1 },
    { name: 'images_contenu', maxCount: 1 },
  ]),
  OrganizerControler.createEvent
);

//routes pour modifier un evenement
router.get('/events/:id', verifyToken, OrganizerControler.getEventById);

// Route pour mettre à jour un événement
router.put('/events/:id', verifyToken, upload.fields([
  { name: 'logo_event', maxCount: 1 },
  { name: 'images_accueil', maxCount: 1 },
  { name: 'images_contenu', maxCount: 1 },
]), OrganizerControler.updateEvent);

// Route pour supprimer un événement
router.delete('/events/:id', verifyToken, OrganizerControler.deleteEvent);

// Nouvelle route publique pour afficher tous les événements
router.get('/public-events', OrganizerControler.getAllPublicEvents);

router.get('/event/:id', OrganizerControler.getEventWithOrganizer);

// Route publique pour récupérer detail d'un événement spécifique par son ID
router.get('/event/:id', OrganizerControler.getEventDetailById);

//Route pour récupérer les participants d'un événement
router.get('/participants/all', verifyToken, OrganizerControler.getAllParticipantsByOrganizer);
// Route pour l'achat de tickets
router.post("/acheter-ticket", OrganizerControler.acheterTicket);

//Route pour la gestion de tickets par l'organisateur
router.get("/tickets/:organizerId", OrganizerControler.getOrganizerTickets);
router.get("/export-tickets/:organizerId", OrganizerControler.exportOrganizerTickets);



//*********************Participant**************************
// Route pour supprimer un participant par son ID dans le TB orgnisateur
router.delete('/participants/:participantId', verifyToken, OrganizerControler.deleteParticipant);

// route pour récupérer un participant spécifique
router.get('/participant/:participantId', verifyToken, OrganizerControler.getParticipantById);

//*********************generation poules**************************

// Récupérer les événements de l'organisateur
router.get('/events', verifyToken, OrganizerControler.getEventsByOrganizer);

// Récupérer le nombre de participants pour un événement depuis "participer"
router.get('/event/:eventId/participants', verifyToken, OrganizerControler.getParticipantsAndCountByEvent);


// Route pour créer des poules pour un événement donné
router.post('/create-pools', verifyToken, OrganizerControler.createPools);

// Route pour répartir les participants dans les poules de manière aléatoire
router.post('/assign-participants', verifyToken, OrganizerControler.assignParticipantsToPools);

// Route pour récupérer les poules et leurs participants pour un événement donné
router.get('/event/:eventId/pools', verifyToken, OrganizerControler.getPoolsWithParticipants);

// Récupérer les événements qui ont des poules
router.get('/events-with-pools', verifyToken, OrganizerControler.getEventsWithPools);


// ************* NOUVELLE ROUTE : ajout manuel d'un participant dans une poule *************
router.post('/manual-add-participant', verifyToken, OrganizerControler.addParticipantManual);

// Route pour supprimer les poules et leurs participants pour un événement donné
router.delete('/event/:eventId/pools', verifyToken, OrganizerControler.deletePoolsForEvent);

// ************* pour le rencontre *************
router.get('/organizer-events', verifyToken, OrganizerControler.getEventsByOrganizerMatch);
router.get('/eventmatch/:eventId/pools', verifyToken, OrganizerControler.getPoolsWithParticipantsMatch);

// Stocker une nouvelle rencontre
router.post('/creatematch', verifyToken, OrganizerControler.createMatch);

// Récupérer les rencontres d'un événement donné
router.get('/event/:eventId/matches', verifyToken, OrganizerControler.getMatchesByEvent);

// Route pour supprimer une rencontre
router.delete('/match/:matchId', verifyToken, OrganizerControler.deleteMatch);

// // pour récupérer le calendrier des rencontres
// router.get('/eventcalendrier/:eventId/matches', verifyToken, OrganizerControler.getCalendarMatchesByEvent);

// Route pour récupérer toutes les rencontres de tous les événements d'un organisateur
router.get('/eventcalendrier/matches', verifyToken, OrganizerControler.getAllCalendarMatches);

// Route pour récupérer les rencontres d'un événement spécifique
router.get('/eventcalendrier/:eventId/matches', verifyToken, OrganizerControler.getCalendarMatchesByEvent);

// //envoye email au participant 
router.post(
  '/participants/:id/send-email', // Route pour envoyer un email depuis un organisateur
  verifyToken, // Vérifie que l'organisateur est authentifié
   // Vérifie que l'utilisateur a le rôle "organizer"
  OrganizerControler.sendEmailToParticipant // Méthode du contrôleur
);

//*********************resultats**************************
// Route pour récupérer les informations d'un événement sélectionné
router.get('/event/:eventId/detailsresultats', verifyToken, OrganizerControler.getEventResultats);

// Récupérer les rencontres filtrées par phase, journée ou tour final
router.get('/event/:eventId/filtered-matches', verifyToken, OrganizerControler.getFilteredMatchesByEvent);

// Route pour enregistrer les résultats des rencontres
router.post('/event/:eventId/save-results', verifyToken, OrganizerControler.saveMatchResults);

// ✅ Route publique pour récupérer les événements
router.get('/public/events', OrganizerControler.getPublicEvents);


//********************* Liste resultats**************************
// Récupérer les résultats d'un événement

router.get('/event/:eventId/resultats', OrganizerControler.getEventResultatList);


//pour filtrer les resultats

router.get('/event/:eventId/resultats/filtered', OrganizerControler.getFilteredMatchesResultatList);

// Route pour récupérer tous les résultats des matchs de tous les événements
router.get('/all-resultats', verifyToken, OrganizerControler.getAllMatchesResultatList);

// Route pour modifier un résultat de match
router.put('/match/:matchId/update-score', verifyToken, OrganizerControler.updateMatchScore);

// Route pour supprimer un résultat de match via `id_resultat`
router.delete('/match/resultat/:resultId/delete', verifyToken, OrganizerControler.deleteMatchResult);

//********************* Classement**************************
// // Route pour récupère les résultats des matchs et calcule le classement.
router.get('/classement', verifyToken, OrganizerControler.getClassement);



module.exports = router;