import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const AdminTickets = () => {
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const commissionRate = 0.05; // 5% de commission pour la plateforme
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Vérifier si on est sur un écran mobile

  useEffect(() => {
    fetchTicketData();
  }, []);

  const fetchTicketData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tickets/count-by-event");
      setTicketData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des billets vendus :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (eventId, organizerId) => {
    if (!window.confirm("Voulez-vous transférer les fonds à l'organisateur ?")) return;

    try {
      await axios.post(`http://localhost:3001/api/tickets/transfer/${eventId}`, { organizerId });
      alert("Transfert effectué avec succès !");
      fetchTicketData(); // Rafraîchir les données après transfert
    } catch (error) {
      console.error("Erreur lors du transfert :", error);
      alert("Erreur lors du transfert.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Gestion des Billets et Paiements
      </Typography>

      {loading ? (
        <Typography align="center">Chargement des données...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Réf. Billet</strong></TableCell>
                <TableCell><strong>Événement</strong></TableCell>
                {!isMobile && <TableCell><strong>Organisateur</strong></TableCell>}
                <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
                {!isMobile && <TableCell align="center"><strong>Montant Collecté</strong></TableCell>}
                <TableCell align="center"><strong>Montant à Transférer</strong></TableCell>
                <TableCell align="center"><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ticketData.map((ticket) => {
                const totalCollected = parseFloat(ticket.total_amount);
                const commission = totalCollected * commissionRate;
                const amountToTransfer = totalCollected - commission;

                return (
                  <TableRow key={ticket.id_ticket}>
                    <TableCell>{ticket.ticket_reference}</TableCell>
                    <TableCell>{ticket.event_name}</TableCell>
                    {!isMobile && <TableCell>{ticket.organizer_name}</TableCell>}
                    <TableCell align="center">{ticket.total_billets}</TableCell>
                    {!isMobile && <TableCell align="center">{totalCollected.toFixed(2)} Ar</TableCell>}
                    <TableCell align="center">{amountToTransfer.toFixed(2)} Ar</TableCell>
                    <TableCell align="center">
                      {ticket.payment_status === "transféré" ? "✅ Transféré" : "⏳ En attente"}
                    </TableCell>
                    <TableCell align="center">
                      {ticket.payment_status !== "transféré" && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTransfer(ticket.id_event, ticket.organizer_id)}
                          sx={{
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                            padding: isMobile ? "5px 8px" : "8px 12px",
                          }}
                        >
                          Transférer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminTickets;
