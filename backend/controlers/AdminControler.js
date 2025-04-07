// const db = require('../db');  // Importer l'instance de Knex depuis db.js
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log('Tentative de connexion avec:', email);

//     const admin = await db('admin').where({ email_admin: email }).first();

//     if (!admin) {
//       console.log('Administrateur non trouvé');
//       return res.status(404).json({ message: 'Administrateur non trouvé' });
//     }

//     console.log('Administrateur trouvé:', admin);

//     const validPassword = await bcrypt.compare(password, admin.mdp_admin);
//     if (!validPassword) {
//       console.log('Mot de passe incorrect');
//       return res.status(400).json({ message: 'Mot de passe incorrect' });
//     }

//     console.log('Mot de passe correct');
//     // Ajouter le rôle "admin" dans le token JWT
//     const token = jwt.sign({ id: admin.id_admin, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     console.log('Token généré avec succès');

//     res.status(200).json({ message: 'Connexion réussie', token });
//   } catch (error) {
//     console.error('Erreur serveur lors de la connexion:', error);
//     res.status(500).json({ message: 'Erreur serveur', error });
//   }
// };

// // Fonction pour obtenir les informations de l'administrateur connecté
// exports.getProfile = async (req, res) => {
//   try {
//     const adminId = req.userId; // L'ID de l'utilisateur est extrait du token JWT
//     const admin = await db('admin').where({ id_admin: adminId }).first();

//     if (!admin) {
//       return res.status(404).json({ message: 'Administrateur non trouvé' });
//     }

//     // Retourner les informations de l'administrateur connecté
//     res.status(200).json({
//       name: `${admin.nom_admin} ${admin.prenom_admin}`,
//       email: admin.email_admin,
//     });
//   } catch (error) {
//     console.error('Erreur lors de la récupération du profil:', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// // récuperation des admins
// exports.getAllAdmins = async (req, res) => {
//   try {
//       const admins = await db('admin').select('id_admin', 'nom_admin', 'prenom_admin', 'tel_admin','email_admin');
//       res.status(200).json(admins);
//   } catch (error) {
//       res.status(500).json({ message: 'Erreur lors de la récupération des administrateurs', error });
//   }
// };

// exports.createAdmin = async (req, res) => {
//     const { nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin} = req.body;
    
//     try {
//         const hashedPassword = await bcrypt.hash(mdp_admin, 10);
//         await db('admin').insert({ nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin: hashedPassword });
//         res.status(201).json({ message: 'Administrateur créé avec succès' });
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la création de l\'administrateur', error });
//     }
// };

// //modification d'un admin
// exports.editAdmin = async (req, res) => {
//   const { id } = req.params;
//   const { nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin } = req.body;

//   try {
//       await db('admin').where({ id_admin: id }).update({ nom_admin, prenom_admin, email_admin, role_admin });
//       res.status(200).json({ message: 'Administrateur modifié avec succès' });
//   } catch (error) {
//       res.status(500).json({ message: 'Erreur lors de la modification de l\'administrateur', error });
//   }
// };

// //suppréssion
// exports.deleteAdmin = async (req, res) => {
//   const { id } = req.params;

//   try {
//       await db('admin').where({ id_admin: id }).del();
//       res.status(200).json({ message: 'Administrateur supprimé avec succès' });
//   } catch (error) {
//       res.status(500).json({ message: 'Erreur lors de la suppression de l\'administrateur', error });
//   }
// };

//code farany
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  createAdminQuery,
  getAdminByEmailQuery,
  getAllAdminsQuery,
  getAdminByIdQuery,
  updateAdminQuery,
  deleteAdminQuery,
} = require('../queries'); // Import des requêtes
const nodemailer = require("nodemailer");
const { getOrganizerByIdQuery } = require("../queries");


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Tentative de connexion avec:', email);

    const admin = await getAdminByEmailQuery(email); // Utilisation de la requête externalisée

    if (!admin) {
      console.log('Administrateur non trouvé');
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    console.log('Administrateur trouvé:', admin);

    const validPassword = await bcrypt.compare(password, admin.mdp_admin);
    if (!validPassword) {
      console.log('Mot de passe incorrect');
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    console.log('Mot de passe correct');
    const token = jwt.sign({ id: admin.id_admin, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token généré avec succès');

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur serveur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.createAdmin = async (req, res) => {
  const { nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin } = req.body;
  console.log('Données reçues pour l\'ajout:', req.body);

  try {
    // Vérifier si l'email existe déjà
    const existingAdmin = await getAdminByEmailQuery(email_admin);
    
    if (existingAdmin) {
      console.log('Administrateur avec cet email existe déjà:', email_admin);
      return res.status(400).json({ message: 'Cet email est déjà enregistré.' });
    }

    // Si l'email n'existe pas, continuer avec la création
    const hashedPassword = await bcrypt.hash(mdp_admin, 10);
    console.log('Mot de passe hashé:', hashedPassword);

    // Ajouter l'admin dans la base de données
    await createAdminQuery({ nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin: hashedPassword });
    console.log('Admin ajouté avec succès');

    res.status(201).json({ message: 'Administrateur créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'administrateur', error });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const adminId = req.userId;
    const admin = await getAdminByIdQuery(adminId); // Utilisation de la requête externalisée

    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    res.status(200).json({
      name: `${admin.nom_admin} ${admin.prenom_admin}`,
      email: admin.email_admin,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await getAllAdminsQuery(); // Utilisation de la requête externalisée
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des administrateurs', error });
  }
};

exports.editAdmin = async (req, res) => {
  const { id } = req.params;
  const { nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mdp_admin, 10);
    await updateAdminQuery(id, { nom_admin, prenom_admin, email_admin, tel_admin, mdp_admin: hashedPassword });
    res.status(200).json({ message: 'Administrateur modifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'administrateur', error });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteAdminQuery(id); // Utilisation de la requête externalisée
    res.status(200).json({ message: 'Administrateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'administrateur', error });
  }
};

//Evoie email aux organisateurs
exports.sendEmailToOrganizer = async (req, res) => {
  const { id } = req.params; // ID de l'organisateur
  const { email, subject, content } = req.body; // Contenu de l'email fourni par l'admin

  try {
    // Vérifiez si l'organisateur existe dans la base de données
    const organizer = await getOrganizerByIdQuery(id);
    if (!organizer) {
      return res.status(404).json({ message: "Organisateur non trouvé." });
    }

    // Configuration du service d'email (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail", // Changez si vous utilisez un autre service
      auth: {
        user: process.env.EMAIL_USER, // Adresse email de l'expéditeur
        pass: process.env.EMAIL_PASS, // Mot de passe ou clé d'application de l'expéditeur
      },
    });

    // Définition de l'email à envoyer
    const mailOptions = {
      from: process.env.EMAIL_USER, // Adresse email de l'expéditeur
      to: email, // Adresse email du destinataire
      subject: subject + " (Administration de QuickEvent)",
      text: content, // Contenu du message
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Email envoyé avec succès à ${email}.` });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
  }
};
