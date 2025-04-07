//==========================composant initiale ======================
// import React, { useState, useEffect } from "react";
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
// import axios from "axios";
// import DownloadIcon from "@mui/icons-material/Download";
// import * as XLSX from "xlsx";

// const OrganizerTicketManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [updating, setUpdating] = useState(null);
//     const [deleting, setDeleting] = useState(null);

//     useEffect(() => {
//         fetchSales();
//     }, []);

//     const fetchSales = async () => {
//         try {
//             const response = await axios.get("http://localhost:3001/api/admin/ventes-billets");
//             console.log("📢 Données reçues pour l'admin ticket :", response.data);

//             // Vérification : Assurez-vous que chaque vente a un ID valide
//             response.data.forEach((sale) => {
//                 console.log(`📌 Vente ID: ${sale.id}, Ticket: ${sale.type_ticket}, Statut: ${sale.status_paiement}`);
//             });

//             setSales(response.data);
//         } catch (err) {
//             setError("Erreur lors de la récupération des ventes.");
//             console.error("❌ Erreur :", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteSaleGroup = async (saleGroup) => {
//         setDeleting(saleGroup.ids); // Désactive le bouton

//         try {
//             // Supprimer chaque ID lié au groupe (si API supporte la suppression en lot)
//             await Promise.all(saleGroup.ids.map(id => axios.delete(`http://localhost:3001/api/admin/supprimer-vente/${id}`)));

//             // Mettre à jour la liste en enlevant l'ensemble du groupe supprimé
//             setSales(prevSales => prevSales.filter(s => !saleGroup.ids.includes(s.id)));

//             alert("Toutes les ventes de ce groupe ont été supprimées !");
//         } catch (err) {
//             console.error("❌ Erreur lors de la suppression du groupe :", err);
//             alert("Impossible de supprimer ces ventes.");
//         } finally {
//             setDeleting(null);
//         }
//     };

//     const groupSalesByEventAndTicket = (sales) => {
//         return sales.reduce((acc, sale) => {
//             const key = `${sale.nom_evenement}-${sale.type_ticket}`;

//             // 🔹 Extraire types_tickets s'il existe
//             let billetAssocie = null;
//             if (sale.types_tickets) {
//                 try {
//                     const ticketsArray = JSON.parse(sale.types_tickets); // 🔹 Convertir en objet
//                     billetAssocie = ticketsArray.find((ticket) => ticket.type === sale.type_ticket);
//                 } catch (error) {
//                     console.error("❌ Erreur de parsing JSON pour types_tickets :", error);
//                 }
//             }

//             if (!acc[key]) {
//                 acc[key] = {
//                     ids: [sale.id],
//                     nom_organisateur: sale.nom_organisateur,
//                     nom_evenement: sale.nom_evenement,
//                     type_ticket: sale.type_ticket,
//                     quantite: billetAssocie ? billetAssocie.quantite : sale.quantite,
//                     quantite_restante: billetAssocie ? billetAssocie.nbr_ticket_disponible ?? billetAssocie.quantite : sale.quantite - sale.total_billets_vendus,
//                     total_billets_vendus: 0,
//                     prix_unitaire: sale.prix_unitaire,
//                     montant_collecte: 0,
//                     montant_a_transferer: 0,
//                     acheteurs: new Set(),
//                     status_paiement: sale.status_paiement,
//                 };
//             } else {
//                 acc[key].ids.push(sale.id);
//             }

//             // 🔹 Mise à jour des valeurs calculées
//             acc[key].total_billets_vendus += sale.total_billets_vendus;
//             acc[key].montant_collecte += sale.montant_collecte;
//             acc[key].montant_a_transferer += sale.montant_a_transferer;
//             acc[key].acheteurs.add(sale.acheteur);

//             return acc;
//         }, {});
//     };

//       // ✅ Transformation correcte des ventes groupées en tableau
//       const groupedSales = Object.values(groupSalesByEventAndTicket(sales));


//       const exportToExcel = () => {
//         if (groupedSales.length === 0) {
//             alert("Aucune donnée à exporter.");
//             return;
//         }

//         // 🔹 Transformation des données en format tableau pour Excel
//         const dataToExport = groupedSales.map((sale) => ({
//             "Événement": sale.nom_evenement,
//             "Type de Ticket": sale.type_ticket,
//             "Total": sale.quantite,
//             "Prix Unitaire (Ar)": sale.prix_unitaire,
//             "Billets Vendus": sale.total_billets_vendus,
//             "Billets Restants": sale.quantite_restante,
//             "Revenu (Ar)": sale.montant_collecte
//         }));

//         // 🔹 Création d'une feuille Excel
//         const ws = XLSX.utils.json_to_sheet(dataToExport);

//         // 🔹 Création d'un classeur Excel
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Ventes Billets");

//         // 🔹 Téléchargement du fichier Excel
//         XLSX.writeFile(wb, "ventes_billets.xlsx");
//     };


//     if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
//     if (error) return <Typography color="error" align="center">{error}</Typography>;

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#000000" }}>
//                 Gestion des ventes de billets
//             </Typography>
//             <Box sx={{ padding: 3, textAlign: "center" }}>
//                 <Button
//                     variant="contained"
//                     sx={{
//                         mb: 2,
//                         backgroundColor: "#1565C0", // Bleu profond
//                         color: "white",
//                         fontWeight: "bold",
//                         textTransform: "none",
//                         padding: "10px 20px",
//                         borderRadius: "8px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px", // Espacement entre l'icône et le texte
//                         transition: "0.3s",
//                         "&:hover": {
//                             backgroundColor: "#1E88E5", // Bleu clair au survol
//                             boxShadow: "0px 4px 15px rgba(30, 136, 229, 0.3)",
//                         },
//                     }}
//                     onClick={exportToExcel}
//                 >
//                     <DownloadIcon sx={{ fontSize: 22 }} /> {/* 📥 Icône de téléchargement */}
//                     Exporter les données
//                 </Button>
//             </Box>

//             <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Organisateur</strong></TableCell>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Ticket</strong></TableCell>
//                             <TableCell><strong>Quantité</strong></TableCell>
//                             <TableCell><strong>Restants</strong></TableCell>
//                             <TableCell><strong>Achetés</strong></TableCell>
//                             <TableCell><strong>Prix Unit</strong></TableCell>
//                             <TableCell><strong>Total</strong></TableCell>
//                             <TableCell><strong>Révenu</strong></TableCell>
//                             <TableCell><strong>Statut</strong></TableCell>
//                             <TableCell><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {groupedSales.map((sale, index) => (
//                             console.log("🛠️ Debug : Vérification des ventes", groupedSales),

//                             <TableRow key={index}>
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
//                                             color: sale.status_paiement === "payé" ? "green" : sale.status_paiement === "annulé" ? "red" : "orange",
//                                             textTransform: "capitalize",
//                                         }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     {/* 🔹 Bouton Supprimer */}
//                                     <Button
//                                         variant="contained"
//                                         color="error"
//                                         size="small"
//                                         onClick={() => deleteSaleGroup(sale)}
//                                         disabled={deleting === sale.ids}
//                                         sx={{ minWidth: 100 }}>
//                                         {deleting === sale.ids ? <CircularProgress size={20} /> : "Supprimer"}
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

// export default OrganizerTicketManagement;

// import React, { useState, useEffect } from "react";
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
// import axios from "axios";
// import DownloadIcon from "@mui/icons-material/Download";
// import * as XLSX from "xlsx";

// const OrganizerTicketManagement = () => {
//     const [sales, setSales] = useState([]); // Données des ventes
//     const [loading, setLoading] = useState(true); // Indicateur de chargement
//     const [error, setError] = useState(null); // Gestion des erreurs
//     const [deleting, setDeleting] = useState(null);
//     const [activeOrganizer, setActiveOrganizer] = useState(null);
//     // État pour stocker le profil de l'utilisateur
//   const [profile, setProfile] = useState({});

//   // Fonction pour récupérer le profil utilisateur
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem('token'); // Récupérer le token d'authentification
//         const response = await axios.get('http://localhost:3001/api/organizer/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setProfile(response.data); // Met à jour le profil de l'utilisateur avec les données récupérées

//         console.log("Profil de l'organisteur: ", response.data);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
//       }
//     };

//     fetchUserProfile();
//   }, []);


//     useEffect(() => {
//         const fetchSales = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3001/api/admin/ventes-billets', {
//                     headers: { Authorization: `Bearer ${token}`}
//                 });

//                 if (!response.data || response.data.length === 0) {
//                     throw new Error("Aucune donnée reçue");
//                 }

//                 console.log("✅ Données reçues :", response.data);
//                 setSales(response.data);
//                 console.log("🎯 ID de l'organisateur actif :", activeOrganizer);
//                 setSales(response.data);
//             } catch (error) {
//                 console.error("Erreur lors de la récupération des ventes des billets de l'organisteur :", error);
//             }
//         };
//         fetchSales();
//     }, []);


//     const deleteSaleGroup = async (saleGroup) => {
//         setDeleting(saleGroup.ids);
//         try {
//             await axios.delete("http://localhost:3001/api/admin/supprimer-vente", {
//                 data: { ids: saleGroup.ids }
//             });

//             setSales(prevSales => prevSales.filter(s => !saleGroup.ids.includes(s.id)));

//             alert("Tous les achats de ce groupe ont été supprimés !");
//         } catch (err) {
//             console.error("❌ Erreur lors de la suppression du groupe :", err);
//             alert("Impossible de supprimer ces achats.");
//         } finally {
//             setDeleting(null);
//         }
//     };

//     const groupSalesByEventAndTicket = (sales) => {
//         return sales.reduce((acc, sale) => {
//             if (!activeOrganizer || sale.organizer_id !== activeOrganizer) return acc;

//             const key = `${sale.nom_evenement}-${sale.type_ticket}`;
//             let billetAssocie = null;

//             if (sale.types_tickets) {
//                 try {
//                     const ticketsArray = JSON.parse(sale.types_tickets);
//                     billetAssocie = ticketsArray.find((ticket) => ticket.type === sale.type_ticket);
//                 } catch (error) {
//                     console.error("❌ Erreur de parsing JSON pour types_tickets :", error);
//                 }
//             }

//             if (!acc[key]) {
//                 acc[key] = {
//                     ids: [sale.id], 
//                     nom_organisateur: sale.nom_organisateur,
//                     nom_evenement: sale.nom_evenement,
//                     type_ticket: sale.type_ticket,
//                     quantite: billetAssocie ? billetAssocie.quantite : sale.quantite,
//                     quantite_restante: billetAssocie ? billetAssocie.nbr_ticket_disponible ?? billetAssocie.quantite : sale.quantite - sale.total_billets_vendus,
//                     total_billets_vendus: sale.total_billets_vendus,
//                     prix_unitaire: sale.prix_unitaire,
//                     montant_collecte: sale.montant_collecte,
//                     montant_a_transferer: sale.montant_a_transferer,
//                     status_paiement: sale.status_paiement,
//                 };
//             } else {
//                 acc[key].ids.push(sale.id);
//             }

//             return acc;
//         }, {});
//     };

//     const filteredSales = activeOrganizer
//         ? sales.filter(sale => sale.organizer_id === activeOrganizer)
//         : sales;

//     const groupedSales = Object.values(groupSalesByEventAndTicket(filteredSales));

//     const exportToExcel = () => {
//         if (groupedSales.length === 0) {
//             alert("Aucune donnée à exporter.");
//             return;
//         }

//         const dataToExport = groupedSales.map((sale) => ({
//             "Événement": sale.nom_evenement,
//             "Type de Ticket": sale.type_ticket,
//             "Total": sale.quantite,
//             "Prix Unitaire (Ar)": sale.prix_unitaire,
//             "Billets Vendus": sale.total_billets_vendus,
//             "Billets Restants": sale.quantite_restante,
//             "Revenu (Ar)": sale.montant_collecte
//         }));

//         const ws = XLSX.utils.json_to_sheet(dataToExport);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Ventes Billets");
//         XLSX.writeFile(wb, "ventes_billets.xlsx");
//     };

//     if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
//     if (error) return <Typography color="error" align="center">{error}</Typography>;

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//                 Gestion des ventes de billets
//             </Typography>
//             <Box sx={{ padding: 3, textAlign: "center" }}>
//                 <Button
//                     variant="contained"
//                     sx={{
//                         mb: 2,
//                         backgroundColor: "#1565C0",
//                         color: "white",
//                         fontWeight: "bold",
//                         textTransform: "none",
//                         padding: "10px 20px",
//                         borderRadius: "8px",
//                         "&:hover": { backgroundColor: "#1E88E5" },
//                     }}
//                     onClick={exportToExcel}
//                 >
//                     <DownloadIcon sx={{ fontSize: 22 }} />
//                     Exporter les données
//                 </Button>
//             </Box>

//             {groupedSales.length === 0 ? (
//                 <Typography align="center" sx={{ mt: 3 }}>Aucune vente disponible.</Typography>
//             ) : (
//                 <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                     <Table>
//                         <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                             <TableRow>
//                                 <TableCell><strong>Événement</strong></TableCell>
//                                 <TableCell><strong>Ticket</strong></TableCell>
//                                 <TableCell><strong>Quantité</strong></TableCell>
//                                 <TableCell><strong>Restants</strong></TableCell>
//                                 <TableCell><strong>Achetés</strong></TableCell>
//                                 <TableCell><strong>Prix</strong></TableCell>
//                                 <TableCell><strong>Actions</strong></TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {groupedSales.map((sale, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell>{sale.nom_evenement}</TableCell>
//                                     <TableCell>{sale.type_ticket}</TableCell>
//                                     <TableCell align="center">{sale.quantite}</TableCell>
//                                     <TableCell align="center">{sale.quantite_restante}</TableCell>
//                                     <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                     <TableCell align="right">{sale.prix_unitaire} Ar</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}
//         </Box>
//     );
// };

// export default OrganizerTicketManagement;

// import React, { useState, useEffect } from "react";
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
//     Tooltip,
//     IconButton,
// } from "@mui/material";
// import axios from "axios";
// import DownloadIcon from "@mui/icons-material/Download";
// import DeleteIcon from "@mui/icons-material/Delete";
// import * as XLSX from "xlsx";

// const OrganizerTicketManagement = () => {
//     const [sales, setSales] = useState([]); // Données des ventes
//     const [loading, setLoading] = useState(true); // Indicateur de chargement
//     const [error, setError] = useState(null); // Gestion des erreurs
//     const [deleting, setDeleting] = useState(null);
//     const [activeOrganizer, setActiveOrganizer] = useState(null);
//     const [profile, setProfile] = useState({}); // Stockage du profil utilisateur

//     // Récupérer le profil de l'utilisateur connecté
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 const token = localStorage.getItem('token'); 
//                 const response = await axios.get('http://localhost:3001/api/organizer/profile', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 setProfile(response.data);
//                 setActiveOrganizer(response.data.name); // 🔹 Stocker le NOM de l'organisateur
//                 console.log("✅ Profil de l'organisateur :", response.data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération du profil :", error);
//             }
//         };

//         fetchUserProfile();
//     }, []);

//     // Récupérer les ventes de billets
//     useEffect(() => {
//         if (activeOrganizer) {
//             fetchSales();
//         }
//     }, [activeOrganizer]);

//     const fetchSales = async () => {
//         setLoading(true);
//         try {
//             console.log("📢 Tentative de récupération des ventes...");
//             const token = localStorage.getItem('token');
//             const response = await axios.get('http://localhost:3001/api/admin/ventes-billets', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (!response.data || response.data.length === 0) {
//                 throw new Error("Aucune donnée reçue");
//             }

//             console.log("✅ Données reçues :", response.data);
//             setSales(response.data);
//         } catch (error) {
//             setError("❌ Impossible de récupérer les ventes.");
//             console.error("Erreur lors de la récupération des ventes :", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteSaleGroup = async (saleGroup) => {
//         setDeleting(saleGroup.ids);
//         try {
//             await axios.delete("http://localhost:3001/api/admin/supprimer-vente", {
//                 data: { ids: saleGroup.ids }
//             });

//             setSales(prevSales => prevSales.filter(s => !saleGroup.ids.includes(s.id)));

//             alert("Tous les achats de ce groupe ont été supprimés !");
//         } catch (err) {
//             console.error("❌ Erreur lors de la suppression du groupe :", err);
//             alert("Impossible de supprimer ces achats.");
//         } finally {
//             setDeleting(null);
//         }
//     };

//     // 🔹 Filtrage des ventes par NOM de l'organisateur
//     const filteredSales = activeOrganizer
//         ? sales.filter(sale => sale.nom_organisateur === activeOrganizer)
//         : [];

//     // 🔹 Grouper les ventes par événement et type de ticket
//     const groupSalesByEventAndTicket = (sales) => {
//         return sales.reduce((acc, sale) => {
//             const key = `${sale.nom_evenement}-${sale.type_ticket}`;
//             let billetAssocie = null;

//             if (sale.types_tickets) {
//                 try {
//                     const ticketsArray = JSON.parse(sale.types_tickets);
//                     billetAssocie = ticketsArray.find((ticket) => ticket.type === sale.type_ticket);
//                 } catch (error) {
//                     console.error("❌ Erreur de parsing JSON pour types_tickets :", error);
//                 }
//             }

//             if (!acc[key]) {
//                 acc[key] = {
//                     ids: [sale.id], 
//                     nom_organisateur: sale.nom_organisateur,
//                     nom_evenement: sale.nom_evenement,
//                     type_ticket: sale.type_ticket,
//                     quantite: billetAssocie ? billetAssocie.quantite : sale.quantite,
//                     quantite_restante: billetAssocie ? billetAssocie.nbr_ticket_disponible ?? billetAssocie.quantite : sale.quantite - sale.total_billets_vendus,
//                     total_billets_vendus: sale.total_billets_vendus,
//                     prix_unitaire: sale.prix_unitaire,
//                     montant_collecte: sale.montant_collecte,
//                     montant_a_transferer: sale.montant_a_transferer,
//                     status_paiement: sale.status_paiement,
//                 };
//             } else {
//                 acc[key].ids.push(sale.id);
//             }

//             return acc;
//         }, {});
//     };

//     const groupedSales = Object.values(groupSalesByEventAndTicket(filteredSales));

//     const exportToExcel = () => {
//         if (groupedSales.length === 0) {
//             alert("Aucune donnée à exporter.");
//             return;
//         }

//         const dataToExport = groupedSales.map((sale) => ({
//             "Événement": sale.nom_evenement,
//             "Type de Ticket": sale.type_ticket,
//             "Total": sale.quantite,
//             "Prix Unitaire (Ar)": sale.prix_unitaire,
//             "Billets Vendus": sale.total_billets_vendus,
//             "Billets Restants": sale.quantite_restante,
//             "Revenu (Ar)": sale.montant_collecte
//         }));

//         const ws = XLSX.utils.json_to_sheet(dataToExport);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Ventes Billets");
//         XLSX.writeFile(wb, "ventes_billets.xlsx");
//     };

//     if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
//     if (error) return <Typography color="error" align="center">{error}</Typography>;

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//                 Gestion des ventes de billets
//             </Typography>
//             <Box sx={{ padding: 3, textAlign: "center" }}>
//                 <Button
//                     variant="contained"
//                     sx={{
//                         mb: 2,
//                         backgroundColor: "#1565C0",
//                         color: "white",
//                         fontWeight: "bold",
//                         textTransform: "none",
//                         padding: "10px 20px",
//                         borderRadius: "8px",
//                         "&:hover": { backgroundColor: "#1E88E5" },
//                     }}
//                     onClick={exportToExcel}
//                 >
//                     <DownloadIcon sx={{ fontSize: 22 }} />
//                     Exporter les données
//                 </Button>
//             </Box>

//             {groupedSales.length === 0 ? (
//                 <Typography align="center" sx={{ mt: 3 }}>Aucune vente disponible.</Typography>
//             ) : (
//                 <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                     <Table>
//                         <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Ticket</strong></TableCell>
//                             <TableCell align="center"><strong>Quantité</strong></TableCell>
//                             <TableCell align="right"><strong>Prix Unit</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Restants</strong></TableCell>
//                             <TableCell align="right"><strong>Revenu Généré</strong></TableCell>
//                             <TableCell align="center"><strong>Actions</strong></TableCell>
//                         </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {groupedSales.map((sale, index) => (
//                                 <TableRow key={index}>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite_initiale}</TableCell>
//                                 <TableCell align="right">{sale.prix_unitaire} Ar</TableCell>
//                                 <TableCell align="center">{sale.billets_vendus}</TableCell>
//                                 <TableCell align="center">{sale.billets_restants}</TableCell>
//                                 <TableCell align="right">{sale.revenu_genere} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Tooltip title="Supprimer" arrow>
//                                         <IconButton
//                                             color="error"
//                                             sx={{ transition: "0.2s", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }}
//                                             onClick={() => deleteSaleGroup(sale)}
//                                             disabled={deleting && deleting.some(id => sale.ids.includes(id))}
//                                         >
//                                             {deleting && deleting.some(id => sale.ids.includes(id)) ? (
//                                                 <CircularProgress size={20} />
//                                             ) : (
//                                                 <DeleteIcon />
//                                             )}
//                                         </IconButton>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}
//         </Box>
//     );
// };

// export default OrganizerTicketManagement;

// import React, { useState, useEffect } from "react";
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
//     Tooltip,
//     IconButton,
// } from "@mui/material";
// import axios from "axios";
// import DownloadIcon from "@mui/icons-material/Download";
// import DeleteIcon from "@mui/icons-material/Delete";
// import * as XLSX from "xlsx";
// import { Alert, AlertTitle } from "@mui/material";

// const OrganizerTicketManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [deleting, setDeleting] = useState(null);
//     const [activeOrganizer, setActiveOrganizer] = useState(null);
//     const [profile, setProfile] = useState({});

//     // 🔹 Récupérer le profil utilisateur
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3001/api/organizer/profile', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 setProfile(response.data);
//                 setActiveOrganizer(response.data.name);
//                 console.log("✅ Profil de l'organisateur :", response.data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération du profil :", error);
//             }
//         };

//         fetchUserProfile();
//     }, []);

//     // 🔹 Récupérer les ventes
//     useEffect(() => {
//         if (activeOrganizer) {
//             fetchSales();
//         }
//     }, [activeOrganizer]);

//     const fetchSales = async () => {
//         setLoading(true);
//         try {
//             console.info("📢 Tentative de récupération des ventes...");

//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error("Authentification requise. Veuillez vous reconnecter.");
//             }

//             const response = await axios.get('http://localhost:3001/api/admin/ventes-billets', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (!response.data || response.data.length === 0) {
//                 throw new Error("Aucune vente de billets enregistrée.");
//             }

//             console.info("✅ Données reçues :", response.data);
//             setSales(response.data);
//             setError(null); // Réinitialisation en cas de succès

//         } catch (error) {
//             let errorMessage = "Impossible de récupérer les ventes. Veuillez réessayer plus tard.";

//             if (error.response) {
//                 // Erreur avec réponse du serveur
//                 if (error.response.status === 401) {
//                     errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
//                 } else if (error.response.status === 403) {
//                     errorMessage = "Vous n'avez pas les autorisations nécessaires pour voir ces données.";
//                 } else if (error.response.status === 404) {
//                     errorMessage = "Les données de vente ne sont pas disponibles.";
//                 }
//             } else if (error.message) {
//                 // Erreur générée par JavaScript (ex: réseau, token manquant)
//                 errorMessage = error.message;
//             }

//             setError(errorMessage);
//             console.error("❌ Erreur lors de la récupération des ventes :", error);

//         } finally {
//             setLoading(false);
//         }

//         // Affichage du message d'erreur
//         {error && (
//             <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
//                 <AlertTitle><strong>Aucun achat de billets en ce moment!</strong></AlertTitle>
//                 {error}
//             </Alert>
//         )}

//     };

//     // 🔹 Supprimer une vente groupée
//     const deleteSaleGroup = async (saleGroup) => {
//         setDeleting(saleGroup.ids);
//         try {
//             await axios.delete("http://localhost:3001/api/admin/supprimer-vente", {
//                 data: { ids: saleGroup.ids }
//             });

//             setSales(prevSales => prevSales.filter(s => !saleGroup.ids.includes(s.id)));

//             alert("Vente supprimée !");
//         } catch (err) {
//             console.error("❌ Erreur lors de la suppression :", err);
//             alert("Impossible de supprimer cette vente.");
//         } finally {
//             setDeleting(null);
//         }
//     };

//     // 🔹 Filtrage des ventes par NOM de l'organisateur
//     const filteredSales = activeOrganizer
//         ? sales.filter(sale => sale.nom_organisateur === activeOrganizer)
//         : [];

//     // 🔹 Regroupement des ventes par événement et type de ticket
//     const groupedSales = filteredSales.reduce((acc, sale) => {
//         const key = `${sale.nom_evenement}-${sale.type_ticket}`;

//         if (!acc[key]) {
//             acc[key] = {
//                 ids: [sale.id], // Stocker les IDs pour suppression groupée
//                 nom_evenement: sale.nom_evenement,
//                 type_ticket: sale.type_ticket,
//                 quantite: sale.quantite,
//                 billets_vendus: sale.total_billets_vendus,
//                 billets_restants: sale.quantite - sale.total_billets_vendus,
//                 prix_unitaire: sale.prix_unitaire,
//                 revenu_genere: sale.montant_collecte || 0, // Vérification si null
//             };
//         } else {
//             // Si une entrée existe déjà, on cumule les valeurs
//             acc[key].ids.push(sale.id);
//             acc[key].quantite += sale.quantite;
//             acc[key].billets_vendus += sale.total_billets_vendus;
//             acc[key].billets_restants += sale.quantite - sale.total_billets_vendus;
//             acc[key].revenu_genere += sale.montant_collecte || 0;
//         }

//         return acc;
//     }, {});

//     const formattedSales = Object.values(groupedSales);

//     // 🔹 Exporter les ventes en Excel
//     const exportToExcel = () => {
//         if (formattedSales.length === 0) {
//             alert("Aucune donnée à exporter.");
//             return;
//         }

//         const dataToExport = formattedSales.map((sale) => ({
//             "Événement": sale.nom_evenement,
//             "Type de Ticket": sale.type_ticket,
//             "Quantité Totale": sale.quantite,
//             "Prix Unitaire (Ar)": sale.prix_unitaire,
//             "Billets Vendus": sale.billets_vendus,
//             "Billets Restants": sale.billets_restants,
//             "Revenu (Ar)": sale.revenu_genere
//         }));

//         const ws = XLSX.utils.json_to_sheet(dataToExport);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Ventes Billets");
//         XLSX.writeFile(wb, "ventes_billets.xlsx");
//     };

//     if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
//     if (error) return <Typography color="error" align="center">{error}</Typography>;

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//                 Gestion des ventes de billets
//             </Typography>
//             <Box sx={{ padding: 3, textAlign: "center" }}>
//                 <Button
//                     variant="contained"
//                     sx={{ mb: 2, backgroundColor: "#1565C0", color: "white", fontWeight: "bold" }}
//                     onClick={exportToExcel}
//                 >
//                     <DownloadIcon sx={{ fontSize: 22 }} />
//                     Exporter les données
//                 </Button>
//             </Box>

//             <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Ticket</strong></TableCell>
//                             <TableCell align="center"><strong>Quantité</strong></TableCell>
//                             <TableCell align="right"><strong>Prix Unit</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Restants</strong></TableCell>
//                             <TableCell align="right"><strong>Revenu Généré</strong></TableCell>
//                             <TableCell align="center"><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {formattedSales.map((sale, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite}</TableCell>
//                                 <TableCell align="right">{sale.prix_unitaire} Ar</TableCell>
//                                 <TableCell align="center">{sale.billets_vendus}</TableCell>
//                                 <TableCell align="center">{sale.billets_restants}</TableCell>
//                                 <TableCell align="right">{sale.revenu_genere} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Tooltip title="Supprimer" arrow>
//                                         <IconButton color="error" onClick={() => deleteSaleGroup(sale)}>
//                                             <DeleteIcon />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default OrganizerTicketManagement;

// ==============COMPOSANT FINALE===================================
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
//     CircularProgress,
//     IconButton,
//     Tooltip,
//     ButtonGroup,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     Button
// } from "@mui/material";
// import { CheckCircle, Cancel, Delete } from "@mui/icons-material";
// import axios from "axios";

// const OrganizerTicketManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);
//     const [deleting, setDeleting] = useState(false);
//     const [organizerName, setOrganizerName] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [saleToDelete, setSaleToDelete] = useState(null);

//     // ✅ Charger le profil de l'organisateur connecté
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3001/api/organizer/profile', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setOrganizerName(response.data.name);
//                 console.log("✅ Profil récupéré :", response.data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération du profil :", error);
//             }
//         };

//         fetchProfile();
//     }, []);

//     // ✅ Charger les ventes depuis l'API une fois l'organisateur connu
//     useEffect(() => {
//         if (organizerName) {
//             fetchSales();
//         }
//     }, [organizerName]);

//     const fetchSales = async () => {
//         try {
//             const response = await axios.get("http://localhost:3001/api/tickets/ventes-billets");
//             const data = response.data;

//             // ✅ Filtrer les ventes pour n'afficher que celles de l'organisateur connecté
//             const filteredSales = data.filter(sale => sale.nom_organisateur === organizerName);

//             console.log("✅ Données récupérées :", filteredSales);
//             setSales(filteredSales);
//         } catch (error) {
//             console.error("❌ Erreur lors de la récupération des ventes :", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Regrouper les ventes par Événement et Type de Ticket
//     const groupedSales = sales.reduce((acc, sale) => {
//         const key = `${sale.nom_evenement}-${sale.type_ticket}`;

//         if (!acc[key]) {
//             acc[key] = {
//                 ids: [],
//                 nom_evenement: sale.nom_evenement,
//                 type_ticket: sale.type_ticket,
//                 quantite: sale.quantite,
//                 total_billets_vendus: 0,
//                 prix_unitaire: sale.prix_unitaire,
//                 montant_collecte: 0,
//                 montant_a_transferer: 0,
//                 status_paiement: sale.status_paiement,
//             };
//         }

//         acc[key].ids.push(sale.id);
//         acc[key].total_billets_vendus += sale.total_billets_vendus;
//         acc[key].montant_collecte += sale.montant_collecte;
//         acc[key].montant_a_transferer += sale.montant_a_transferer;

//         return acc;
//     }, {});

//     const groupedSalesArray = Object.values(groupedSales);

//     // ✅ Mettre à jour le statut du paiement
//     const updatePaymentStatus = async (ids, status) => {
//         setUpdating(true);
//         try {
//             await Promise.all(
//                 ids.map((id) =>
//                     axios.put(`http://localhost:3001/api/tickets/update-paiement/${id}`, {
//                         status_paiement: status,
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

//     // ✅ Ouvrir la boîte de confirmation avant suppression
//     const confirmDelete = (sale) => {
//         setSaleToDelete(sale);
//         setOpenDialog(true);
//     };

//     // ✅ Supprimer une vente après confirmation
//     const deleteSale = async () => {
//         if (!saleToDelete) return;
//         setDeleting(true);
//         setOpenDialog(false);

//         try {
//             await axios.delete(`http://localhost:3001/api/tickets/supprimer-vente/${saleToDelete.ids[0]}`);
//             setSales((prevSales) => prevSales.filter(sale => !saleToDelete.ids.includes(sale.id)));
//         } catch (error) {
//             console.error("❌ Erreur lors de la suppression de la vente :", error);
//         } finally {
//             setDeleting(false);
//             setSaleToDelete(null);
//         }
//     };

//     if (loading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
//                 Mes ventes de billets
//             </Typography>

//             <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Ticket</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
//                             <TableCell align="center"><strong>Revenu</strong></TableCell>
//                             <TableCell align="center"><strong>Statut</strong></TableCell>
//                             <TableCell align="center"><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {groupedSalesArray.map((sale, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="center">{sale.montant_collecte} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Typography sx={{
//                                         fontWeight: "bold",
//                                         color: sale.status_paiement === "payé" ? "green" : "orange",
//                                         textTransform: "capitalize",
//                                     }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     <Tooltip title="Supprimer">
//                                         <IconButton color="error" onClick={() => confirmDelete(sale)}>
//                                             <Delete />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Boîte de dialogue de confirmation */}
//             <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//                 <DialogTitle>Confirmation</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>Voulez-vous vraiment supprimer cette vente ?</DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
//                     <Button onClick={deleteSale} color="error">Supprimer</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default OrganizerTicketManagement;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
//     CircularProgress,
//     IconButton,
//     Tooltip,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     Button
// } from "@mui/material";
// import { Delete } from "@mui/icons-material";
// import axios from "axios";

// const OrganizerTicketManagement = () => {
//     const [sales, setSales] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [deleting, setDeleting] = useState(false);
//     const [organizerName, setOrganizerName] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [saleToDelete, setSaleToDelete] = useState(null);

//     // ✅ Charger le profil de l'organisateur connecté
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3001/api/organizer/profile', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setOrganizerName(response.data.name);
//                 console.log("✅ Profil récupéré :", response.data);
//             } catch (error) {
//                 console.error("❌ Erreur lors de la récupération du profil :", error);
//             }
//         };

//         fetchProfile();
//     }, []);

//     // ✅ Charger les ventes depuis l'API une fois l'organisateur connu
//     useEffect(() => {
//         if (organizerName) {
//             fetchSales();
//         }
//     }, [organizerName]);

//     const fetchSales = async () => {
//         try {
//             const response = await axios.get("http://localhost:3001/api/tickets/ventes-billets");
//             const data = response.data;

//             // ✅ Filtrer les ventes pour n'afficher que celles de l'organisateur connecté
//             const filteredSales = data.filter(sale => sale.nom_organisateur === organizerName);

//             console.log("✅ Données récupérées :", filteredSales);
//             setSales(filteredSales);
//         } catch (error) {
//             console.error("❌ Erreur lors de la récupération des ventes :", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Ouvrir la boîte de confirmation avant suppression
//     const confirmDelete = (sale) => {
//         setSaleToDelete(sale);
//         setOpenDialog(true);
//     };

//     // ✅ Supprimer une vente après confirmation
//     const deleteSale = async () => {
//         if (!saleToDelete) return;
//         setDeleting(true);
//         setOpenDialog(false);

//         try {
//             await axios.delete(`http://localhost:3001/api/tickets/supprimer-vente/${saleToDelete.id}`);

//             // ✅ Supprimer immédiatement l'élément sans nécessiter plusieurs clics
//             setSales((prevSales) => prevSales.filter(sale => sale.id !== saleToDelete.id));

//             console.log("✅ Vente supprimée :", saleToDelete);
//         } catch (error) {
//             console.error("❌ Erreur lors de la suppression de la vente :", error);
//         } finally {
//             setDeleting(false);
//             setSaleToDelete(null);
//         }
//     };

//     if (loading) {
//         return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
//     }

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
//                 Mes ventes de billets
//             </Typography>

//             <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
//                 <Table>
//                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableRow>
//                             <TableCell><strong>Événement</strong></TableCell>
//                             <TableCell><strong>Ticket</strong></TableCell>
//                             <TableCell align="center"><strong>Quantité</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
//                             <TableCell align="center"><strong>Billets Restants</strong></TableCell>
//                             <TableCell align="center"><strong>Prix Unitaire</strong></TableCell>
//                             <TableCell align="center"><strong>Encaissement</strong></TableCell>
//                             <TableCell align="center"><strong>Statut</strong></TableCell>
//                             <TableCell align="center"><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {sales.map((sale, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{sale.nom_evenement}</TableCell>
//                                 <TableCell>{sale.type_ticket}</TableCell>
//                                 <TableCell align="center">{sale.quantite}</TableCell>
//                                 <TableCell align="center">{sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="center">{sale.quantite - sale.total_billets_vendus}</TableCell>
//                                 <TableCell align="center">{sale.prix_unitaire} Ar</TableCell>
//                                 <TableCell align="center">{sale.montant_collecte} Ar</TableCell>
//                                 <TableCell align="center">
//                                     <Typography sx={{
//                                         fontWeight: "bold",
//                                         color: sale.status_paiement === "payé" ? "green" : "orange",
//                                         textTransform: "capitalize",
//                                     }}>
//                                         {sale.status_paiement}
//                                     </Typography>
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     <Tooltip title="Supprimer">
//                                         <IconButton
//                                             color="error"
//                                             onClick={() => confirmDelete(sale)}
//                                             disabled={deleting}
//                                         >
//                                             <Delete />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Boîte de dialogue de confirmation */}
//             <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//                 <DialogTitle>Confirmation</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>Voulez-vous vraiment supprimer cette vente ?</DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
//                     <Button onClick={deleteSale} color="error">Supprimer</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default OrganizerTicketManagement;
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button, 
    useTheme
} from "@mui/material";
import { Delete, DownloadDone } from "@mui/icons-material";
import axios from "axios";
import * as XLSX from "xlsx";

const OrganizerTicketManagement = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [organizerName, setOrganizerName] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);

    const theme = useTheme();

    // ✅ Charger le profil de l'organisateur connecté
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/organizer/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrganizerName(response.data.name);
                console.log("✅ Profil récupéré :", response.data);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération du profil :", error);
            }
        };

        fetchProfile();
    }, []);

    // ✅ Charger les ventes depuis l'API une fois l'organisateur connu
    useEffect(() => {
        if (organizerName) {
            fetchSales();
        }
    }, [organizerName]);

    const fetchSales = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/tickets/ventes-billets");
            const data = response.data;

            // ✅ Filtrer les ventes pour n'afficher que celles de l'organisateur connecté
            const filteredSales = data.filter(sale => sale.nom_organisateur === organizerName);

            console.log("✅ Données récupérées :", filteredSales);
            setSales(filteredSales);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des ventes :", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Regrouper les billets par Événement et Type de Ticket
    const groupedSales = sales.reduce((acc, sale) => {
        const key = `${sale.nom_evenement}-${sale.type_ticket}`;

        if (!acc[key]) {
            acc[key] = {
                ids: [],
                nom_evenement: sale.nom_evenement,
                type_ticket: sale.type_ticket,
                quantite_totale: sale.quantite,
                total_billets_vendus: 0,
                total_montant_collecte: 0,
                prix_unitaire: sale.prix_unitaire,
                status_paiement: sale.status_paiement,
            };
        }

        acc[key].ids.push(sale.id);
        acc[key].total_billets_vendus += sale.total_billets_vendus;
        acc[key].total_montant_collecte += sale.montant_collecte;

        return acc;
    }, {});

    const groupedSalesArray = Object.values(groupedSales);

    // ✅ Ouvrir la boîte de confirmation avant suppression
    const confirmDelete = (sale) => {
        setSaleToDelete(sale);
        setOpenDialog(true);
    };

    // ✅ Supprimer un groupe de billets après confirmation
    const deleteSale = async () => {
        if (!saleToDelete) return;
        setDeleting(true);
        setOpenDialog(false);

        try {
            await Promise.all(
                saleToDelete.ids.map((id) =>
                    axios.delete(`http://localhost:3001/api/tickets/supprimer-vente/${id}`)
                )
            );

            // ✅ Supprimer immédiatement le groupe sans nécessiter plusieurs clics
            setSales((prevSales) => prevSales.filter(sale => !saleToDelete.ids.includes(sale.id)));

            console.log("✅ Groupe de billets supprimé :", saleToDelete);
        } catch (error) {
            console.error("❌ Erreur lors de la suppression :", error);
        } finally {
            setDeleting(false);
            setSaleToDelete(null);
        }
    };


    // ✅ Exporter les ventes en Excel
    const exportToExcel = () => {
        if (groupedSalesArray.length === 0) {
            alert("Aucune donnée à exporter.");
            return;
        }

        const dataToExport = groupedSalesArray.map((sale) => ({
            "Événement": sale.nom_evenement,
            "Type de Ticket": sale.type_ticket,
            "Quantité Totale": sale.quantite_totale,
            "Billets Vendus": sale.total_billets_vendus,
            "Billets Restants": sale.quantite_totale - sale.total_billets_vendus,
            "Prix Unitaire (Ar)": sale.prix_unitaire,
            "Encaissement (Ar)":  Math.round(sale.total_montant_collecte * 0.95),
            "Statut": sale.status_paiement,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ventes Billets");
        XLSX.writeFile(wb, "ventes_billets.xlsx");
    };


    if (loading) {
        return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }} color={theme.palette.mode === "dark" ? "white" : "black"}>
                Mes ventes de billets
            </Typography>
            {/* ✅ Bouton pour exporter les données Excel */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadDone/> }
                sx={{ mb: 2 }}
                onClick={exportToExcel}
            >
                Exporter en Excel
            </Button>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5"  }}>
                        <TableRow>
                            <TableCell><strong>Événement</strong></TableCell>
                            <TableCell><strong>Ticket</strong></TableCell>
                            <TableCell align="center"><strong>Quantité</strong></TableCell>
                            <TableCell align="center"><strong>Billets Vendus</strong></TableCell>
                            <TableCell align="center"><strong>Billets Restants</strong></TableCell>
                            <TableCell align="center"><strong>Prix Unitaire</strong></TableCell>
                            <TableCell align="center"><strong>Encaissement</strong></TableCell>
                            <TableCell align="center"><strong>Statut</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupedSalesArray.map((sale, index) => (
                            <TableRow key={index}>
                                <TableCell>{sale.nom_evenement}</TableCell>
                                <TableCell>{sale.type_ticket}</TableCell>
                                <TableCell align="center">{sale.quantite_totale}</TableCell>
                                <TableCell align="center">{sale.total_billets_vendus}</TableCell>
                                <TableCell align="center">{sale.quantite_totale - sale.total_billets_vendus}</TableCell>
                                <TableCell align="center">{sale.prix_unitaire} Ar</TableCell>
                                <TableCell align="center">{Math.round(sale.total_montant_collecte * 0.95)} Ar</TableCell>
                                <TableCell align="center">
                                    <Typography sx={{
                                        fontWeight: "bold",
                                        color: sale.status_paiement === "payé" ? "green" : "orange",
                                        textTransform: "capitalize",
                                    }}>
                                        {sale.status_paiement}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Supprimer">
                                        <IconButton
                                            color="error"
                                            onClick={() => confirmDelete(sale)}
                                            disabled={deleting}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Boîte de dialogue de confirmation */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Voulez-vous vraiment supprimer ce groupe de ventes ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button onClick={deleteSale} color="error">Supprimer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrganizerTicketManagement;













