import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    IconButton,
    Box,
    CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";

const SendEmailNotify = ({ open, onClose, participant, token }) => {
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!emailContent.trim() || !emailSubject.trim()) {
      alert("Veuillez remplir tous les champs avant d'envoyer.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:3001/api/organizer/participants/${participant.id_participant}/send-email`,
        {
          subject: emailSubject,
          content: emailContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Email envoyé avec succès à ${participant.email_part}.`);
      setEmailContent("");
      setEmailSubject("");
      onClose();
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email :",
        error.response?.data.message || error.message
      );
      alert("Erreur lors de l'envoi de l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle>Composer un email</DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          À : <strong>{participant?.email_part}</strong>
        </Typography>

        <TextField
          fullWidth
          label="Sujet"
          variant="outlined"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          label="Écrire votre message ici..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handleSendEmail}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendEmailNotify;
