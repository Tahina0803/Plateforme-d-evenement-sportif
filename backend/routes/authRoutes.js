
const express = require('express');
const verifyToken = require('../middleware/jwtMiddleware');
const verifyRoles = require('../middleware/roleMiddleware');
const AdminControler = require('../controlers/AdminControler');
const OrganizerControler = require('../controlers/OrganizerControler');

const router = express.Router();

// ************ ADMINISTRATEURS ************************
// Routes réservées aux administrateurs pour gérer la plateforme
// Route pour obtenir les informations de l'admin connecté (avec JWT et rôle 'admin')
router.get('/admin/profile', verifyToken, verifyRoles(['admin']), AdminControler.getProfile);
 // Routes pour les administrateurs
 router.post('/login/admin', AdminControler.login);
// Route pour obtenir tous les administrateurs (protégée par JWT avec vérification du rôle 'admin')
router.get('/admin/all', verifyToken, verifyRoles(['admin']), AdminControler.getAllAdmins);
// Route pour créer un nouvel admin (protégée par JWT avec rôle 'admin')
router.post('/admin/create', verifyToken, verifyRoles(['admin']), AdminControler.createAdmin);
// Route pour supprimer un admin
router.delete('/admin/delete/:id', AdminControler.deleteAdmin);
// Route pour modifier un administrateur
router.put('/admin/edit/:id', verifyToken, verifyRoles(['admin']), AdminControler.editAdmin);
//***********Organisateurs************* */


// Route pour récupérer le nombre total d'organisateurs
router.get('/admin/organizers/count', OrganizerControler.getOrganizerCount);
// Routes pour gérer les organisateurs

router.get('/admin/organizers', (req, res, next) => {
    console.log("Route /admin/organizers atteinte");
    next();
  }, verifyToken, verifyRoles(['admin']), OrganizerControler.getAllOrganizers);
  
router.put('/admin/organizers/toggle-status/:id', verifyToken, verifyRoles(['admin']), OrganizerControler.toggleOrganizerStatus);
router.delete('/admin/organizers/:id', verifyToken, verifyRoles(['admin']), OrganizerControler.deleteOrganizer);
//nouveau
//Route pour Envoyer un email à un organisateur
router.post(
  '/admin/organizers/:id/send-email',
  verifyToken,
  verifyRoles(['admin']),
  AdminControler.sendEmailToOrganizer // Méthode appelée ici
);
// Récupérer les événements d'un organisateur
router.get(
  '/admin/organizers/:id/events',
  verifyToken,
  verifyRoles(['admin']),
  OrganizerControler.getEventsByOrganizerId
);


module.exports = router;