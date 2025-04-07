import React, { useState } from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";

const SendNewsletter = ({ subscribers }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const response = await fetch("http://localhost:3001/api/newsletter/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject, 
          content: message, 
          recipients: subscribers.map((s) => s.email) }),
      });

      const data = await response.json();
      setStatus(data.message || data.error);

      if (data.message) {
        setSubject("");
        setMessage("");
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error) {
      setStatus("Erreur lors de l'envoi.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Envoyer une newsletter
      </Typography>
      <form onSubmit={handleSendEmail}>
        <TextField
          fullWidth
          label="Objet"
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Envoyer
        </Button>
      </form>
      {status && <Typography sx={{ mt: 2, color: "green" }}>{status}</Typography>}
    </Paper>
  );
};

export default SendNewsletter;
