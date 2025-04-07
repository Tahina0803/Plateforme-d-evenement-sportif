const db = require('./../db');
const nodemailer = require('nodemailer');
const { saveContactMessage } = require('../queries');

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    // (Optionnel) Enregistrer dans la base de données
    await saveContactMessage({ name, email, subject, message });

    // Envoi par mail via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Récepteur : admin
      subject: `[Contact] ${subject}`,
      text: `Nom : ${name}\nEmail : ${email}\n\n${message}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur envoi message de contact :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
};

// 🔹 Contrôleur : Récupérer les messages de contact
exports.getAllContactMessages = async (req, res) => {
    try {
      const messages = await db('contact_messages').orderBy('created_at', 'desc');
      res.status(200).json(messages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des messages.' });
    }
  };


// Supprimer un message de contact
exports.deleteContactMessage = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await db('contact_messages').where({ id }).del();
  
      if (deleted) {
        res.json({ message: 'Message supprimé avec succès.' });
      } else {
        res.status(404).json({ error: 'Message non trouvé.' });
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
    }
  };
