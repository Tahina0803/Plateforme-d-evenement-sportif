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
// } from "@mui/material";

// const ParticipantsList = () => {
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchParticipants();
//   }, []);

//   const fetchParticipants = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/participant/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setParticipants(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des participants :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteParticipant = async (id) => {
//     if (window.confirm("Voulez-vous vraiment supprimer ce participant ?")) {
//       try {
//         await axios.delete(`http://localhost:3001/api/participant/participants/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setParticipants(participants.filter((p) => p.id_participant !== id));
//       } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//       }
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom textAlign="center">
//         Liste des Participants
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : participants.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Nom</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Téléphone</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {participants.map((participant) => (
//                 <TableRow key={participant.id_participant} hover>
//                   <TableCell>{participant.id_participant}</TableCell>
//                   <TableCell>{participant.nom_part}</TableCell>
//                   <TableCell>{participant.email_part}</TableCell>
//                   <TableCell>{participant.telephone_part}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => deleteParticipant(participant.id_participant)}
//                     >
//                       Supprimer
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
//           Aucun participant trouvé.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ParticipantsList;
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
// } from "@mui/material";

// const ParticipantsList = () => {
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchParticipants();
//   }, []);

//   const fetchParticipants = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/participant/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setParticipants(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des participants :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteParticipant = async (id) => {
//     if (window.confirm("Voulez-vous vraiment supprimer ce participant ?")) {
//       try {
//         await axios.delete(`http://localhost:3001/api/participant/participants/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setParticipants(participants.filter((p) => p.id_participant !== id));
//       } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//       }
//     }
//   };

//   const distributeCertificate = async (id) => {
//     if (window.confirm("Voulez-vous distribuer un certificat à ce participant ?")) {
//       try {
//         await axios.post(`http://localhost:3001/api/certificate/distribute/${id}`, {}, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         alert("Certificat distribué avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de la distribution du certificat :", error);
//         alert("Une erreur s'est produite lors de la distribution du certificat.");
//       }
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom textAlign="center">
//         Liste des Participants
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : participants.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Nom</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Téléphone</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {participants.map((participant) => (
//                 <TableRow key={participant.id_participant} hover>
//                   <TableCell>{participant.id_participant}</TableCell>
//                   <TableCell>{participant.nom_part}</TableCell>
//                   <TableCell>{participant.email_part}</TableCell>
//                   <TableCell>{participant.telephone_part}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="success"
//                       size="small"
//                       onClick={() => distributeCertificate(participant.id_participant)}
//                       sx={{ mr: 1 }}
//                     >
//                       Distribuer Certificat
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => deleteParticipant(participant.id_participant)}
//                     >
//                       Supprimer
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
//           Aucun participant trouvé.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ParticipantsList;


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
// } from "@mui/material";

// const ParticipantsList = () => {
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [certificatesDistributed, setCertificatesDistributed] = useState({});

//   useEffect(() => {
//     fetchParticipants();
//     fetchCertificates();
//   }, []);

//   // Récupérer la liste des participants
//   const fetchParticipants = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/participant/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setParticipants(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des participants :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer les certificats existants
//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/certificate/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       // Mettre à jour l'état des certificats distribués
//       const distributedMap = {};
//       response.data.forEach((cert) => {
//         distributedMap[cert.id_participant] = true;
//       });

//       setCertificatesDistributed(distributedMap);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des certificats :", error);
//     }
//   };

//   // Supprimer un participant
//   const deleteParticipant = async (id) => {
//     if (window.confirm("Voulez-vous vraiment supprimer ce participant ?")) {
//       try {
//         await axios.delete(`http://localhost:3001/api/participant/participants/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setParticipants(participants.filter((p) => p.id_participant !== id));
//       } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//       }
//     }
//   };

//   // Distribuer un certificat
//   const distributeCertificate = async (id) => {
//     if (window.confirm("Voulez-vous distribuer un certificat à ce participant ?")) {
//       try {
//         await axios.post(`http://localhost:3001/api/certificate/distribute/${id}`, {}, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         // Mettre à jour l'état pour indiquer que le certificat a été distribué
//         setCertificatesDistributed((prev) => ({ ...prev, [id]: true }));
//         alert("Certificat distribué avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de la distribution du certificat :", error);
//         alert("Une erreur s'est produite lors de la distribution du certificat.");
//       }
//     }
//   };

//   return (
//     <Box >
//       <Typography variant="h4" gutterBottom textAlign="center">
//         📋 Liste des Participants
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : participants.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Nom</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Téléphone</TableCell>
//                 <TableCell>Certificat</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {participants.map((participant) => (
//                 <TableRow key={participant.id_participant} hover>
//                   <TableCell>{participant.id_participant}</TableCell>
//                   <TableCell>{participant.nom_part}</TableCell>
//                   <TableCell>{participant.email_part}</TableCell>
//                   <TableCell>{participant.telephone_part}</TableCell>
//                   <TableCell>
//                     {certificatesDistributed[participant.id_participant] ? (
//                       <Typography color="green">✔ Certificat Distribué</Typography>
//                     ) : (
//                       <Typography color="red">✖ Non Distribué</Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {!certificatesDistributed[participant.id_participant] && (
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="small"
//                         onClick={() => distributeCertificate(participant.id_participant)}
//                         sx={{ mr: 1 }}
//                       >
//                         Distribuer
//                       </Button>
//                     )}
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => deleteParticipant(participant.id_participant)}
//                     >
//                       Supprimer
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
//           Aucun participant trouvé.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ParticipantsList;

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
// } from "@mui/material";

// const ParticipantsList = () => {
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [certificatesDistributed, setCertificatesDistributed] = useState({});

//   useEffect(() => {
//     fetchParticipants();
//     fetchCertificates();
//   }, []);

//   // Récupérer la liste des participants
//   const fetchParticipants = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/participant/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setParticipants(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des participants :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer les certificats existants
//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/certificate/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       // Mettre à jour l'état des certificats distribués
//       const distributedMap = {};
//       response.data.forEach((cert) => {
//         distributedMap[cert.id_participant] = true;
//       });

//       setCertificatesDistributed(distributedMap);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des certificats :", error);
//     }
//   };

//   // Supprimer un participant
//   const deleteParticipant = async (id) => {
//     if (window.confirm("Voulez-vous vraiment supprimer ce participant ?")) {
//       try {
//         await axios.delete(`http://localhost:3001/api/participant/participants/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setParticipants(participants.filter((p) => p.id_participant !== id));
//       } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//       }
//     }
//   };

//   // Distribuer un certificat
//   const distributeCertificate = async (id) => {
//     if (window.confirm("Voulez-vous distribuer un certificat à ce participant ?")) {
//       try {
//         await axios.post(`http://localhost:3001/api/certificate/distribute/${id}`, {}, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         // Mettre à jour l'état pour indiquer que le certificat a été distribué
//         setCertificatesDistributed((prev) => ({ ...prev, [id]: true }));
//         alert("Certificat distribué avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de la distribution du certificat :", error);
//         alert("Une erreur s'est produite lors de la distribution du certificat.");
//       }
//     }
//   };

//   return (
//     <Box>
//       {/* 🔥 Ajout du nombre total de participants */}
//       <Typography variant="h4" gutterBottom textAlign="center">
//         📋 Liste des Participants ({participants.length})
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : participants.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableRow>
//                 <TableCell>#</TableCell> {/* 🔹 Numéro de ligne */}
//                 <TableCell>Nom</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Téléphone</TableCell>
//                 <TableCell>Certificat</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {participants.map((participant, index) => (
//                 <TableRow key={participant.id_participant} hover>
//                   {/* 🔹 Utilisation de index + 1 pour afficher un numéro croissant */}
//                   <TableCell>{index + 1}</TableCell> 
//                   <TableCell>{participant.nom_part}</TableCell>
//                   <TableCell>{participant.email_part}</TableCell>
//                   <TableCell>{participant.telephone_part}</TableCell>
//                   <TableCell>
//                     {certificatesDistributed[participant.id_participant] ? (
//                       <Typography color="green">✔ Certificat Distribué</Typography>
//                     ) : (
//                       <Typography color="red">✖ Non Distribué</Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {!certificatesDistributed[participant.id_participant] && (
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="small"
//                         onClick={() => distributeCertificate(participant.id_participant)}
//                         sx={{ mr: 1 }}
//                       >
//                         Distribuer
//                       </Button>
//                     )}
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => deleteParticipant(participant.id_participant)}
//                     >
//                       Supprimer
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
//           Aucun participant trouvé.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ParticipantsList;
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
// } from "@mui/material";

// const ParticipantsList = () => {
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [certificatesDistributed, setCertificatesDistributed] = useState({});

//   useEffect(() => {
//     fetchParticipants();
//     fetchCertificates();
//   }, []);

//   const fetchParticipants = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/participant/allparticipants", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setParticipants(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des participants :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCertificates = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/certificate/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const distributedMap = {};
//       response.data.forEach((cert) => {
//         distributedMap[cert.id_participant] = true;
//       });

//       setCertificatesDistributed(distributedMap);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des certificats :", error);
//     }
//   };

//   const deleteParticipant = async (id) => {
//     if (window.confirm("Voulez-vous vraiment supprimer ce participant ?")) {
//       try {
//         await axios.delete(`http://localhost:3001/api/participant/participants/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setParticipants((prevParticipants) => prevParticipants.filter((p) => p.id_participant !== id));

//       } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//       }
//     }
//   };

//   const distributeCertificate = async (id) => {
//     if (window.confirm("Voulez-vous distribuer un certificat à ce participant ?")) {
//       try {
//         await axios.post(`http://localhost:3001/api/certificate/distribute/${id}`, {}, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         setCertificatesDistributed((prev) => ({ ...prev, [id]: true }));
//         alert("Certificat distribué avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de la distribution du certificat :", error);
//         alert("Une erreur s'est produite lors de la distribution du certificat.");
//       }
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom textAlign="center">
//         📋 Liste des Participants
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//           <CircularProgress />
//         </Box>
//       ) : participants.length > 0 ? (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Nom</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Téléphone</TableCell>
//                 <TableCell>Événement</TableCell>
//                 <TableCell>Certificat</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {participants.map((participant, index) => (
//                 <TableRow key={participant.id_participant} hover>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{participant.nom_part}</TableCell>
//                   <TableCell>{participant.email_part}</TableCell>
//                   <TableCell>{participant.telephone_part}</TableCell>
//                   <TableCell>{participant.nom_event || "Non spécifié"}</TableCell>
//                   <TableCell>
//                     {certificatesDistributed[participant.id_participant] ? (
//                       <Typography color="green">✔ Certificat Distribué</Typography>
//                     ) : (
//                       <Typography color="red">✖ Non Distribué</Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {!certificatesDistributed[participant.id_participant] && (
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="small"
//                         onClick={() => distributeCertificate(participant.id_participant)}
//                         sx={{ mr: 1 }}
//                       >
//                         Distribuer
//                       </Button>
//                     )}
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => deleteParticipant(participant.id_participant)}
//                     >
//                       Supprimer
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
//           Aucun participant trouvé.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ParticipantsList;
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
  useTheme,
} from "@mui/material";

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certificatesDistributed, setCertificatesDistributed] = useState({});

  const theme = useTheme(); // Récupère le thème depuis AdminLayout.js

  useEffect(() => {
    fetchParticipants();
    fetchCertificates();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/participant/allparticipants", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setParticipants(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des participants :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/certificate/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const distributedMap = {};
      response.data.forEach((cert) => {
        distributedMap[cert.id_participant] = true;
      });

      setCertificatesDistributed(distributedMap);
    } catch (error) {
      console.error("Erreur lors de la récupération des certificats :", error);
    }
  };

  const deleteParticipant = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce participant ?")) {
      try {
        await axios.delete(`http://localhost:3001/api/participant/participants/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setParticipants((prevParticipants) => prevParticipants.filter((p) => p.id_participant !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  // const distributeCertificate = async (id) => {
  //   if (window.confirm("Voulez-vous distribuer un certificat à ce participant ?")) {
  //     try {
  //       await axios.post(`http://localhost:3001/api/certificate/distribute/${id}`, {}, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       });

  //       setCertificatesDistributed((prev) => ({ ...prev, [id]: true }));
  //       alert("Certificat distribué avec succès !");
  //     } catch (error) {
  //       console.error("Erreur lors de la distribution du certificat :", error);
  //       alert("Une erreur s'est produite lors de la distribution du certificat.");
  //     }
  //   }
  // };
  const distributeCertificate = async (id_participant, id_evenement) => {
    if (!id_evenement) {
      alert("L'ID de l'événement est requis pour distribuer un certificat !");
      return;
    }

    if (window.confirm("Voulez-vous distribuer un certificat à ce participant ?")) {
      try {
        // ✅ Vérification des données envoyées
        console.log("📤 Envoi des données :", { id_participant, id_evenement });

        await axios.post(`http://localhost:3001/api/certificate/distribute/${id_participant}`, {
          id_evenement, // ✅ Assurez-vous que cet ID est bien envoyé
          adminId: localStorage.getItem("adminId")
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        alert("Certificat distribué avec succès !");
      } catch (error) {
        console.error("Erreur lors de la distribution du certificat :", error);
        alert("Une erreur s'est produite.");
      }
    }
  };


  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f9f9f9",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        color={theme.palette.mode === "dark" ? "white" : "black"}
      >
        📋 Liste des Participants
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : participants.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Événement</TableCell>
                <TableCell>Certificat</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant, index) => (
                <TableRow key={participant.id_participant} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{participant.nom_part}</TableCell>
                  <TableCell>{participant.email_part}</TableCell>
                  <TableCell>{participant.telephone_part}</TableCell>
                  <TableCell>{participant.nom_event || "Non spécifié"}</TableCell>
                  <TableCell>
                    {certificatesDistributed[participant.id_participant] ? (
                      <Typography color="green">✔ Certificat Distribué</Typography>
                    ) : (
                      <Typography color="red">✖ Non distribué</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {!certificatesDistributed[participant.id_participant] && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => distributeCertificate(participant.id_participant, participant.id_evenement)} // ✅ Ajout de id_evenement
                        sx={{ mr: 1 }}
                      >
                        Distribuer
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteParticipant(participant.id_participant)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mt: 3 }}>
          Aucun participant trouvé.
        </Typography>
      )}
    </Box>
  );
};

export default ParticipantsList;
