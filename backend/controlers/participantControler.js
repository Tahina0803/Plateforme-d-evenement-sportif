const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../db');
const jwt = require('jsonwebtoken');
const Token = require('../middleware/jwtMiddleware'); // Modèle pour la table Token
const {
  createParticipantQuery,
  getParticipantByEmailQuery,
  getEventByIdQuery,
  getParticipantByIdQuery,
  updateParticipantQuery
} = require('../queries');
const { sendActivationEmail } = require('./ParticipantEmailService');


// Récupérer tous les participants
exports.getAllParticipants = async (req, res) => {
  try {
      const participants = await db('participants').select('*');
      res.status(200).json(participants);
  } catch (error) {
      console.error("Erreur lors de la récupération des participants :", error);
      res.status(500).json({ message: "Erreur serveur." });
  }
};

// Supprimer un participant
exports.deleteParticipant = async (req, res) => {
  const { id } = req.params;
  try {
      const deletedRows = await db('participants').where({ id_participant: id }).del();
      if (deletedRows) {
          res.status(200).json({ message: "Participant supprimé avec succès." });
      } else {
          res.status(404).json({ message: "Participant non trouvé." });
      }
  } catch (error) {
      console.error("Erreur lors de la suppression du participant :", error);
      res.status(500).json({ message: "Erreur serveur." });
  }
};
// Récupérer le nombre total de participants
exports.getParticipantCount = async (req, res) => {
  try {
    const count = await db('participants').count('id_participant as total').first();
    res.status(200).json({ total: count.total });
  } catch (error) {
    console.error("Erreur lors du comptage des participants :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
//controler pour afficher les donne de participant dans son tableau de bord

exports.registerOrLoginParticipant = async (req, res) => {
  const { nom_part, email_part, mdp_part, genre_part, telephone_part, ville_part, codepostal_part, id_evenement } = req.body;

  try {
    console.log("🔍 Données reçues :", req.body);

    // Vérifier si l'événement existe
    const event = await db('evenement').where({ id_evenement }).first();
    if (!event) {
      console.error("❌ Événement non trouvé pour l'ID :", id_evenement);
      return res.status(400).json({ message: "Événement non trouvé." });
    }
    const id_organisateur = event.id_organisateur;

    // Vérifier si le participant existe déjà
    let participant = await db('participants').where({ email_part }).first();

    if (!participant) {
      // 🔹 **Créer un nouveau participant**
      console.log("🆕 Création d'un nouveau participant...");

      // Validation des champs obligatoires
      if (!nom_part || !email_part || !mdp_part || !telephone_part || !ville_part || !codepostal_part) {
        console.error("❌ Un champ obligatoire est manquant.");
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
      }

      // Validation du numéro de téléphone
      const phoneRegex = /^\+\d{1,3}\d{8,12}$/;
      if (!phoneRegex.test(telephone_part)) {
        console.error("❌ Numéro de téléphone invalide :", telephone_part);
        return res.status(400).json({ message: "Numéro de téléphone invalide." });
      }

      // Hashage du mot de passe
      console.log("🔑 Hashage du mot de passe...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mdp_part, salt);

      // Insérer le participant dans la base de données
      const [participantId] = await db('participants').insert({
        nom_part,
        email_part,
        mdp_part: hashedPassword,
        genre_part,
        telephone_part,
        ville_part,
        codepostal_part,
        id_organisateur,
        statut_part: "En attente",
        date_inscription: new Date().toISOString().split("T")[0],
      });

      console.log("✅ Nouveau participant créé avec ID :", participantId);
      participant = { id_participant: participantId };
    } else {
      // 🔹 **Le participant existe déjà → Vérifier son mot de passe**
      console.log("🔄 Connexion d'un participant existant...");
      const isPasswordValid = await bcrypt.compare(mdp_part, participant.mdp_part);
      if (!isPasswordValid) {
        console.error("❌ Mot de passe incorrect pour :", email_part);
        return res.status(401).json({ message: "Mot de passe incorrect." });
      }
    }

    // 🔹 Vérifier si le participant est déjà inscrit à cet événement
    const existingParticipation = await db('participer')
      .where({ id_participant: participant.id_participant, id_evenement })
      .first();

    if (existingParticipation) {
      console.warn(`⚠️ Le participant avec l'email ${email_part} est déjà inscrit à cet événement.`);
      return res.status(400).json({ message: "Vous êtes déjà inscrit à cet événement." });
    }

    // 🔹 Inscrire le participant à l'événement
    await db('participer').insert({
      id_participant: participant.id_participant,
      id_evenement,
    });

    console.log("✅ Inscription à l'événement réussie.");

    // 🔹 Génération du token JWT
    const token = jwt.sign(
      { id_participant: participant.id_participant, email: participant.email_part },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "Inscription réussie.",
      participantId: participant.id_participant,
      token,
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getParticipantProfile = async (req, res) => {
  const { participantId } = req.params;

  try {
    const participant = await getParticipantByIdQuery(participantId);
    console.log(await getParticipantByIdQuery(participantId)); // Ajoutez ceci dans votre contrôleur pour déboguer

    if (!participant) {
      return res.status(404).json({ message: "Participant non trouvé." });
    }

    res.status(200).json(participant);
  } catch (error) {
    console.error('Erreur lors de la récupération des données du participant :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur de connexion pour le participant
exports.loginParticipant = async (req, res) => {
  const { email, password } = req.body;

  try {

    // Vérifiez les champs envoyés depuis le frontend
    console.log("Email reçu depuis le frontend :", email);
    console.log("Mot de passe reçu depuis le frontend :", password);

    // Validation des champs d'entrée
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }

    // Récupérer le participant par email
    const participant = await getParticipantByEmailQuery(email);
    console.log("Participant récupéré depuis la base de données :", participant);
    if (!participant) {
      return res.status(404).json({ message: 'Participant non trouvé.' });
    }

    // Vérifiez si le mot de passe hashé est présent dans la base de données
    console.log("Mot de passe hashé dans la base de données :", participant.mdp_participant);

    // Vérifiez si le mot de passe hashé est présent dans la base de données
    if (!participant.mdp_participant) {
      console.error('Mot de passe introuvable pour cet utilisateur:', participant);
      return res.status(400).json({ message: 'Mot de passe introuvable pour cet utilisateur.' });

    }

    // Comparer le mot de passe fourni avec le hash dans la base de données
    const validPassword = await bcrypt.compare(password, participant.mdp_participant);
    console.log("Résultat de la comparaison des mots de passe :", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    //Créer un token JWT
    const token = jwt.sign(
      { id: participant.id_participant, role: 'participant' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );



    console.log('Connexion réussie pour le participant:', participant.email_part);
    return res.status(200).json({
      message: 'Connexion réussie (participant)',
      token,
    });
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ message: 'Erreur serveur.', error });
  }
};

// Mettre à jour le profil du participant
exports.updateParticipantProfile = async (req, res) => {
  const { participantId } = req.params;
  const { nom_part, prenom_part, email_part, telephone_part, genre_part, ville_part, codepostal_part, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const participant = await getParticipantByIdQuery(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant non trouvé." });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingEmail = await db('participants').where({ email_part }).whereNot({ id_participant: participantId }).first();
    if (existingEmail) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    let updatedFields = {
      nom_part,
      prenom_part,
      email_part,
      telephone_part,
      genre_part,
      ville_part,
      codepostal_part
    };

    // Si l'utilisateur veut changer son mot de passe
    if (oldPassword && newPassword && confirmPassword) {
      const validPassword = await bcrypt.compare(oldPassword, participant.mdp_part);
      if (!validPassword) {
        return res.status(400).json({ message: "Ancien mot de passe incorrect." });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas." });
      }

      const salt = await bcrypt.genSalt(10);
      updatedFields.mdp_part = await bcrypt.hash(newPassword, salt);
    }

    // Mise à jour des informations dans la base de données
    await updateParticipantQuery(participantId, updatedFields);

    return res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


// Récupérer les événements auxquels un participant est inscrit
exports.getInscribedEvents = async (req, res) => {
  try {
    console.log("📌 Token brut reçu dans l'en-tête:", req.headers.authorization);

    let participantId = req.userId || req.id_participant;

    if (!participantId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("📌 Token décodé directement dans le contrôleur:", decoded);

        participantId = decoded.id_participant || decoded.id;
      } catch (error) {
        console.error("❌ Erreur lors de la vérification du token dans le contrôleur:", error.message);
      }
    }

    console.log("📌 ID du participant extrait du token:", participantId);

    if (!participantId) {
      console.error("❌ ID du participant introuvable.");
      return res.status(400).json({ message: "ID du participant manquant." });
    }

    console.log("🔍 Récupération des événements pour le participant ID:", participantId);

    const events = await db('participer')
      .join('evenement', 'participer.id_evenement', '=', 'evenement.id_evenement')
      .where('participer.id_participant', participantId)
      .select(
        'evenement.id_evenement',
        'evenement.nom_event',
        'evenement.date_debut',
        'evenement.date_fin',
        'evenement.lieu_event',
        'evenement.logo_event',
        'evenement.type_event',
        'evenement.nbr_participant',
        'evenement.genre_participant',
        'evenement.categorie_participant',
        'evenement.frais_inscription',
        'evenement.statut_event',
        'evenement.description_accueil',
        'evenement.description_detail'
      );

    console.log("✅ Événements trouvés:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements inscrits :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// Contrôleur pour annuler une inscription
exports.unsubscribeFromEvent = async (req, res) => {
  try {
    const participantId = req.userId || req.id_participant;
    const { eventId } = req.params;

    if (!participantId || !eventId) {
      return res.status(400).json({ message: "ID du participant ou de l'événement manquant." });
    }

    console.log("🔍 Suppression de l'inscription de l'événement :", eventId, "par le participant :", participantId);

    // Vérifier si l'inscription existe
    const participation = await db('participer')
      .where({ id_participant: participantId, id_evenement: eventId })
      .first();

    if (!participation) {
      return res.status(404).json({ message: "Vous n'êtes pas inscrit à cet événement." });
    }

    // Supprimer l'inscription
    await db('participer')
      .where({ id_participant: participantId, id_evenement: eventId })
      .del();

    console.log("✅ Inscription annulée avec succès !");
    return res.status(200).json({ message: "Votre inscription a été annulée avec succès." });

  } catch (error) {
    console.error("❌ Erreur lors de l'annulation de l'inscription :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
// pour Affichage des événements
exports.getAllEvents = async (req, res) => {
  try {
    const events = await db('evenement')
      .select('id_evenement', 'nom_event');

    console.log("✅ Événements trouvés:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔹 Récupérer les événements auxquels le participant est inscrit
exports.getParticipantEvents = async (req, res) => {
  try {
    console.log("📌 Token brut reçu dans l'en-tête:", req.headers.authorization);

    let participantId = req.userId || req.id_participant;

    // Vérification du token si `participantId` n'est pas défini
    if (!participantId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 Token décodé dans `getParticipantEvents`:", decoded);
        participantId = decoded.id_participant || decoded.id;
      } catch (error) {
        console.error("❌ Erreur lors de la vérification du token:", error.message);
      }
    }

    console.log("📌 ID du participant extrait du token:", participantId);

    if (!participantId) {
      return res.status(400).json({ message: "ID du participant manquant." });
    }

    console.log("🔍 Récupération des événements auxquels le participant ID:", participantId, "est inscrit.");

    // Récupérer les événements du participant depuis la table `participer`
    const events = await db('participer')
      .join('evenement', 'participer.id_evenement', '=', 'evenement.id_evenement')
      .where('participer.id_participant', participantId)
      .select('evenement.id_evenement', 'evenement.nom_event');

    console.log("✅ Événements trouvés:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements inscrits:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔹 **Créer une équipe (stockée avec le participant)**
exports.createEquipe = async (req, res) => {
  try {
    console.log("📌 Token brut reçu dans l'en-tête:", req.headers.authorization);

    let participantId = req.userId || req.id_participant;

    if (!participantId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 Token décodé dans `createEquipe`:", decoded);
        participantId = decoded.id_participant || decoded.id;
      } catch (error) {
        console.error("❌ Erreur lors de la vérification du token:", error.message);
      }
    }

    console.log("📌 ID du participant extrait du token:", participantId);

    if (!participantId) {
      return res.status(400).json({ message: "ID du participant manquant." });
    }

    const { nom_equipe, categorie_equipe, id_evenement } = req.body;

    if (!nom_equipe || !categorie_equipe || !id_evenement) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    console.log(`🔍 Création d'une équipe: ${nom_equipe} | Catégorie: ${categorie_equipe} | Événement ID: ${id_evenement} | Participant ID: ${participantId}`);

    const [equipeId] = await db('equipes').insert({
      nom_equipe,
      categorie_equipe,
      id_participant: participantId,
      id_evenement
    });

    console.log("✅ Équipe créée avec ID:", equipeId);
    res.status(201).json({ message: "Équipe créée avec succès.", id_equipe: equipeId });

  } catch (error) {
    console.error("❌ Erreur lors de la création de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔹 Afficher les équipes du participant
// 🔹 Afficher les équipes du participant avec le nom de l'événement
exports.getMyTeams = async (req, res) => {
  try {
    console.log("📌 Token brut reçu dans l'en-tête:", req.headers.authorization);

    let participantId = req.userId || req.id_participant;

    if (!participantId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 Token décodé dans `getMyTeams`:", decoded);
        participantId = decoded.id_participant || decoded.id;
      } catch (error) {
        console.error("❌ Erreur lors de la vérification du token:", error.message);
      }
    }

    console.log("📌 ID du participant extrait du token:", participantId);

    if (!participantId) {
      return res.status(400).json({ message: "ID du participant manquant." });
    }

    // 🔍 Récupération des équipes du participant avec le nom de l'événement
    const equipes = await db('equipes')
      .join('evenement', 'equipes.id_evenement', '=', 'evenement.id_evenement') // Ajout de la jointure
      .where({ 'equipes.id_participant': participantId })
      .select('equipes.id_equipe', 'equipes.nom_equipe', 'equipes.categorie_equipe', 'equipes.id_evenement', 'evenement.nom_event');

    console.log("✅ Équipes récupérées:", equipes);
    res.status(200).json(equipes);

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des équipes:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// controler pour supprimer une équipe
exports.deleteEquipe = async (req, res) => {
  try {
    const { id } = req.params;
    await db('equipes').where({ id_equipe: id }).del();
    res.status(200).json({ message: "Équipe supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

// Controler pour modifier une équipe
exports.updateEquipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_equipe, categorie_equipe } = req.body;

    await db('equipes').where({ id_equipe: id }).update({ nom_equipe, categorie_equipe });

    res.status(200).json({ message: "Équipe mise à jour avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

// ✅ Ajouter un joueur à une équipe
exports.addJoueur = async (req, res) => {
  try {
      console.log("📌 Requête reçue pour ajouter un joueur:", req.body);
      
      const { nom_joueur, prenom_joueur, date_naissance, sexe_joueur, email_joueur, tel_joueur, poste_joueur } = req.body;
      const { idEquipe } = req.params; // Récupérer l'ID de l'équipe depuis l'URL

      if (!nom_joueur || !prenom_joueur || !date_naissance || !sexe_joueur || !email_joueur || !tel_joueur || !poste_joueur) {
          return res.status(400).json({ message: "Tous les champs sont obligatoires." });
      }

      console.log(`🔍 Ajout du joueur: ${nom_joueur} ${prenom_joueur}, Poste: ${poste_joueur}, Équipe ID: ${idEquipe}`);

      const [joueurId] = await db('joueurs').insert({
          nom_joueur,
          prenom_joueur,
          date_naissance,
          sexe_joueur,
          email_joueur,
          tel_joueur,
          poste_joueur,
          id_equipe: idEquipe
      });

      console.log("✅ Joueur ajouté avec ID:", joueurId);
      res.status(201).json({ message: "Joueur ajouté avec succès.", id_joueur: joueurId });

  } catch (error) {
      console.error("❌ Erreur lors de l'ajout du joueur:", error);
      res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Récupérer les joueurs d'une équipe
exports.getJoueursByEquipe = async (req, res) => {
  try {
      const { idEquipe } = req.params; // Récupérer l'ID de l'équipe depuis l'URL

      console.log(`📌 Récupération des joueurs pour l'équipe ID: ${idEquipe}`);

      // Vérification si l'équipe existe
      const equipe = await db('equipes').where({ id_equipe: idEquipe }).first();
      if (!equipe) {
          return res.status(404).json({ message: "Équipe non trouvée." });
      }

      // Récupération des joueurs de cette équipe
      const joueurs = await db('joueurs').where({ id_equipe: idEquipe }).select('*');

      console.log("✅ Joueurs récupérés:", joueurs);
      res.status(200).json(joueurs);

  } catch (error) {
      console.error("❌ Erreur lors de la récupération des joueurs:", error);
      res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔹 Modifier un joueur
exports.updateJoueur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_joueur, prenom_joueur, date_naissance, sexe_joueur, email_joueur, tel_joueur, poste_joueur } = req.body;

    // Vérifier si le joueur existe
    const joueur = await db('joueurs').where({ id_joueur: id }).first();
    if (!joueur) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }

    // Mise à jour du joueur
    await db('joueurs').where({ id_joueur: id }).update({
      nom_joueur, prenom_joueur, date_naissance, sexe_joueur, email_joueur, tel_joueur, poste_joueur
    });

    res.status(200).json({ message: "Joueur mis à jour avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du joueur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 🔹 Supprimer un joueur
exports.deleteJoueur = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le joueur existe
    const joueur = await db('joueurs').where({ id_joueur: id }).first();
    if (!joueur) {
      return res.status(404).json({ message: "Joueur non trouvé." });
    }

    // Supprimer le joueur
    await db('joueurs').where({ id_joueur: id }).del();

    res.status(200).json({ message: "Joueur supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du joueur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



