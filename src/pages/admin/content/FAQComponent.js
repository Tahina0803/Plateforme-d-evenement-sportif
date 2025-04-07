import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  QuestionAnswer,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../../services/faqService";

const FAQComponent = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const theme = useTheme();

  // Fonction pour récupérer la liste des FAQs depuis le backend
  const fetchFaqs = async () => {
    try {
      const faqs = await getAllFaqs();
      setFaqList(faqs);
    } catch (error) {
      console.error("Erreur lors de la récupération des FAQs:", error);
    }
  };

  // Charger les FAQs lors du montage du composant
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Ajouter ou modifier une FAQ
  const handleAddFAQ = async () => {
    if (question && answer) {
      const newFAQ = { question, answer };

      try {
        if (editIndex !== null) {
          // Modification d'une FAQ existante
          const faqToUpdate = faqList[editIndex];
          await updateFaq(faqToUpdate.id, newFAQ);
          setSuccessMessage("FAQ modifiée avec succès !");
        } else {
          // Ajout d'une nouvelle FAQ
          await createFaq(newFAQ);
          setSuccessMessage("FAQ ajoutée avec succès !");
        }

        // Récupérer la liste complète des FAQ pour s'assurer de l'affichage
        fetchFaqs();

        // Réinitialiser les champs
        setQuestion("");
        setAnswer("");
        setError(false);
        setEditIndex(null);
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout ou de la modification de la FAQ:",
          error
        );
      }
    } else {
      setError(true);
    }
  };

  // Remplir les champs pour l'édition d'une FAQ
  const handleEditFAQ = (index) => {
    setQuestion(faqList[index].question);
    setAnswer(faqList[index].answer);
    setEditIndex(index);
  };

  // Supprimer une FAQ
  const handleDeleteFAQ = async (index) => {
    try {
      const faqToDelete = faqList[index];
      await deleteFaq(faqToDelete.id);
      setSuccessMessage("FAQ supprimée avec succès !");

      // Récupérer la liste complète des FAQ pour s'assurer de l'affichage
      fetchFaqs();
    } catch (error) {
      console.error("Erreur lors de la suppression de la FAQ:", error);
    }
  };

  return (
    <Box sx={{ "@media (max-width: 600px)": { padding: 2 } }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold" }}
        color={theme.palette.mode === "dark" ? "white" : "black"}
      >
        Gestion des questions fréquentes
      </Typography>

      {/* Champ de Question */}
      <TextField
        label="Question"
        variant="outlined"
        fullWidth
        margin="normal"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Add />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ boxShadow: 1, borderRadius: 1 }}
      />

      {/* Champ de Réponse */}
      <TextField
        label="Réponse"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        sx={{ boxShadow: 1, borderRadius: 1 }}
      />

      {/* Affichage d'une alerte en cas d'erreur */}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          Veuillez remplir les champs Question et Réponse avant d'ajouter.
        </Alert>
      )}

      {/* Bouton aligné à droite */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={editIndex !== null ? <Edit /> : <Add />}
          onClick={handleAddFAQ}
          sx={{
            borderRadius: 5,
            backgroundColor: "#0288D1",
            "&:hover": { backgroundColor: "#0277BD" },
          }}
        >
          {editIndex !== null ? "Modifier" : "Ajouter"}
        </Button>
      </Box>

      {/* Liste des FAQ sous forme d'accordéon */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#006064",
          borderBottom: "2px solid #006064",
          width: "150px",
        }}
      >
        Listes des FAQ :
      </Typography>

      <Box>
        {faqList.map((faq, index) => (
          <Accordion
            key={index}
            sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ borderRadius: 1 }}
            >
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: "100%",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* La réponse */}
              <Typography
                sx={{
                  width: "100%",
                  wordWrap: "break-word",
                  textAlign: "left",
                }}
              >
                {faq.answer}
              </Typography>

              {/* Boutons d'action pour modifier et supprimer */}
              <Box
                display="flex"
                justifyContent="flex-end"
                gap={1}
                width="100%"
                sx={{ marginTop: "auto" }}
              >
                <Tooltip title="Modifier">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditFAQ(index)}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteFAQ(index)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Snackbar de confirmation */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
    </Box>
  );
};

export default FAQComponent;
