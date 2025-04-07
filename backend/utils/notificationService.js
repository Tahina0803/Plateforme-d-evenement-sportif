const nodemailer = require('nodemailer');
// Utilisez une API comme Twilio pour l'envoi de SMS
const { Twilio } = require('twilio');
const { formatPhoneToE164 } = require('./validation');

exports.sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
  });

  await transporter.sendMail({ from: process.env.EMAIL, to, subject, text: message });
};

exports.sendSMS = async (to, message) => {
  const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  // Formatez le numéro en E.164
  const formattedPhone = formatPhoneToE164(to);

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: formattedPhone,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS via Twilio:', error);
    throw error; // Propager l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

