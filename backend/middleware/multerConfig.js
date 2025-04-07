const multer = require('multer');
const path = require('path');

// Configuration pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Nom unique pour éviter les conflits
  },
});

const upload = multer({ storage });

module.exports = upload;
