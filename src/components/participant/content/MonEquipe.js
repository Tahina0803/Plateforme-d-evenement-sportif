import React, { useState, useEffect } from 'react';
import {
  Box, Tooltip, Typography, DialogContent, DialogActions, TextField, Button, MenuItem,
  Grid, Dialog, DialogTitle, Divider, IconButton
} from '@mui/material';
import { Edit, Delete, PersonAdd } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 🚀 Ajout de la navigation




const baseURL = "http://localhost:3001";

const MonEquipe = () => {
  const [nomEquipe, setNomEquipe] = useState('');
  const [categorieEquipe, setCategorieEquipe] = useState('');
  const [idEvenement, setIdEvenement] = useState('');
  const [evenements, setEvenements] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageErreur, setMessageErreur] = useState('');
  const [hoveredEquipe, setHoveredEquipe] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState(null);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState("");
  const navigate = useNavigate(); // ✅ Hook de navigation

  const [pageActuelle, setPageActuelle] = useState("equipes"); // ✅ Gère l'affichage de la page
  const [idEquipeSelectionnee, setIdEquipeSelectionnee] = useState(null); // ✅ Stocke l'ID de l'équipe pour ajouter un joueur

  // États pour les champs du formulaire de joueur
  const [nomJoueur, setNomJoueur] = useState("");
  const [prenomJoueur, setPrenomJoueur] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [sexeJoueur, setSexeJoueur] = useState("");
  const [emailJoueur, setEmailJoueur] = useState("");
  const [telJoueur, setTelJoueur] = useState("");
  const [posteJoueur, setPosteJoueur] = useState("");

  const [joueurs, setJoueurs] = useState([]); // ✅ Stocke la liste des joueurs
  const [emailErreur, setEmailErreur] = useState("");
  const [telErreur, setTelErreur] = useState("");

  const [openJoueursModal, setOpenJoueursModal] = useState(false); // ✅ Gère l'ouverture de la modal
  const [equipeSelectionnee, setEquipeSelectionnee] = useState(null); // ✅ Stocke l'équipe sélectionnée

  const [openJoueurModal, setOpenJoueurModal] = useState(false); // ✅ Gère l'affichage de la modal de détails du joueur
  const [joueurSelectionne, setJoueurSelectionne] = useState(null); // ✅ Stocke les informations du joueur sélectionné

  const [openEditJoueurModal, setOpenEditJoueurModal] = useState(false); // ✅ Gère la modal d'édition du joueur
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false); // ✅ Gère la modal de confirmation de suppression

  // ✅ Récupérer les événements
  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return alert("Vous devez vous reconnecter.");

        const response = await axios.get(`${baseURL}/api/participant/evenements/inscrits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvenements(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      }
    };
    fetchEvenements();
  }, []);

  // ✅ Récupérer les équipes
  const fetchEquipes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Vous devez vous reconnecter.");

      const response = await axios.get(`${baseURL}/api/participant/equipe/my-teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEquipes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les équipes au démarrage
  useEffect(() => {
    fetchEquipes();
  }, []);

  useEffect(() => {
    if (idEvenement) {
      const equipeExistante = equipes.some(equipe => equipe.id_evenement === idEvenement);
      setMessageErreur(equipeExistante ? "Vous avez déjà ajouté une équipe pour cet événement." : "");
    } else {
      setMessageErreur("");
    }
  }, [idEvenement, equipes]);


  // ✅ Ajouter une équipe
  const handleAddEquipe = async () => {
    if (!nomEquipe || !categorieEquipe || !idEvenement) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifier si une équipe existe déjà pour cet événement
    const equipeExistante = equipes.some(equipe => equipe.id_evenement === idEvenement);
    if (equipeExistante) {
      setMessageErreur("Vous avez déjà une équipe pour cet événement.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/api/participant/equipe/create`,
        { nom_equipe: nomEquipe, categorie_equipe: categorieEquipe, id_evenement: idEvenement },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔄 Rafraîchir la liste des équipes après l'ajout
      fetchEquipes();

      setNomEquipe('');
      setCategorieEquipe('');
      setIdEvenement('');
      setMessageErreur('');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipe:", error);
    }
  };

  // ✅ Ouvrir la modal de modification
  const handleOpenEditModal = (equipe) => {
    setSelectedEquipe(equipe);
    setNouveauNom(equipe.nom_equipe);
    setNouvelleCategorie(equipe.categorie_equipe);
    setOpenEditModal(true);
  };

  // ✅ Ouvrir la modal de suppression
  const handleOpenDeleteModal = (equipe) => {
    setSelectedEquipe(equipe);
    setOpenDeleteModal(true);
  };

  // ✅ Fermer les modals
  const handleCloseModals = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setSelectedEquipe(null);
  };

  // ✅ Modifier une équipe
  const handleEditEquipe = async () => {
    if (!nouveauNom || !nouvelleCategorie) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseURL}/api/participant/equipe/update/${selectedEquipe.id_equipe}`, {
        nom_equipe: nouveauNom,
        categorie_equipe: nouvelleCategorie
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchEquipes();
      handleCloseModals();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
    }
  };

  // ✅ Supprimer une équipe
  const handleDeleteEquipe = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/api/participant/equipe/delete/${selectedEquipe.id_equipe}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchEquipes();
      handleCloseModals();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe:", error);
    }
  };

  const handleOpenJoueursModal = (equipe) => {
    setEquipeSelectionnee(equipe); // ✅ Stocke l'équipe sélectionnée
    setOpenJoueursModal(true); // ✅ Ouvre la modal
    fetchJoueurs(equipe.id_equipe); // ✅ Charge les joueurs de l'équipe
  };


  // Fonction pour récupérer les joueurs d'une équipe
  const fetchJoueurs = async (idEquipe) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/participant/equipe/${idEquipe}/joueurs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoueurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des joueurs:", error);
    }
  };


  // ✅ Fonction pour afficher le formulaire d'ajout de joueur
  const handleOpenAjoutJoueur = (idEquipe) => {
    setIdEquipeSelectionnee(idEquipe);
    setPageActuelle("ajoutJoueur");
    fetchJoueurs(idEquipe); // ✅ Charge les joueurs de l'équipe sélectionnée

  };

  // ✅ Fonction pour revenir à la liste des équipes
  const handleRetourEquipes = () => {
    setPageActuelle("equipes");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErreur("Veuillez entrer une adresse email valide.");
    } else {
      setEmailErreur(""); // Réinitialiser le message d'erreur si l'email est valide
    }
  };

  const validateTelephone = (telephone) => {
    const telRegex = /^(032|033|034|038|037)\d{7}$/;
    if (!telRegex.test(telephone)) {
      setTelErreur("Le numéro doit commencer par 032, 033, 034, 038 ou 037 et contenir 10 chiffres.");
    } else {
      setTelErreur(""); // Réinitialiser l'erreur si le format est correct
    }
  };


  // ✅ Fonction pour ajouter un joueur
  const handleAddJoueur = async () => {
    if (!nomJoueur || !prenomJoueur || !dateNaissance || !sexeJoueur || !emailJoueur || !telJoueur || !posteJoueur) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/api/participant/equipe/${idEquipeSelectionnee}/joueurs`,
        {
          nom_joueur: nomJoueur,
          prenom_joueur: prenomJoueur,
          date_naissance: dateNaissance,
          sexe_joueur: sexeJoueur,
          email_joueur: emailJoueur,
          tel_joueur: telJoueur,
          poste_joueur: posteJoueur,
          id_equipe: idEquipeSelectionnee
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Joueur ajouté avec succès !");

      // ✅ Réinitialiser le formulaire après l'ajout du joueur
      setNomJoueur("");
      setPrenomJoueur("");
      setDateNaissance("");
      setSexeJoueur("");
      setEmailJoueur("");
      setTelJoueur("");
      setPosteJoueur("");

      // setPageActuelle("equipes"); // 🔄 Retour à la liste des équipes après l'ajout
      fetchJoueurs(idEquipeSelectionnee); // ✅ Actualiser la liste des joueurs après l'ajout

    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du joueur:", error);
    }
  };


  // ✅ Modifier un joueur
  const handleEditJoueur = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseURL}/api/participant/joueur/update/${joueurSelectionne.id_joueur}`, {
        nom_joueur: joueurSelectionne.nom_joueur,
        prenom_joueur: joueurSelectionne.prenom_joueur,
        date_naissance: joueurSelectionne.date_naissance,
        sexe_joueur: joueurSelectionne.sexe_joueur,
        email_joueur: joueurSelectionne.email_joueur,
        tel_joueur: joueurSelectionne.tel_joueur,
        poste_joueur: joueurSelectionne.poste_joueur
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Joueur mis à jour avec succès !");
      setOpenEditJoueurModal(false);
      fetchJoueurs(idEquipeSelectionnee); // ✅ Rafraîchir la liste des joueurs
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du joueur:", error);
    }
  };

  // ✅ Supprimer un joueur
  const handleDeleteJoueur = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/api/participant/joueur/delete/${joueurSelectionne.id_joueur}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Joueur supprimé avec succès !");
      setOpenConfirmDeleteModal(false);
      setOpenJoueurModal(false);
      fetchJoueurs(idEquipeSelectionnee); // ✅ Rafraîchir la liste des joueurs
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du joueur:", error);
    }
  };

  // ✅ Ouvrir la modal de détails d'un joueur
  const handleOpenJoueurModal = (joueur) => {
    setJoueurSelectionne(joueur);
    setOpenJoueurModal(true);
  };

  // ✅ Fermer la modal de détails du joueur
  const handleCloseJoueurModal = () => {
    setOpenJoueurModal(false);
    setJoueurSelectionne(null);
  };

  // ✅ Ouvrir la modal de modification du joueur
  const handleOpenEditJoueurModal = () => {
    setOpenEditJoueurModal(true);
  };

  // ✅ Fermer la modal de modification du joueur
  const handleCloseEditJoueurModal = () => {
    setOpenEditJoueurModal(false);
  };

  // ✅ Ouvrir la modal de confirmation de suppression du joueur
  const handleOpenConfirmDeleteModal = () => {
    setOpenConfirmDeleteModal(true);
  };

  // ✅ Fermer la modal de confirmation de suppression du joueur
  const handleCloseConfirmDeleteModal = () => {
    setOpenConfirmDeleteModal(false);
  };



  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 1 }}>
      {pageActuelle === "equipes" ? (
        // ✅ Affichage de la liste des équipes
        <>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Gérer équipe
          </Typography>

          <Grid container spacing={2} sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

            {/* 🔹 Formulaire */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                Ajouter équipe
              </Typography>

              <Box sx={{ p: 2, }}>
                <TextField select label="Sélectionner l'Événement" value={idEvenement} onChange={(e) => setIdEvenement(e.target.value)} fullWidth sx={{ mb: 2 }}>
                  {evenements.map(event => (
                    <MenuItem key={event.id_evenement} value={event.id_evenement}>{event.nom_event}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Nom de l'équipe" value={nomEquipe} onChange={(e) => setNomEquipe(e.target.value)} fullWidth sx={{ mb: 2 }} />
                <TextField label="Catégorie" value={categorieEquipe} onChange={(e) => setCategorieEquipe(e.target.value)} fullWidth sx={{ mb: 2 }} />

                {/* Désactiver le bouton si une équipe existe déjà */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddEquipe}
                  fullWidth
                  disabled={!!messageErreur}
                >
                  Créer équipe
                </Button>

                {/* Affichage du message d'erreur sous le bouton */}
                {messageErreur && (
                  <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
                    {messageErreur}
                  </Typography>
                )}
              </Box>
            </Grid>


            {/* 🔹 Liste des équipes */}
            <Grid item xs={12} md={7}>
              <Box sx={{ maxHeight: '100%', overflowY: 'auto', p: " 0px 0px 0px 30px", borderLeft: "1px solid #ddd" }}>

                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                  Liste des équipes
                </Typography>


                {equipes.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', width: '100%' }}>Aucune équipe trouvée</Typography>
                ) : (
                  equipes.map(equipe => (
                    <Box key={equipe.id_equipe} sx={{ borderBottom: '1px solid #ddd', pb: 1, display: 'flex', justifyContent: 'space-between' }}
                      onMouseEnter={() => setHoveredEquipe(equipe.id_equipe)}
                      onMouseLeave={() => setHoveredEquipe(null)}

                    >

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center", // ✅ Alignement vertical
                          justifyContent: "space-between", // ✅ Espacement entre le texte et les icônes
                          borderRadius: "5px", // ✅ Coins arrondis
                          p: 1, // ✅ Ajout de padding
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // ✅ Ombre douce
                          width: "100%"
                        }}
                      >
                        {/* ✅ Partie gauche : Infos de l'équipe */}
                        <Box sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                          onClick={() => handleOpenJoueursModal(equipe)}
                        >


                          {/* ✅ Affichage du nom de l'événement en bleu */}
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#1976D2", textTransform: "uppercase", fontSize: "0.9rem" }}
                          >
                            {evenements.find(e => e.id_evenement === equipe.id_evenement)?.nom_event || "Événement inconnu"}
                          </Typography>

                          {/* ✅ Nom de l'équipe et catégorie */}
                          <Typography sx={{ textAlign: "left", fontSize: "0.9rem", }}>
                            <b style={{ color: "#D32F2F" }}></b> {equipe.nom_equipe} || <b style={{ color: "#388E3C" }}></b> {equipe.categorie_equipe}
                          </Typography>
                        </Box>

                        {/* ✅ Partie droite : Icônes d'actions */}
                        {hoveredEquipe === equipe.id_equipe && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Ajouter joueurs">
                              <IconButton onClick={() => handleOpenAjoutJoueur(equipe.id_equipe)}>
                                <PersonAdd />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Modifier">
                              <IconButton onClick={() => handleOpenEditModal(equipe)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Supprimer">
                              <IconButton onClick={() => handleOpenDeleteModal(equipe)}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>

                    </Box>
                  ))
                )}
              </Box>
            </Grid>


            {/* 🔹 Modal pour afficher les joueurs de l'équipe sélectionnée */}
            <Dialog open={openJoueursModal} onClose={() => setOpenJoueursModal(false)} fullWidth maxWidth="md">
              <DialogTitle>Joueurs de l'équipe {equipeSelectionnee?.nom_equipe}</DialogTitle>
              <DialogContent>
                {/* ✅ En-tête du tableau */}
                <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "#E0E0E0", p: 1.5, fontWeight: "bold" }}>
                  <Typography sx={{ flex: 1, textAlign: "left", fontSize: "1rem", fontWeight: "bold", ml: 4 }}>Nom</Typography>
                  <Typography sx={{ flex: 1, textAlign: "right", fontSize: "1rem", fontWeight: "bold", mr: 4 }}>Poste</Typography>
                </Box>

                {/* ✅ Liste des joueurs avec couleurs alternées */}
                {joueurs.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', width: '100%', mt: 2 }}>Aucun joueur trouvé</Typography>
                ) : (
                  joueurs.map((joueur, index) => (
                    <Box
                      key={joueur.id_joueur}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                        backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#E0E0E0",
                      }}
                    >
                      <Typography sx={{ flex: 1, textAlign: "left", fontSize: "0.9rem", ml: 5 }}>
                        {joueur.nom_joueur}
                      </Typography>
                      <Typography sx={{ flex: 1, textAlign: "right", fontSize: "0.9rem", mr: 6 }}>
                        {joueur.poste_joueur}
                      </Typography>
                    </Box>
                  ))
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenJoueursModal(false)}  variant="contained" color="secondary">Fermer</Button>
              </DialogActions>
            </Dialog>


            {/* 🔹 Modal de modification */}
            <Dialog open={openEditModal} onClose={handleCloseModals}>
              <DialogTitle>Modifier l'équipe</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Nom de l'équipe"
                  value={nouveauNom}
                  onChange={(e) => setNouveauNom(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Catégorie de l'équipe"
                  value={nouvelleCategorie}
                  onChange={(e) => setNouvelleCategorie(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModals} variant="contained" color="secondary">Annuler</Button>
                <Button onClick={handleEditEquipe} variant="contained" color="primary">Modifier</Button>
              </DialogActions>
            </Dialog>

            {/* 🔹 Modal de confirmation de suppression */}
            <Dialog open={openDeleteModal} onClose={handleCloseModals}>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography>Êtes-vous sûr de vouloir supprimer cette équipe ?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModals} variant="contained" color="secondary">Annuler</Button>
                <Button onClick={handleDeleteEquipe} variant="contained" color="error">Supprimer</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </>
      ) : (
        // ✅ Affichage du formulaire d'ajout de joueur à gauche et de la liste des joueurs à droite
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {/* 🔹 Formulaire d'ajout de joueur à gauche */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Ajouter un joueur</Typography>
              <TextField label="Nom" value={nomJoueur} onChange={(e) => setNomJoueur(e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Prénom" value={prenomJoueur} onChange={(e) => setPrenomJoueur(e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Date de naissance" type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
              <TextField select label="Sexe" value={sexeJoueur} onChange={(e) => setSexeJoueur(e.target.value)} fullWidth sx={{ mb: 2 }}>
                <MenuItem value="Homme">Homme</MenuItem>
                <MenuItem value="Femme">Femme</MenuItem>
              </TextField>
              <TextField label="Email" type="email" value={emailJoueur} onChange={(e) => setEmailJoueur(e.target.value)} onBlur={() => validateEmail(emailJoueur)} error={!!emailErreur} helperText={emailErreur} fullWidth sx={{ mb: 2 }} />
              <TextField label="Téléphone" type="tel" value={telJoueur} onChange={(e) => setTelJoueur(e.target.value)} onBlur={() => validateTelephone(telJoueur)} error={!!telErreur} helperText={telErreur} fullWidth sx={{ mb: 2 }} inputProps={{ maxLength: 10 }} />
              <TextField label="Poste du joueur" value={posteJoueur} onChange={(e) => setPosteJoueur(e.target.value)} fullWidth sx={{ mb: 2 }} />
              <Button variant="contained" color="primary" onClick={handleAddJoueur} sx={{ mr: 2 }}>
                Ajouter Joueur
              </Button>
              <Button  variant="contained" color="secondary" onClick={handleRetourEquipes}>
                Retour aux équipes
              </Button>
            </Box>
          </Grid>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mt: 4, ml: 2 }} />

          {/* 🔹 Liste des joueurs à droite */}
          <Grid item xs={12} md={5}>
            <Box sx={{ maxHeight: '100%', overflowY: 'auto' }}>

              {/* ✅ En-tête du tableau */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#E0E0E0", // ✅ Fond gris pour l'en-tête
                  p: 1.5,
                  fontWeight: "bold",
                  borderRadius: "0px",
                  mt: { xs: 2, sm: 5, md: 8, lg: 9 },
                }}
              >
                <Typography sx={{ flex: 1, textAlign: "left", fontSize: "1rem", fontWeight: "bold", ml: 4 }}>Nom</Typography>
                <Typography sx={{ flex: 1, textAlign: "right", fontSize: "1rem", fontWeight: "bold", mr: 4 }}>Poste</Typography>
              </Box>

              {/* ✅ Liste des joueurs avec couleurs alternées */}
              {joueurs.length === 0 ? (
                <Typography sx={{ textAlign: 'center', width: '100%' }}>Aucun joueur trouvé</Typography>
              ) : (
                joueurs.map((joueur, index) => (
                  <Box
                    key={joueur.id_joueur}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#E0E0E0", // ✅ Alternance de couleurs
                      cursor: "pointer" // ✅ Change le curseur en main
                    }}
                    onClick={() => handleOpenJoueurModal(joueur)} // ✅ Affiche les détails en modal

                  >
                    <Typography sx={{ flex: 1, textAlign: "left", fontSize: "0.9rem", ml: 5 }}>
                      {joueur.nom_joueur}
                    </Typography>
                    <Typography sx={{ flex: 1, textAlign: "right", fontSize: "0.9rem", mr: 6 }}>
                      {joueur.poste_joueur}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Grid>

          {/* Modal des détails du joueur */}
          <Dialog open={openJoueurModal} onClose={handleCloseJoueurModal} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
              Détails du joueur
            </DialogTitle>
            
            <DialogContent>
              {joueurSelectionne && (
                <Box sx={{ p: 1 }}>
                  <Grid container spacing={1}>
                    {/* Nom */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Nom</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.nom_joueur}</Typography>
                    </Grid>

                    {/* Prénom */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Prénom</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.prenom_joueur}</Typography>
                    </Grid>

                    {/* Date de naissance */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Date de naissance</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.date_naissance}</Typography>
                    </Grid>

                    {/* Sexe */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Sexe</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.sexe_joueur}</Typography>
                    </Grid>

                    {/* Email */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Email</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.email_joueur}</Typography>
                    </Grid>

                    {/* Téléphone */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Téléphone</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.tel_joueur}</Typography>
                    </Grid>

                    {/* Poste */}
                    <Grid item xs={6} sx={{ textAlign: "right", fontWeight: "bold" }}>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>Poste</Typography>
                      <Typography component="span" sx={{ pr: 1, pl: 1, fontWeight: "bold" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Typography component="span">{joueurSelectionne.poste_joueur}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>


            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button onClick={handleOpenEditJoueurModal} variant="contained" color="primary">Modifier</Button>
              <Button onClick={handleOpenConfirmDeleteModal} variant="contained" color="error">Supprimer</Button>
              <Button onClick={handleCloseJoueurModal} variant="contained" color="secondary">Fermer</Button>
            </DialogActions>
          </Dialog>

          {/* Modal de modification du joueur : */}
          <Dialog open={openEditJoueurModal} onClose={handleCloseEditJoueurModal} fullWidth maxWidth="sm">
            <DialogTitle>Modifier le joueur</DialogTitle>
            <DialogContent>
              <TextField fullWidth margin="dense" label="Nom" value={joueurSelectionne?.nom_joueur} onChange={(e) => setJoueurSelectionne({ ...joueurSelectionne, nom_joueur: e.target.value })} />
              <TextField fullWidth margin="dense" label="Prénom" value={joueurSelectionne?.prenom_joueur} onChange={(e) => setJoueurSelectionne({ ...joueurSelectionne, prenom_joueur: e.target.value })} />
              <TextField fullWidth margin="dense" label="Email" type="email" value={joueurSelectionne?.email_joueur} onChange={(e) => setJoueurSelectionne({ ...joueurSelectionne, email_joueur: e.target.value })} />
              <TextField fullWidth margin="dense" label="Téléphone" type="tel" value={joueurSelectionne?.tel_joueur} onChange={(e) => setJoueurSelectionne({ ...joueurSelectionne, tel_joueur: e.target.value })} />
              <TextField fullWidth margin="dense" label="Poste" type="poste" value={joueurSelectionne?.poste_joueur} onChange={(e) => setJoueurSelectionne({ ...joueurSelectionne, poste_joueur: e.target.value })} />

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditJoueurModal}  variant="contained" color="secondary">Annuler</Button>
              <Button onClick={handleEditJoueur}  variant="contained" color="primary">Enregistrer</Button>
            </DialogActions>
          </Dialog>

          {/* Modal de confirmation de suppression du joueur : */}
          <Dialog open={openConfirmDeleteModal} onClose={handleCloseConfirmDeleteModal} fullWidth maxWidth="xs">
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <Typography>Êtes-vous sûr de vouloir supprimer ce joueur ?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDeleteModal} variant="contained" color="secondary">Annuler</Button>
              <Button onClick={handleDeleteJoueur} variant="contained" color="error">Supprimer</Button>
            </DialogActions>
          </Dialog>

        </Grid>
      )}
    </Box>
  );
};
export default MonEquipe;