require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');  // Importer l'instance de Knex depuis db.js
const verifyToken = require('./middleware/jwtMiddleware');
const authRoutes = require('./routes/authRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const participantRoutes = require('./routes/participantRoutes');
const faqRoutes = require('./routes/faqRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const ticketSalesRoutes = require('./routes/ticketSalesRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const calendrierRoutes = require('./routes/calendrierRoutes');
const resultatsRoutes = require('./routes/resultatsRoutes');  
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const port = process.env.PORT || 3001;


app.use((req, res, next) => {
    console.log(`📡 Requête reçue : ${req.method} ${req.url}`);
    console.log("🔍 Corps de la requête :", req.body);
    next();
});
app.post("/api/admin/supprimer-vente", ticketSalesRoutes);
console.log("✅ Route DELETE /api/admin/supprimer-vente enregistrée !");

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Gère les requêtes POST avec form-data

// Test de connexion à la base de données
db.raw('SELECT 1')
    .then(() => {
        console.log('Connected to MySQL using Knex');
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err);
    });

    app.use('/api/auth', authRoutes); //pour les gestion d'administrateur
    app.use('/api', faqRoutes); // pour les questions fréquents
    app.use('/api/organizer', organizerRoutes);// pour les organisateurs
    app.use('/api/participant', participantRoutes);
    app.use('/api/newsletter', newsletterRoutes); //pour la newsletter
    app.use("/api/tickets", ticketSalesRoutes);
    app.use("/api/admin", ticketSalesRoutes); // pour le billets
    app.use("/api/organizer", ticketSalesRoutes);
    app.use("/api/certificate", certificateRoutes);
    app.use('/api/contact', contactRoutes);

// ✅ Ajout de la route publique des calendriers (⚠️ SANS TOKEN)
app.use("/api/public", calendrierRoutes); 

app.use('/api/resultats', resultatsRoutes);  // Ajout de la route des résultats avec le préfixe simple /api/resultats


app.get('/api/admin/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'Bienvenue sur le tableau de bord administrateur' });
});

app.listen(port, () => {
    console.log(`Serveur démarré avec succès au port ${port}`);
});

//ajoute image
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app._router.stack.forEach(function(r){
    if (r.route && r.route.path) {
        console.log(`🛠 Route enregistrée: ${r.route.path}`);
    }
});
