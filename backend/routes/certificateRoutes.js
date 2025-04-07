const express = require("express");
const router = express.Router();
const certificateControler = require("../controlers/certificateControler");


// Route pour distribuer un certificat à un participant
router.post("/distribute/:id", (req, res, next) => {
    console.log("✅ Requête reçue sur /distribute/:id");
    next();
}, certificateControler.distributeCertificate);

// Route pour récupérer tous les certificats
router.get("/all", certificateControler.getAllCertificates);


// Route pour récupérer les certificats d'un participant
router.get("/participant/:id", certificateControler.getCertificatesByParticipant);

// Route pour supprimer un certificat
router.delete("/:id", certificateControler.deleteCertificate);



module.exports = router;
