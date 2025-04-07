const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();  // Charge les variables d'environnement depuis le fichier .env
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);  // Clé API de SendGrid

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "L'email est requis" });
    }

    try {
        const existingSubscriber = await db('subscribers').where({ email }).first();
        if (existingSubscriber) {
            return res.status(400).json({ error: "Cet email est déjà abonné" });
        }

        await db('subscribers').insert({ email });
        res.status(201).json({ message: "Abonnement réussi !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post('/unsubscribe', async (req, res) => {
    const { email } = req.body;

    try {
        const deleted = await db('subscribers').where({ email }).del();
        if (deleted) {
            res.json({ message: "Désinscription réussie" });
        } else {
            res.status(400).json({ error: "Email non trouvé" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get('/list', async (req, res) => {
    try {
        const subscribers = await db('subscribers').select('*');
        res.json(subscribers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour envoyer une newsletter
router.post('/send-newsletter', async (req, res) => {
    const { subject, content } = req.body;
    
    if (!subject || !content) {
        return res.status(400).json({ error: "Le sujet et le contenu sont requis." });
    }

    try {
        // Récupérer la liste des abonnés depuis la base de données
        const subscribers = await db('subscribers').select('email'); 
        
        if (subscribers.length === 0) {
            return res.status(400).json({ error: "Aucun abonné disponible." });
        }

        const recipients = subscribers.map(subscriber => subscriber.email);

        // Définir les options de l'email
        const msg = {
            to: recipients,
            from: process.env.EMAIL_USER,  // Utilisez votre email pour l'envoi
            subject: subject,
            text: content,
        };

        // Envoi de l'email via SendGrid
        await sgMail.sendMultiple(msg);

        res.status(200).json({ message: 'Newsletter envoyée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'envoi de la newsletter." });
    }
});

module.exports = router;