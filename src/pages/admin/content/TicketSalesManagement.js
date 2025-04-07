// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     CircularProgress,
// } from "@mui/material";

// const TicketSalesManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(null);
//     const [deleting, setDeleting] = useState(null);

//     // ✅ Charger les ventes depuis l'API
//     useEffect(() => {
//         const fetchSales = async () => {
//             try {
//                 const response = await fetch("http://localhost:3001/api/tickets/ventes-billets");
//                 const data = await response.json();
//                 console.log("✅ Données récupérées :", data);  // Vérifier si chaque vente contient un `id`
//                 setSales(data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération des ventes :", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSales();
//     }, []);

//     // ✅ Mettre à jour le statut du paiement
//     const updatePaymentStatus = async (id, status) => {
//         setUpdating(id);
//         try {
//             await fetch(`http://localhost:3001/api/tickets/update-paiement/${id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ status_paiement: status }),
//             });
//             setSales((prevSales) =>
//                 prevSales.map((sale) =>
//                     sale.id === id ? { ...sale, status_paiement: status } : sale
//                 )
//             );
//         } catch (error) {
//             console.error("❌ Erreur lors de la mise à jour du paiement :", error);
//         } finally {
//             setUpdating(null);
//         }
//     };

//     // ✅ Supprimer une vente
//     const deleteSale = async (id) => {
//         setDeleting(id);
//         try {
//             await fetch(`http://localhost:3001/api/tickets/supprimer-vente/${id}`, {
//                 method: "DELETE",
//             });
//             setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
//         } catch (error) {
//             console.error("❌ Erreur lors de la suppression de la vente :", error);
//         } finally {
//             setDeleting(null);
//         }
//     };

//     if (loading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
//                 Gestion des ventes de billets
//             </Typography>

//             <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Organisateur</strong></TableCell>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Ticket</strong></TableCell>
//                             <TableCell><strong>Quantité Totale</strong></TableCell>
//                             <TableCell><strong>Billets Restants</strong></TableCell>
//                             <TableCell><strong>Billets achetés</strong></TableCell>
//                             <TableCell><strong>Prix Unitaire</strong></TableCell>
//                             <TableCell><strong>Montant Collecté</strong></TableCell>
//                             <TableCell><strong>Montant Transférable</strong></TableCell>
//                             <TableCell><strong>Statut</strong></TableCell>
//                             <TableCell><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {sales.map((sale) => (
//                             <TableRow key={sale.id}>
//                                 <TableCell>{sale.nom_organisateur}</TableCell>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite}</TableCell>
//                                 <TableCell align="center">{sale.quantite_restante ?? (sale.quantite - sale.total_billets_vendus)}</TableCell>
//                                 <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="right">{sale.prix_unitaire} Ar</TableCell>
//                                 <TableCell align="right">{sale.montant_collecte} Ar</TableCell>
//                                 <TableCell align="right">{sale.montant_a_transferer} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Typography
//                                         sx={{
//                                             fontWeight: "bold",
//                                             color: sale.status_paiement === "payé" ? "green" :
//                                                 sale.status_paiement === "annulé" ? "red" : "orange",
//                                             textTransform: "capitalize",
//                                         }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     {/* 🔹 Bouton Transférer */}
//                                     {sale.status_paiement === "en_attente" && (
//                                         <Button
//                                             variant="contained"
//                                             color="success"
//                                             size="small"
//                                             onClick={() => updatePaymentStatus(sale.id, "payé")}
//                                             disabled={updating === sale.id}
//                                             sx={{ minWidth: 100, mb: 1 }}>
//                                             {updating === sale.id ? <CircularProgress size={20} /> : "Transférer"}
//                                         </Button>
//                                     )}

//                                     {/* 🔹 Bouton Annuler */}
//                                     {sale.status_paiement === "payé" && (
//                                         <Button
//                                             variant="contained"
//                                             color="error"
//                                             size="small"
//                                             onClick={() => updatePaymentStatus(sale.id, "annulé")}
//                                             disabled={updating === sale.id}
//                                             sx={{ minWidth: 100, mb: 1 }}>
//                                             {updating === sale.id ? <CircularProgress size={20} /> : "Annuler"}
//                                         </Button>
//                                     )}

//                                     {/* 🔹 Bouton Supprimer */}
//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         size="small"
//                                         onClick={() => deleteSale(sale.id)}
//                                         disabled={deleting === sale.id}
//                                         sx={{ minWidth: 100 }}>
//                                         {deleting === sale.id ? <CircularProgress size={20} /> : "Supprimer"}
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default TicketSalesManagement;

// **************************CODE FONCTIONNEL***************************************
// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     CircularProgress,
// } from "@mui/material";

// const TicketSalesManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);
//     const [deleting, setDeleting] = useState(false);

//     // ✅ Charger les ventes depuis l'API
//     useEffect(() => {
//         const fetchSales = async () => {
//             try {
//                 const response = await fetch("http://localhost:3001/api/tickets/ventes-billets");
//                 const data = await response.json();
//                 console.log("✅ Données récupérées :", data);
//                 setSales(data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération des ventes :", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSales();
//     }, []);

//     // ✅ Regrouper les ventes par Organisateur, Événement et Type de Ticket
//     const groupedSales = sales.reduce((acc, sale) => {
//         const key = `${sale.nom_organisateur}-${sale.nom_evenement}-${sale.type_ticket}`;

//         if (!acc[key]) {
//             acc[key] = {
//                 ids: [], // Stocker les IDs des ventes individuelles
//                 nom_organisateur: sale.nom_organisateur,
//                 nom_evenement: sale.nom_evenement,
//                 type_ticket: sale.type_ticket,
//                 quantite: sale.quantite,
//                 total_billets_vendus: 0,
//                 montant_collecte: 0,
//                 montant_a_transferer: 0,
//                 status_paiement: sale.status_paiement,
//             };
//         }

//         acc[key].ids.push(sale.id); // Ajouter l'ID de la vente au groupe
//         acc[key].total_billets_vendus += sale.total_billets_vendus;
//         acc[key].montant_collecte += sale.montant_collecte;
//         acc[key].montant_a_transferer += sale.montant_a_transferer;

//         return acc;
//     }, {});

//     const groupedSalesArray = Object.values(groupedSales);

//     // ✅ Mettre à jour le statut du paiement pour toutes les ventes du groupe
//     const updatePaymentStatus = async (ids, status) => {
//         setUpdating(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     fetch(`http://localhost:3001/api/tickets/update-paiement/${id}`, {
//                         method: "PUT",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ status_paiement: status }),
//                     })
//                 )
//             );

//             setSales((prevSales) =>
//                 prevSales.map((sale) =>
//                     ids.includes(sale.id) ? { ...sale, status_paiement: status } : sale
//                 )
//             );
//         } catch (error) {
//             console.error("❌ Erreur lors de la mise à jour du paiement :", error);
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // ✅ Supprimer toutes les ventes d’un groupe
//     const deleteSale = async (ids) => {
//         setDeleting(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     fetch(`http://localhost:3001/api/tickets/supprimer-vente/${id}`, {
//                         method: "DELETE",
//                     })
//                 )
//             );

//             setSales((prevSales) => prevSales.filter((sale) => !ids.includes(sale.id)));
//         } catch (error) {
//             console.error("❌ Erreur lors de la suppression de la vente :", error);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     if (loading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
//                 Gestion des ventes de billets
//             </Typography>

//             <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Organisateur</strong></TableCell>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Type de Ticket</strong></TableCell>
//                             <TableCell><strong>Quantité Totale</strong></TableCell>
//                             <TableCell><strong>Billets Vendus</strong></TableCell>
//                             <TableCell><strong>Montant Collecté</strong></TableCell>
//                             <TableCell><strong>Montant Transférable</strong></TableCell>
//                             <TableCell><strong>Statut</strong></TableCell>
//                             <TableCell><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {groupedSalesArray.map((sale, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{sale.nom_organisateur}</TableCell>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite}</TableCell>
//                                 <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="right">{sale.montant_collecte} Ar</TableCell>
//                                 <TableCell align="right">{sale.montant_a_transferer} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Typography
//                                         sx={{
//                                             fontWeight: "bold",
//                                             color: sale.status_paiement === "payé" ? "green" :
//                                                 sale.status_paiement === "annulé" ? "red" : "orange",
//                                             textTransform: "capitalize",
//                                         }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     {/* 🔹 Bouton Transférer */}
//                                     {sale.status_paiement === "en_attente" && (
//                                         <Button
//                                             variant="contained"
//                                             color="success"
//                                             size="small"
//                                             onClick={() => updatePaymentStatus(sale.ids, "payé")}
//                                             disabled={updating}
//                                             sx={{ minWidth: 100, mb: 1 }}>
//                                             {updating ? <CircularProgress size={20} /> : "Transférer"}
//                                         </Button>
//                                     )}

//                                     {/* 🔹 Bouton Supprimer */}
//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         size="small"
//                                         onClick={() => deleteSale(sale.ids)}
//                                         disabled={deleting}
//                                         sx={{ minWidth: 100 }}>
//                                         {deleting ? <CircularProgress size={20} /> : "Supprimer"}
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default TicketSalesManagement;
//***********************************code très fonctionnel**************************************** */
// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     CircularProgress,
// } from "@mui/material";

// const TicketSalesManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);
//     const [deleting, setDeleting] = useState(false);

//     // ✅ Charger les ventes depuis l'API
//     useEffect(() => {
//         const fetchSales = async () => {
//             try {
//                 const response = await fetch("http://localhost:3001/api/tickets/ventes-billets");
//                 const data = await response.json();
//                 console.log("✅ Données récupérées :", data);
//                 setSales(data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération des ventes :", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSales();
//     }, []);

//     // ✅ Regrouper les ventes par Organisateur, Événement et Type de Ticket
//     const groupedSales = sales.reduce((acc, sale) => {
//         const key = `${sale.nom_organisateur}-${sale.nom_evenement}-${sale.type_ticket}`;

//         if (!acc[key]) {
//             acc[key] = {
//                 ids: [], // Stocker les IDs des ventes individuelles
//                 nom_organisateur: sale.nom_organisateur,
//                 nom_evenement: sale.nom_evenement,
//                 type_ticket: sale.type_ticket,
//                 quantite: sale.quantite,
//                 total_billets_vendus: 0,
//                 montant_collecte: 0,
//                 montant_a_transferer: 0,
//                 status_paiement: sale.status_paiement,
//             };
//         }

//         acc[key].ids.push(sale.id); // Ajouter l'ID de la vente au groupe
//         acc[key].total_billets_vendus += sale.total_billets_vendus;
//         acc[key].montant_collecte += sale.montant_collecte;
//         acc[key].montant_a_transferer += sale.montant_a_transferer;

//         return acc;
//     }, {});

//     const groupedSalesArray = Object.values(groupedSales);

//     // ✅ Mettre à jour le statut du paiement pour toutes les ventes du groupe
//     const updatePaymentStatus = async (ids, status) => {
//         setUpdating(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     fetch(`http://localhost:3001/api/tickets/update-paiement/${id}`, {
//                         method: "PUT",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ status_paiement: status }),
//                     })
//                 )
//             );

//             setSales((prevSales) =>
//                 prevSales.map((sale) =>
//                     ids.includes(sale.id) ? { ...sale, status_paiement: status } : sale
//                 )
//             );
//         } catch (error) {
//             console.error("❌ Erreur lors de la mise à jour du paiement :", error);
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // ✅ Supprimer toutes les ventes d’un groupe
//     const deleteSale = async (ids) => {
//         setDeleting(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     fetch(`http://localhost:3001/api/tickets/supprimer-vente/${id}`, {
//                         method: "DELETE",
//                     })
//                 )
//             );

//             setSales((prevSales) => prevSales.filter((sale) => !ids.includes(sale.id)));
//         } catch (error) {
//             console.error("❌ Erreur lors de la suppression de la vente :", error);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     if (loading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
//                 Gestion des ventes de billets
//             </Typography>

//             <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Organisateur</strong></TableCell>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Type de Ticket</strong></TableCell>
//                             <TableCell><strong>Quantité Totale</strong></TableCell>
//                             <TableCell><strong>Billets Vendus</strong></TableCell>
//                             <TableCell><strong>Montant Collecté</strong></TableCell>
//                             <TableCell><strong>Montant Transférable</strong></TableCell>
//                             <TableCell><strong>Statut</strong></TableCell>
//                             <TableCell><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {groupedSalesArray.map((sale, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{sale.nom_organisateur}</TableCell>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite}</TableCell>
//                                 <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="right">{sale.montant_collecte} Ar</TableCell>
//                                 <TableCell align="right">{sale.montant_a_transferer} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Typography
//                                         sx={{
//                                             fontWeight: "bold",
//                                             color: sale.status_paiement === "payé" ? "green" :
//                                                 sale.status_paiement === "annulé" ? "red" : "orange",
//                                             textTransform: "capitalize",
//                                         }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     {/* 🔹 Bouton Transférer */}
//                                     {sale.status_paiement === "en_attente" && (
//                                         <Button
//                                             variant="contained"
//                                             color="success"
//                                             size="small"
//                                             onClick={() => updatePaymentStatus(sale.ids, "payé")}
//                                             disabled={updating}
//                                             sx={{ minWidth: 100, mb: 1 }}>
//                                             {updating ? <CircularProgress size={20} /> : "Transférer"}
//                                         </Button>
//                                     )}

//                                     {/* 🔹 Bouton Annuler le transfert */}
//                                     {sale.status_paiement === "payé" && (
//                                         <Button
//                                             variant="contained"
//                                             color="warning"
//                                             size="small"
//                                             onClick={() => updatePaymentStatus(sale.ids, "en_attente")}
//                                             disabled={updating}
//                                             sx={{ minWidth: 100, mb: 1 }}>
//                                             {updating ? <CircularProgress size={20} /> : "Annuler le transfert"}
//                                         </Button>
//                                     )}

//                                     {/* 🔹 Bouton Supprimer */}
//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         size="small"
//                                         onClick={() => deleteSale(sale.ids)}
//                                         disabled={deleting}
//                                         sx={{ minWidth: 100 }}>
//                                         {deleting ? <CircularProgress size={20} /> : "Supprimer"}
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default TicketSalesManagement;
// ==================== perfection ====================================
// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     CircularProgress,
// } from "@mui/material";
// import { IconButton, Tooltip, ButtonGroup } from "@mui/material";
// import { CheckCircle, Cancel, Delete } from "@mui/icons-material";

// const TicketSalesManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);
//     const [deleting, setDeleting] = useState(false);

//     // ✅ Charger les ventes depuis l'API
//     useEffect(() => {
//         const fetchSales = async () => {
//             try {
//                 const response = await fetch("http://localhost:3001/api/tickets/ventes-billets");
//                 const data = await response.json();
//                 console.log("✅ Données récupérées :", data);
//                 setSales(data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération des ventes :", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSales();
//     }, []);

//     // ✅ Regrouper les ventes par Organisateur, Événement et Type de Ticket
//     const groupedSales = sales.reduce((acc, sale) => {
//         const key = `${sale.nom_organisateur}-${sale.nom_evenement}-${sale.type_ticket}`;

//         if (!acc[key]) {
//             acc[key] = {
//                 ids: [], // Stocker les IDs des ventes individuelles
//                 nom_organisateur: sale.nom_organisateur,
//                 nom_evenement: sale.nom_evenement,
//                 type_ticket: sale.type_ticket,
//                 quantite: sale.quantite,
//                 total_billets_vendus: 0,
//                 montant_collecte: 0,
//                 montant_a_transferer: 0,
//                 status_paiement: sale.status_paiement,
//             };
//         }

//         acc[key].ids.push(sale.id); // Ajouter l'ID de la vente au groupe
//         acc[key].total_billets_vendus += sale.total_billets_vendus;
//         acc[key].montant_collecte += sale.montant_collecte;
//         acc[key].montant_a_transferer += sale.montant_a_transferer;

//         return acc;
//     }, {});

//     const groupedSalesArray = Object.values(groupedSales);

//     // ✅ Mettre à jour le statut du paiement pour toutes les ventes du groupe
//     const updatePaymentStatus = async (ids, status) => {
//         setUpdating(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     fetch(`http://localhost:3001/api/tickets/update-paiement/${id}`, {
//                         method: "PUT",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ status_paiement: status }),
//                     })
//                 )
//             );

//             setSales((prevSales) =>
//                 prevSales.map((sale) =>
//                     ids.includes(sale.id) ? { ...sale, status_paiement: status } : sale
//                 )
//             );
//         } catch (error) {
//             console.error("❌ Erreur lors de la mise à jour du paiement :", error);
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // ✅ Supprimer toutes les ventes d’un groupe
//     const deleteSale = async (ids) => {
//         setDeleting(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     fetch(`http://localhost:3001/api/tickets/supprimer-vente/${id}`, {
//                         method: "DELETE",
//                     })
//                 )
//             );

//             setSales((prevSales) => prevSales.filter((sale) => !ids.includes(sale.id)));
//         } catch (error) {
//             console.error("❌ Erreur lors de la suppression de la vente :", error);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     if (loading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
//                 Gestion des ventes de billets
//             </Typography>

//             <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Organisateur</strong></TableCell>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Type de Ticket</strong></TableCell>
//                             <TableCell><strong>Quantité Totale</strong></TableCell>
//                             <TableCell><strong>Billets Vendus</strong></TableCell>
//                             <TableCell><strong>Montant Collecté</strong></TableCell>
//                             <TableCell><strong>Montant Transférable</strong></TableCell>
//                             <TableCell><strong>Statut</strong></TableCell>
//                             <TableCell><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {groupedSalesArray.map((sale, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{sale.nom_organisateur}</TableCell>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite}</TableCell>
//                                 <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="right">{sale.montant_collecte} Ar</TableCell>
//                                 <TableCell align="right">{sale.montant_a_transferer} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Typography
//                                         sx={{
//                                             fontWeight: "bold",
//                                             color: sale.status_paiement === "payé" ? "green" :
//                                                 sale.status_paiement === "annulé" ? "red" : "orange",
//                                             textTransform: "capitalize",
//                                         }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     <ButtonGroup variant="outlined" size="small">
//                                         {/* 🔹 Bouton Transférer */}
//                                         {sale.status_paiement === "en_attente" && (
//                                             <Tooltip title="Confirmer le transfert">
//                                                 <IconButton
//                                                     color="success"
//                                                     onClick={() => updatePaymentStatus(sale.ids, "payé")}
//                                                     disabled={updating}>
//                                                     {updating ? <CircularProgress size={20} /> : <CheckCircle />}
//                                                 </IconButton>
//                                             </Tooltip>
//                                         )}

//                                         {/* 🔹 Bouton Annuler le transfert */}
//                                         {sale.status_paiement === "payé" && (
//                                             <Tooltip title="Annuler le transfert">
//                                                 <IconButton
//                                                     color="warning"
//                                                     onClick={() => updatePaymentStatus(sale.ids, "en_attente")}
//                                                     disabled={updating}>
//                                                     {updating ? <CircularProgress size={20} /> : <Cancel />}
//                                                 </IconButton>
//                                             </Tooltip>
//                                         )}

//                                         {/* 🔹 Bouton Supprimer */}
//                                         <Tooltip title="Supprimer la vente">
//                                             <IconButton
//                                                 color="error"
//                                                 onClick={() => deleteSale(sale.ids)}
//                                                 disabled={deleting}>
//                                                 {deleting ? <CircularProgress size={20} /> : <Delete />}
//                                             </IconButton>
//                                         </Tooltip>
//                                     </ButtonGroup>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default TicketSalesManagement;

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Tooltip,
    ButtonGroup,
    useTheme
} from "@mui/material";
import { CheckCircle, Cancel, Delete } from "@mui/icons-material";

const TicketSalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const theme = useTheme();
    // ✅ Charger les ventes depuis l'API
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/tickets/ventes-billets");
                const data = await response.json();
                console.log("✅ Données récupérées :", data);
                setSales(data);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des ventes :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    // ✅ Regrouper les ventes par Organisateur, Événement et Type de Ticket
    const groupedSales = sales.reduce((acc, sale) => {
        const key = `${sale.nom_organisateur}-${sale.nom_evenement}-${sale.type_ticket}`;

        if (!acc[key]) {
            acc[key] = {
                ids: [],
                nom_organisateur: sale.nom_organisateur,
                nom_evenement: sale.nom_evenement,
                type_ticket: sale.type_ticket,
                quantite: sale.quantite,
                total_billets_vendus: 0,
                prix_unitaire: sale.prix_unitaire,
                montant_collecte: 0,
                montant_a_transferer: 0,
                status_paiement: sale.status_paiement,
            };
        }

        acc[key].ids.push(sale.id);
        acc[key].total_billets_vendus += sale.total_billets_vendus;
        acc[key].montant_collecte += sale.montant_collecte;
        acc[key].montant_a_transferer += sale.montant_a_transferer;

        return acc;
    }, {});

    const groupedSalesArray = Object.values(groupedSales);

    // ✅ Mettre à jour le statut du paiement pour toutes les ventes du groupe
    const updatePaymentStatus = async (ids, status) => {
        setUpdating(true);
        try {
            await Promise.all(
                ids.map((id) =>
                    fetch(`http://localhost:3001/api/tickets/update-paiement/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status_paiement: status }),
                    })
                )
            );

            setSales((prevSales) =>
                prevSales.map((sale) =>
                    ids.includes(sale.id) ? { ...sale, status_paiement: status } : sale
                )
            );
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour du paiement :", error);
        } finally {
            setUpdating(false);
        }
    };

    // ✅ Supprimer toutes les ventes d’un groupe
    const deleteSale = async (ids) => {
        setDeleting(true);
        try {
            await Promise.all(
                ids.map((id) =>
                    fetch(`http://localhost:3001/api/tickets/supprimer-vente/${id}`, {
                        method: "DELETE",
                    })
                )
            );

            setSales((prevSales) => prevSales.filter((sale) => !ids.includes(sale.id)));
        } catch (error) {
            console.error("❌ Erreur lors de la suppression de la vente :", error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold"}} color={theme.palette.mode === "dark" ? "white" : "black"}>
                Gestion des ventes de billets
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5"   }}>
                        <TableRow>
                            <TableCell><strong>Organisateur</strong></TableCell>
                            <TableCell><strong>Événement</strong></TableCell>
                            <TableCell><strong>Ticket</strong></TableCell>
                            <TableCell align="center"><strong>Quantité</strong></TableCell>
                            <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
                            <TableCell align="center"><strong>Billets Restants</strong></TableCell>
                            <TableCell><strong>Prix Unitaire</strong></TableCell>
                            <TableCell align="center"><strong>Encaissement</strong></TableCell>
                            <TableCell align="center"><strong>Décaissement </strong></TableCell>
                            <TableCell align="center"><strong>Statut</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupedSalesArray.map((sale, index) => (
                            <TableRow key={index}>
                                <TableCell>{sale.nom_organisateur}</TableCell>
                                <TableCell>{sale.nom_evenement}</TableCell>
                                <TableCell>{sale.type_ticket}</TableCell>
                                <TableCell align="center">{sale.quantite}</TableCell>
                                <TableCell align="center">{sale.total_billets_vendus}</TableCell>
                                <TableCell align="center">{sale.quantite - sale.total_billets_vendus}</TableCell>
                                <TableCell align="center">{sale.prix_unitaire} Ar</TableCell>
                                <TableCell align="center">{sale.montant_collecte} Ar</TableCell>
                                <TableCell align="center">{sale.montant_a_transferer} Ar</TableCell>
                                <TableCell align="center">
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            color: sale.status_paiement === "payé" ? "green" :
                                                sale.status_paiement === "annulé" ? "red" : "orange",
                                            textTransform: "capitalize",
                                        }}>
                                        {sale.status_paiement}
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    <ButtonGroup variant="outlined" size="small">
                                        {/* 🔹 Bouton Transférer */}
                                        {sale.status_paiement === "en_attente" && (
                                            <Tooltip title="Confirmer le transfert">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => updatePaymentStatus(sale.ids, "payé")}
                                                    disabled={updating}>
                                                    {updating ? <CircularProgress size={20} /> : <CheckCircle />}
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {/* 🔹 Bouton Annuler le transfert */}
                                        {sale.status_paiement === "payé" && (
                                            <Tooltip title="Annuler le transfert">
                                                <IconButton
                                                    color="warning"
                                                    onClick={() => updatePaymentStatus(sale.ids, "en_attente")}
                                                    disabled={updating}>
                                                    {updating ? <CircularProgress size={20} /> : <Cancel />}
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {/* 🔹 Bouton Supprimer */}
                                        <Tooltip title="Supprimer la vente">
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteSale(sale.ids)}
                                                disabled={deleting}>
                                                {deleting ? <CircularProgress size={20} /> : <Delete />}
                                            </IconButton>
                                        </Tooltip>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TicketSalesManagement;
