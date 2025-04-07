const db = require('./db');

// **** ADMIN *********
// Requête pour créer un administrateur
const createAdminQuery = async (adminData) => {
  return db('admin').insert(adminData);
};

// Requête pour obtenir un administrateur par email
const getAdminByEmailQuery = async (email) => {
  return db('admin').where({ email_admin: email }).first();
};

// Requête pour obtenir tous les administrateurs
const getAllAdminsQuery = async () => {
  return db('admin').select('*');
};

// Requête pour obtenir un administrateur par ID
const getAdminByIdQuery = async (id) => {
  return db('admin').where({ id_admin: id }).first();
};

// Requête pour mettre à jour un administrateur
const updateAdminQuery = async (id, updatedData) => {
  return db('admin').where({ id_admin: id }).update(updatedData);
};

// Requête pour supprimer un administrateur
const deleteAdminQuery = async (id) => {
  return db('admin').where({ id_admin: id }).del();
};

//***********FAQ*************
// Créer une nouvelle FAQ
const createFaqQuery = async (faqData) => {
  const [id] = await db('faq').insert(faqData);
  return { id, ...faqData };
};

// Obtenir toutes les FAQs
const getAllFaqsQuery = async () => {
  return db('faq').select('*');
};

// Obtenir une FAQ par ID
const getFaqByIdQuery = async (id) => {
  return db('faq').where({ id }).first();
};

// Mettre à jour une FAQ
const updateFaqQuery = async (id, updatedData) => {
  return db('faq').where({ id }).update(updatedData);
};

// Supprimer une FAQ
const deleteFaqQuery = async (id) => {
  return db('faq').where({ id }).del();
};

// ************Organisateur***************

// Requête pour créer un organisateur avec la date d'inscription
const createOrganizerQuery = async ({ nom_organisateur, prenom_organisateur, email_organisateur, tel_organisateur, mdp_organisateur, date_inscription, isActive }) => {
  const [id] = await db('organisateur').insert({
    nom_organisateur,
    prenom_organisateur,
    email_organisateur,
    tel_organisateur,
    mdp_organisateur,
    date_inscription,
    isActive
  });
  return id; // retourne l'ID inséré
};

// Requête pour insérer un jeton d'activation dans la base de données
const insertTokenQuery = async ({ token, expiresAt, email, nom_organisateur, prenom_organisateur, tel_organisateur, mdp_organisateur }) => {
  try {
    console.log('Préparation pour insérer le token et les données utilisateur:', { token, expiresAt, email });
    const result = await db('tokens').insert({
      token,
      expires_at: expiresAt,
      email,
      nom_organisateur,
      prenom_organisateur,
      tel_organisateur,
      mdp_organisateur,
    });
    console.log('Insertion réussie dans la table tokens:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'insertion du token dans la table:', error);
    throw error;
  }
};

const getTokenQuery = async (userId, token) => {
  return db('tokens').where({ user_id: userId, token }).first();
};

// Requête pour supprimer un token d'activation
const deleteTokenQuery = async (userId, token) => {
  return db('tokens').where({ user_id: userId, token }).del();
};

// Requête pour mettre à jour les informations complémentaires d'un organisateur
const completeOrganizerQuery = async ({ prenom_organisateur, tel_organisateur, email_organisateur }) => {
  return db('organisateur')
    .where({ email_organisateur })
    .update({ prenom_organisateur, tel_organisateur });
};

// Requête pour obtenir un organisateur par email
const getOrganizerByEmailQuery = async (email) => {
  return db('organisateur').where({ email_organisateur: email }).first();
};

// Requête pour obtenir tous les organisateurs
const getAllOrganizersQuery = async () => {
  return db('organisateur').select('*');
};

// Requête pour obtenir un organisateur par ID
const getOrganizerByIdQuery = async (id) => {
  return db('organisateur')
    .where({ id_organisateur: id })
    .select('nom_organisateur', 'prenom_organisateur', 'email_organisateur', 'tel_organisateur', 'date_inscription')
    .first();
};

// Requête pour mettre à jour un organisateur
const updateOrganizerQuery = async (id, updatedData) => {
  return await db('organisateur').where({ id_organisateur: id }).update(updatedData);
};

// Requête pour supprimer un organisateur
const deleteOrganizerQuery = async (id) => {
  return db('organisateur').where({ id_organisateur: id }).del();
};

const getEventWithOrganizerQuery = async (idEvenement) => {
  return db('evenement')
    .join('organisateur', 'evenement.id_organisateur', 'organisateur.id_organisateur')
    .where({ 'evenement.id_evenement': idEvenement })
    .select(
      'evenement.*',
      'organisateur.tel_organisateur',
      'organisateur.email_organisateur'
    )
    .first();
};

// ************Participant***************

// Requête pour créer un participant
const createParticipantQuery = async (participantData) => {
  const [id] = await db('participants').insert(participantData);
  return id; // retourne l'ID inséré
};

// Requête pour obtenir un participant par email
// const getParticipantByEmailQuery = async (email) => {
//   return db('participants').where({ email_part: email }).first();
// };

// Requête pour obtenir un participant par email
const getParticipantByEmailQuery = async (email) => {
  return db('participants')
    .select(
      'id_participant',
      'nom_part',
      'email_part',
      'mdp_part as mdp_participant', // Alias pour renommer mdp_part
      'genre_part',
      'telephone_part',
      'ville_part',
      'codepostal_part',
      'statut_part',
      'date_inscription',
      'id_organisateur'
    )
    .where({ email_part: email })
    .first();
};

// Requête pour obtenir un participant par ID
const getParticipantByIdQuery = async (id) => {
  return db('participants').where({ id_participant: id }).first();
};

// Requête pour mettre à jour un participant
const updateParticipantQuery = async (id, updatedData) => {
  return db('participants').where({ id_participant: id }).update(updatedData);
};

// Requête pour supprimer un participant
const deleteParticipantQuery = async (id) => {
  return db('participants').where({ id_participant: id }).del();
};

// Requête pour obtenir tous les participants
const getAllParticipantsQuery = async () => {
  return db('participants').select('*');
};

// Requête pour mettre à jour un participant via son email
const updateParticipantByEmailQuery = async (email, updatedData) => {
  return db('participants').where({ email_part: email }).update(updatedData);
};

//ajoutez une requête pour obtenir les détails d'un événement 
const getEventByIdQuery = async (id_evenement) => {
  return db('evenement').where({ id_evenement }).first();
};
//achat billets
// 🔹 Récupérer toutes les ventes de billets
const getTicketSales = async () => {
  return await db("achatbillets")
    .join("organisateur", "achatbillets.nom_organisateur", "=", "organisateur.nom_organisateur")
    .join("evenement", "achatbillets.nom_evenement", "=", "evenement.nom_event")
    .select(
      "achatbillets.id",
      "organisateur.nom_organisateur",
      "achatbillets.nom_evenement",
      "achatbillets.type_ticket",
      db.raw("SUM(achatbillets.total_billets_vendus) as total_billets_vendus"),
      "achatbillets.prix_unitaire",
      db.raw("SUM(achatbillets.montant_collecte) as montant_collecte"),
      db.raw("SUM(achatbillets.montant_a_transferer) as montant_a_transferer"),
      "achatbillets.acheteur",
      "achatbillets.status_paiement",
      "achatbillets.date_achat",
      "evenement.types_tickets"
    )
    .groupBy("achatbillets.nom_evenement", "achatbillets.type_ticket", "achatbillets.id");
};



// 🔹 Mettre à jour le statut de paiement
const updatePaymentStatus = async (id, status) => {
  return await db("achatbillets")
    .where({ id })
    .update({ status_paiement: status });
};

// 🔹 Supprimer une vente de billet
const deleteTicketSale = async (id) => {
  return await db("achatbillets")
    .where({ id })
    .del();
};

// nouveau teste
const getTicketSalesAll = async () => {
  return await db("achatbillets").select(
    "id",  // ✅ On inclut l'ID unique de chaque achat
    "nom_organisateur",
    "nom_evenement",
    "type_ticket",
    "quantite",
    "prix_unitaire",
    "total_billets_vendus",
    "montant_collecte",
    "montant_a_transferer",
    "acheteur",
    "status_paiement"
  );
};

// ============== CERTIFICAT =====================

// Vérifier si un participant existe
const getParticipantById = async (id) => {
  return db('participants')
    .where({ id_participant: id })
    .select('id_participant', 'nom_part') // ✅ Vérification que `nom` est bien récupéré
    .first();
};

// Ajouter un certificat
const addCertificate = async (certificateData) => {
  return db('certificat').insert(certificateData);
};


// Récupérer tous les certificats
const getAllCertificates = async () => {
  return db('certificat').select('*');
};

// Récupérer un certificat par participant
const getCertificateByParticipant = async (id) => {
  return db('certificat').where({ id_participant: id }).first();
};

const getAllParticipantsforCertificat = async () => {
  return db('participants')
    .join('organisateur', 'participants.id_organisateur', '=', 'organisateur.id_organisateur')
    .join('evenement', 'organisateur.id_organisateur', '=', 'evenement.id_organisateur') // Jointure avec les événements
    .select(
      'participants.id_participant',
      'participants.nom_part',
      'participants.email_part',
      'participants.telephone_part',
      'evenement.nom_event',// Récupération du nom de l'événement
      'evenement.id_evenement', // ✅ Ajout de id_evenement
    );
};

// Récupérer les certificats d'un participant
// const getCertificatesByParticipant = async (participantId) => {
//   return db("certificat")
//     .join("evenement", "certificat.id_evenement", "=", "evenement.id_evenement")
//     .where("certificat.id_participant", participantId)
//     .select(
//       "certificat.id_certificat",
//       "evenement.nom_event",
//       'evenement.id_evenement', // ✅ Ajout de id_evenement
//       "certificat.date_distribution",
//       "certificat.url_certificat"
//     );
// };
const getCertificatesByParticipant = async (participantId) => {
  return db("certificat")
    .join("evenement", "certificat.id_evenement", "=", "evenement.id_evenement")
    .join("organisateur", "evenement.id_organisateur", "=", "organisateur.id_organisateur") // Jointure avec l'organisateur
    .where("certificat.id_participant", participantId)
    .select(
      "certificat.id_certificat",
      "certificat.nom_titulaire",
      'evenement.id_evenement',
      "evenement.nom_event",
      "evenement.date_debut",
      "evenement.date_fin",
      "evenement.lieu_event",
      "organisateur.nom_organisateur", // Récupération du nom de l'organisateur
      "certificat.date_distribution",
      "certificat.url_certificat"
    );
};

// Supprimer un certificat par ID
const deleteCertificate = async (id) => {
  return db("certificat").where("id_certificat", id).del();
};

//contact partie page d'accueil
// Enregistrer un message de contact
const saveContactMessage = async ({ name, email, subject, message }) => {
  return await db('contact_messages').insert({
    name,
    email,
    subject,
    message,
    created_at: db.fn.now()
  });
};

module.exports = {

  insertTokenQuery,
  getTokenQuery,
  deleteTokenQuery,
  createAdminQuery,
  getAdminByEmailQuery,
  getAllAdminsQuery,
  getAdminByIdQuery,
  updateAdminQuery,
  deleteAdminQuery,
  createFaqQuery,
  getAllFaqsQuery,
  getFaqByIdQuery,
  updateFaqQuery,
  deleteFaqQuery,
  createOrganizerQuery,
  getOrganizerByEmailQuery,
  getAllOrganizersQuery,
  getOrganizerByIdQuery,
  updateOrganizerQuery,
  deleteOrganizerQuery,
  completeOrganizerQuery,
  createParticipantQuery,
  getParticipantByEmailQuery,
  getParticipantByIdQuery,
  updateParticipantQuery,
  deleteParticipantQuery,
  getAllParticipantsQuery,
  updateParticipantByEmailQuery,
  getEventByIdQuery,
  getEventWithOrganizerQuery,
  getTicketSales,
  updatePaymentStatus,
  deleteTicketSale,
  getTicketSalesAll,
  addCertificate,
  getParticipantById,
  getAllCertificates,
  getCertificateByParticipant,
  getAllParticipantsforCertificat,
  getCertificatesByParticipant,
  deleteCertificate,
  saveContactMessage,

};
