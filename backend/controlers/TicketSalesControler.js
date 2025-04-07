const db = require('./../db');
const {
    getTicketSales,
    updatePaymentStatus,
    deleteTicketSale
} = require("../queries");  // Vérifie bien le chemin
const axios = require('axios'); 

const acheterTicket = async (req, res) => {
    const { id_evenement, type_ticket, quantity, acheteur } = req.body;
    console.log("🛒 Données reçues pour l'achat :", req.body);

    try {
        // Vérifier si l'événement existe
        const event = await db("evenement")
            .join("organisateur", "evenement.id_organisateur", "=", "organisateur.id_organisateur")
            .where("evenement.id_evenement", id_evenement)
            .select("evenement.*", "organisateur.nom_organisateur")
            .first();

        if (!event) {
            return res.status(404).json({ message: "Événement introuvable" });
        }

        let tickets = JSON.parse(event.types_tickets);
        let ticketUpdated = false;
        let prixUnitaire = 0;

        tickets = tickets.map(ticket => {
            if ((ticket.type_ticket || ticket.type) === type_ticket) {
                // 📌 **Correction : Initialiser `nbr_ticket_disponible` à `quantite` si null**
                if (ticket.nbr_ticket_disponible === null || ticket.nbr_ticket_disponible === undefined) {
                    ticket.nbr_ticket_disponible = ticket.quantite;
                }

                // 📌 **Vérification du stock disponible**
                if (ticket.nbr_ticket_disponible < quantity) {
                    return res.status(400).json({ message: "Stock insuffisant" });
                }

                // Mise à jour du prix et du stock après achat
                prixUnitaire = parseInt(ticket.prix_ticket || ticket.prix, 10);
                ticket.nbr_ticket_disponible -= quantity;
                ticketUpdated = true;
            }
            return ticket;
        });

        if (!ticketUpdated) {
            return res.status(400).json({ message: "Type de billet non trouvé ou stock insuffisant" });
        }

        // 📌 **Mettre à jour la base de données avec les nouvelles valeurs**
        await db("evenement")
            .where({ id_evenement })
            .update({ types_tickets: JSON.stringify(tickets) });

        // Vérifier si l'organisateur est bien défini
        if (!event.nom_organisateur) {
            return res.status(500).json({ message: "Erreur : Nom de l'organisateur introuvable pour cet événement." });
        }

        // 📌 **Calcul des montants**
        const montantTotal = prixUnitaire * quantity;
        const montantATransferer = montantTotal * 0.95; // Retrait de 5% pour la plateforme

        // 📌 **Enregistrer l'achat dans la table `achatbillets`**
        const [idAchat] = await db("achatbillets").insert({
            nom_organisateur: event.nom_organisateur,
            nom_evenement: event.nom_event,
            type_ticket,
            quantite: quantity,
            prix_unitaire: prixUnitaire,
            total_billets_vendus: quantity,
            montant_collecte: montantTotal,
            montant_a_transferer: montantATransferer,
            acheteur: acheteur,
            status_paiement: "en_attente",
            date_achat: db.fn.now(),
        });

        return res.json({
            message: "Achat réussi",
            id_achat: idAchat,
            tickets,
        });

    } catch (error) {
        console.error("❌ Erreur lors de l'achat :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


const getAllTicketSales = async (req, res) => {
    try {
        const ventes = await db("achatbillets")
            .join("organisateur", "achatbillets.nom_organisateur", "=", "organisateur.nom_organisateur")
            .join("evenement", "achatbillets.nom_evenement", "=", "evenement.nom_event")
            .select(
                "achatbillets.id", // ✅ Correction ici
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
            .groupBy("achatbillets.nom_evenement", "achatbillets.type_ticket", "achatbillets.id"); // ✅ Correction ici aussi

        console.log("✅ Données des ventes envoyées :", ventes);


        // 🔹 Extraction de la quantité totale de billets et calcul de la quantité restante
        const ventesAvecQuantite = ventes.map((vente) => {
            const typesTickets = JSON.parse(vente.types_tickets || "[]");
            const billetAssocie = typesTickets.find((ticket) => ticket.type === vente.type_ticket);
            console.log("✅ Données des ventes envoyées :", ventes);

            return {
                ...vente,
                quantite: billetAssocie ? billetAssocie.quantite : 0, // 🔹 Quantité initiale
                quantite_restante: billetAssocie
                    ? billetAssocie.quantite - vente.total_billets_vendus
                    : 0, // 🔹 Calculer les billets restants
            };
        });

        res.json(ventesAvecQuantite);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des ventes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// **************fonctionnel io revy ambony io *******************


const updateTransferStatus = async (req, res) => {
    const { id } = req.params;

    try {
        // Mettre à jour le statut de transfert à "payé"
        await db("achatbillets")
            .where({ id })
            .update({ status_paiement: "payé" });

        res.json({ message: "Paiement transféré à l'organisateur avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors du transfert du paiement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


const cancelPayment = async (req, res) => {
    const { id } = req.params;

    try {
        // Mettre à jour le statut de paiement à "annulé"
        await db("achatbillets")
            .where({ id })
            .update({ status_paiement: "annulé" });

        res.json({ message: "Paiement annulé avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors de l'annulation du paiement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};



const updateSaleStatus = async (req, res) => {
    const { id } = req.params;
    const { status_paiement } = req.body;

    try {
        await updatePaymentStatus(id, status_paiement);

        // 🔹 Récupérer la vente mise à jour
        const updatedSale = await db("achatbillets").where({ id }).first();

        res.json({
            message: "Statut mis à jour avec succès",
            status_paiement: updatedSale.status_paiement, // ✅ Retourne le nouveau statut
        });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du paiement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


const deleteSale = async (req, res) => {
    const { id } = req.params;

    try {
        // Supprimer l'enregistrement correspondant
        await db("achatbillets").where({ id }).del();

        res.json({ message: "Vente supprimée avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la vente :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


const transferPaymentToOrganizer = async (req, res) => {
    const { id } = req.params;

    try {
        // Récupérer les infos de la vente et de l'organisateur
        const sale = await db("achatbillets")
            .join("evenement", "achatbillets.nom_evenement", "=", "evenement.nom_event")
            .join("organisateur", "evenement.id_organisateur", "=", "organisateur.id_organisateur")
            .where("achatbillets.id", id)
            .select(
                "achatbillets.montant_a_transferer",
                "organisateur.tel_organisateur"
            )
            .first();

        if (!sale) {
            return res.status(404).json({ message: "Vente introuvable." });
        }

        const { montant_a_transferer, tel_organisateur } = sale;

        // Simulation d'un appel API vers MVola / Orange Money / Airtel Money
        const mobileMoneyResponse = await axios.post("https://api-mobilemoney.com/transfer", {
            phoneNumber: tel_organisateur,
            amount: montant_a_transferer,
            currency: "MGA",
            description: "Paiement de l'organisateur"
        });

        if (mobileMoneyResponse.data.status !== "success") {
            return res.status(500).json({ message: "Échec du transfert Mobile Money." });
        }

        // Mise à jour du statut de paiement dans la base de données
        await db("achatbillets")
            .where({ id })
            .update({ status_paiement: "payé" });

        res.json({ message: "Transfert réussi et paiement marqué comme payé." });
    } catch (error) {
        console.error("❌ Erreur lors du transfert de paiement :", error);
        res.status(500).json({ message: "Erreur lors du transfert du paiement." });
    }
};



// Vérification des exports
console.log("✅ ticketSalesController chargé avec succès !");

module.exports = {
    acheterTicket,
    getAllTicketSales,
    updateSaleStatus,
    deleteSale,
    updateTransferStatus,
    cancelPayment,
    transferPaymentToOrganizer,
};
