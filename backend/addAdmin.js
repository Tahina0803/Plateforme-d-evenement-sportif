// addAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db'); 

// Fonction pour ajouter un administrateur
const addAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('example', 10); // Hachage du mot de passe
    const admin = {
      nom_admin: 'admin',
      prenom_admin: 'example',
      email_admin: 'admin@example.com',
      tel_admin: '0340002365',
      mdp_admin: hashedPassword
    };

    // Insertion de l'administrateur dans la table `admin`
    await db('admin').insert(admin);
    console.log('Administrateur ajouté avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'administrateur:', err);
  } finally {
    process.exit(); // Sortir une fois l'insertion terminée
  }
};

addAdmin();
