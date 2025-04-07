const express = require('express');
const ParticipantControler = require('../controlers/participantControler'); // Assurez-vous d'avoir ce contrôleur
const nodemailer = require('nodemailer'); // Importez Nodemailer pour l'envoi des emails
const router = express.Router();
const verifyToken = require('../middleware/jwtMiddleware');
const { getAllParticipantsforCertificat } = require('../queries');


let userVerificationCodes = {}; // Stocke temporairement les codes de validation pour chaque utilisateur

//*********************Participant**************************

// Route pour récupérer tous les participants
router.get('/all', ParticipantControler.getAllParticipants);

//Route pour supprimer un participant
router.delete('/participants/:id', ParticipantControler.deleteParticipant);

// Route pour récupérer le nombre total de participants
router.get('/count', ParticipantControler.getParticipantCount);


// Route pour créer un nouveau participant (sans restriction de rôle)
//router.post('/create', ParticipantControler.createParticipant);

// Route pour gérer l'inscription ou la connexion d'un participant
router.post('/registerOrLogin', ParticipantControler.registerOrLoginParticipant);


// Route pour envoyer le code de validation
router.post('/sendVerificationCode', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email est requis' });
    }

    // Générer un code de validation
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Code à 6 chiffres
    userVerificationCodes[email] = verificationCode; // Associer le code à l'email

    // Configurer Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou un autre service (ex : 'hotmail')
        auth: {
            user: 'rak.tahina02@gmail.com', // Remplacez par votre email
            pass: 'wikybpaufizeykql', // Remplacez par votre mot de passe ou token
        },
    });

    const mailOptions = {
        from: 'rak.tahina02@gmail.com',
        to: email,
        subject: 'Code de validation pour votre inscription',
        text: `Votre code de validation est : ${verificationCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Code de validation envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
    }
});

// Route pour valider le code de validation
router.post('/verifyCode', (req, res) => {
    const { email, code } = req.body;
// Log les données reçues
console.log('Données reçues:', { email, code });

    if (userVerificationCodes[email] && userVerificationCodes[email] === parseInt(code, 10)) {
        delete userVerificationCodes[email]; // Supprimer le code après validation
        return res.status(200).json({ message: 'Code vérifié avec succès' });
    }

    res.status(400).json({ message: 'Code invalide ou expiré' });
});

//Route pour le tableau de bord de participant
// router.get('/dashboard/:participantId', ParticipantControler.getDashboardData);

//Routes pour affiché le profil
router.get('/profile/:participantId', verifyToken, ParticipantControler.getParticipantProfile);

// Route pour la connexion du participant
router.post('/login/participant', ParticipantControler.loginParticipant);

// Route pour mettre à jour le profil du participant
router.put('/profile/:participantId', verifyToken, ParticipantControler.updateParticipantProfile);

// Route pour récupérer les événements auxquels le participant est inscrit
router.get('/events', verifyToken, ParticipantControler.getInscribedEvents);

// Route pour annuler une inscription
router.delete('/unsubscribe/:eventId', verifyToken, ParticipantControler.unsubscribeFromEvent);

// Route pour récupérer uniquement les événements auxquels le participant est inscrit
router.get('/evenements/inscrits', verifyToken, ParticipantControler.getParticipantEvents);

// Route pour créer une équipe (lié à un participant)
router.post('/equipe/create', verifyToken, ParticipantControler.createEquipe);

// Route pour récupérer les équipes du participant
router.get('/equipe/my-teams', verifyToken, ParticipantControler.getMyTeams);

// Route pour supprimer une équipe
router.delete('/equipe/delete/:id', verifyToken, ParticipantControler.deleteEquipe);

// Route pour modifier une équipe
router.put('/equipe/update/:id', verifyToken, ParticipantControler.updateEquipe);

// Route pour ajouter un joueur à une équipe
router.post('/equipe/:idEquipe/joueurs', verifyToken, ParticipantControler.addJoueur);

// Route pour récupérer les joueurs d'une équipe spécifique
router.get('/equipe/:idEquipe/joueurs', verifyToken, ParticipantControler.getJoueursByEquipe);

// Route pour modifier un joueur
router.put('/joueur/update/:id', verifyToken, ParticipantControler.updateJoueur);

// Route pour supprimer un joueur
router.delete('/joueur/delete/:id', verifyToken, ParticipantControler.deleteJoueur);

router.get("/allparticipants", async (req, res) => {
    try {
      const participants = await getAllParticipantsforCertificat();
      res.json(participants);
    } catch (error) {
      console.error("Erreur récupération participants :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des participants" });
    }
});



module.exports = router;