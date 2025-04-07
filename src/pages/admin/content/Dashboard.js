import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  useMediaQuery
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [organizersCount, setOrganizersCount] = useState(0); // Stocke le nombre d'organisateurs
  const [organizers, setOrganizers] = useState([]); // Stocke la liste des organisateurs
  
  const [subscribers, setSubscribers] = useState([]);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const token = localStorage.getItem("token");

  // responsivité
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchOrganizersCount = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/auth/admin/organizers/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganizersCount(response.data.total); // ✅ Stocke seulement le nombre
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'organisateurs :", error);
      }
    };
  
    fetchOrganizersCount();
  }, [token]);
  
  useEffect(() => {
    const fetchOrganizersList = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/auth/admin/organizers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganizers(response.data); // ✅ Stocke un tableau contenant la liste des organisateurs
      } catch (error) {
        console.error("Erreur lors de la récupération des organisateurs :", error);
      }
    };
  
    fetchOrganizersList();
  }, [token]);
  

  useEffect(() => {
    fetch("http://localhost:3001/api/newsletter/list")
      .then((res) => res.json())
      .then((data) => setSubscribers(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/organizer/allevents");
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/participant/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParticipants(response.data.total);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de participants :", error);
      }
    };
  
    fetchParticipants();
  }, [token]);
  
  

  // Données pour le graphique circulaire
  const pieData = {
    labels: ["Organisateurs", "Participants", "Événements", "Abonnés"],
    datasets: [
      {
        label: "Répartition des utilisateurs",
        data: [organizersCount, participants, events.length, subscribers.length],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFF6368", "#FFCE56"],
      },
    ],
  };

  return (
    <Grid container spacing={3} padding={isSmallScreen ? 2 : 4}>
      {/* Cartes de statistiques */}
      {[
        { title: "Organisateurs", value: organizersCount || 0 },
        { title: "Participants", value: participants || 0 },
        { title: "Événements", value: events.length || 0 },
        { title: "Abonnés", value: subscribers.length || 0 },
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary">{stat.value}</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{stat.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
{/* Graphique circulaire */}
<Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CardContent sx={{ width: isSmallScreen ? "100%" : 400, height: isSmallScreen ? 300 : 400 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>Répartition des utilisateurs</Typography>
            <Pie data={pieData} options={{ maintainAspectRatio: false, responsive: true }} />
          </CardContent>
        </Card>
      </Grid>
      {/* Liste des organisateurs */}
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
              Liste des Organisateurs
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto", borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Avatar</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Prénom</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizers.map((organizer) => (
                    <TableRow key={organizer.id_organisateur} hover>
                      <TableCell>
                        <Avatar sx={{ bgcolor: "#36A2EB" }}>{organizer.nom_organisateur.charAt(0)}</Avatar>
                      </TableCell>
                      <TableCell>{organizer.nom_organisateur}</TableCell>
                      <TableCell>{organizer.prenom_organisateur}</TableCell>
                      <TableCell sx={{ wordBreak: "break-word" }}>{organizer.email_organisateur}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
// import { Pie } from 'react-chartjs-2';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const Dashboard = () => {
//   const [organizers, setOrganizers] = useState([]);
//   const [subscribers, setSubscribers] = useState([]);
//   const [events, setEvents] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchOrganizers = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3001/api/auth/admin/organizers",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setOrganizers(response.data);
//       } catch (error) {
//         console.error(
//           "Erreur lors de la récupération des organisateurs :",
//           error.response?.data.message || error.message
//         );
//       }
//     };

//     fetchOrganizers();
//   }, [token]);

//   useEffect(() => {
//     fetch("http://localhost:3001/api/newsletter/list")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Réponse API :", data); // Vérifier la structure de la réponse
//         setSubscribers(data);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   useEffect(() => {
//     const fetchEvents = async () => {
//         try {
//           console.log("Appel à l'URL : http://localhost:3001/api/organizer/allevents");
//           const response = await axios.get(`http://localhost:3001/api/organizer/allevents`);
//           console.log("Données récupérées :", response.data);
//           setEvents(response.data);
//         } catch (error) {
//           console.error("Erreur lors de la récupération des événements :", error.response?.data?.message || error.message);
//         }
//       };
      
  
//     fetchEvents();
//   }, []); // Assurez-vous que le tableau de dépendances est vide pour exécuter une seule fois
  

//   // Données pour le graphique circulaire
//   const pieData = {
//     labels: ['Organisateurs', 'Participants', 'Evénements', 'Abonnés'],
//     datasets: [
//       {
//         label: 'Répartition des utilisateurs',
//         data: [organizers.length, 50, events.length, subscribers.length],
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFF6368','#FFCE56' ],
//       },
//     ],
//   };

//   return (
//     <Grid container spacing={3}>
//       {/* Cartes de statistiques */}
//       {[
//         { title: 'Organisateurs', value: organizers.length },
//         { title: 'Participants', value: 4500 },
//         { title: 'Événements', value: events.length },
//         { title: 'Abonnés', value: subscribers.length},
//       ].map((stat, index) => (
//         <Grid item xs={12} md={3} key={index}>
//           <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
//             <CardContent>
//               <Typography variant="h4" color="primary">{stat.value}</Typography>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{stat.title}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}

//       {/* Liste des organisateurs */}
//       <Grid item xs={12} md={6}>
//         <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
//               Liste des Organisateurs
//             </Typography>
//             <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto', borderRadius: 2 }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Avatar</TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Prénom</TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {organizers.map((organizer) => (
//                     <TableRow key={organizer.id_organisateur} hover>
//                       <TableCell>
//                         <Avatar sx={{ bgcolor: '#36A2EB' }}>{organizer.nom_organisateur.charAt(0)}</Avatar>
//                       </TableCell>
//                       <TableCell>{organizer.nom_organisateur}</TableCell>
//                       <TableCell>{organizer.prenom_organisateur}</TableCell>
//                       <TableCell>{organizer.email_organisateur}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* Graphique circulaire */}
//       <Grid item xs={12} md={6}>
//         <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <CardContent sx={{ width: 400, height: 400 }}> {/* Taille réduite pour le graphique */}
//             <Typography variant="h6" sx={{ textAlign: 'center' }}>Répartition des utilisateurs</Typography>
//             <Pie data={pieData} options={{ maintainAspectRatio: false }} />
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default Dashboard;
