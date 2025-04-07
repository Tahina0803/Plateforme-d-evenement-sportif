// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Button,
//   useTheme,
// } from "@mui/material";
// import { FileDownload } from "@mui/icons-material";


// const ParticipantCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const theme = useTheme();
//   const participantId = localStorage.getItem("participantId"); // ID du participant connecté

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/certificate/participant/${participantId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setCertificates(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des certificats :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         p: 3,
//         minHeight: "100vh",
//         backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f9f9f9",
//       }}
//     >
//       <Typography
//         variant="h4"
//         gutterBottom
//         textAlign="center"
//         color={theme.palette.mode === "dark" ? "white" : "black"}
//       >
//         🎖️ Mes Certificats
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : certificates.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
//           <Table sx={{ minWidth: 600 }}>
//             <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5" }}>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Événement</TableCell>
//                 <TableCell>Date de distribution</TableCell>
//                 <TableCell>Certificat</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {certificates.map((cert, index) => (
//                 <TableRow key={`cert-${cert.id_certificat}`} hover>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{cert.nom_event}</TableCell>
//                   <TableCell>{new Date(cert.date_distribution).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       startIcon={<FileDownload />}
//                       href={cert.url_certificat}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       Télécharger
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
//           Aucun certificat trouvé.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ParticipantCertificates;
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Button,
  useTheme,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import CertificatePreview from "./CertificatePreview"; // ✅ Import du composant d'aperçu du certificat

const ParticipantCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const participantId = localStorage.getItem("participantId");

  useEffect(() => {
    fetchCertificates();
  }, []);

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/certificate/participant/${participantId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setCertificates(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des certificats :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

const fetchCertificates = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/certificate/participant/${participantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setCertificates(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des certificats :", error);
    } finally {
      setLoading(false);
    }
  };
  

  // 📄 Ouvrir l'aperçu du certificat
  const openCertificatePreview = (cert) => {
    setSelectedCertificate(cert);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom textAlign="center" color={theme.palette.mode === "dark" ? "white" : "black"}>
        🎖️ Mes Certificats
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : certificates.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Événement</TableCell>
                <TableCell>Date de distribution</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.map((cert, index) => (
                <TableRow key={`cert-${cert.id_certificat}`} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cert.nom_event}</TableCell>
                  <TableCell>{new Date(cert.date_distribution).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Visibility />}
                      onClick={() => openCertificatePreview(cert)}
                    >
                      Aperçu & Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
          Aucun certificat trouvé.
        </Typography>
      )}

      {/* Utilisation du composant CertificatePreview */}
      {selectedCertificate && (
        <CertificatePreview
          certificate={selectedCertificate}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </Box>
  );
};

export default ParticipantCertificates;
