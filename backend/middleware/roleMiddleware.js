const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: 'Accès refusé, aucun rôle défini pour cet utilisateur.' });
    }

    // Vérifier si le rôle de l'utilisateur fait partie des rôles autorisés
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: `Accès refusé, rôle '${req.userRole}' non autorisé pour cette action.` });
    }

    next();
  };
};

module.exports = verifyRoles;
