const db = require('../db');  // Connexion à MySQL avec Knex


exports.getEventResults = async (req, res) => {
  const { eventId } = req.params;

  try {
    const results = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .where('rencontre.id_evenement', eventId)
      .select(
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.date_rencontre',
        'rencontre.heure_rencontre',
        'rencontre.participant_a',
        'rencontre.participant_b',
        'rencontre.lieu_rencontre',
        'resultat.score_A',
        'resultat.score_B'
      )
      .orderBy(['rencontre.phase', 'rencontre.journee', 'rencontre.date_rencontre']);

    res.json(results);
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// ✅ Récupérer tous les résultats pour tous les événements
exports.getAllResults = async (req, res) => {
  try {
    const results = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .join('evenement', 'rencontre.id_evenement', '=', 'evenement.id_evenement')
      .select(
        'evenement.nom_event as eventName',
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.date_rencontre',
        'rencontre.heure_rencontre',
        'rencontre.participant_a',
        'rencontre.participant_b',
        'rencontre.lieu_rencontre',
        'resultat.score_A',
        'resultat.score_B'
      )
      .orderBy(['evenement.nom_event', 'rencontre.phase', 'rencontre.journee', 'rencontre.date_rencontre']);

    if (results.length === 0) {
      return res.status(404).json({ message: "Aucun résultat disponible." });
    }

    res.json(results);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des résultats :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getClassementByEventPhaseJournee = async (req, res) => {
  const { eventId, phase, journee } = req.params;

  try {
    const classement = await db('resultat')
      .join('rencontre', 'resultat.id_rencontre', '=', 'rencontre.id_rencontre')
      .join('evenement', 'rencontre.id_evenement', '=', 'evenement.id_evenement')
      .where('rencontre.id_evenement', eventId)
      .where('rencontre.phase', phase)
      .where('rencontre.journee', journee)
      .select(
        'evenement.nom_sport', // ✅ Ajout du type de sport
        'rencontre.phase',
        'rencontre.journee',
        'rencontre.participant_a as equipe',
        db.raw('SUM(resultat.score_A) as points'),
        db.raw('SUM(resultat.score_A - resultat.score_B) as difference'),
        db.raw('COUNT(resultat.id_rencontre) as matchs_joues')
      )
      .groupBy('rencontre.participant_a')
      .orderBy('points', 'desc')
      .orderBy('difference', 'desc');

      res.json({ classement, sport: classement[0]?.nom_sport });
    } catch (error) {
    console.error("❌ Erreur lors de la récupération du classement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Récupérer le classement par événement

// exports.getClassementByEvent = async (req, res) => {
//   const { eventId } = req.params;

//   try {
//     const results = await db("resultat")
//       .join("rencontre", "resultat.id_rencontre", "=", "rencontre.id_rencontre")
//       .join("evenement", "rencontre.id_evenement", "=", "evenement.id_evenement")
//       .join("poules", "rencontre.id_poule", "=", "poules.id_poule")
//       .where("rencontre.id_evenement", eventId)
//       .select(
//         "evenement.nom_event",
//         "evenement.nom_sport", // doit être bien renseigné dans ta DB
//         "rencontre.phase",
//         "rencontre.journee",
//         "poules.nom_poule",
//         "rencontre.participant_a",
//         "rencontre.participant_b",
//         "resultat.score_A",
//         "resultat.score_B",
//         "resultat.point_victoire",
//         "resultat.point_matchnul",
//         "resultat.point_defaite"
//       );

//     if (!results.length) {
//       return res.status(404).json({ message: "Aucun classement disponible." });
//     }

//     const nom_sport = (results[0].nom_sport ?? "inconnu").toLowerCase();

//     let classementParPhase = {};
//     let classementGeneral = {};

//     results.forEach((match) => {
//       const { phase, journee, nom_poule } = match;
//       const phaseKey = `Phase: ${phase}`;
//       const journeeKey = `Journée ${journee}`;
//       const pouleKey = `Poule ${nom_poule}`;

//       if (!classementParPhase[phaseKey]) classementParPhase[phaseKey] = {};
//       if (!classementParPhase[phaseKey][journeeKey]) classementParPhase[phaseKey][journeeKey] = {};
//       if (!classementParPhase[phaseKey][journeeKey][pouleKey]) classementParPhase[phaseKey][journeeKey][pouleKey] = [];

//       [match.participant_a, match.participant_b].forEach((equipe, i) => {
//         const score = i === 0 ? match.score_A : match.score_B;
//         const adversaireScore = i === 0 ? match.score_B : match.score_A;
//         const victoire = score > adversaireScore ? 1 : 0;
//         const defaite = score < adversaireScore ? 1 : 0;
//         const matchJoue = 1;

//         let points = 0;
//         if (score > adversaireScore) points = match.point_victoire;
//         else if (score === adversaireScore) points = match.point_matchnul;
//         else points = match.point_defaite;

//         const team = classementParPhase[phaseKey][journeeKey][pouleKey].find((e) => e.nom_equipe === equipe);

//         if (team) {
//           if (nom_sport === "basketball") {
//             team.mj += matchJoue;
//             team.v += victoire;
//             team.d += defaite;
//             team.points_marques += score;
//             team.points_concedes += adversaireScore;
//             team.difference_points += score - adversaireScore;
//           } else {
//             team.points += points;
//             team.buts_marques += score;
//             team.buts_encaisses += adversaireScore;
//             team.difference_buts += score - adversaireScore;
//           }
//         } else {
//           classementParPhase[phaseKey][journeeKey][pouleKey].push({
//             nom_equipe: equipe,
//             points,
//             mj: nom_sport === "basketball" ? matchJoue : undefined,
//             v: nom_sport === "basketball" ? victoire : undefined,
//             d: nom_sport === "basketball" ? defaite : undefined,
//             buts_marques: nom_sport !== "basketball" ? score : undefined,
//             buts_encaisses: nom_sport !== "basketball" ? adversaireScore : undefined,
//             difference_buts: nom_sport !== "basketball" ? score - adversaireScore : undefined,
//             points_marques: nom_sport === "basketball" ? score : undefined,
//             points_concedes: nom_sport === "basketball" ? adversaireScore : undefined,
//             difference_points: nom_sport === "basketball" ? score - adversaireScore : undefined,
//           });
//         }
//       });
//     });

//     // Classement général (fusion de toutes les phases)
//     Object.keys(classementParPhase).forEach((phaseKey) => {
//       Object.keys(classementParPhase[phaseKey]).forEach((journeeKey) => {
//         Object.keys(classementParPhase[phaseKey][journeeKey]).forEach((pouleKey) => {
//           classementParPhase[phaseKey][journeeKey][pouleKey].forEach((team) => {
//             const equipeKey = team.nom_equipe;
//             if (!classementGeneral[equipeKey]) {
//               classementGeneral[equipeKey] = { ...team };
//             } else {
//               Object.keys(team).forEach((stat) => {
//                 if (typeof team[stat] === "number") {
//                   classementGeneral[equipeKey][stat] += team[stat];
//                 }
//               });
//             }
//           });
//         });
//       });
//     });

//     // 🔁 Normalisation des noms de champs selon le sport
//     function normaliserClassement(classement, sport) {
//       const nouveauClassement = {};

//       Object.keys(classement).forEach(phase => {
//         nouveauClassement[phase] = {};
//         Object.keys(classement[phase]).forEach(journee => {
//           nouveauClassement[phase][journee] = {};
//           Object.keys(classement[phase][journee]).forEach(poule => {
//             nouveauClassement[phase][journee][poule] = classement[phase][journee][poule].map(team => {
//               const base = {
//                 nom_equipe: team.nom_equipe,
//                 points: team.points ?? 0,
//               };

//               if (sport.toLowerCase() === "pétanque") {
//                 return {
//                   ...base,
//                   points_marques: team.buts_marques ?? 0,
//                   points_concedes: team.buts_encaisses ?? 0,
//                   difference_points: team.difference_buts ?? 0
//                 };
//               } else if (sport.toLowerCase() === "basketball") {
//                 return {
//                   ...base,
//                   mj: team.mj ?? 0,
//                   v: team.v ?? 0,
//                   d: team.d ?? 0,
//                   points_marques: team.points_marques ?? 0,
//                   points_concedes: team.points_concedes ?? 0,
//                   difference_points: team.difference_points ?? 0
//                 };
//               } else {
//                 return {
//                   ...base,
//                   buts_marques: team.buts_marques ?? 0,
//                   buts_encaisses: team.buts_encaisses ?? 0,
//                   difference_buts: team.difference_buts ?? 0
//                 };
//               }
//             });
//           });
//         });
//       });

//       return nouveauClassement;
//     }

//     // ✅ Envoi final
//     res.json({
//       nom_event: results[0].nom_event,
//       classement: normaliserClassement(classementParPhase, nom_sport),
//       classement_general: Object.values(classementGeneral).sort((a, b) => b.points - a.points),
//       sport: nom_sport
//     });
//   } catch (error) {
//     console.error("Erreur lors de la récupération du classement :", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };
// exports.getClassementByEvent = async (req, res) => {
//   const { eventId } = req.params;

//   try {
//     const results = await db("resultat")
//       .join("rencontre", "resultat.id_rencontre", "=", "rencontre.id_rencontre")
//       .join("evenement", "rencontre.id_evenement", "=", "evenement.id_evenement")
//       .join("poules", "rencontre.id_poule", "=", "poules.id_poule")
//       .where("rencontre.id_evenement", eventId)
//       .select(
//         "evenement.nom_event",
//         "evenement.nom_sport",
//         "rencontre.phase",
//         "rencontre.journee",
//         "poules.nom_poule",
//         "rencontre.participant_a",
//         "rencontre.participant_b",
//         "resultat.score_A",
//         "resultat.score_B",
//         "resultat.point_victoire",
//         "resultat.point_matchnul",
//         "resultat.point_defaite"
//       );

//     if (!results.length) {
//       return res.status(404).json({ message: "Aucun classement disponible." });
//     }

//     const nom_sport = (results[0].nom_sport ?? "inconnu").toLowerCase();

//     let classementParPhase = {};
//     let classementGeneral = {};

//     results.forEach((match) => {
//       const { phase, journee, nom_poule } = match;
//       const phaseKey = `Phase: ${phase}`;
//       const journeeKey = `Journée ${journee}`;
//       const pouleKey = `Poule ${nom_poule}`;

//       if (!classementParPhase[phaseKey]) classementParPhase[phaseKey] = {};
//       if (!classementParPhase[phaseKey][journeeKey]) classementParPhase[phaseKey][journeeKey] = {};
//       if (!classementParPhase[phaseKey][journeeKey][pouleKey]) classementParPhase[phaseKey][journeeKey][pouleKey] = [];

//       [match.participant_a, match.participant_b].forEach((equipe, i) => {
//         const score = i === 0 ? match.score_A : match.score_B;
//         const adversaireScore = i === 0 ? match.score_B : match.score_A;
//         const victoire = score > adversaireScore ? 1 : 0;
//         const defaite = score < adversaireScore ? 1 : 0;
//         const matchJoue = 1;

//         let points = 0;
//         if (score > adversaireScore) points = match.point_victoire;
//         else if (score === adversaireScore) points = match.point_matchnul;
//         else points = match.point_defaite;

//         const team = classementParPhase[phaseKey][journeeKey][pouleKey].find((e) => e.nom_equipe === equipe);

//         if (team) {
//           if (nom_sport === "basketball") {
//             team.mj += matchJoue;
//             team.v += victoire;
//             team.d += defaite;
//             team.points_marques += score;
//             team.points_concedes += adversaireScore;
//             team.difference_points += score - adversaireScore;
//           } else {
//             team.points += points;
//             team.buts_marques += score;
//             team.buts_encaisses += adversaireScore;
//             team.difference_buts += score - adversaireScore;
//           }
//         } else {
//           classementParPhase[phaseKey][journeeKey][pouleKey].push({
//             nom_equipe: equipe,
//             points,
//             mj: nom_sport === "basketball" ? matchJoue : undefined,
//             v: nom_sport === "basketball" ? victoire : undefined,
//             d: nom_sport === "basketball" ? defaite : undefined,
//             buts_marques: nom_sport !== "basketball" ? score : undefined,
//             buts_encaisses: nom_sport !== "basketball" ? adversaireScore : undefined,
//             difference_buts: nom_sport !== "basketball" ? score - adversaireScore : undefined,
//             points_marques: nom_sport === "basketball" ? score : undefined,
//             points_concedes: nom_sport === "basketball" ? adversaireScore : undefined,
//             difference_points: nom_sport === "basketball" ? score - adversaireScore : undefined,
//           });
//         }
//       });
//     });

//     // 🔁 Calcul du classement général (fusion de tous les matchs)
//     Object.keys(classementParPhase).forEach((phaseKey) => {
//       Object.keys(classementParPhase[phaseKey]).forEach((journeeKey) => {
//         Object.keys(classementParPhase[phaseKey][journeeKey]).forEach((pouleKey) => {
//           classementParPhase[phaseKey][journeeKey][pouleKey].forEach((team) => {
//             const equipeKey = team.nom_equipe;
//             if (!classementGeneral[equipeKey]) {
//               classementGeneral[equipeKey] = { ...team };
//             } else {
//               Object.keys(team).forEach((stat) => {
//                 if (typeof team[stat] === "number") {
//                   classementGeneral[equipeKey][stat] += team[stat];
//                 }
//               });
//             }
//           });
//         });
//       });
//     });

//     // 🔁 Normalisation du classement général selon le sport
//     const classementGeneralNormalise = Object.values(classementGeneral).map((team) => {
//       const base = {
//         nom_equipe: team.nom_equipe,
//         points: team.points ?? 0,
//       };

//       if (nom_sport === "pétanque") {
//         return {
//           ...base,
//           points_marques: team.buts_marques ?? 0,
//           points_concedes: team.buts_encaisses ?? 0,
//           difference_points: team.difference_buts ?? 0,
//         };
//       } else if (nom_sport === "basketball") {
//         return {
//           ...base,
//           mj: team.mj ?? 0,
//           v: team.v ?? 0,
//           d: team.d ?? 0,
//           points_marques: team.points_marques ?? 0,
//           points_concedes: team.points_concedes ?? 0,
//           difference_points: team.difference_points ?? 0,
//         };
//       } else {
//         return {
//           ...base,
//           buts_marques: team.buts_marques ?? 0,
//           buts_encaisses: team.buts_encaisses ?? 0,
//           difference_buts: team.difference_buts ?? 0,
//         };
//       }
//     });

//     // 🔁 Normalisation du classement journalier (par phase)
//     function normaliserClassement(classement, sport) {
//       const nouveauClassement = {};

//       Object.keys(classement).forEach(phase => {
//         nouveauClassement[phase] = {};
//         Object.keys(classement[phase]).forEach(journee => {
//           nouveauClassement[phase][journee] = {};
//           Object.keys(classement[phase][journee]).forEach(poule => {
//             nouveauClassement[phase][journee][poule] = classement[phase][journee][poule].map(team => {
//               const base = {
//                 nom_equipe: team.nom_equipe,
//                 points: team.points ?? 0,
//               };

//               if (sport === "pétanque") {
//                 return {
//                   ...base,
//                   points_marques: team.buts_marques ?? 0,
//                   points_concedes: team.buts_encaisses ?? 0,
//                   difference_points: team.difference_buts ?? 0,
//                 };
//               } else if (sport === "basketball") {
//                 return {
//                   ...base,
//                   mj: team.mj ?? 0,
//                   v: team.v ?? 0,
//                   d: team.d ?? 0,
//                   points_marques: team.points_marques ?? 0,
//                   points_concedes: team.points_concedes ?? 0,
//                   difference_points: team.difference_points ?? 0,
//                 };
//               } else {
//                 return {
//                   ...base,
//                   buts_marques: team.buts_marques ?? 0,
//                   buts_encaisses: team.buts_encaisses ?? 0,
//                   difference_buts: team.difference_buts ?? 0,
//                 };
//               }
//             });
//           });
//         });
//       });

//       return nouveauClassement;
//     }

//     // ✅ Envoi final
//     res.json({
//       nom_event: results[0].nom_event,
//       classement: normaliserClassement(classementParPhase, nom_sport),
//       classement_general: classementGeneralNormalise.sort((a, b) => b.points - a.points),
//       sport: nom_sport
//     });

//   } catch (error) {
//     console.error("Erreur lors de la récupération du classement :", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };
exports.getClassementByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const results = await db("resultat")
      .join("rencontre", "resultat.id_rencontre", "=", "rencontre.id_rencontre")
      .join("evenement", "rencontre.id_evenement", "=", "evenement.id_evenement")
      .join("poules", "rencontre.id_poule", "=", "poules.id_poule")
      .where("rencontre.id_evenement", eventId)
      .select(
        "evenement.nom_event",
        "evenement.nom_sport",
        "rencontre.phase",
        "rencontre.journee",
        "rencontre.tour_final",  // Ajout du champ 'tour_final'
        "poules.nom_poule",
        "rencontre.participant_a",
        "rencontre.participant_b",
        "resultat.score_A",
        "resultat.score_B",
        "resultat.point_victoire",
        "resultat.point_matchnul",
        "resultat.point_defaite"
      );

    if (!results.length) {
      return res.status(404).json({ message: "Aucun classement disponible." });
    }

    const nom_sport = (results[0].nom_sport ?? "inconnu").toLowerCase();

    let classementParPhase = {};
    let classementGeneral = {};

    results.forEach((match) => {
      const { phase, journee, tour_final, nom_poule } = match; // Récupérer tour_final ici
      const phaseKey = `Phase: ${phase}`;
      const journeeKey = `Journée ${journee}`;
      const pouleKey = `Poule ${nom_poule}`;

      if (!classementParPhase[phaseKey]) classementParPhase[phaseKey] = {};
      if (!classementParPhase[phaseKey][journeeKey]) classementParPhase[phaseKey][journeeKey] = {};
      if (!classementParPhase[phaseKey][journeeKey][pouleKey]) classementParPhase[phaseKey][journeeKey][pouleKey] = [];

      [match.participant_a, match.participant_b].forEach((equipe, i) => {
        const score = i === 0 ? match.score_A : match.score_B;
        const adversaireScore = i === 0 ? match.score_B : match.score_A;
        const victoire = score > adversaireScore ? 1 : 0;
        const defaite = score < adversaireScore ? 1 : 0;
        const matchJoue = 1;

        let points = 0;
        if (score > adversaireScore) points = match.point_victoire;
        else if (score === adversaireScore) points = match.point_matchnul;
        else points = match.point_defaite;

        const team = classementParPhase[phaseKey][journeeKey][pouleKey].find((e) => e.nom_equipe === equipe);

        if (team) {
          if (nom_sport === "basketball") {
            team.mj += matchJoue;
            team.v += victoire;
            team.d += defaite;
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
          classementParPhase[phaseKey][journeeKey][pouleKey].push({
            nom_equipe: equipe,
            points,
            mj: nom_sport === "basketball" ? matchJoue : undefined,
            v: nom_sport === "basketball" ? victoire : undefined,
            d: nom_sport === "basketball" ? defaite : undefined,
            buts_marques: nom_sport !== "basketball" ? score : undefined,
            buts_encaisses: nom_sport !== "basketball" ? adversaireScore : undefined,
            difference_buts: nom_sport !== "basketball" ? score - adversaireScore : undefined,
            points_marques: nom_sport === "basketball" ? score : undefined,
            points_concedes: nom_sport === "basketball" ? adversaireScore : undefined,
            difference_points: nom_sport === "basketball" ? score - adversaireScore : undefined,
          });
        }
      });
    });

    // 🔁 Calcul du classement général (fusion de tous les matchs)
    Object.keys(classementParPhase).forEach((phaseKey) => {
      Object.keys(classementParPhase[phaseKey]).forEach((journeeKey) => {
        Object.keys(classementParPhase[phaseKey][journeeKey]).forEach((pouleKey) => {
          classementParPhase[phaseKey][journeeKey][pouleKey].forEach((team) => {
            const equipeKey = team.nom_equipe;
            if (!classementGeneral[equipeKey]) {
              classementGeneral[equipeKey] = { ...team };
            } else {
              Object.keys(team).forEach((stat) => {
                if (typeof team[stat] === "number") {
                  classementGeneral[equipeKey][stat] += team[stat];
                }
              });
            }
          });
        });
      });
    });

    // 🔁 Normalisation du classement général selon le sport
    const classementGeneralNormalise = Object.values(classementGeneral).map((team) => {
      const base = {
        nom_equipe: team.nom_equipe,
        points: team.points ?? 0,
      };

      if (nom_sport === "pétanque") {
        return {
          ...base,
          points_marques: team.buts_marques ?? 0,
          points_concedes: team.buts_encaisses ?? 0,
          difference_points: team.difference_buts ?? 0,
        };
      } else if (nom_sport === "basketball") {
        return {
          ...base,
          mj: team.mj ?? 0,
          v: team.v ?? 0,
          d: team.d ?? 0,
          points_marques: team.points_marques ?? 0,
          points_concedes: team.points_concedes ?? 0,
          difference_points: team.difference_points ?? 0,
        };
      } else {
        return {
          ...base,
          buts_marques: team.buts_marques ?? 0,
          buts_encaisses: team.buts_encaisses ?? 0,
          difference_buts: team.difference_buts ?? 0,
        };
      }
    });

    // 🔁 Normalisation du classement journalier (par phase)
    function normaliserClassement(classement, sport) {
      const nouveauClassement = {};

      Object.keys(classement).forEach(phase => {
        nouveauClassement[phase] = {};
        Object.keys(classement[phase]).forEach(journee => {
          nouveauClassement[phase][journee] = {};
          Object.keys(classement[phase][journee]).forEach(poule => {
            nouveauClassement[phase][journee][poule] = classement[phase][journee][poule].map(team => {
              const base = {
                nom_equipe: team.nom_equipe,
                points: team.points ?? 0,
              };

              if (sport === "pétanque") {
                return {
                  ...base,
                  points_marques: team.buts_marques ?? 0,
                  points_concedes: team.buts_encaisses ?? 0,
                  difference_points: team.difference_buts ?? 0,
                };
              } else if (sport === "basketball") {
                return {
                  ...base,
                  mj: team.mj ?? 0,
                  v: team.v ?? 0,
                  d: team.d ?? 0,
                  points_marques: team.points_marques ?? 0,
                  points_concedes: team.points_concedes ?? 0,
                  difference_points: team.difference_points ?? 0,
                };
              } else {
                return {
                  ...base,
                  buts_marques: team.buts_marques ?? 0,
                  buts_encaisses: team.buts_encaisses ?? 0,
                  difference_buts: team.difference_buts ?? 0,
                };
              }
            });
          });
        });
      });

      return nouveauClassement;
    }

    // ✅ Envoi final
    res.json({
      nom_event: results[0].nom_event,
      classement: normaliserClassement(classementParPhase, nom_sport),
      classement_general: classementGeneralNormalise.sort((a, b) => b.points - a.points),
      sport: nom_sport,
      tour_final: results[0].tour_final // Ajouter tour_final à la réponse
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du classement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
