// import React, { useState, useEffect } from "react";
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     Typography,
//     TextField,
//     Box,
// } from "@mui/material";
// import MobileMoneyPaiment from "../services/MobileMoneyPaiment";
// import axios from "axios";

// const TicketPurchaseDialog = ({ open, onClose, event, selectedTicket, onPurchaseComplete }) => {
//     const [quantity, setQuantity] = useState(1);
//     const [total, setTotal] = useState(0);
//     const [paymentOpen, setPaymentOpen] = useState(false);
//     const [buyerPhoneNumber, setBuyerPhoneNumber] = useState(""); // 🔹 Ajout du champ numéro MVola

//     useEffect(() => {
//         if (selectedTicket) {
//             const ticketPrice = parseInt(selectedTicket.prix, 10) || parseInt(selectedTicket.prix_ticket, 10) || 0;
//             setTotal(ticketPrice * quantity);
//         }
//     }, [quantity, selectedTicket]);

//     const handleQuantityChange = (e) => {
//         let qty = parseInt(e.target.value, 10);
//         if (isNaN(qty) || qty < 1) qty = 1;
//         setQuantity(qty);
//     };

//     const handleConfirmPurchase = () => {
//         if (!buyerPhoneNumber || buyerPhoneNumber.length !== 10 || !buyerPhoneNumber.startsWith("034")) {
//             alert("Veuillez entrer un numéro MVola valide !");
//             return;
//         }
//         setPaymentOpen(true);
//     };

//     const handlePaymentSuccess = async () => {
//         try {
//             console.log("📤 Envoi des données d'achat à l'API :", {
//                 id_evenement: event.id_evenement,
//                 type_ticket: selectedTicket.type_ticket || selectedTicket.type,
//                 quantity: quantity,
//                 acheteur: buyerPhoneNumber, // 🔹 Ajout du numéro MVola comme identifiant acheteur
//             });

//             const response = await axios.post("http://localhost:3001/api/tickets/acheter-ticket", {
//                 id_evenement: event.id_evenement,
//                 type_ticket: selectedTicket.type_ticket || selectedTicket.type,
//                 quantity: quantity,
//                 acheteur: buyerPhoneNumber, // 🔹 Ajout de l'acheteur dans la requête
//             });

//             console.log("✅ Mise à jour réussie :", response.data);
//             onPurchaseComplete(selectedTicket.type_ticket, quantity);
//         } catch (error) {
//             console.error("❌ Erreur lors de la mise à jour des billets :", error);
//             alert("Une erreur est survenue lors de la mise à jour des billets.");
//         }

//         setPaymentOpen(false);
//         onClose();
//     };

//     return (
//         <>
//             <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//                 <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
//                     Achat de billet
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                         <Typography variant="h6">{event.nom_event}</Typography>
//                         <Typography variant="body1">
//                             <strong>Lieu :</strong> {event.lieu_event}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Date :</strong>{" "}
//                             {new Date(event.date_debut).toLocaleDateString("fr-FR")} -{" "}
//                             {new Date(event.date_fin).toLocaleDateString("fr-FR")}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Type de billet :</strong>{" "}
//                             {selectedTicket?.type || selectedTicket?.type_ticket || "Non spécifié"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Prix unitaire :</strong> {selectedTicket?.prix || selectedTicket?.prix_ticket} Ar
//                         </Typography>

//                         <TextField
//                             label="Nombre de billets"
//                             type="number"
//                             variant="outlined"
//                             fullWidth
//                             value={quantity}
//                             onChange={handleQuantityChange}
//                             InputProps={{ inputProps: { min: 1 } }}
//                         />

//                         <TextField
//                             label="Numéro MVola"
//                             type="tel"
//                             variant="outlined"
//                             fullWidth
//                             value={buyerPhoneNumber}
//                             onChange={(e) => setBuyerPhoneNumber(e.target.value)}
//                             placeholder="034xxxxxxxx"
//                         />

//                         <Typography variant="h6">
//                             <strong>Total :</strong> {total} Ar
//                         </Typography>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={onClose} color="secondary">
//                         Annuler
//                     </Button>
//                     <Button variant="contained" color="primary" onClick={handleConfirmPurchase}>
//                         Confirmer l'achat
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <MobileMoneyPaiment
//                 open={paymentOpen}
//                 onClose={() => setPaymentOpen(false)}
//                 event={event}
//                 selectedTicket={selectedTicket}
//                 quantity={quantity}
//                 total={total}
//                 onPaymentSuccess={handlePaymentSuccess} // 🔹 Notifier après paiement
//             />
//         </>
//     );
// };

// export default TicketPurchaseDialog;
import React, { useState, useEffect } from "react";
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
import MobileMoneyPaiment from "../services/MobileMoneyPaiment";
import axios from "axios";

const TicketPurchaseDialog = ({ open, onClose, event, selectedTicket, onPurchaseComplete }) => {
    const [quantity, setQuantity] = useState(1);
    const [total, setTotal] = useState(0);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [buyerPhoneNumber, setBuyerPhoneNumber] = useState(""); // 🔹 Numéro MVola de l'acheteur

    useEffect(() => {
        if (selectedTicket) {
            const ticketPrice = parseInt(selectedTicket.prix, 10) || parseInt(selectedTicket.prix_ticket, 10) || 0;
            setTotal(ticketPrice * quantity);
        }
    }, [quantity, selectedTicket]);

    // 🔹 Gestion du changement de quantité
    const handleQuantityChange = (e) => {
        let qty = parseInt(e.target.value, 10);
        if (isNaN(qty) || qty < 1) qty = 1;
        setQuantity(qty);
    };

    // 🔹 Vérification du numéro MVola et ouverture de la boîte de dialogue de paiement
    const handleConfirmPurchase = () => {
        if (!buyerPhoneNumber || buyerPhoneNumber.length !== 10 || !buyerPhoneNumber.startsWith("034")) {
            alert("Veuillez entrer un numéro MVola valide !");
            return;
        }
        setPaymentOpen(true);
    };

    // 🔹 Après validation du paiement, enregistrement de l'achat dans la base
    const handlePaymentSuccess = async () => {
        try {
            console.log("📤 Envoi des données d'achat à l'API :", {
                id_evenement: event.id_evenement,
                type_ticket: selectedTicket.type_ticket || selectedTicket.type,
                quantity: quantity,
                acheteur: buyerPhoneNumber, // 🔹 Envoi du numéro MVola
            });

            const response = await axios.post("http://localhost:3001/api/tickets/acheter", {
                id_evenement: event.id_evenement,
                type_ticket: selectedTicket.type_ticket || selectedTicket.type,
                quantity: quantity,
                acheteur: buyerPhoneNumber,
            });


            console.log("✅ Achat enregistré :", response.data);
            alert("Achat confirmé !");
            onPurchaseComplete(selectedTicket.type_ticket, quantity);
        } catch (error) {
            console.error("❌ Erreur lors de l'achat :", error.response?.data || error);
            alert("Une erreur est survenue lors de l'achat.");
        }

        setPaymentOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
                    Achat de billet
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
                            <strong>Type de billet :</strong>{" "}
                            {selectedTicket?.type || selectedTicket?.type_ticket || "Non spécifié"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Prix unitaire :</strong> {selectedTicket?.prix || selectedTicket?.prix_ticket} Ar
                        </Typography>

                        {/* 🔹 Champ pour sélectionner la quantité */}
                        <TextField
                            label="Nombre de billets"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={quantity}
                            onChange={handleQuantityChange}
                            InputProps={{ inputProps: { min: 1 } }}
                        />

                        {/* 🔹 Champ pour entrer le numéro MVola */}
                        <TextField
                            label="Numéro MVola"
                            type="tel"
                            variant="outlined"
                            fullWidth
                            value={buyerPhoneNumber}
                            onChange={(e) => setBuyerPhoneNumber(e.target.value)}
                            placeholder="034xxxxxxxx"
                        />

                        <Typography variant="h6">
                            <strong>Total :</strong> {total} Ar
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Annuler
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleConfirmPurchase}>
                        Confirmer l'achat
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 🔹 Intégration du module de paiement Mobile Money */}
            <MobileMoneyPaiment
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                event={event}
                selectedTicket={selectedTicket}
                quantity={quantity}
                total={total}
                onPaymentSuccess={handlePaymentSuccess} // 🔹 Enregistre l'achat après paiement
            />
        </>
    );
};

export default TicketPurchaseDialog;
