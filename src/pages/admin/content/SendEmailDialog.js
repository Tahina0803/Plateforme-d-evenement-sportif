// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Button,
//   Typography,
// } from "@mui/material";
// import axios from "axios";

// const SendEmailDialog = ({ open, onClose, organizer, token }) => {
//   const [emailContent, setEmailContent] = useState("");

//   const handleSendEmail = async () => {
//     if (!emailContent.trim()) {
//       alert("Veuillez écrire un message avant d'envoyer.");
//       return;
//     }

//     try {
//       await axios.post(
//         `http://localhost:3001/api/auth/admin/organizers/${organizer.id_organisateur}/send-email`,
//         { email: organizer.email_organisateur, content: emailContent },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert(`Email envoyé avec succès à ${organizer.email_organisateur}.`);
//       setEmailContent("");
//       onClose(); // Fermer la boîte de dialogue
//     } catch (error) {
//       console.error(
//         "Erreur lors de l'envoi de l'email :",
//         error.response?.data.message || error.message
//       );
//       alert("Erreur lors de l'envoi de l'email.");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Envoyer un email</DialogTitle>
//       <DialogContent>
//         <Typography>
//           Destinataire : {organizer?.email_organisateur}
//         </Typography>
//         <TextField
//           multiline
//           rows={4}
//           fullWidth
//           label="Message"
//           value={emailContent}
//           onChange={(e) => setEmailContent(e.target.value)}
//           sx={{ mt: 2 }}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Annuler
//         </Button>
//         <Button onClick={handleSendEmail} color="primary" variant="contained">
//           Envoyer
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default SendEmailDialog;
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

const SendEmailDialog = ({ open, onClose, organizer, token }) => {
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!emailContent.trim() || !emailSubject.trim()) {
      alert("Veuillez remplir tous les champs avant d'envoyer.");
      return;
    }

    setLoading(true); //activation du chargement

    try {
      await axios.post(
        `http://localhost:3001/api/auth/admin/organizers/${organizer.id_organisateur}/send-email`,
        {
          email: organizer.email_organisateur,
          subject: emailSubject,
          content: emailContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Email envoyé avec succès à ${organizer.email_organisateur}.`);
      setEmailContent("");
      setEmailSubject("");
      onClose(); // Fermer la boîte de dialogue
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
          À : <strong>{organizer?.email_organisateur}</strong>
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
          startIcon={loading && <CircularProgress size={20} color="inherit"/>}
        >
         {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendEmailDialog;
