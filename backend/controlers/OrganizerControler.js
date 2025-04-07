const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const { sendActivationEmail } = require('./OrganizerEmailService'); // Import du service d'envoi d'email
const Token = require('../middleware/jwtMiddleware'); // Modèle pour la table Token
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
  createOrganizerQuery,
  getOrganizerByEmailQuery,
  getAllOrganizersQuery,
  getOrganizerByIdQuery,
  getEventWithOrganizerQuery,
  updateOrganizerQuery,
  deleteOrganizerQuery,
  insertTokenQuery,
  getParticipantByIdQuery,

} = require('../queries'); // Import des requêtes
const { log } = require('console');
const { Parser } = require("json2csv");

// Fonction de connexion pour l'organisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Données reçues :', req.body); // Log des données reçues

  try {
    const organizer = await getOrganizerByEmailQuery(email);

    if (!organizer) {
      return res.status(404).json({ message: 'Organisateur non trouvé' });
    }


    // Vérifiez si le compte est activé
    if (!organizer.isActive) {
      return res.status(403).json({ message: "Veuillez activer votre compte en vérifiant votre email." });
    }

    const validPassword = await bcrypt.compare(password, organizer.mdp_organisateur);
    if (!validPassword) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT avec l'ID de l'organisateur
    const token = jwt.sign({ id: organizer.id_organisateur, role: 'organizer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' });

    res.status(200).json({
      message: 'Connexion réussie',
      token, // Envoie le token au frontend
      organizerId: organizer.id_organisateur // Ajoute l'ID de l'organisateur pour redirection au dashboard
    });
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.createOrganizer = async (req, res) => {
  const { nom_organisateur, prenom_organisateur, email_organisateur, tel_organisateur, mdp_organisateur } = req.body;
  console.log("Données reçues:", req.body);

  try {
    console.log("Vérification de l'email existant...");
    const existingOrganizer = await getOrganizerByEmailQuery(email_organisateur);
    const existingTokenEntry = await db('tokens').where({ email: email_organisateur }).first();

    if (existingOrganizer || existingTokenEntry) {
      return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
    }

    console.log("Hashing du mot de passe...");
    const hashedPassword = await bcrypt.hash(mdp_organisateur, 10);

    // Génération d'un token d'activation unique
    const activationToken = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expiration dans 24 heures

    // Stocker les données dans la table 'tokens'
    console.log("Insertion du token et des données utilisateur dans la table tokens...");
    await insertTokenQuery({
      token: activationToken,
      expiresAt,
      email: email_organisateur,
      nom_organisateur,
      prenom_organisateur,
      tel_organisateur,
      mdp_organisateur: hashedPassword,
    });

    // Envoyer l'e-mail d'activation avec le lien contenant le même token
    console.log("Envoi de l'email d'activation...");
    await sendActivationEmail(email_organisateur, activationToken); // Transmettez le token ici
    console.log("Token généré pour l'activation :", activationToken);

    res.status(201).json({ message: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer.' });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription. Veuillez réessayer.", error: error.message });
  }
};

//récupération de l'organisateur par id
exports.getOrganizerById = async (req, res) => {
  console.log("Requête reçue avec params :", req.params); // Vérifier les paramètres

  const id = parseInt(req.params.id, 10); // Convertir l'ID en entier

  if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide, doit être un nombre." });
  }

  try {
      // Correction : Convertir l'ID et utiliser le bon champ "id_organisateur"
      const organizer = await db('organisateur').where('id_organisateur', id).first();

      if (!organizer) {
          return res.status(404).json({ message: "Organisateur non trouvé" });
      }

      res.json(organizer);
  } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'organisateur :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer le nombre total d'organisateurs

exports.getOrganizerCount = async (req, res) => {
  try {
    const count = await db('organisateur').count('id_organisateur as total').first(); // ✅ Récupère seulement le nombre total
    res.status(200).json({ total: count.total }); // ✅ Retourne { total: X }
  } catch (error) {
    console.error("Erreur lors du comptage des organisateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getProfilOrganizer = async (req, res) => {
  try {
    // Assurez-vous que organizerId est un entier.
    const organizerId = parseInt(req.user?.id , 10);
    if (!organizerId) {
      return res.status(400).json({ message: 'ID de l\'organisateur manquant ou invalide' });
    }

    const organizer = await getOrganizerByIdQuery(organizerId);
    console.log("Données de l'organisateur :", organizer);

    if (!organizer) {
      return res.status(404).json({ message: 'Organisateur non trouvé' });
    }

    res.status(200).json({
      name: organizer.nom_organisateur,
      email: organizer.email_organisateur,
      prenom: organizer.prenom_organisateur,
      tel_organisateur: organizer.tel_organisateur,
      date_inscription: organizer.date_inscription,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateProfilOrganizer = async (req, res) => {
  const organizerId = req.user?.id;
  const { name, prenom, email, tel_organisateur, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    console.log("Données reçues :", { name, prenom, email, tel_organisateur, oldPassword, newPassword, confirmPassword });

    // Récupération de l'organisateur
    const organizer = await getOrganizerByIdQuery(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: 'Organisateur non trouvé' });
    }
    console.log("Organisateur récupéré :", organizer);

    // Initialisation des données à mettre à jour
    const updateData = {
      nom_organisateur: name,
      prenom_organisateur: prenom,
      email_organisateur: email,
      tel_organisateur: String(tel_organisateur),
    };

    // Vérification de l'ancien mot de passe si nécessaire
    if (oldPassword && organizer.mdp_organisateur) {
      const isMatch = await bcrypt.compare(oldPassword, organizer.mdp_organisateur);
      if (!isMatch) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
      }
    } else if (oldPassword && !organizer.mdp_organisateur) {
      // Si aucun ancien mot de passe n'est défini pour cet utilisateur, permettre la mise à jour
      if (newPassword && newPassword === confirmPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.mdp_organisateur = hashedPassword;
      } else {
        return res.status(400).json({ message: 'Le nouveau mot de passe et la confirmation ne correspondent pas' });
      }
    } else if (newPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Le nouveau mot de passe et la confirmation ne correspondent pas' });
    }

    // Hashage du nouveau mot de passe si fourni sans ancien mot de passe
    if (newPassword && !oldPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.mdp_organisateur = hashedPassword;
    }

    // Mise à jour de l'organisateur dans la base de données
    const result = await updateOrganizerQuery(organizerId, updateData);
    console.log('Données de mise à jour :', updateData);
    console.log('Résultat de la mise à jour:', result);

    if (result === 0) {
      return res.status(400).json({ message: 'Échec de la mise à jour du profil' });
    }

    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
};

exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await db("organisateur")
      .leftJoin("evenement", "organisateur.id_organisateur", "evenement.id_organisateur")
      .select(
        "organisateur.id_organisateur",
        "organisateur.nom_organisateur",
        "organisateur.prenom_organisateur",
        "organisateur.email_organisateur"
      )
      .count("evenement.id_evenement as eventCount") // Compter les événements
      .groupBy("organisateur.id_organisateur"); // Grouper par organisateur

    console.log("Organisateurs récupérés :", organizers);
    res.status(200).json(organizers);
  } catch (error) {
    console.error("Erreur lors de la récupération des organisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Fonction pour modifier un organisateur
exports.editOrganizer = async (req, res) => {
  const { id } = req.params;
  const { nom_organisateur, prenom_organisateur, email_organisateur, tel_organisateur, mdp_organisateur } = req.body;

  try {
    await updateOrganizerQuery(id, { nom_organisateur, prenom_organisateur, email_organisateur, tel_organisateur, mdp_organisateur });
    res.status(200).json({ message: 'Organisateur modifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'organisateur', error });
  }
};

// Fonction pour supprimer un organisateur
exports.deleteOrganizer = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteOrganizerQuery(id); // Utilisation de la requête externalisée
    res.status(200).json({ message: 'Organisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'organisateur', error });
  }
};


exports.toggleOrganizerStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const organizer = await getOrganizerByIdQuery(id);

    if (!organizer) {
      return res.status(404).json({ message: 'Organisateur non trouvé' });
    }

    const newStatus = !organizer.isActive;
    await updateOrganizerQuery(id, { isActive: newStatus });

    res.status(200).json({ isActive: newStatus });
  } catch (error) {
    console.error('Erreur lors de l\'activation/désactivation :', error);
    res.status(500).json({ message: 'Erreur lors de l\'activation/désactivation' });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    // Affichage du token reçu dans l'URL pour vérification
    console.log("Token de l'URL:", `"${token}"`);

    // Récupérer les données utilisateur en utilisant le token
    const tokenEntry = await db('tokens').where({ token }).first();
    console.log("Token Entry dans la base de données:", tokenEntry);

    // Vérification de la correspondance des tokens
    if (tokenEntry && token !== tokenEntry.token) {
      console.log("Les tokens ne correspondent pas !");
    }

    if (!tokenEntry) {
      return res.status(400).json({ message: "Token non trouvé dans la base de données." });
    }

    // Afficher la date d'expiration et la date actuelle pour vérification
    console.log("Date d'expiration :", tokenEntry.expires_at);
    console.log("Date actuelle :", new Date());

    if (new Date(tokenEntry.expires_at) < new Date()) {
      return res.status(400).json({ message: "Le lien d'activation a expiré." });
    }

    // Récupération et affichage de tous les tokens pour diagnostic
    const allTokens = await db('tokens').select('*');
    console.log("Tous les tokens enregistrés :", allTokens);

    // Créer l'organisateur dans la base de données
    const organizerId = await createOrganizerQuery({
      nom_organisateur: tokenEntry.nom_organisateur,
      prenom_organisateur: tokenEntry.prenom_organisateur,
      email_organisateur: tokenEntry.email,
      tel_organisateur: tokenEntry.tel_organisateur,
      mdp_organisateur: tokenEntry.mdp_organisateur,
      date_inscription: new Date(),
      isActive: true
    });

    // Supprimer le token après activation
    await db('tokens').where({ token }).del();

    // Redirection vers la page de connexion ou autre
    res.redirect(`http://localhost:3000/login?activation=success`);
  } catch (error) {
    console.error("Erreur lors de l'activation du compte :", error);
    res.status(500).json({ message: "Erreur lors de l'activation du compte." });
  }
};

// Vérifiez si l'email existe déjà dans la base de données
exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifiez si l'email existe déjà dans la base de données
    const existingOrganizer = await db('organisateur').where({ email_organisateur: email }).first();

    if (existingOrganizer) {
      // Si l'email est déjà utilisé
      res.json({ isAvailable: false });
    } else {
      // Si l'email n'est pas utilisé
      res.json({ isAvailable: true });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.checkFirstName = async (req, res) => {
  const { firstName } = req.body;

  try {
    const existingOrganizer = await db('organisateur').where({ prenom_organisateur: firstName }).first();

    if (existingOrganizer) {
      return res.json({ isAvailable: false });
    } else {
      return res.json({ isAvailable: true });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du prénom :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Vérification de l'unicité du nom (lastName)
exports.checkLastName = async (req, res) => {
  const { lastName } = req.body;

  try {
    const existingOrganizer = await db('organisateur').where({ nom_organisateur: lastName }).first();

    if (existingOrganizer) {
      return res.json({ isAvailable: false });
    } else {
      return res.json({ isAvailable: true });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du nom :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


// Envoyer le code de réinitialisation mot de passe oublier Organisateur
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const organizer = await db('organisateur').where({ email_organisateur: email }).first();
    if (!organizer) {
      return res.status(404).json({ message: 'Email non trouvé.' });
    }

    const resetCode = crypto.randomBytes(3).toString('hex'); // Génère un code de réinitialisation
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // Expire après 15 minutes

    // Mettre à jour la base de données avec le code et la date d'expiration
    await db('organisateur')
      .where({ email_organisateur: email })
      .update({ reset_code: resetCode, reset_code_expiry: resetCodeExpiry });

    // Envoyer l'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Code de réinitialisation de mot de passe',
      text: `Votre code de réinitialisation est : ${resetCode}. Ce code expirera dans 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Code de réinitialisation envoyé à votre email.' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du code de réinitialisation :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Valider le code de réinitialisation mot de passe oublier Organisateur
exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const organizer = await db('organisateur')
      .where({ email_organisateur: email, reset_code: code })
      .first();

    if (!organizer) {
      return res.status(400).json({ message: 'Code invalide ou expiré.' });
    }

    const now = new Date();
    if (new Date(organizer.reset_code_expiry) < now) {
      return res.status(400).json({ message: 'Code expiré.' });
    }

    res.status(200).json({ message: 'Code valide.' });
  } catch (err) {
    console.error('Erreur lors de la vérification du code :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Réinitialiser le mot de passe mot de passe oublier Organisateur
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('organisateur')
      .where({ email_organisateur: email })
      .update({ mdp_organisateur: hashedPassword, reset_code: null, reset_code_expiry: null });

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

//*********************Creation d'evenement**************************


exports.createEvent = async (req, res) => {
  const {
    nom_event,
    type_event,
    nom_sport,
    lieu_event,
    nbr_participant,
    genre_participant, // Inclut genre_participant
    date_debut,
    date_fin,
    date_creationEvent,
    description_accueil,
    description_detail,
    categorie_participant,
    frais_inscription,
    statut_event,
    id_challenge,
    tickets
  } = req.body;

  try {
    // Validation pour genre_participant
    if (!['Masculin', 'Féminin', 'Mixte'].includes(genre_participant)) {
      return res.status(400).json({ message: 'Valeur invalide pour genre_participant' });
    }

    const organizerId = req.user?.id;

    const logo_event = req.files.logo_event ? req.files.logo_event[0].filename : null;
    const images_accueil = req.files.images_accueil ? req.files.images_accueil[0].filename : null;
    const images_contenu = req.files.images_contenu ? req.files.images_contenu[0].filename : null;
    // Vérification et transformation des tickets en JSON
    let types_tickets = [];
    let nbr_total_tickets = 0;

    if (tickets) {
      try {
        const parsedTickets = typeof tickets === 'string' ? JSON.parse(tickets) : tickets;
        if (Array.isArray(parsedTickets)) {
          types_tickets = parsedTickets.map(ticket => ({
            type: ticket.type_ticket,
            prix: ticket.prix_ticket,
            quantite: parseInt(ticket.nbr_ticket_disponible, 10)
          }));
          nbr_total_tickets = types_tickets.reduce((total, ticket) => total + ticket.quantite, 0);
        } else {
          return res.status(400).json({ message: 'Le format des tickets est invalide' });
        }
      } catch (error) {
        console.error("Erreur de parsing des tickets :", error);
        return res.status(400).json({ message: 'Format JSON invalide pour tickets' });
      }
    }

    await db('evenement').insert({
      nom_event,
      type_event,
      nom_sport,
      lieu_event,
      nbr_participant,
      genre_participant, // Déjà inclus ici
      date_debut,
      date_fin,
      date_creationEvent,
      description_accueil,
      description_detail,
      categorie_participant,
      frais_inscription,
      statut_event,
      id_challenge,
      logo_event,
      images_accueil,
      images_contenu,
      id_organisateur: organizerId,
      types_tickets: JSON.stringify(types_tickets), // Stockage en JSON
      nbr_total_tickets
    });


    res.status(201).json({ message: 'Événement créé avec succès' });
  }

  catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


exports.getEventAll = async (req, res) => {
  try {
    const events = await db('evenement').select('*');

    if (events.length === 0) {
      return res.status(200).json({ message: "Aucun événement trouvé." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};



// Contrôleur pour afficher les événements avec les chemins des images
exports.getAllEvents = async (req, res) => {
  try {
    const organizerId = req.user?.id;
    const events = await db('evenement').where({ id_organisateur: organizerId });

    const eventsWithImagePaths = events.map((event) => {
      return {
        ...event,
        logo_event: event.logo_event ? `http://localhost:3001/uploads/${event.logo_event}` : null,
        images_accueil: event.images_accueil ? `http://localhost:3001/uploads/${event.images_accueil}` : null,
        images_contenu: event.images_contenu ? `http://localhost:3001/uploads/${event.images_contenu}` : null,
      };
    });

    res.status(200).json(eventsWithImagePaths);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//  controler pour la get un evenement pour modifier
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await db('evenement').where({ id_evenement: id }).first();
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    console.log("Événement récupéré :", event); // Affichez les détails récupérés
    res.status(200).json({
      ...event,
      logo_event: event.logo_event ? `http://localhost:3001/uploads/${event.logo_event}` : null,
      images_accueil: event.images_accueil ? `http://localhost:3001/uploads/${event.images_accueil}` : null,
      images_contenu: event.images_contenu ? `http://localhost:3001/uploads/${event.images_contenu}` : null,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l’événement :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getEventWithOrganizer = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await getEventWithOrganizerQuery(id);


    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.status(200).json({
      ...event,
      logo_event: event.logo_event ? `http://localhost:3001/uploads/${event.logo_event}` : null,
      images_accueil: event.images_accueil ? `http://localhost:3001/uploads/${event.images_accueil}` : null,
      images_contenu: event.images_contenu ? `http://localhost:3001/uploads/${event.images_contenu}` : null,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l’événement avec l’organisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

//mis a jour ou modification evenement
exports.updateEvent = async (req, res) => {
  const { id } = req.params; // ID de l'événement
  const {
    nom_event,
    type_event,
    nom_sport,
    lieu_event,
    nbr_participant,
    genre_participant,
    date_debut,
    date_fin,
    frais_inscription,
    statut_event,
    categorie_participant,
    description_accueil,
    description_detail,
    tickets
  } = req.body;
  const organizerId = req.user?.id;
  const logo_event = req.files.logo_event ? req.files.logo_event[0].filename : null;
  const images_accueil = req.files.images_accueil ? req.files.images_accueil[0].filename : null;
  const images_contenu = req.files.images_contenu ? req.files.images_contenu[0].filename : null;

  try {
    // Vérification et transformation des tickets en JSON
    let types_tickets = [];
    let nbr_total_tickets = 0;

    if (tickets) {
      try {
        const parsedTickets = typeof tickets === 'string' ? JSON.parse(tickets) : tickets;
        if (Array.isArray(parsedTickets)) {
          types_tickets = parsedTickets.map(ticket => ({
            type: ticket.type_ticket,
            prix: ticket.prix_ticket,
            quantite: parseInt(ticket.nbr_ticket_disponible, 10)
          }));
          nbr_total_tickets = types_tickets.reduce((total, ticket) => total + ticket.quantite, 0);
        } else {
          return res.status(400).json({ message: 'Le format des tickets est invalide' });
        }
      } catch (error) {
        console.error("Erreur de parsing des tickets :", error);
        return res.status(400).json({ message: 'Format JSON invalide pour tickets' });
      }
    }

    const updatedEvent = {
      nom_event,
      type_event,
      nom_sport,
      lieu_event,
      nbr_participant,
      genre_participant,
      date_debut: date_debut ? date_debut : null, // ✅ Remplace '' par NULL
      date_fin: date_fin ? date_fin : null,  
      frais_inscription,
      statut_event,
      categorie_participant,
      description_accueil,
      description_detail,
      ...(logo_event && { logo_event }), // Ajouter uniquement si fourni
      ...(images_accueil && { images_accueil }), // Ajouter uniquement si fourni
      ...(images_contenu && { images_contenu }), // Ajouter uniquement si fourni
      ...(tickets && {
        types_tickets: JSON.stringify(tickets), // ✅ S'assurer que les tickets sont bien un tableau
        nbr_total_tickets
      })
    };

    const result = await db('evenement').where({ id_evenement: id }).update(updatedEvent);

    if (result) {
      res.status(200).json({ message: 'Événement mis à jour avec succès.' });
    } else {
      res.status(404).json({ message: 'Événement non trouvé.' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’événement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await db('evenement').where({ id_evenement: id }).first();

    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé.' });
    }

    await db('evenement').where({ id_evenement: id }).del();

    res.status(200).json({ message: 'Événement supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’événement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour afficher tous les événements (public)
exports.getAllPublicEvents = async (req, res) => {
  try {
    const events = await db('evenement'); // Pas de filtre par `id_organisateur` ici

    // Ajout des chemins des images pour chaque événement
    const eventsWithImagePaths = events.map((event) => {
      return {
        ...event,
        logo_event: event.logo_event ? `http://localhost:3001/uploads/${event.logo_event}` : null,
        images_accueil: event.images_accueil ? `http://localhost:3001/uploads/${event.images_accueil}` : null,
        images_contenu: event.images_contenu ? `http://localhost:3001/uploads/${event.images_contenu}` : null,
      };
    });

    res.status(200).json(eventsWithImagePaths);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements publics:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getEventDetailById = async (req, res) => {
  const { id } = req.params; // Récupère l'ID depuis les paramètres de la route
  try {
    console.log('Requête pour récupérer l\'événement avec ID :', id);

    // Recherche l'événement par ID
    const event = await db('evenement').where({ id_evenement: id }).first();

    if (!event) {
      return res.status(404).json({ message: 'Événement introuvable' });
    }

    // Ajouter les chemins d'image et retourner les données
    res.status(200).json({
      ...event, // Inclut toutes les données de l'événement
      logo_event: event.logo_event
        ? `http://localhost:3001/uploads/${event.logo_event}`
        : null,
      images_accueil: event.images_accueil
        ? `http://localhost:3001/uploads/${event.images_accueil}`
        : null,
      images_contenu: event.images_contenu
        ? `http://localhost:3001/uploads/${event.images_contenu}`
        : null,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// nouveau 
// Contrôleur pour récupérer tous les événements d'un organisateur
exports.getEventsByOrganizerId = async (req, res) => {
  const { id } = req.params; // ID de l'organisateur

  try {
    const events = await db('evenement').where({ id_organisateur: id });

    // Ajout des chemins des images pour chaque événement
    const eventsWithImagePaths = events.map((event) => ({
      ...event,
      logo_event: event.logo_event
        ? `http://localhost:3001/uploads/${event.logo_event}`
        : null,
      images_accueil: event.images_accueil
        ? `http://localhost:3001/uploads/${event.images_accueil}`
        : null,
      images_contenu: event.images_contenu
        ? `http://localhost:3001/uploads/${event.images_contenu}`
        : null,
    }));

    res.status(200).json(eventsWithImagePaths);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements." });
  }
};

// fonction pour récupérer les participants depuis la base de données 
exports.getParticipantsByEventId = async (req, res) => {
  const { eventId } = req.params;
  console.log(`Requête reçue pour récupérer les participants de l'événement ID : ${eventId}`);
  try {
    // Utiliser 'id_evenement' à la place de 'event_id'
    const participants = await db('participants').where({ id_evenement: eventId });

    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: 'Aucun participant trouvé pour cet événement.' });
    }

    res.status(200).json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.getAllParticipantsByOrganizer = async (req, res) => {
  const organizerId = req.user?.id; // Récupérer l'ID de l'organisateur authentifié

  if (!organizerId) {
    return res.status(403).json({ message: "L'ID de l'organisateur est introuvable." });
  }

  try {
    // Jointure entre `evenements`, `participer` et `participants`
    const participants = await db('participer')
      .join('participants', 'participer.id_participant', '=', 'participants.id_participant')
      .join('evenement', 'participer.id_evenement', '=', 'evenement.id_evenement')
      .select(
        'participants.id_participant',
        'participants.nom_part',
        'evenement.nom_event',
        'participer.id_evenement'
      )
      .where('evenement.id_organisateur', organizerId); // Filtrer par organisateur

    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: 'Aucun participant trouvé pour vos événements.' });
    }

    res.status(200).json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};




// Fonction pour supprimer un participant dans le TB organisateur
exports.deleteParticipant = async (req, res) => {
  const { participantId } = req.params;
  console.log("ID du participant à supprimer :", participantId);

  try {
    // Vérifier si le participant existe
    const participant = await db('participants').where({ id_participant: participantId }).first();

    if (!participant) {
      return res.status(404).json({ message: "Participant non trouvé." });
    }

    // Supprimer le participant de la base de données
    await db('participants').where({ id_participant: participantId }).del();

    res.status(200).json({ message: "Participant supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du participant :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/**
 * Achat d'un billet et mise à jour des tickets disponibles.
 */
exports.acheterTicket = async (req, res) => {
  const { id_evenement, type_ticket, quantity } = req.body;

  try {
      console.log("📥 Données reçues :", req.body);

      // Récupérer l'événement
      const event = await db("evenement").where({ id_evenement }).first();
      if (!event) {
          return res.status(404).json({ message: "Événement introuvable" });
      }

      let tickets = JSON.parse(event.types_tickets);
      let ticketUpdated = false;

      // Vérifier si le billet existe et le mettre à jour
      const updatedTickets = tickets.map(ticket => {
          if ((ticket.type_ticket || ticket.type) === type_ticket) {
              // Vérifier que `nbr_ticket_disponible` est un nombre valide
              let currentStock = parseInt(ticket.nbr_ticket_disponible, 10);
              if (isNaN(currentStock)) {
                  currentStock = parseInt(ticket.quantite, 10) || 0; // Prendre `quantite` si `nbr_ticket_disponible` est invalide
              }

              console.log(`🎟 Mise à jour du billet ${ticket.type || ticket.type_ticket} (avant: ${currentStock})`);

              // Vérifier si le stock est suffisant
              if (currentStock < quantity) {
                  console.warn("⚠️ Stock insuffisant !");
                  return ticket; // Retourne le billet inchangé
              }

              // Mise à jour du stock
              ticket.nbr_ticket_disponible = Math.max(0, currentStock - quantity);
              console.log(`✅ Nouveau stock: ${ticket.nbr_ticket_disponible}`);
              ticketUpdated = true;
          }
          return ticket;
      });

      // Si le billet n'existe pas ou n'a pas été mis à jour
      if (!ticketUpdated) {
          return res.status(400).json({ message: "Type de billet non trouvé ou stock insuffisant" });
      }

      // Mettre à jour la base de données avec la nouvelle liste de tickets
      await db("evenement").where({ id_evenement }).update({ types_tickets: JSON.stringify(updatedTickets) });

      console.log("🔄 Mise à jour réussie ! Tickets mis à jour :", updatedTickets);
      return res.json({ message: "Billet acheté avec succès", tickets: updatedTickets });

  } catch (error) {
      console.error("❌ Erreur lors de l'achat du billet :", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


// Récupérer les événements créés par un organisateur
exports.getEventsByOrganizer = async (req, res) => {
  const organizerId = req.user.id; // Récupérer l'ID de l'organisateur connecté

  try {
    const events = await db('evenement').where({ id_organisateur: organizerId });

    if (!events.length) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet organisateur." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getParticipantsAndCountByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // 1) Récupérer les participants avec le nom de leur équipe
    const participants = await db('participants')
      .join('participer', 'participants.id_participant', 'participer.id_participant')
      .join('equipes', 'participants.id_participant', 'equipes.id_participant') // Jointure avec la table des équipes
      .where('participer.id_evenement', eventId)
      .select(
        'participants.id_participant',
        'equipes.nom_equipe' // On sélectionne le nom de l'équipe au lieu du nom du participant
      );

    // 2) Compter les participants
    const nbrParticipant = participants.length;

    res.status(200).json({
      nbr_participant: nbrParticipant,
      participants // Retourne la liste des participants avec leur équipe
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des participants :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// Fonction pour créer les poules d'un événement (une seule fois par événement)
exports.createPools = async (req, res) => {
  const { id_evenement, pools } = req.body;

  if (!id_evenement || !pools || pools.length === 0) {
    return res.status(400).json({ message: "Données invalides. Assurez-vous de sélectionner un événement et d'ajouter des poules." });
  }

  try {
    // Vérifier si des poules existent déjà pour cet événement
    const existingPools = await db('poules')
      .where({ id_evenement })
      .select('id_poule');

    console.log(`Poules existantes pour l'événement ${id_evenement} :`, existingPools);

    if (existingPools.length > 0) {
      console.warn("Tentative de création de poules alors qu'elles existent déjà !");
      return res.status(409).json({ message: "Des poules existent déjà pour cet événement. Impossible d'en créer de nouvelles." });
    }

    // Insérer les poules dans la table `poules`
    const insertedPools = await db('poules').insert(
      pools.map(nom_poule => ({
        id_evenement,
        nom_poule,
        created_at: new Date()
      }))
    ).returning('*'); // Retourne les nouvelles poules insérées

    res.status(201).json({ message: "Poules créées avec succès.", pools: insertedPools });
  } catch (error) {
    console.error("Erreur lors de la création des poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création des poules.", error: error.message });
  }
};


// Fonction pour attribuer les participants aux poules équitablement
exports.assignParticipantsToPools = async (req, res) => {
  const { id_evenement } = req.body;

  if (!id_evenement) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    // Récupérer les poules associées à cet événement
    const pools = await db('poules').where({ id_evenement }).select('id_poule');

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    // Récupérer les participants inscrits à cet événement
    const participants = await db('participer')
      .where({ id_evenement })
      .select('id_participant');

    if (participants.length === 0) {
      return res.status(404).json({ message: "Aucun participant trouvé pour cet événement." });
    }

    // Mélanger les participants
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
      }
      return array;
    }

    const shuffledParticipants = shuffleArray([...participants]);

    // Calculer la répartition équitable
    const numPools = pools.length;
    const numParticipants = participants.length;
    const minPerPool = Math.floor(numParticipants / numPools);
    const extraParticipants = numParticipants % numPools;

    console.log("🔹 Total Participants :", numParticipants);
    console.log("🔹 Total Poules :", numPools);
    console.log("🔹 Nombre min de participants par poule :", minPerPool);
    console.log("🔹 Participants supplémentaires à répartir :", extraParticipants);

    let assignments = [];
    let index = 0;
    let poolDistribution = {};

    for (let i = 0; i < numPools; i++) {
      const numToAssign = minPerPool + (i < extraParticipants ? 1 : 0);
      poolDistribution[pools[i].id_poule] = numToAssign;

      for (let j = 0; j < numToAssign; j++) {
        assignments.push({
          id_poule: pools[i].id_poule,
          id_participant: shuffledParticipants[index].id_participant
        });
        index++;
      }
    }

    console.log("📌 Répartition des participants par poule :", poolDistribution);

    // Insérer les assignations dans la table `poule_participants`
    await db('poule_participants').insert(assignments);

    res.status(201).json({ message: "Participants répartis avec succès.", assignments });
  } catch (error) {
    console.error("❌ Erreur lors de l'affectation des participants :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'affectation des participants." });
  }
};



exports.getPoolsWithParticipants = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    // Récupérer les poules de cet événement
    const pools = await db('poules')
      .where({ id_evenement: eventId })
      .select('id_poule', 'nom_poule');

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    // Récupérer les participants avec leur équipe pour chaque poule
    const participants = await db('poule_participants')
      .join('participants', 'poule_participants.id_participant', '=', 'participants.id_participant')
      .join('equipes', 'participants.id_participant', '=', 'equipes.id_participant') // Jointure avec la table équipes
      .whereIn('poule_participants.id_poule', pools.map(p => p.id_poule))
      .select(
        'poule_participants.id_poule',
        'participants.id_participant',
        'equipes.nom_equipe' // On récupère le nom de l'équipe
      );

    // Organiser les participants par poule
    const poolsWithParticipants = pools.map(pool => ({
      id_poule: pool.id_poule,
      nom_poule: pool.nom_poule,
      participants: participants.filter(p => p.id_poule === pool.id_poule)
    }));

    res.status(200).json({ pools: poolsWithParticipants });
  } catch (error) {
    console.error("Erreur lors de la récupération des poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des poules." });
  }
};

exports.getEventsWithPools = async (req, res) => {
  try {
    // Récupérer l'ID de l'organisateur depuis `verifyToken`
    const organizerId = req.user?.id; // Correction ici

    if (!organizerId) {
      return res.status(401).json({ message: "Organisateur non authentifié." });
    }

    // Vérification des logs pour s'assurer que l'ID est bien récupéré
    console.log("🔍 ID de l'organisateur récupéré :", organizerId);

    const eventsWithPools = await db('poules')
      .join('evenement', 'poules.id_evenement', '=', 'evenement.id_evenement')
      .where('evenement.id_organisateur', organizerId) // Correction ici
      .distinct('evenement.id_evenement', 'evenement.nom_event')
      .select();

    if (eventsWithPools.length === 0) {
      return res.status(404).json({ message: "Aucun événement avec des poules trouvé pour cet organisateur." });
    }

    res.status(200).json(eventsWithPools);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements avec poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des événements." });
  }
};

exports.addParticipantManual = async (req, res) => {
  try {
    const { id_evenement, nom_poule, id_participant } = req.body;

    // 0) Vérifier que l'id_participant est fourni
    if (!id_participant) {
      return res.status(400).json({
        message: "L'id du participant est requis."
      });
    }

    // 1) Vérifier si le participant est déjà inscrit dans une poule pour cet événement
    const alreadyAssigned = await db('poule_participants')
      .join('poules', 'poule_participants.id_poule', '=', 'poules.id_poule')
      .where('poules.id_evenement', id_evenement)
      .andWhere('poule_participants.id_participant', id_participant)
      .first();

    if (alreadyAssigned) {
      return res.status(400).json({
        message: 'Ce participant est déjà inscrit dans une poule pour cet événement.'
      });
    }

    // 2) Vérifier si la poule existe déjà pour cet événement et ce nom
    let existingPoule = await db('poules')
      .where({ id_evenement, nom_poule })
      .first();

    // 3) Si la poule n'existe pas, la créer
    if (!existingPoule) {
      const [newPouleId] = await db('poules').insert({
        id_evenement,
        nom_poule,
        created_at: new Date()
      });
      existingPoule = { id_poule: newPouleId };
      console.log('Poule créée avec ID:', newPouleId);
    } else {
      console.log('Poule existante trouvée:', existingPoule);
    }

    // 4) Insérer dans la table poule_participants
    await db('poule_participants').insert({
      id_poule: existingPoule.id_poule,
      id_participant
    });

    return res.status(200).json({ message: 'Participant ajouté avec succès !' });
  } catch (error) {
    console.error("Erreur lors de l'ajout manuel :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprime les poules et leurs participants pour un événement donné
exports.deletePoolsForEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    // Récupérer les id des poules de cet événement
    const pools = await db('poules').where({ id_evenement: eventId }).select('id_poule');

    if (pools.length > 0) {
      const poolIds = pools.map(p => p.id_poule);
      // Supprimer d'abord les participants liés aux poules
      await db('poule_participants').whereIn('id_poule', poolIds).del();
      // Supprimer ensuite les poules
      await db('poules').where({ id_evenement: eventId }).del();
    }

    return res.status(200).json({ message: "Les poules et leurs participants ont été supprimés avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression des poules :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la suppression des poules." });
  }
};

// Récupérer les événements avec des poules pour un organisateur
exports.getEventsByOrganizerMatch = async (req, res) => {
  try {
    const organizerId = req.user?.id; // L'ID de l'organisateur est récupéré via le token

    if (!organizerId) {
      return res.status(401).json({ message: "Organisateur non authentifié." });
    }

    const events = await db('evenement')
      .where('id_organisateur', organizerId)
      .select('id_evenement', 'nom_event');

    if (events.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet organisateur." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des événements." });
  }
};

// Récupérer les poules et leurs participants pour un événement sélectionné
exports.getPoolsWithParticipantsMatch = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    const pools = await db('poules')
      .where({ id_evenement: eventId })
      .select('id_poule', 'nom_poule');

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    const participants = await db('poule_participants')
      .join('participants', 'poule_participants.id_participant', '=', 'participants.id_participant')
      .whereIn('poule_participants.id_poule', pools.map(p => p.id_poule))
      .select('poule_participants.id_poule', 'participants.id_participant', 'participants.nom_part');

    const poolsWithParticipants = pools.map(pool => ({
      id_poule: pool.id_poule,
      nom_poule: pool.nom_poule,
      participants: participants.filter(p => p.id_poule === pool.id_poule)
    }));

    res.status(200).json(poolsWithParticipants);
  } catch (error) {
    console.error("Erreur lors de la récupération des poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des poules." });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const {
      phase,
      participant_a,
      participant_b,
      lieu_rencontre,
      date_rencontre,
      heure_rencontre,
      id_evenement,
      journee,
      tour_final
    } = req.body;

    // Vérification des champs essentiels
    if (!phase || !participant_a || !participant_b || !lieu_rencontre || !date_rencontre || !heure_rencontre || !id_evenement) {
      return res.status(400).json({ message: "Tous les champs essentiels sont requis." });
    }

    if (!["Barrage", "Éliminatoire", "Finale"].includes(phase) && !journee) {
      return res.status(400).json({ message: "Le champ 'journee' est requis." });
    }

    if (!["Groupe", "Qualification", "Classement", "Barrage"].includes(phase) && !tour_final) {
      return res.status(400).json({ message: "Le champ 'tour_final' est requis." });
    }

    // 🔍 Récupérer l'ID des équipes
    const equipeA = await db("equipes").where({ nom_equipe: participant_a }).first();
    const equipeB = await db("equipes").where({ nom_equipe: participant_b }).first();

    if (!equipeA || !equipeB) {
      return res.status(400).json({ message: "Les équipes sélectionnées n'existent pas." });
    }

    // 🔍 Récupérer les poules des équipes A et B
    const poulesA = await db("poule_participants")
      .where({ id_participant: equipeA.id_participant })
      .pluck("id_poule");

    const poulesB = await db("poule_participants")
      .where({ id_participant: equipeB.id_participant })
      .pluck("id_poule");

    if (!poulesA.length || !poulesB.length) {
      return res.status(400).json({ message: "Impossible de trouver la poule des participants." });
    }

    // 🔍 Vérifier si une poule est commune aux deux participants
    const pouleCommune = poulesA.find(poule => poulesB.includes(poule));

    if (!pouleCommune) {
      return res.status(400).json({ message: "Les participants ne sont pas dans la même poule." });
    }

    // 🔍 Vérifier que cette poule appartient bien à l'événement donné
    const pouleInfo = await db("poules")
      .where({ id_poule: pouleCommune, id_evenement })
      .first();

    if (!pouleInfo) {
      return res.status(400).json({ message: "La poule des participants doit être liée à l'événement." });
    }

    // 🔹 Insérer la rencontre
    const matchData = {
      phase,
      participant_a: equipeA.nom_equipe,
      participant_b: equipeB.nom_equipe,
      lieu_rencontre,
      date_rencontre,
      heure_rencontre,
      id_evenement,
      journee: journee || null,
      tour_final: tour_final || null,
      id_poule: pouleCommune
    };

    // Insérer la rencontre
    const [newMatchId] = await db("rencontre").insert(matchData);
    console.log(`✅ Match inséré avec succès (ID: ${newMatchId})`);

    // 🔹 Récupérer la rencontre nouvellement créée
    const newMatch = await db("rencontre").where({ id_rencontre: newMatchId }).first();

    res.status(201).json({ message: "Rencontre créée avec succès.", match: newMatch });

  } catch (error) {
    console.error("❌ Erreur lors de la création de la rencontre :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création de la rencontre." });
  }
};


exports.getMatchesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    const matches = await db("rencontre")
      .select(
        "id_rencontre",
        "participant_a",
        "participant_b",
        "date_rencontre",
        "heure_rencontre",
        "lieu_rencontre",
        "phase",
        "journee",
        "tour_final"
      )
      .where("id_evenement", eventId);

    // Groupement des matchs par phase/journée/tour final
    const groupedMatches = matches.reduce((acc, match) => {
      const key = `${match.phase}_${match.journee || "0"}_${match.tour_final || "0"}`;

      if (!acc[key]) {
        acc[key] = {
          phase: match.phase,
          journee: match.journee,
          tour_final: match.tour_final,
          matches: [],
        };
      }

      acc[key].matches.push({
        id_rencontre: match.id_rencontre,
        participant_a: match.participant_a, // Déjà stocké sous forme de nom
        participant_b: match.participant_b, // Déjà stocké sous forme de nom
        date_rencontre: match.date_rencontre,
        heure_rencontre: match.heure_rencontre,
        lieu_rencontre: match.lieu_rencontre,
      });

      return acc;
    }, {});

    res.status(200).json(Object.values(groupedMatches));

  } catch (error) {
    console.error("Erreur lors de la récupération des rencontres :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rencontres." });
  }
};


// Récupérer les infos du participant avec son équipe
exports.getParticipantById = async (req, res) => {
  const { participantId } = req.params;

  if (!participantId) {
    return res.status(400).json({ message: "ID du participant requis." });
  }

  try {
    // Récupérer les infos du participant avec son équipe
    const participant = await db('participants as p')
      .leftJoin('equipes as e', 'p.id_participant', 'e.id_participant')
      .where({ 'p.id_participant': participantId })
      .select(
        'p.*',
        'e.nom_equipe',
        'e.categorie_equipe'
      )
      .first();

    if (!participant) {
      return res.status(404).json({ message: "Participant non trouvé." });
    }

    res.status(200).json(participant);
  } catch (error) {
    console.error("Erreur lors de la récupération du participant:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du participant." });
  }
};

// Suppression d'une rencontre par ID
exports.deleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const deletedRows = await db('rencontre').where('id_rencontre', matchId).del();

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Rencontre non trouvée." });
    }

    res.status(200).json({ message: "Rencontre supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la rencontre :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression de la rencontre." });
  }
};


// Fonction pour récupérer toutes les rencontres de tous les événements d'un organisateur
exports.getAllCalendarMatches = async (req, res) => {
  try {
    // Récupérer tous les événements de l'organisateur
    const events = await db('evenement')
      .where('id_organisateur', req.user.id)  // On suppose que l'organisateur est dans req.user.id
      .select('id_evenement');  // On ne sélectionne que les ID des événements

    if (events.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet organisateur." });
    }

    // Récupérer toutes les rencontres de tous les événements
    const allMatches = [];

    for (const event of events) {
      const matches = await db('rencontre')
        .where({ id_evenement: event.id_evenement })
        .select('*')
        .orderBy('date_rencontre', 'asc')
        .orderBy('heure_rencontre', 'asc');
      allMatches.push(...matches);
    }

    // Vérifier si la phase "Aller-Retour" est bien présente dans les résultats
    console.log(matches);  // Vérifiez dans la console si la phase est correcte

    if (allMatches.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée." });
    }

    res.status(200).json(allMatches);
  } catch (error) {
    console.error("Erreur lors de la récupération du calendrier des rencontres :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rencontres." });
  }
};

exports.getCalendarMatchesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    const matches = await db('rencontre')
      .where({ id_evenement: eventId })
      .select('id_rencontre', 'date_rencontre', 'heure_rencontre',
        'participant_a', 'participant_b', 'lieu_rencontre',
        'phase', 'journee', 'tour_final');

    console.log("Données envoyées par l'API :", matches); // 🔍 Vérification des données avant envoi

    res.status(200).json(matches);
  } catch (error) {
    console.error("Erreur lors de la récupération des rencontres :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du calendrier des rencontres." });
  }
};




// recuperation de toute participant 
exports.getAllParticipantsByOrganizer = async (req, res) => {
  const organizerId = req.user?.id; // Récupérer l'ID de l'organisateur authentifié

  if (!organizerId) {
    return res.status(403).json({ message: "L'ID de l'organisateur est introuvable." });
  }

  try {
    // Jointure entre `evenements`, `participer` et `participants`
    const participants = await db('participer')
      .join('participants', 'participer.id_participant', '=', 'participants.id_participant')
      .join('evenement', 'participer.id_evenement', '=', 'evenement.id_evenement') // Correction ici
      .select(
        'participants.id_participant',
        'participants.nom_part',
        'evenement.nom_event',
        'participer.id_evenement'
      )
      .where('evenement.id_organisateur', organizerId); // Filtrer par organisateur

    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: 'Aucun participant trouvé pour vos événements.' });
    }

    res.status(200).json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// **************************Resultats*****************************
// pour récupérer les informations d'un événement sélectionné

exports.getEventResultats = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("🔍 eventId reçu :", eventId);

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    // 🔹 Récupération du nom de l'événement
    const event = await db('evenement')
      .where({ id_evenement: eventId })
      .select('nom_event')
      .first();

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // 🔹 Récupération des différentes phases, journées et tours finaux associés à l'événement
    const matchInfo = await db('rencontre')
      .where({ id_evenement: eventId })
      .select('phase', 'journee', 'tour_final')
      .groupBy('phase', 'journee', 'tour_final')  // 🔥 On récupère toutes les valeurs uniques

    console.log("✅ Données matchInfo :", matchInfo);

    if (matchInfo.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée pour cet événement." });
    }

    res.status(200).json({
      nom_event: event.nom_event,
      details: matchInfo // 🔥 On envoie un tableau contenant toutes les phases, journées et tours finaux
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'événement.", error: error.message });
  }
};

// pour récupérer les rencontres filtrées :
exports.getFilteredMatchesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { phase, journee, tour_final } = req.query;

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    let query = db('rencontre')
      .where({ id_evenement: eventId })
      .select('id_rencontre', 'participant_a', 'participant_b', 'phase', 'journee', 'tour_final');

    // Filtrage dynamique en fonction des paramètres reçus
    if (phase) {
      query = query.where({ phase });
    }
    if (journee) {
      query = query.where({ journee });
    }
    if (tour_final) {
      query = query.where({ tour_final });
    }

    const matches = await query;

    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée pour ces critères." });
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rencontres filtrées." });
  }
};
// pour enregistrer les résultats des rencontres
exports.saveMatchResults = async (req, res) => {
  try {
    const { eventId } = req.params;
    let { results, point_victoire, point_defaite, point_matchnul } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "L'ID de l'événement est requis." });
    }

    if (!results || results.length === 0) {
      return res.status(400).json({ message: "Aucun résultat fourni." });
    }

    // Date actuelle pour l'enregistrement
    const date_resultat = new Date();
    const insertedResults = [];
    const ignoredResults = [];

    for (const match of results) {
      const { id_rencontre, score_A, score_B, phase } = match;

      // 🔹 Vérification des phases qui ne doivent pas avoir de points
      if (["Finale", "Barrage", "Aller Retour"].includes(phase)) {
        point_victoire = null;
        point_defaite = null;
        point_matchnul = null;
      }

      // Vérifier si un résultat existe déjà pour ce match et cet événement
      const existingResult = await db('resultat')
        .where({ id_rencontre, id_evenement: eventId })
        .first();

      if (existingResult) {
        // 🔹 Ne pas insérer et ajouter à la liste des ignorés
        ignoredResults.push({ id_rencontre, message: "Résultat déjà existant" });
      } else {
        // 🔹 Insérer un nouveau résultat
        const [id_resultat] = await db('resultat').insert({
          id_rencontre,
          id_evenement: eventId,
          score_A,
          score_B,
          point_victoire,
          point_defaite,
          point_matchnul,
          date_resultat
        });

        insertedResults.push({ id_resultat, id_rencontre, score_A, score_B, status: "Inséré" });
      }
    }

    res.status(201).json({
      message: "Résultats traités",
      inserted: insertedResults,
      ignored: ignoredResults
    });
  } catch (error) {
    console.error("❌ Erreur serveur lors de l'enregistrement des résultats :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'enregistrement des résultats." });
  }
};

// ************************** Liste Resultats*****************************
// Récupérer les détails d'un événement et ses phases
exports.getEventResultatList = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Vérifier si l'événement existe
    const event = await db('evenement')
      .where({ id_evenement: eventId })
      .select('nom_event')
      .first();

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // Récupérer les informations de rencontre liées à cet événement
    const matchInfo = await db('rencontre')
      .where({ id_evenement: eventId })
      .select('phase', 'journee', 'tour_final')
      .first(); // On récupère un seul enregistrement

    res.status(200).json({
      nom_event: event.nom_event,
      phase: matchInfo?.phase || 'N/A',
      journee: matchInfo?.journee || 'N/A',
      tour_final: matchInfo?.tour_final || 'N/A'
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'événement.", error: error.message });
  }
};

// Récupérer les résultats des matchs avec jointure
exports.getFilteredMatchesResultatList = async (req, res) => {
  try {
    const { eventId } = req.params;

    let matches = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .join('evenement', 'rencontre.id_evenement', '=', 'evenement.id_evenement')
      .select(
        'evenement.nom_event',
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.tour_final',
        'rencontre.date_rencontre',
        'rencontre.heure_rencontre',
        'rencontre.participant_a',
        'rencontre.participant_b',
        'resultat.score_A',
        'resultat.score_B',
        'rencontre.lieu_rencontre'
      )
      .where('resultat.id_evenement', eventId)
      .orderBy(['evenement.nom_event', 'rencontre.phase', 'rencontre.journee', 'rencontre.tour_final', 'rencontre.date_rencontre']);

    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucun résultat trouvé pour cet événement." });
    }

    // Regrouper les résultats par événement, phase, journée et tour
    let groupedResults = {};
    matches.forEach(match => {
      const groupKey = `${match.nom_event} | ${match.phase} | Journée: ${match.journee !== 'N/A' ? match.journee : 'Non défini'} ${match.tour_final !== 'N/A' ? `Tour Final: ${match.tour_final}` : ''}`;

      if (!groupedResults[groupKey]) {
        groupedResults[groupKey] = [];
      }
      groupedResults[groupKey].push(match);
    });

    res.status(200).json(groupedResults);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des résultats.", error: error.message });
  }
};



// ✅ Récupérer les événements SANS authentification
exports.getPublicEvents = async (req, res) => {
  try {
    const events = await db('evenement').select('*'); // Récupérer tous les événements
    console.log("Événements récupérés :", events);
    res.json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// ********************************* Tous les résultats des matchs *********************************
// Récupérer les résultats de tous les événements
exports.getAllMatchesResultatList = async (req, res) => {
  try {
    let matches = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .join('evenement', 'rencontre.id_evenement', '=', 'evenement.id_evenement')
      .select(
        'evenement.nom_event',
        'rencontre.id_rencontre',
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.tour_final',
        'rencontre.date_rencontre',
        'rencontre.heure_rencontre',
        'rencontre.participant_a',
        'rencontre.participant_b',
        'resultat.id_resultat', // ✅ Ajout de `id_resultat`
        'resultat.score_A',
        'resultat.score_B',
        'rencontre.lieu_rencontre'
      )
      .orderBy(['evenement.nom_event', 'rencontre.phase', 'rencontre.journee', 'rencontre.tour_final', 'rencontre.date_rencontre']);

    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucun résultat trouvé." });
    }

    // Regrouper les résultats par événement, phase, journée et tour
    let groupedResults = {};
    matches.forEach(match => {
      const groupKey = `${match.nom_event} | ${match.phase} | Journée: ${match.journee !== 'N/A' ? match.journee : 'Non défini'} ${match.tour_final !== 'N/A' ? `Tour Final: ${match.tour_final}` : ''}`;

      if (!groupedResults[groupKey]) {
        groupedResults[groupKey] = [];
      }
      groupedResults[groupKey].push(match);
    });

    res.status(200).json(groupedResults);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des résultats.", error: error.message });
  }
};

// Contrôleur pour la mise à jour du score
exports.updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { score_A, score_B } = req.body;

    // Vérification des valeurs
    if (score_A === undefined || score_B === undefined) {
      return res.status(400).json({ message: "Les scores sont requis." });
    }

    // Mise à jour du score dans la base de données
    const updated = await db('resultat')
      .where({ id_rencontre: matchId })
      .update({ score_A, score_B });

    if (updated) {
      res.status(200).json({ message: "Score mis à jour avec succès !" });
    } else {
      res.status(404).json({ message: "Match non trouvé." });
    }
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du score :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du score." });
  }
};

// Contrôleur pour supprimer un résultat de match via `id_resultat`
exports.deleteMatchResult = async (req, res) => {
  try {
    const { resultId } = req.params; // On récupère `id_resultat` et non `id_rencontre`

    // Vérifier si le résultat existe
    const resultExists = await db('resultat').where({ id_resultat: resultId }).first();

    if (!resultExists) {
      return res.status(404).json({ message: "Le résultat du match n'existe pas." });
    }

    // Suppression du résultat
    await db('resultat').where({ id_resultat: resultId }).del();

    res.status(200).json({ message: "Résultat supprimé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du résultat :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du résultat." });
  }
};
// ********************************* Classement *********************************

exports.getClassement = async (req, res) => {
  try {
    const phasesAExclure = ["Barrage", "Éliminatoire", "Aller Retour", "Finale"];

    let query = db("resultat")
      .join("rencontre", "resultat.id_rencontre", "=", "rencontre.id_rencontre")
      .join("evenement", "rencontre.id_evenement", "=", "evenement.id_evenement")
      .join("poules", "rencontre.id_poule", "=", "poules.id_poule")
      .select(
        "evenement.nom_event",
        "evenement.nom_sport",
        "rencontre.id_evenement",
        "rencontre.phase",
        "rencontre.journee",
        "rencontre.id_poule",
        "poules.nom_poule",
        "rencontre.participant_a",
        "rencontre.participant_b",
        "resultat.score_A",
        "resultat.score_B",
        "resultat.point_victoire",
        "resultat.point_matchnul",
        "resultat.point_defaite"
      )
      .whereNotIn("rencontre.phase", phasesAExclure);

    const resultats = await query;

    if (!resultats.length) {
      return res.status(200).json({ classement: {} });
    }

    let classementParEvenement = {};

    resultats.forEach((match) => {
      const eventKey = match.nom_event;
      const phaseKey = `Phase: ${match.phase}`;
      const journeeKey = `Journée ${match.journee}`;
      const pouleKey = `Poule ${match.nom_poule}`;
      const sport = match.nom_sport.toLowerCase();

      if (!classementParEvenement[eventKey]) {
        classementParEvenement[eventKey] = {};
      }

      if (!classementParEvenement[eventKey][phaseKey]) {
        classementParEvenement[eventKey][phaseKey] = {};
      }

      if (!classementParEvenement[eventKey][phaseKey][journeeKey]) {
        classementParEvenement[eventKey][phaseKey][journeeKey] = {};
      }

      if (!classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey]) {
        classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey] = [];
      }

      [match.participant_a, match.participant_b].forEach((equipe, i) => {
        const score = i === 0 ? match.score_A : match.score_B;
        const adversaireScore = i === 0 ? match.score_B : match.score_A;
        const victoire = score > adversaireScore ? 1 : 0;
        const defaite = score < adversaireScore ? 1 : 0;
        const matchJoue = 1;

        let points = 0;
        if (score > adversaireScore) {
          points = match.point_victoire;
        } else if (score === adversaireScore) {
          points = match.point_matchnul;
        } else {
          points = match.point_defaite;
        }

        const team = classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey].find(
          (equipeData) => equipeData.nom_equipe === equipe
        );

        if (team) {
          if (sport === "basketball") {
            team.mj += matchJoue;
            team.v += victoire;
            team.d += defaite;
            team.points_marques += score;
            team.points_concedes += adversaireScore;
            team.difference_points += score - adversaireScore;
          } else if (sport === "pétanque") {
            team.points += points;
            team.points_marques += score;
            team.points_concedes += adversaireScore;
            team.difference_points += score - adversaireScore;
          } else {
            team.points += points;
            team.buts_marques += score;
            team.buts_encaisses += adversaireScore;
            team.difference_buts += score - adversaireScore;
          }
        } else {
          classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey].push({
            nom_equipe: equipe,
            points: points,
            buts_marques: sport !== "basketball" ? score : undefined,
            buts_encaisses: sport !== "basketball" ? adversaireScore : undefined,
            difference_buts: sport !== "basketball" ? score - adversaireScore : undefined,
            points_marques: sport === "basketball" || sport === "pétanque" ? score : undefined,
            points_concedes: sport === "basketball" || sport === "pétanque" ? adversaireScore : undefined,
            difference_points: sport === "basketball" || sport === "pétanque" ? score - adversaireScore : undefined,
            mj: sport === "basketball" ? matchJoue : undefined,
            v: sport === "basketball" ? victoire : undefined,
            d: sport === "basketball" ? defaite : undefined
          });
        }
      });
    });

    // Ajout du Classement Général
    Object.keys(classementParEvenement).forEach(eventKey => {
      let classementGeneral = {};

      Object.keys(classementParEvenement[eventKey]).forEach(phaseKey => {
        Object.keys(classementParEvenement[eventKey][phaseKey]).forEach(journeeKey => {
          Object.keys(classementParEvenement[eventKey][phaseKey][journeeKey]).forEach(pouleKey => {
            classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey].forEach(team => {
              const equipeKey = team.nom_equipe;
              if (!classementGeneral[equipeKey]) {
                classementGeneral[equipeKey] = { ...team };
              } else {
                Object.keys(team).forEach(stat => {
                  if (typeof team[stat] === "number") {
                    classementGeneral[equipeKey][stat] += team[stat];
                  }
                });
              }
            });
          });
        });
      });

      classementParEvenement[eventKey]["Classement Général"] = {
        "Classement Général": Object.values(classementGeneral).sort((a, b) => b.points - a.points)
      };
    });

    res.status(200).json({ classement: classementParEvenement });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//==================== gestion ticket par l'organisateur =====================

// 📌 Récupérer les ventes de billets de l’organisateur
exports.getOrganizerTickets = async (req, res) => {
  const { organizerId } = req.params;
  try {
      const sales = await db("achatbillets")
          .join("evenement", "achatbillets.nom_evenement", "=", "evenement.nom_event")
          .where("evenement.id_organisateur", organizerId)
          .select(
              "achatbillets.nom_evenement",
              "achatbillets.type_ticket",
              "achatbillets.quantite as quantite",
              "achatbillets.total_billets_vendus",
              "achatbillets.montant_collecte",
              "achatbillets.prix_unitaire",
              db.raw("achatbillets.quantite - achatbillets.total_billets_vendus AS quantite_restante")
          );

      res.json(sales);
  } catch (error) {
      console.error("❌ Erreur lors de la récupération des billets :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📥 Exporter les ventes de billets en CSV
exports.exportOrganizerTickets = async (req, res) => {
  const { organizerId } = req.params;
  try {
      const sales = await db("achatbillets")
          .join("evenement", "achatbillets.nom_evenement", "=", "evenement.nom_event")
          .where("evenement.id_organisateur", organizerId)
          .select(
              "achatbillets.nom_evenement",
              "achatbillets.type_ticket",
              "achatbillets.quantite",
              "achatbillets.total_billets_vendus",
              "achatbillets.montant_collecte",
              "achatbillets.prix_unitaire"
          );

      const fields = ["nom_evenement", "type_ticket", "quantite", "total_billets_vendus", "montant_collecte", "prix_unitaire"];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(sales);

      res.header("Content-Type", "text/csv");
      res.attachment("ventes_billets.csv");
      res.send(csv);
  } catch (error) {
      console.error("❌ Erreur lors de l'exportation CSV :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};



// Récupérer les événements créés par un organisateur
exports.getEventsByOrganizer = async (req, res) => {
  const organizerId = req.user.id; // Récupérer l'ID de l'organisateur connecté

  try {
    const events = await db('evenement').where({ id_organisateur: organizerId });

    if (!events.length) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet organisateur." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getParticipantsAndCountByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // 1) Récupérer les participants avec le nom de leur équipe
    const participants = await db('participants')
      .join('participer', 'participants.id_participant', 'participer.id_participant')
      .join('equipes', 'participants.id_participant', 'equipes.id_participant') // Jointure avec la table des équipes
      .where('participer.id_evenement', eventId)
      .select(
        'participants.id_participant',
        'equipes.nom_equipe' // On sélectionne le nom de l'équipe au lieu du nom du participant
      );

    // 2) Compter les participants
    const nbrParticipant = participants.length;

    res.status(200).json({
      nbr_participant: nbrParticipant,
      participants // Retourne la liste des participants avec leur équipe
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des participants :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// Fonction pour créer les poules d'un événement (une seule fois par événement)
exports.createPools = async (req, res) => {
  const { id_evenement, pools } = req.body;

  if (!id_evenement || !pools || pools.length === 0) {
    return res.status(400).json({ message: "Données invalides. Assurez-vous de sélectionner un événement et d'ajouter des poules." });
  }

  try {
    // Vérifier si des poules existent déjà pour cet événement
    const existingPools = await db('poules')
      .where({ id_evenement })
      .select('id_poule');

    console.log(`Poules existantes pour l'événement ${id_evenement} :`, existingPools);

    if (existingPools.length > 0) {
      console.warn("Tentative de création de poules alors qu'elles existent déjà !");
      return res.status(409).json({ message: "Des poules existent déjà pour cet événement. Impossible d'en créer de nouvelles." });
    }

    // Insérer les poules dans la table `poules`
    const insertedPools = await db('poules').insert(
      pools.map(nom_poule => ({
        id_evenement,
        nom_poule,
        created_at: new Date()
      }))
    ).returning('*'); // Retourne les nouvelles poules insérées

    res.status(201).json({ message: "Poules créées avec succès.", pools: insertedPools });
  } catch (error) {
    console.error("Erreur lors de la création des poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création des poules.", error: error.message });
  }
};

// Fonction pour attribuer les participants aux poules équitablement
exports.assignParticipantsToPools = async (req, res) => {
  const { id_evenement } = req.body;

  if (!id_evenement) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    // Récupérer les poules associées à cet événement
    const pools = await db('poules').where({ id_evenement }).select('id_poule');

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    // Récupérer les participants inscrits à cet événement
    const participants = await db('participer')
      .where({ id_evenement })
      .select('id_participant');

    if (participants.length === 0) {
      return res.status(404).json({ message: "Aucun participant trouvé pour cet événement." });
    }

    // Mélanger les participants
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
      }
      return array;
    }

    const shuffledParticipants = shuffleArray([...participants]);

    // Calculer la répartition équitable
    const numPools = pools.length;
    const numParticipants = participants.length;
    const minPerPool = Math.floor(numParticipants / numPools);
    const extraParticipants = numParticipants % numPools;

    console.log("🔹 Total Participants :", numParticipants);
    console.log("🔹 Total Poules :", numPools);
    console.log("🔹 Nombre min de participants par poule :", minPerPool);
    console.log("🔹 Participants supplémentaires à répartir :", extraParticipants);

    let assignments = [];
    let index = 0;
    let poolDistribution = {};

    for (let i = 0; i < numPools; i++) {
      const numToAssign = minPerPool + (i < extraParticipants ? 1 : 0);
      poolDistribution[pools[i].id_poule] = numToAssign;

      for (let j = 0; j < numToAssign; j++) {
        assignments.push({
          id_poule: pools[i].id_poule,
          id_participant: shuffledParticipants[index].id_participant
        });
        index++;
      }
    }

    console.log("📌 Répartition des participants par poule :", poolDistribution);

    // Insérer les assignations dans la table `poule_participants`
    await db('poule_participants').insert(assignments);

    res.status(201).json({ message: "Participants répartis avec succès.", assignments });
  } catch (error) {
    console.error("❌ Erreur lors de l'affectation des participants :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'affectation des participants." });
  }
};



exports.getPoolsWithParticipants = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    // Récupérer les poules de cet événement
    const pools = await db('poules')
      .where({ id_evenement: eventId })
      .select('id_poule', 'nom_poule');

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    // Récupérer les participants avec leur équipe pour chaque poule
    const participants = await db('poule_participants')
      .join('participants', 'poule_participants.id_participant', '=', 'participants.id_participant')
      .join('equipes', 'participants.id_participant', '=', 'equipes.id_participant') // Jointure avec la table équipes
      .whereIn('poule_participants.id_poule', pools.map(p => p.id_poule))
      .select(
        'poule_participants.id_poule',
        'participants.id_participant',
        'equipes.nom_equipe' // On récupère le nom de l'équipe
      );

    // Organiser les participants par poule
    const poolsWithParticipants = pools.map(pool => ({
      id_poule: pool.id_poule,
      nom_poule: pool.nom_poule,
      participants: participants.filter(p => p.id_poule === pool.id_poule)
    }));

    res.status(200).json({ pools: poolsWithParticipants });
  } catch (error) {
    console.error("Erreur lors de la récupération des poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des poules." });
  }
};

exports.getEventsWithPools = async (req, res) => {
  try {
    // Récupérer l'ID de l'organisateur depuis `verifyToken`
    const organizerId = req.user?.id; // Correction ici

    if (!organizerId) {
      return res.status(401).json({ message: "Organisateur non authentifié." });
    }

    // Vérification des logs pour s'assurer que l'ID est bien récupéré
    console.log("🔍 ID de l'organisateur récupéré :", organizerId);

    const eventsWithPools = await db('poules')
      .join('evenement', 'poules.id_evenement', '=', 'evenement.id_evenement')
      .where('evenement.id_organisateur', organizerId) // Correction ici
      .distinct('evenement.id_evenement', 'evenement.nom_event')
      .select();

    if (eventsWithPools.length === 0) {
      return res.status(404).json({ message: "Aucun événement avec des poules trouvé pour cet organisateur." });
    }

    res.status(200).json(eventsWithPools);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements avec poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des événements." });
  }
};

exports.addParticipantManual = async (req, res) => {
  try {
    const { id_evenement, nom_poule, id_participant } = req.body;

    // 0) Vérifier que l'id_participant est fourni
    if (!id_participant) {
      return res.status(400).json({
        message: "L'id du participant est requis."
      });
    }

    // 1) Vérifier si le participant est déjà inscrit dans une poule pour cet événement
    const alreadyAssigned = await db('poule_participants')
      .join('poules', 'poule_participants.id_poule', '=', 'poules.id_poule')
      .where('poules.id_evenement', id_evenement)
      .andWhere('poule_participants.id_participant', id_participant)
      .first();

    if (alreadyAssigned) {
      return res.status(400).json({
        message: 'Ce participant est déjà inscrit dans une poule pour cet événement.'
      });
    }

    // 2) Vérifier si la poule existe déjà pour cet événement et ce nom
    let existingPoule = await db('poules')
      .where({ id_evenement, nom_poule })
      .first();

    // 3) Si la poule n'existe pas, la créer
    if (!existingPoule) {
      const [newPouleId] = await db('poules').insert({
        id_evenement,
        nom_poule,
        created_at: new Date()
      });
      existingPoule = { id_poule: newPouleId };
      console.log('Poule créée avec ID:', newPouleId);
    } else {
      console.log('Poule existante trouvée:', existingPoule);
    }

    // 4) Insérer dans la table poule_participants
    await db('poule_participants').insert({
      id_poule: existingPoule.id_poule,
      id_participant
    });

    return res.status(200).json({ message: 'Participant ajouté avec succès !' });
  } catch (error) {
    console.error("Erreur lors de l'ajout manuel :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


// Supprime les poules et leurs participants pour un événement donné
exports.deletePoolsForEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    // Récupérer les id des poules de cet événement
    const pools = await db('poules').where({ id_evenement: eventId }).select('id_poule');

    if (pools.length > 0) {
      const poolIds = pools.map(p => p.id_poule);
      // Supprimer d'abord les participants liés aux poules
      await db('poule_participants').whereIn('id_poule', poolIds).del();
      // Supprimer ensuite les poules
      await db('poules').where({ id_evenement: eventId }).del();
    }

    return res.status(200).json({ message: "Les poules et leurs participants ont été supprimés avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression des poules :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la suppression des poules." });
  }
};

// Récupérer les événements avec des poules pour un organisateur
exports.getEventsByOrganizerMatch = async (req, res) => {
  try {
    const organizerId = req.user?.id; // L'ID de l'organisateur est récupéré via le token

    if (!organizerId) {
      return res.status(401).json({ message: "Organisateur non authentifié." });
    }

    const events = await db('evenement')
      .where('id_organisateur', organizerId)
      .select('id_evenement', 'nom_event');

    if (events.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet organisateur." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des événements." });
  }
};

// Récupérer les poules et leurs participants pour un événement sélectionné
exports.getPoolsWithParticipantsMatch = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement requis." });
  }

  try {
    const pools = await db('poules')
      .where({ id_evenement: eventId })
      .select('id_poule', 'nom_poule');

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    const participants = await db('poule_participants')
      .join('participants', 'poule_participants.id_participant', '=', 'participants.id_participant')
      .whereIn('poule_participants.id_poule', pools.map(p => p.id_poule))
      .select('poule_participants.id_poule', 'participants.id_participant', 'participants.nom_part');

    const poolsWithParticipants = pools.map(pool => ({
      id_poule: pool.id_poule,
      nom_poule: pool.nom_poule,
      participants: participants.filter(p => p.id_poule === pool.id_poule)
    }));

    res.status(200).json(poolsWithParticipants);
  } catch (error) {
    console.error("Erreur lors de la récupération des poules :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des poules." });
  }
};

// exports.createMatch = async (req, res) => {
//   try {
//     const {
//       phase,
//       participant_a,
//       participant_b,
//       lieu_rencontre,
//       id_resultat,
//       date_rencontre,
//       heure_rencontre,
//       id_evenement,
//       journee,
//       tour_final
//     } = req.body;

//     // Vérification des champs essentiels
//     if (!phase || !participant_a || !participant_b || !lieu_rencontre || !id_resultat || !date_rencontre || !heure_rencontre || !id_evenement) {
//       return res.status(400).json({ message: "Tous les champs essentiels sont requis." });
//     }

//     if (!["Barrage", "Éliminatoire", "Finale"].includes(phase) && !journee) {
//       return res.status(400).json({ message: "Le champ 'journee' est requis." });
//     }

//     if (!["Groupe", "Qualification", "Classement", "Barrage"].includes(phase) && !tour_final) {
//       return res.status(400).json({ message: "Le champ 'tour_final' est requis." });
//     }

//     // 🔍 Récupérer l'ID des équipes
//     const equipeA = await db("equipes").where({ nom_equipe: participant_a }).first();
//     const equipeB = await db("equipes").where({ nom_equipe: participant_b }).first();

//     if (!equipeA || !equipeB) {
//       return res.status(400).json({ message: "Les équipes sélectionnées n'existent pas." });
//     }

//     // 🔍 Récupérer les poules des équipes A et B
//     const poulesA = await db("poule_participants")
//       .where({ id_participant: equipeA.id_participant })
//       .pluck("id_poule");

//     const poulesB = await db("poule_participants")
//       .where({ id_participant: equipeB.id_participant })
//       .pluck("id_poule");

//     if (!poulesA.length || !poulesB.length) {
//       return res.status(400).json({ message: "Impossible de trouver la poule des participants." });
//     }

//     // 🔍 Vérifier si une poule est commune aux deux participants
//     const pouleCommune = poulesA.find(poule => poulesB.includes(poule));

//     if (!pouleCommune) {
//       return res.status(400).json({ message: "Les participants ne sont pas dans la même poule." });
//     }

//     // 🔍 Vérifier que cette poule appartient bien à l'événement donné
//     const pouleInfo = await db("poules")
//       .where({ id_poule: pouleCommune, id_evenement })
//       .first();

//     if (!pouleInfo) {
//       return res.status(400).json({ message: "La poule des participants doit être liée à l'événement." });
//     }

//     // 🔹 Insérer la rencontre
//     const matchData = {
//       phase,
//       participant_a: equipeA.nom_equipe,
//       participant_b: equipeB.nom_equipe,
//       lieu_rencontre,
//       id_resultat,
//       date_rencontre,
//       heure_rencontre,
//       id_evenement,
//       journee: journee || null,
//       tour_final: tour_final || null,
//       id_poule: pouleCommune
//     };

//     // Insérer la rencontre
//     const [newMatchId] = await db("rencontre").insert(matchData);
//     console.log(`✅ Match inséré avec succès (ID: ${newMatchId})`);

//     // 🔹 Récupérer la rencontre nouvellement créée
//     const newMatch = await db("rencontre").where({ id_rencontre: newMatchId }).first();

//     res.status(201).json({ message: "Rencontre créée avec succès.", match: newMatch });

//   } catch (error) {
//     console.error("❌ Erreur lors de la création de la rencontre :", error);
//     res.status(500).json({ message: "Erreur serveur lors de la création de la rencontre." });
//   }
// };

exports.createMatch = async (req, res) => {
  try {
    const {
      phase,
      participant_a,
      participant_b,
      lieu_rencontre,
      date_rencontre,
      heure_rencontre,
      id_evenement,
      journee,
      tour_final
    } = req.body;

    // Vérification des champs essentiels
    if (!phase || !participant_a || !participant_b || !lieu_rencontre || !date_rencontre || !heure_rencontre || !id_evenement) {
      return res.status(400).json({ message: "Tous les champs essentiels sont requis." });
    }

    if (!["Barrage", "Éliminatoire", "Finale"].includes(phase) && !journee) {
      return res.status(400).json({ message: "Le champ 'journee' est requis." });
    }

    if (!["Groupe", "Qualification", "Classement", "Barrage"].includes(phase) && !tour_final) {
      return res.status(400).json({ message: "Le champ 'tour_final' est requis." });
    }

    // 🔍 Récupérer les équipes
    const equipeA = await db("equipes").where({ nom_equipe: participant_a }).first();
    const equipeB = await db("equipes").where({ nom_equipe: participant_b }).first();

    if (!equipeA || !equipeB) {
      return res.status(400).json({ message: "Les équipes sélectionnées n'existent pas." });
    }

    // 🔍 Vérifier les poules
    const poulesA = await db("poule_participants").where({ id_participant: equipeA.id_participant }).pluck("id_poule");
    const poulesB = await db("poule_participants").where({ id_participant: equipeB.id_participant }).pluck("id_poule");

    const pouleCommune = poulesA.find(p => poulesB.includes(p));
    if (!pouleCommune) {
      return res.status(400).json({ message: "Les participants ne sont pas dans la même poule." });
    }

    const pouleInfo = await db("poules").where({ id_poule: pouleCommune, id_evenement }).first();
    if (!pouleInfo) {
      return res.status(400).json({ message: "La poule n'est pas liée à cet événement." });
    }

    // ✅ ÉTAPE 1 : Créer un résultat vide
    const [idResultat] = await db("resultat").insert({
      score_A: 0,
      score_B: 0,
      point_victoire: null,
      point_matchnul: null,
      point_defaite: null,
      classement_general: 0,
      date_resultat: new Date(), 
      id_evenement: id_evenement,
      id_calendrier: 0,
      id_rencontre: 0 // temporairement null
    });

    // ✅ ÉTAPE 2 : Créer la rencontre avec ce id_resultat
    const [newMatchId] = await db("rencontre").insert({
      phase,
      participant_a: equipeA.nom_equipe,
      participant_b: equipeB.nom_equipe,
      lieu_rencontre,
      id_resultat: idResultat,
      date_rencontre,
      heure_rencontre,
      id_evenement,
      journee: journee || null,
      tour_final: tour_final || null,
      id_poule: pouleCommune
    });

    // ✅ ÉTAPE 3 : Mettre à jour le résultat avec l'ID de la rencontre
    await db("resultat").where({ id_resultat: idResultat }).update({
      id_rencontre: newMatchId
    });

    const newMatch = await db("rencontre").where({ id_rencontre: newMatchId }).first();
    res.status(201).json({ message: "Rencontre créée avec succès.", match: newMatch });

  } catch (error) {
    console.error("❌ Erreur lors de la création de la rencontre :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création de la rencontre." });
  }
};


exports.getMatchesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    const matches = await db("rencontre")
      .select(
        "id_rencontre",
        "participant_a",
        "participant_b",
        "date_rencontre",
        "heure_rencontre",
        "lieu_rencontre",
        "phase",
        "journee",
        "tour_final"
      )
      .where("id_evenement", eventId);

    // Groupement des matchs par phase/journée/tour final
    const groupedMatches = matches.reduce((acc, match) => {
      const key = `${match.phase}_${match.journee || "0"}_${match.tour_final || "0"}`;

      if (!acc[key]) {
        acc[key] = {
          phase: match.phase,
          journee: match.journee,
          tour_final: match.tour_final,
          matches: [],
        };
      }

      acc[key].matches.push({
        id_rencontre: match.id_rencontre,
        participant_a: match.participant_a, // Déjà stocké sous forme de nom
        participant_b: match.participant_b, // Déjà stocké sous forme de nom
        date_rencontre: match.date_rencontre,
        heure_rencontre: match.heure_rencontre,
        lieu_rencontre: match.lieu_rencontre,
      });

      return acc;
    }, {});

    res.status(200).json(Object.values(groupedMatches));

  } catch (error) {
    console.error("Erreur lors de la récupération des rencontres :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rencontres." });
  }
};


// Récupérer les infos du participant avec son équipe
exports.getParticipantById = async (req, res) => {
  const { participantId } = req.params;

  if (!participantId) {
    return res.status(400).json({ message: "ID du participant requis." });
  }

  try {
    // Récupérer les infos du participant avec son équipe
    const participant = await db('participants as p')
      .leftJoin('equipes as e', 'p.id_participant', 'e.id_participant')
      .where({ 'p.id_participant': participantId })
      .select(
        'p.*',
        'e.nom_equipe',
        'e.categorie_equipe'
      )
      .first();

    if (!participant) {
      return res.status(404).json({ message: "Participant non trouvé." });
    }

    res.status(200).json(participant);
  } catch (error) {
    console.error("Erreur lors de la récupération du participant:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du participant." });
  }
};


// Suppression d'une rencontre par ID
exports.deleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const deletedRows = await db('rencontre').where('id_rencontre', matchId).del();

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Rencontre non trouvée." });
    }

    res.status(200).json({ message: "Rencontre supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la rencontre :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression de la rencontre." });
  }
};


// Fonction pour récupérer toutes les rencontres de tous les événements d'un organisateur
exports.getAllCalendarMatches = async (req, res) => {
  try {
    // Récupérer tous les événements de l'organisateur
    const events = await db('evenement')
      .where('id_organisateur', req.user.id)  // On suppose que l'organisateur est dans req.user.id
      .select('id_evenement');  // On ne sélectionne que les ID des événements

    if (events.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet organisateur." });
    }

    // Récupérer toutes les rencontres de tous les événements
    const allMatches = [];

    for (const event of events) {
      const matches = await db('rencontre')
        .where({ id_evenement: event.id_evenement })
        .select('*')
        .orderBy('date_rencontre', 'asc')
        .orderBy('heure_rencontre', 'asc');
      allMatches.push(...matches);
    }

    // Vérifier si la phase "Aller-Retour" est bien présente dans les résultats
    console.log(matches);  // Vérifiez dans la console si la phase est correcte

    if (allMatches.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée." });
    }

    res.status(200).json(allMatches);
  } catch (error) {
    console.error("Erreur lors de la récupération du calendrier des rencontres :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rencontres." });
  }
};

exports.getCalendarMatchesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    const matches = await db('rencontre')
      .where({ id_evenement: eventId })
      .select('id_rencontre', 'date_rencontre', 'heure_rencontre',
        'participant_a', 'participant_b', 'lieu_rencontre',
        'phase', 'journee', 'tour_final');

    console.log("Données envoyées par l'API :", matches); // 🔍 Vérification des données avant envoi

    res.status(200).json(matches);
  } catch (error) {
    console.error("Erreur lors de la récupération des rencontres :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du calendrier des rencontres." });
  }
};




// recuperation de toute participant 
exports.getAllParticipantsByOrganizer = async (req, res) => {
  const organizerId = req.user?.id; // Récupérer l'ID de l'organisateur authentifié

  if (!organizerId) {
    return res.status(403).json({ message: "L'ID de l'organisateur est introuvable." });
  }

  try {
    // Jointure entre `evenements`, `participer` et `participants`
    const participants = await db('participer')
      .join('participants', 'participer.id_participant', '=', 'participants.id_participant')
      .join('evenement', 'participer.id_evenement', '=', 'evenement.id_evenement') // Correction ici
      .select(
        'participants.id_participant',
        'participants.nom_part',
        'evenement.nom_event',
        'participer.id_evenement'
      )
      .where('evenement.id_organisateur', organizerId); // Filtrer par organisateur

    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: 'Aucun participant trouvé pour vos événements.' });
    }

    res.status(200).json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Envoi d'email depuis un organisateur vers un participant
exports.sendEmailToParticipant = async (req, res) => {
  const { id } = req.params; // ID du participant
  const { subject, content } = req.body; // Sujet et contenu du mail
  const organizerId = req.user.id; // Récupération de l'ID de l'organisateur depuis le token

  try {
    // Vérifier si le participant existe
    const participant = await getParticipantByIdQuery(id);
    if (!participant) {
      return res.status(404).json({ message: "Participant non trouvé." });
    }

    // Vérifier si l'organisateur existe
    const organizer = await getOrganizerByIdQuery(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organisateur non trouvé." });
    }

    // Configuration du service d'email (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Adresse email utilisée pour envoyer les emails
        pass: process.env.EMAIL_PASS, // Mot de passe ou clé d'application
      },
    });

    // Définition de l'email à envoyer
    const mailOptions = {
      from: organizer.email_organisateur, // L'email de l'organisateur en tant qu'expéditeur
      to: participant.email_part, // Destinataire : le participant
      subject: subject + " (Message de votre organisateur)",
      text: `Bonjour ${participant.nom_part},\n\n${content}\n\nCordialement,\n${organizer.nom_organisateur}`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: `Email envoyé avec succès à ${participant.email_part} depuis ${organizer.email_organisateur}.`,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
  }
};

// **************************Resultats*****************************
// pour récupérer les informations d'un événement sélectionné

exports.getEventResultats = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("🔍 eventId reçu :", eventId);

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    // 🔹 Récupération du nom de l'événement
    const event = await db('evenement')
      .where({ id_evenement: eventId })
      .select('nom_event')
      .first();

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // 🔹 Récupération des différentes phases, journées et tours finaux associés à l'événement
    const matchInfo = await db('rencontre')
      .where({ id_evenement: eventId })
      .select('phase', 'journee', 'tour_final')
      .groupBy('phase', 'journee', 'tour_final')  // 🔥 On récupère toutes les valeurs uniques

    console.log("✅ Données matchInfo :", matchInfo);

    if (matchInfo.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée pour cet événement." });
    }

    res.status(200).json({
      nom_event: event.nom_event,
      details: matchInfo // 🔥 On envoie un tableau contenant toutes les phases, journées et tours finaux
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'événement.", error: error.message });
  }
};

// pour récupérer les rencontres filtrées :
exports.getFilteredMatchesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { phase, journee, tour_final } = req.query;

    if (!eventId) {
      return res.status(400).json({ message: "ID de l'événement requis." });
    }

    let query = db('rencontre')
      .where({ id_evenement: eventId })
      .select('id_rencontre', 'participant_a', 'participant_b', 'phase', 'journee', 'tour_final');

    // Filtrage dynamique en fonction des paramètres reçus
    if (phase) {
      query = query.where({ phase });
    }
    if (journee) {
      query = query.where({ journee });
    }
    if (tour_final) {
      query = query.where({ tour_final });
    }

    const matches = await query;

    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée pour ces critères." });
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rencontres filtrées." });
  }
};
// pour enregistrer les résultats des rencontres
exports.saveMatchResults = async (req, res) => {
  try {
    const { eventId } = req.params;
    let { results, point_victoire, point_defaite, point_matchnul } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "L'ID de l'événement est requis." });
    }

    if (!results || results.length === 0) {
      return res.status(400).json({ message: "Aucun résultat fourni." });
    }

    // Date actuelle pour l'enregistrement
    const date_resultat = new Date();
    const insertedResults = [];
    const ignoredResults = [];

    for (const match of results) {
      const { id_rencontre, score_A, score_B, phase } = match;

      // 🔹 Vérification des phases qui ne doivent pas avoir de points
      if (["Finale", "Barrage", "Aller Retour"].includes(phase)) {
        point_victoire = null;
        point_defaite = null;
        point_matchnul = null;
      }

      // Vérifier si un résultat existe déjà pour ce match et cet événement
      const existingResult = await db('resultat')
        .where({ id_rencontre, id_evenement: eventId })
        .first();

      if (existingResult) {
        // 🔹 Ne pas insérer et ajouter à la liste des ignorés
        ignoredResults.push({ id_rencontre, message: "Résultat déjà existant" });
      } else {
        // 🔹 Insérer un nouveau résultat
        const [id_resultat] = await db('resultat').insert({
          id_rencontre,
          id_evenement: eventId,
          score_A,
          score_B,
          point_victoire,
          point_defaite,
          point_matchnul,
          date_resultat
        });

        insertedResults.push({ id_resultat, id_rencontre, score_A, score_B, status: "Inséré" });
      }
    }

    res.status(201).json({
      message: "Résultats traités",
      inserted: insertedResults,
      ignored: ignoredResults
    });
  } catch (error) {
    console.error("❌ Erreur serveur lors de l'enregistrement des résultats :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'enregistrement des résultats." });
  }
};

// ************************** Liste Resultats*****************************
// Récupérer les détails d'un événement et ses phases
exports.getEventResultatList = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Vérifier si l'événement existe
    const event = await db('evenement')
      .where({ id_evenement: eventId })
      .select('nom_event')
      .first();

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // Récupérer les informations de rencontre liées à cet événement
    const matchInfo = await db('rencontre')
      .where({ id_evenement: eventId })
      .select('phase', 'journee', 'tour_final')
      .first(); // On récupère un seul enregistrement

    res.status(200).json({
      nom_event: event.nom_event,
      phase: matchInfo?.phase || 'N/A',
      journee: matchInfo?.journee || 'N/A',
      tour_final: matchInfo?.tour_final || 'N/A'
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'événement.", error: error.message });
  }
};

// Récupérer les résultats des matchs avec jointure
exports.getFilteredMatchesResultatList = async (req, res) => {
  try {
    const { eventId } = req.params;

    let matches = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .join('evenement', 'rencontre.id_evenement', '=', 'evenement.id_evenement')
      .select(
        'evenement.nom_event',
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.tour_final',
        'rencontre.date_rencontre',
        'rencontre.heure_rencontre',
        'rencontre.participant_a',
        'rencontre.participant_b',
        'resultat.score_A',
        'resultat.score_B',
        'rencontre.lieu_rencontre'
      )
      .where('resultat.id_evenement', eventId)
      .orderBy(['evenement.nom_event', 'rencontre.phase', 'rencontre.journee', 'rencontre.tour_final', 'rencontre.date_rencontre']);

    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucun résultat trouvé pour cet événement." });
    }

    // Regrouper les résultats par événement, phase, journée et tour
    let groupedResults = {};
    matches.forEach(match => {
      const groupKey = `${match.nom_event} | ${match.phase} | Journée: ${match.journee !== 'N/A' ? match.journee : 'Non défini'} ${match.tour_final !== 'N/A' ? `Tour Final: ${match.tour_final}` : ''}`;

      if (!groupedResults[groupKey]) {
        groupedResults[groupKey] = [];
      }
      groupedResults[groupKey].push(match);
    });

    res.status(200).json(groupedResults);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des résultats.", error: error.message });
  }
};



// ✅ Récupérer les événements SANS authentification
exports.getPublicEvents = async (req, res) => {
  try {
    const events = await db('evenement').select('*'); // Récupérer tous les événements
    console.log("Événements récupérés :", events);
    res.json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// ********************************* Tous les résultats des matchs *********************************
// Récupérer les résultats de tous les événements
exports.getAllMatchesResultatList = async (req, res) => {
  try {
    let matches = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .join('evenement', 'rencontre.id_evenement', '=', 'evenement.id_evenement')
      .select(
        'evenement.nom_event',
        'rencontre.id_rencontre',
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.tour_final',
        'rencontre.date_rencontre',
        'rencontre.heure_rencontre',
        'rencontre.participant_a',
        'rencontre.participant_b',
        'resultat.id_resultat', // ✅ Ajout de `id_resultat`
        'resultat.score_A',
        'resultat.score_B',
        'rencontre.lieu_rencontre'
      )
      .orderBy(['evenement.nom_event', 'rencontre.phase', 'rencontre.journee', 'rencontre.tour_final', 'rencontre.date_rencontre']);

    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucun résultat trouvé." });
    }

    // Regrouper les résultats par événement, phase, journée et tour
    let groupedResults = {};
    matches.forEach(match => {
      const groupKey = `${match.nom_event} | ${match.phase} | Journée: ${match.journee !== 'N/A' ? match.journee : 'Non défini'} ${match.tour_final !== 'N/A' ? `Tour Final: ${match.tour_final}` : ''}`;

      if (!groupedResults[groupKey]) {
        groupedResults[groupKey] = [];
      }
      groupedResults[groupKey].push(match);
    });

    res.status(200).json(groupedResults);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des résultats.", error: error.message });
  }
};

// Contrôleur pour la mise à jour du score
exports.updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { score_A, score_B } = req.body;

    // Vérification des valeurs
    if (score_A === undefined || score_B === undefined) {
      return res.status(400).json({ message: "Les scores sont requis." });
    }

    // Mise à jour du score dans la base de données
    const updated = await db('resultat')
      .where({ id_rencontre: matchId })
      .update({ score_A, score_B });

    if (updated) {
      res.status(200).json({ message: "Score mis à jour avec succès !" });
    } else {
      res.status(404).json({ message: "Match non trouvé." });
    }
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du score :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du score." });
  }
};

// Contrôleur pour supprimer un résultat de match via `id_resultat`
exports.deleteMatchResult = async (req, res) => {
  try {
    const { resultId } = req.params; // On récupère `id_resultat` et non `id_rencontre`

    // Vérifier si le résultat existe
    const resultExists = await db('resultat').where({ id_resultat: resultId }).first();

    if (!resultExists) {
      return res.status(404).json({ message: "Le résultat du match n'existe pas." });
    }

    // Suppression du résultat
    await db('resultat').where({ id_resultat: resultId }).del();

    res.status(200).json({ message: "Résultat supprimé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du résultat :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du résultat." });
  }
};
// ********************************* Classement *********************************

exports.getClassement = async (req, res) => {
  try {
    const phasesAExclure = ["Barrage", "Éliminatoire", "Aller Retour", "Finale"];

    let query = db("resultat")
      .join("rencontre", "resultat.id_rencontre", "=", "rencontre.id_rencontre")
      .join("evenement", "rencontre.id_evenement", "=", "evenement.id_evenement")
      .join("poules", "rencontre.id_poule", "=", "poules.id_poule")
      .select(
        "evenement.nom_event",
        "evenement.nom_sport",
        "rencontre.id_evenement",
        "rencontre.phase",
        "rencontre.journee",
        "rencontre.id_poule",
        "poules.nom_poule",
        "rencontre.participant_a",
        "rencontre.participant_b",
        "resultat.score_A",
        "resultat.score_B",
        "resultat.point_victoire",
        "resultat.point_matchnul",
        "resultat.point_defaite"
      )
      .whereNotIn("rencontre.phase", phasesAExclure);

    const resultats = await query;

    if (!resultats.length) {
      return res.status(200).json({ classement: {} });
    }

    let classementParEvenement = {};

    resultats.forEach((match) => {
      const eventKey = match.nom_event;
      const phaseKey = `Phase: ${match.phase}`;
      const journeeKey = `Journée ${match.journee}`;
      const pouleKey = `Poule ${match.nom_poule}`;
      const sport = match.nom_sport.toLowerCase();

      if (!classementParEvenement[eventKey]) {
        classementParEvenement[eventKey] = {};
      }

      if (!classementParEvenement[eventKey][phaseKey]) {
        classementParEvenement[eventKey][phaseKey] = {};
      }

      if (!classementParEvenement[eventKey][phaseKey][journeeKey]) {
        classementParEvenement[eventKey][phaseKey][journeeKey] = {};
      }

      if (!classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey]) {
        classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey] = [];
      }

      [match.participant_a, match.participant_b].forEach((equipe, i) => {
        const score = i === 0 ? match.score_A : match.score_B;
        const adversaireScore = i === 0 ? match.score_B : match.score_A;
        const victoire = score > adversaireScore ? 1 : 0;
        const defaite = score < adversaireScore ? 1 : 0;
        const matchJoue = 1;

        let points = 0;
        if (score > adversaireScore) {
          points = match.point_victoire;
        } else if (score === adversaireScore) {
          points = match.point_matchnul;
        } else {
          points = match.point_defaite;
        }

        const team = classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey].find(
          (equipeData) => equipeData.nom_equipe === equipe
        );

        if (team) {
          if (sport === "basketball") {
            team.mj += matchJoue;
            team.v += victoire;
            team.d += defaite;
            team.points_marques += score;
            team.points_concedes += adversaireScore;
            team.difference_points += score - adversaireScore;
          } else if (sport === "pétanque") {
            team.points += points;
            team.points_marques += score;
            team.points_concedes += adversaireScore;
            team.difference_points += score - adversaireScore;
          } else {
            team.points += points;
            team.buts_marques += score;
            team.buts_encaisses += adversaireScore;
            team.difference_buts += score - adversaireScore;
          }
        } else {
          classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey].push({
            nom_equipe: equipe,
            points: points,
            buts_marques: sport !== "basketball" ? score : undefined,
            buts_encaisses: sport !== "basketball" ? adversaireScore : undefined,
            difference_buts: sport !== "basketball" ? score - adversaireScore : undefined,
            points_marques: sport === "basketball" || sport === "pétanque" ? score : undefined,
            points_concedes: sport === "basketball" || sport === "pétanque" ? adversaireScore : undefined,
            difference_points: sport === "basketball" || sport === "pétanque" ? score - adversaireScore : undefined,
            mj: sport === "basketball" ? matchJoue : undefined,
            v: sport === "basketball" ? victoire : undefined,
            d: sport === "basketball" ? defaite : undefined
          });
        }
      });
    });

    // Ajout du Classement Général
    Object.keys(classementParEvenement).forEach(eventKey => {
      let classementGeneral = {};

      Object.keys(classementParEvenement[eventKey]).forEach(phaseKey => {
        Object.keys(classementParEvenement[eventKey][phaseKey]).forEach(journeeKey => {
          Object.keys(classementParEvenement[eventKey][phaseKey][journeeKey]).forEach(pouleKey => {
            classementParEvenement[eventKey][phaseKey][journeeKey][pouleKey].forEach(team => {
              const equipeKey = team.nom_equipe;
              if (!classementGeneral[equipeKey]) {
                classementGeneral[equipeKey] = { ...team };
              } else {
                Object.keys(team).forEach(stat => {
                  if (typeof team[stat] === "number") {
                    classementGeneral[equipeKey][stat] += team[stat];
                  }
                });
              }
            });
          });
        });
      });

      classementParEvenement[eventKey]["Classement Général"] = {
        "Classement Général": Object.values(classementGeneral).sort((a, b) => b.points - a.points)
      };
    });

    res.status(200).json({ classement: classementParEvenement });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
