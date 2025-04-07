gestion de rôle
Faites de même pour les organisateurs 
et participants dans leurs contrôleurs respectifs
 (OrganisateurControler.js, ParticipantControler.js) 
 en ajoutant leur rôle dans le token JWT.

 exemple : 
 const token = jwt.sign({ id: organisateur.id_organisateur, role: 'organisateur' }, process.env.JWT_SECRET, { expiresIn: '1h' });
