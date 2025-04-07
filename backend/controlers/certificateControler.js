const {
    addCertificate,
    getParticipantById,
    getAllCertificates,
    getCertificatesByParticipant,
} = require('../queries'); // Vérifie que le chemin est correct
const db = require('./../db');


exports.distributeCertificate = async (req, res) => {
    const { id } = req.params; // ID du participant
    let { id_evenement, adminId } = req.body; // ID de l'événement et de l'admin

    console.log("📩 Données reçues :", req.body); // ✅ Vérifier si adminId est bien présent

    // Vérifier si adminId est défini, sinon attribuer une valeur par défaut
    if (!adminId) {
        console.warn("⚠️ Aucun adminId reçu, attribution d'une valeur par défaut.");
        adminId = 1; // 🛠 Remplacez 1 par un ID valide si nécessaire
    }

    try {
        if (!id_evenement) {
            return res.status(400).json({ message: "L'ID de l'événement est requis pour distribuer un certificat." });
        }

        const evenement = await db("evenement").where("id_evenement", id_evenement).first();
        if (!evenement) {
            return res.status(404).json({ message: "Événement non trouvé" });
        }

        const participant = await getParticipantById(id);
        if (!participant || !participant.nom_part) {
            return res.status(404).json({ message: "Participant non trouvé ou nom invalide" });
        }

        console.log("🔍 Participant trouvé :", participant);
        console.log("📆 Événement trouvé :", evenement);

        const certificateData = {
            type_certificat: "Certificat de participation",
            nom_titulaire: participant.nom_part,
            date_certificat: new Date(),
            url_certificat: `https://mon-site.com/certificats/${id}.pdf`,
            id_admin: adminId, // ✅ Vérification et correction ici
            id_participant: id,
            id_evenement: id_evenement,
            date_distribution: new Date()
        };

        console.log("📩 Données du certificat à insérer :", certificateData);

        await addCertificate(certificateData);

        res.status(200).json({ message: `Certificat distribué avec succès à ${participant.nom_part} pour l'événement ${evenement.nom_event} !` });
    } catch (error) {
        console.error("❌ Erreur distribution certificat :", error);
        res.status(500).json({ message: "Erreur lors de la distribution du certificat", error });
    }
};


// Récupérer tous les certificats
exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await getAllCertificates();
        res.status(200).json(certificates);
    } catch (error) {
        console.error("❌ Erreur récupération certificats :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des certificats", error });
    }
};

// Récupérer un certificat par participant
exports.getCertificatesByParticipant = async (req, res) => {
    const { id } = req.params;

    try {
        const certificates = await getCertificatesByParticipant(id); // Correction ici
        if (!certificates || certificates.length === 0) {
            return res.status(404).json({ message: "Aucun certificat trouvé pour ce participant" });
        }
        res.status(200).json(certificates);
    } catch (error) {
        console.error("❌ Erreur récupération certificat :", error);
        res.status(500).json({ message: "Erreur lors de la récupération du certificat", error });
    }
};

// Supprimer un certificat par ID
exports.deleteCertificate = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le certificat existe
        const certificat = await db("certificat").where("id_certificat", id).first();
        if (!certificat) {
            return res.status(404).json({ message: "Certificat non trouvé" });
        }

        // Supprimer le certificat
        await db("certificat").where("id_certificat", id).del();

        res.status(200).json({ message: "Certificat supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du certificat :", error);
        res.status(500).json({ message: "Erreur lors de la suppression du certificat", error });
    }
};
