import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import TicketPDF from "../public/TicketPDF";

const MobileMoneyPaiment = ({ open, onClose, event, selectedTicket, quantity, total, onPaymentSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [generateTicket, setGenerateTicket] = useState(false);

  const handlePayment = () => {
    if (phoneNumber.length !== 10 || !phoneNumber.startsWith("034")) {
      alert("Veuillez entrer un numéro MVola valide !");
      return;
    }
    alert(`Paiement MVola en cours pour ${total} Ar...`);

    //simulation du paiment réussi
    setTimeout(() => {
      setGenerateTicket(true);
      onPaymentSuccess();
    }, 2000);

    onClose(); // Fermer la modale après le paiement
  };



  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
        Paiement MVola
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">{event.nom_event}</Typography>
          <Typography variant="body1">
            <strong>Lieu :</strong> {event.lieu_event}
          </Typography>
          <Typography variant="body1">
            <strong>Date :</strong>{" "}
            {new Date(event.date_debut).toLocaleDateString("fr-FR")} -{" "}
            {new Date(event.date_fin).toLocaleDateString("fr-FR")}
          </Typography>
          <Typography variant="body1">
            <strong>Type de billet :</strong> {selectedTicket?.type || selectedTicket?.type_ticket}
          </Typography>
          <Typography variant="body1">
            <strong>Prix unitaire :</strong> {selectedTicket?.prix || selectedTicket?.prix_ticket} Ar
          </Typography>
          <Typography variant="body1">
            <strong>Quantité :</strong> {quantity}
          </Typography>
          <Typography variant="h6">
            <strong>Total :</strong> {total} Ar
          </Typography>

          {/* Entrée du numéro MVola */}
          <TextField
            label="Numéro MVola"
            type="tel"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="034xxxxxxxx"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button variant="contained" color="primary" onClick={handlePayment}>
          Payer avec MVola
        </Button>
      </DialogActions>
    </Dialog>
    
    {generateTicket && (<TicketPDF
      event={event}
      selectedTicket={selectedTicket}
      quantity={quantity}
      total={total}
      onComplete={() => setGenerateTicket(false)}
      />
    )}
    </>
  );
};

export default MobileMoneyPaiment;
