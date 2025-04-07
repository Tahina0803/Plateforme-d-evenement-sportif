require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  // Récupérer le token depuis l'en-tête 'authorization'
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.log('Token non fourni dans l\'en-tête Authorization');
    return res.status(403).send({ message: 'Token manquant dans l\'en-tête Authorization!' });
  }

  // Extraire le token du header "Bearer <token>"
  const token = authHeader.split(' ')[1]; // La deuxième partie contient le token réel

  if (!token) {
    console.log('Le token n\'est pas fourni dans le bon format (Bearer <token>)');
    return res.status(403).send({ message: 'Format incorrect du token, "Bearer <token>" attendu!' });
  }

  try {
    // Vérifier et décoder le token avec la clé secrète
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Erreur lors de la vérification du token:', err.message);
        return res.status(401).send({ message: 'Token invalide ou expiré!' });
      }

      // Stocker l'ID et le rôle de l'utilisateur dans la requête pour une utilisation ultérieure
      // req.userId = decoded.id;
      req.user = decoded;
      req.userRole = decoded.role;
      console.log('Token valide pour l\'utilisateur ID:', decoded.id, 'avec le rôle:', decoded.role);
      
      next();
    });
  } catch (err) {
    console.error('Erreur inattendue lors de la vérification du token:', err.message);
    return res.status(500).send({ message: 'Erreur interne lors de la vérification du token!' });
  }
};

module.exports = verifyToken;
