const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Assurez-vous que votre clé API est définie dans .env

// Fonction pour envoyer l'email d'activation avec un jeton unique
const sendActivationEmail = async (email, token) => {
  console.log("Email destinataire :", email); // pour vérifier l'email
  try {
    const activationLink = `http://localhost:3001/api/organizer/activate/${token}`;

    const message = {
      to: email,
      from: 'rak.tahina02@gmail.com', // Remplacez par votre adresse email vérifiée sur SendGrid
      subject: 'Confirmez votre adresse email',
      html: `<p>Veuillez cliquer sur le lien suivant pour activer votre compte :</p><a href="${activationLink}">${activationLink}</a>`,
    };

    await sgMail.send(message);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email d'activation :", error);
    throw error;
  }
};


module.exports = { sendActivationEmail };