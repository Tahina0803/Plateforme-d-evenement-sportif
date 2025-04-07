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
//   Button,
//   CircularProgress, 
//   useTheme
// } from "@mui/material";

// const CertificatesList = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const theme = useTheme();

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/certificate/all", {
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
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom textAlign="center">
//         Liste des Certificats
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : certificates.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5"  }}>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Nom du Participant</TableCell>
//                 <TableCell>Date de Distribution</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {certificates.map((certif) => (
//                 <TableRow key={certif.id_certificat} hover>
//                   <TableCell>{certif.id_certificat}</TableCell>
//                   <TableCell>{certif.nom_titulaire}</TableCell>
//                   <TableCell>{new Date(certif.date_distribution).toLocaleDateString()}</TableCell>
//                   <TableCell>{certif.type_certificat}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       size="small"
//                       href={certif.url_certificat}
//                       target="_blank"
//                     >
//                       Télécharger PDF
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

// export default CertificatesList;
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
  Button,
  CircularProgress,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CertificatesList = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/certificate/all", {
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

  const deleteCertificate = async (id_certificat) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce certificat ?")) {
      try {
        await axios.delete(`http://localhost:3001/api/certificate/${id_certificat}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Mettre à jour la liste des certificats après suppression
        setCertificates(certificates.filter(cert => cert.id_certificat !== id_certificat));
      } catch (error) {
        console.error("Erreur lors de la suppression du certificat :", error);
      }
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%", overflowX: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Liste des Certificats
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : certificates.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom du Participant</TableCell>
                <TableCell>Date de Distribution</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.map((certif) => (
                <TableRow key={certif.id_certificat} hover>
                  <TableCell>{certif.id_certificat}</TableCell>
                  <TableCell>{certif.nom_titulaire}</TableCell>
                  <TableCell>{new Date(certif.date_distribution).toLocaleDateString()}</TableCell>
                  <TableCell>{certif.type_certificat}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteCertificate(certif.id_certificat)}
                      sx={{
                        minWidth: "40px", // Réduit la taille du bouton
                        height: "40px",
                        borderRadius: "50%", // Rend le bouton circulaire
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#c62828", // Rouge plus foncé au survol
                          transform: "scale(1.1)", // Effet d'agrandissement au survol
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: "20px" }} />
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
    </Box>
  );
};

export default CertificatesList;
