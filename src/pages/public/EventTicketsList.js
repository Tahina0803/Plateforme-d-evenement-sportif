import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import TicketPurchaseDialog from "./TicketPurchaseDialog";
import axios from "axios"; // **Ajout d'Axios pour récupérer les mises à jour de l'API**

const EventTicketsList = ({ event }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
    const [availableTickets, setAvailableTickets] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);


    // **📌 Récupération des billets depuis l'API**
    const fetchTickets = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/organizer/event/${event.id_evenement}`);
            console.log("🔄 Tickets mis à jour depuis API :", response.data.types_tickets);
            
            const correctedTickets = JSON.parse(response.data.types_tickets).map(ticket => ({
                ...ticket,
                nbr_ticket_disponible: ticket.nbr_ticket_disponible !== undefined && ticket.nbr_ticket_disponible !== null
                    ? parseInt(ticket.nbr_ticket_disponible, 10)
                    : parseInt(ticket.quantite, 10) || 0,
                prix_ticket: parseInt(ticket.prix_ticket, 10) || parseInt(ticket.prix, 10) || 0
            }));

            setAvailableTickets(correctedTickets);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des billets :", error);
        }
    };

    // **📌 Charger les billets à l'affichage de la page**
    useEffect(() => {
        if (event?.id_evenement) {
            fetchTickets();
        }
    }, [event]);

    // **🛒 Fonction pour ouvrir la boîte de dialogue d'achat**
    const handlePurchaseClick = (ticket) => {
        const foundTicket = availableTickets.find(t => (t.type_ticket || t.type) === (ticket.type_ticket || ticket.type));

        console.log("🛒 Ticket sélectionné :", foundTicket);

        if (!foundTicket || foundTicket.nbr_ticket_disponible <= 0) {
            alert("⚠️ Tous les billets de ce type sont vendus !");
            return;
        } 

        setSelectedTicket(foundTicket);
        setPurchaseDialogOpen(true);
    };

    // **🔄 Mise à jour des tickets après achat**
    const handlePurchaseComplete = async (ticketType, quantity) => {
        try {
            console.log(`🔄 Mise à jour du billet ${ticketType} après achat de ${quantity} ticket(s)...`);
            await fetchTickets(); // **Recharger les données après achat**
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour des billets :", error);
        }
    };
    
    return (
        <Box sx={{ marginTop: 3, width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: "#f50057" }}>
                Billets disponibles :
            </Typography>

            <Grid container spacing={3}>
                {availableTickets.length > 0 ? (
                    availableTickets.map((ticket, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    transition: '0.3s',
                                    '&:hover': { boxShadow: '0 6px 15px rgba(0,0,0,0.2)' },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#1976d2" }}>
                                        {ticket.type_ticket || ticket.type || "Non spécifié"}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
                                        <strong>Prix :</strong> {ticket.prix_ticket || ticket.prix || "0"} Ar
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
                                        <strong>Quantité restante :</strong> {ticket.nbr_ticket_disponible || "0"}
                                    </Typography>

                                    {/* Bouton pour acheter un billet */}
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#f50057",
                                            color: "white",
                                            mt: 2,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            "&:hover": { backgroundColor: "#c51162" },
                                        }}
                                        fullWidth
                                        onClick={() => handlePurchaseClick(ticket)}
                                    >
                                        Acheter
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ mx: 2 }}>
                        Aucun billet disponible.
                    </Typography>
                )}
            </Grid>

            {/* 🔹 Boîte de dialogue pour finaliser l'achat */}
            {selectedTicket && (
                <TicketPurchaseDialog
                open={purchaseDialogOpen}
                onClose={() => setPurchaseDialogOpen(false)}
                event={event}
                selectedTicket={selectedTicket}
                selectedQuantity={selectedQuantity} // Passer la quantité sélectionnée
                setSelectedQuantity={setSelectedQuantity} // Permettre à la boîte de dialogue de modifier la quantité
                onPurchaseComplete={handlePurchaseComplete}
            />
            
            )}
        </Box>
    );
};

export default EventTicketsList;