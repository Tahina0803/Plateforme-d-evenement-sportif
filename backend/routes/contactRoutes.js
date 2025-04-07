const express = require('express');
const router = express.Router();
const ContactControler = require('../controlers/ContactControler');

router.post('/send', ContactControler.sendContactMessage);

// 🔹 Route GET pour récupérer les messages de contact
router.get('/messages', ContactControler.getAllContactMessages);

// Route de suppression
router.delete('/messages/:id', ContactControler.deleteContactMessage);

module.exports = router;
