const express = require("express");
const router = express.Router();
const ticketSalesControler = require("./../controlers/TicketSalesControler"); // ✅ Assure-toi que ce chemin est correct

// Endpoint pour acheter un billet
router.post("/acheter", ticketSalesControler.acheterTicket);
// 📌 Vérifier si les fonctions existent
if (!ticketSalesControler.getAllTicketSales) {
    console.error("❌ ERREUR: getAllTicketSales n'est pas défini dans ticketSalesController !");
}

if (!ticketSalesControler.updateSaleStatus) {
    console.error("❌ ERREUR: updateSaleStatus n'est pas défini dans ticketSalesController !");
}

if (!ticketSalesControler.deleteSale) {
    console.error("❌ ERREUR: deleteSale n'est pas défini dans ticketSalesController !");
}

// 👇 Route à ajouter si elle n'est pas encore là
router.post('/acheter', ticketSalesControler.acheterTicket);
router.get("/ventes-billets", ticketSalesControler.getAllTicketSales);
router.put("/update-paiement/:id", ticketSalesControler.updateSaleStatus);
router.delete("/supprimer-vente/:id", ticketSalesControler.deleteSale);
router.put("/transfert-paiement/:id", ticketSalesControler.updateTransferStatus);
router.put("/annuler-paiement/:id", ticketSalesControler.cancelPayment);


module.exports = router;
