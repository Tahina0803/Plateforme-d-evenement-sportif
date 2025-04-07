// import React, { useRef } from "react";
// import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { FileDownload } from "@mui/icons-material";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const CertificatePreview = ({ certificate, open, onClose }) => {
//   const certificateRef = useRef(null);

//   // 📥 Télécharger le certificat en PDF
//   const downloadPDF = async () => {
//     if (!certificateRef.current) return;

//     const canvas = await html2canvas(certificateRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape");
//     pdf.addImage(imgData, "PNG", 10, 10, 280, 180);
//     pdf.save(`Certificat_${certificate.nom_titulaire}.pdf`);

//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Aperçu du Certificat</DialogTitle>
//       <DialogContent>
//         {certificate && (
//           <Box ref={certificateRef} sx={{ p: 3, textAlign: "center", backgroundColor: "#fff", borderRadius: "10px" }}>
//             <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
//               🎖️ CERTIFICAT DE PARTICIPATION
//             </Typography>
//             <Typography variant="h6">Décerné à</Typography>
//             <Typography variant="h5" sx={{ color: "green", fontWeight: "bold" }}>
//               {certificate.nom_titulaire}
//             </Typography>
//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Pour sa participation à l'événement :
//             </Typography>
//             <Typography variant="h5" sx={{ color: "blue", fontWeight: "bold" }}>
//               {certificate.nom_event}
//             </Typography>
//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Date : {new Date(certificate.date_distribution).toLocaleDateString()}
//             </Typography>

//             {/* QR Code de vérification */}
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//               <QRCodeCanvas
//                 value={`https://mon-site.com/verifier-certificat/${certificate.id_certificat}`}
//                 size={120}
//               />
//             </Box>

//             <Typography variant="body2" sx={{ mt: 2 }}>
//               Scannez ce QR Code pour vérifier l'authenticité du certificat.
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Fermer
//         </Button>
//         <Button onClick={downloadPDF} color="primary" startIcon={<FileDownload />}>
//           Télécharger
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CertificatePreview;
// import React, { useRef } from "react";
// import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { FileDownload } from "@mui/icons-material";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const CertificatePreview = ({ certificate, open, onClose }) => {
//   const certificateRef = useRef(null);

//   // 📥 Télécharger le certificat en PDF
//   const downloadPDF = async () => {
//     if (!certificateRef.current) return;

//     const canvas = await html2canvas(certificateRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape");
//     pdf.addImage(imgData, "PNG", 10, 10, 280, 180);
//     pdf.save(`Certificat_${certificate.nom_titulaire}.pdf`);

//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Aperçu du Certificat</DialogTitle>
//       <DialogContent>
//         {certificate && (
//           <Box
//             ref={certificateRef}
//             sx={{
//               p: 3,
//               textAlign: "center",
//               backgroundColor: "#fff",
//               borderRadius: "10px",
//               border: "2px solid #000",
//               maxWidth: "600px",
//               margin: "auto"
//             }}
//           >
//             <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
//               🎖️ CERTIFICAT DE PARTICIPATION
//             </Typography>

//             <Typography variant="h6">Décerné à</Typography>
//             <Typography variant="h5" sx={{ color: "green", fontWeight: "bold" }}>
//               {certificate.nom_titulaire}
//             </Typography>

//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Pour sa participation à l'événement :
//             </Typography>
//             <Typography variant="h5" sx={{ color: "blue", fontWeight: "bold" }}>
//               {certificate.nom_event}
//             </Typography>

//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Organisé par :
//             </Typography>
//             <Typography variant="h5" sx={{ color: "purple", fontWeight: "bold" }}>
//               {certificate.nom_organisateur}
//             </Typography>

//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Date de l'événement :
//             </Typography>
//             <Typography variant="h5" sx={{ color: "#d32f2f", fontWeight: "bold" }}>
//               Du {new Date(certificate.date_debut).toLocaleDateString()} au {new Date(certificate.date_fin).toLocaleDateString()}
//             </Typography>

//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Lieu :
//             </Typography>
//             <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: "bold" }}>
//               {certificate.lieu_event}
//             </Typography>

//             {/* QR Code de vérification */}
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//               <QRCodeCanvas
//                 value={`${certificate.id_certificat}`}
//                 size={120}
//               />
//             </Box>

//             <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold", color: "#555" }}>
//               Scannez ce QR Code pour vérifier l'authenticité du certificat.
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Fermer
//         </Button>
//         <Button onClick={downloadPDF} color="primary" startIcon={<FileDownload />}>
//           Télécharger
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CertificatePreview;
// =====================================================

// import React, { useRef } from "react";
// import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { FileDownload } from "@mui/icons-material";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const CertificatePreview = ({ certificate, open, onClose }) => {
//   const certificateRef = useRef(null);

//   // 📥 Télécharger le certificat en PDF
//   const downloadPDF = async () => {
//     if (!certificateRef.current) return;

//     const canvas = await html2canvas(certificateRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape");
//     pdf.addImage(imgData, "PNG", 10, 10, 280, 180);
//     pdf.save(`Certificat_${certificate.nom_titulaire}.pdf`);

//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Aperçu du Certificat</DialogTitle>
//       <DialogContent>
//         {certificate && (
//           <Box
//             ref={certificateRef}
//             sx={{
//               p: 4,
//               textAlign: "center",
//               backgroundColor: "#fff",
//               borderRadius: "10px",
//               border: "3px solid #000",
//               maxWidth: "700px",
//               margin: "auto",
//               boxShadow: "5px 5px 15px rgba(0,0,0,0.2)"
//             }}
//           >
//             {/* 🎖️ En-tête du certificat */}
//             <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, color: "#003366" }}>
//               CERTIFICAT DE PARTICIPATION
//             </Typography>

//             <Typography variant="h6">Décerné à</Typography>
//             <Typography variant="h4" sx={{ color: "#228B22", fontWeight: "bold", mb: 2 }}>
//               {certificate.nom_titulaire}
//             </Typography>

//             <Typography variant="h6">Pour sa participation à l'événement :</Typography>
//             <Typography variant="h4" sx={{ color: "#1E90FF", fontWeight: "bold", mb: 2 }}>
//               {certificate.nom_event}
//             </Typography>

//             <Typography variant="h6">Organisé par :</Typography>
//             <Typography variant="h5" sx={{ color: "#800080", fontWeight: "bold", mb: 2 }}>
//               {certificate.nom_organisateur}
//             </Typography>

//             <Typography variant="h6">Date de l'événement :</Typography>
//             <Typography variant="h5" sx={{ color: "#d32f2f", fontWeight: "bold", mb: 2 }}>
//               Du {new Date(certificate.date_debut).toLocaleDateString()} au {new Date(certificate.date_fin).toLocaleDateString()}
//             </Typography>

//             <Typography variant="h6">Lieu :</Typography>
//             <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}>
//               {certificate.lieu_event}
//             </Typography>

//             {/* 📌 QR Code de vérification */}
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//               <QRCodeCanvas
//                 value={`https://mon-site.com/verifier-certificat/${certificate.id_certificat}`}
//                 size={100}
//               />
//             </Box>
//             <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold", color: "#555" }}>
//               Scannez ce QR Code pour vérifier l'authenticité du certificat.
//             </Typography>

//             {/* 🖊 Signature et validation */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, px: 5 }}>
//               {/* Signature */}
//               <Box sx={{ textAlign: "center" }}>
//                 <img
//                   src="/images/signature.png" // 📌 Remplacez par l'URL de votre signature
//                   alt="Signature"
//                   style={{ width: "120px", height: "60px" }}
//                 />
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                   {certificate.nom_organisateur}
//                 </Typography>
//                 <Typography variant="body2">Organisateur</Typography>
//               </Box>

//               {/* Cachet de validation */}
//               <Box sx={{ textAlign: "center" }}>
//                 <img
//                   src="/images/cachet.png" // 📌 Remplacez par l'URL du cachet officiel
//                   alt="Cachet"
//                   style={{ width: "100px", height: "100px" }}
//                 />
//               </Box>
//             </Box>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Fermer
//         </Button>
//         <Button onClick={downloadPDF} color="primary" startIcon={<FileDownload />}>
//           Télécharger
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CertificatePreview;
// import React, { useRef } from "react";
// import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { FileDownload } from "@mui/icons-material";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import certificatImg from './../../../assets/img/certificatImg.png';

// const CertificatePreview = ({ certificate, open, onClose }) => {
//   const certificateRef = useRef(null);

//   // 📥 Télécharger le certificat en PDF
//   const downloadPDF = async () => {
//     if (!certificateRef.current) return;

//     const canvas = await html2canvas(certificateRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL({certificatImg});

//     const pdf = new jsPDF("landscape");
//     pdf.addImage(imgData, "PNG", 10, 10, 280, 180);
//     pdf.save(`Certificat_${certificate.nom_titulaire}.pdf`);

//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Aperçu du Certificat</DialogTitle>
//       <DialogContent>
//         {certificate && (
//           <Box
//             ref={certificateRef}
//             sx={{
//               p: 4,
//               textAlign: "center",
//               backgroundColor: "#fff",
//               backgroundImage: `url(${certificatImg})`, // 🎨 Image de texture
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               borderRadius: "10px",
//               border: "3px solid #000",
//               maxWidth: "700px",
//               margin: "auto",
//               boxShadow: "5px 5px 15px rgba(0,0,0,0.2)"
//             }}
//           >
//             {/* 🎖️ En-tête du certificat */}
//             <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, color: "#003366" }}>
//               CERTIFICAT DE PARTICIPATION
//             </Typography>

//             <Typography variant="h6">Décerné à</Typography>
//             <Typography variant="h4" sx={{ color: "#228B22", fontWeight: "bold", mb: 2 }}>
//               {certificate.nom_titulaire}
//             </Typography>

//             <Typography variant="h6">Pour sa participation à l'événement :</Typography>
//             <Typography variant="h4" sx={{ color: "#1E90FF", fontWeight: "bold", mb: 2 }}>
//               {certificate.nom_event}
//             </Typography>

//             <Typography variant="h6">Organisé par :</Typography>
//             <Typography variant="h5" sx={{ color: "#800080", fontWeight: "bold", mb: 2 }}>
//               {certificate.nom_organisateur}
//             </Typography>

//             <Typography variant="h6">Date de l'événement :</Typography>
//             <Typography variant="h5" sx={{ color: "#d32f2f", fontWeight: "bold", mb: 2 }}>
//               Du {new Date(certificate.date_debut).toLocaleDateString()} au {new Date(certificate.date_fin).toLocaleDateString()}
//             </Typography>

//             <Typography variant="h6">Lieu :</Typography>
//             <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}>
//             {certificate.lieu_event}
//             </Typography>

//             {/* 📌 QR Code de vérification */}
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//               <QRCodeCanvas
//                 value={`https://mon-site.com/verifier-certificat/${certificate.id_certificat}`}
//                 size={100}
//               />
//             </Box>
//             <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold", color: "#555" }}>
//               Scannez ce QR Code pour vérifier l'authenticité du certificat.
//             </Typography>

//             {/* 🖊 Signature et validation */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, px: 5 }}>
//               {/* Signature */}
//               <Box sx={{ textAlign: "center" }}>
//                 <img
//                   src="/images/signature.png" // 📌 Remplacez par l'URL de votre signature
//                   alt="Signature"
//                   style={{ width: "120px", height: "60px" }}
//                 />
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                   {certificate.nom_organisateur}
//                 </Typography>
//                 <Typography variant="body2">Organisateur</Typography>
//               </Box>

//               {/* Cachet de validation */}
//               <Box sx={{ textAlign: "center" }}>
//                 <img
//                   src="/images/cachet.png" // 📌 Remplacez par l'URL du cachet officiel
//                   alt="Cachet"
//                   style={{ width: "100px", height: "100px" }}
//                 />
//               </Box>
//             </Box>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Fermer
//         </Button>
//         <Button onClick={downloadPDF} color="primary" startIcon={<FileDownload />}>
//           Télécharger
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CertificatePreview;
import React, { useRef } from "react";
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import certificatBg from "./../../../assets/img/certificatImg.png";

const CertificatePreview = ({ certificate, open, onClose }) => {
    const certificateRef = useRef(null);

    // 📥 Télécharger le certificat en PDF (Haute Qualité)
    const downloadPDF = async () => {
        if (!certificateRef.current) return;

        const dpi = window.devicePixelRatio * 4; // 🔥 Augmentation de la netteté
        const canvas = await html2canvas(certificateRef.current, {
            scale: dpi, // Amélioration de la qualité de rendu
            useCORS: true, // Résolution des problèmes d’images chargées via CORS
            backgroundColor: null, // Conserve la transparence
        });

        const imgData = canvas.toDataURL("image/png", 1.0); // 🔥 Qualité maximale

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
            compress: false, // 🔥 Supprime la compression pour une meilleure qualité
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
        pdf.save(`Certificat_${certificate.nom_titulaire}.pdf`);

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
                Aperçu du Certificat
            </DialogTitle>
            <Box
                ref={certificateRef}
                sx={{
                    width: "3508 px",
                    height: "2480 px",
                    position: "relative",
                    backgroundImage: `url(${certificatBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "center",
                    padding: "80px",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
                }}
            >
                <DialogContent>

                    {certificate && (
                        <Box>
                            {/* 🎖️ TITRE */}
                            <Typography variant="h2" sx={{ fontWeight: "bold", color: "#000", mt: 8 }}>
                                CERTIFICAT
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                                DE PARTICIPATION
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#d4af37", fontWeight: "bold", mb: 3 }}>
                                CE CERTIFICAT DE PARTICIPATION EST DISCERNÉ À
                            </Typography>

                            {/* 🏅 Nom du Participant */}
                            <Typography variant="h3" sx={{ color: "#003366", fontWeight: "bold", mb: 1 }}>
                                {certificate.nom_titulaire}
                            </Typography>
                            {/* ✅ Ligne sous le nom */}
                            <Box
                                sx={{
                                    width: "60%", // 🔥 Ajuste la longueur de la ligne ici
                                    height: "4px", // 🔥 Épaisseur de la ligne
                                    backgroundColor: "#454545", // 🔥 Couleur de la ligne
                                    margin: "0 auto", // Centre la ligne
                                    mb: 3, // Ajuste l'espacement après la ligne
                                }}
                            ></Box>

                            {/* 📆 Détails de l'événement */}
                            <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
                                <span>Pour sa participation à l'événement </span>
                                "<span sx={{ color: "#1E90FF", fontWeight: "bold" }}>{certificate.nom_event}</span>"
                                Organisé par "{certificate.nom_organisateur}" .
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
                                Le {new Date(certificate.date_debut).toLocaleDateString()} jusqu'au {new Date(certificate.date_fin).toLocaleDateString()} au {certificate.lieu_event}
                            </Typography>

                            {/* 📌 QR Code de vérification */}

                            <Box sx={{ display: "flex", justifyContent: "right", mt: 3, mr: 12 }}>
                                <QRCodeCanvas
                                    value={`https://mon-site.com/verifier-certificat/${certificate.id_certificat}`}
                                    size={100}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold", color: "#555", textAlign: "right", mr: 10 }}>
                                Scannez ce QR Code
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Box>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Fermer
                </Button>
                <Button onClick={downloadPDF} color="primary" startIcon={<FileDownload />}>
                    Télécharger
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default CertificatePreview;
