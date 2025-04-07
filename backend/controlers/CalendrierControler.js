const db = require('../db');  // Connexion MySQL avec Knex

exports.getEventMatches = async (req, res) => {
  const { eventId } = req.params;
  try {
    const matches = await db('rencontre')
      .where('id_evenement', eventId)
      .select('*');  // Sélectionne toutes les colonnes

    console.log("Matches trouvés :", matches); // ✅ Vérifie si des données sont récupérées
    if (matches.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée pour cet événement." });
    }
    
    res.json(matches);
  } catch (error) {
    console.error("Erreur lors de la récupération des rencontres :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur pour récupérer tous les matchs
exports.getAllMatches = async (req, res) => {
  try {
    const events = await db('evenement').select('id_evenement', 'nom_event');  // Sélectionne tous les événements
    const allMatches = [];

    // Pour chaque événement, récupérer les matchs associés
    for (const event of events) {
      const matches = await db('rencontre')
        .where('id_evenement', event.id_evenement)
        .select('*');
      allMatches.push(...matches.map(match => ({
        ...match,
        eventName: event.nom_event,
        eventId: event.id_evenement
      })));
    }

    // Si des matchs sont trouvés, les renvoyer
    if (allMatches.length === 0) {
      return res.status(404).json({ message: "Aucune rencontre trouvée" });
    }

    res.json(allMatches);  // Renvoie tous les matchs
  } catch (error) {
    console.error("Erreur lors de la récupération des rencontres :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// contrôleur pour récupérer les poules
exports.getEventPools = async (req, res) => {
  const { eventId } = req.params;
  try {
    // Récupérer toutes les poules pour un événement spécifique
    const pools = await db('poules')
      .where('id_evenement', eventId)
      .select('id_poule', 'nom_poule');
    
    // Récupérer les participants associés à chaque poule avec les équipes
    for (let pool of pools) {
      const participants = await db('poule_participants')
        .where('id_poule', pool.id_poule)
        .join('equipes', 'poule_participants.id_participant', '=', 'equipes.id_participant')
        .select('equipes.nom_equipe');
      pool.participants = participants;
    }

    if (pools.length === 0) {
      return res.status(404).json({ message: "Aucune poule trouvée pour cet événement." });
    }

    res.json(pools);
  } catch (error) {
    console.error("Erreur lors de la récupération des poules :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

