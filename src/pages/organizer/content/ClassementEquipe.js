
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid
} from "@mui/material";

const ClassementEquipe = () => {
  const [classement, setClassement] = useState({});
  const [loading, setLoading] = useState(false);
  const [showJournalierMap, setShowJournalierMap] = useState({}); // 👈 État pour chaque événement
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClassement = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/organizer/classement`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClassement(response.data.classement || {});
      } catch (error) {
        console.error("Erreur lors du chargement des classements :", error);
        setClassement({});
      } finally {
        setLoading(false);
      }
    };

    fetchClassement();
  }, [token]);

  //  ✅ Fonction pour basculer entre Classement Général et Journalier pour un seul événement
  const toggleClassementJournalier = (eventName) => {
    setShowJournalierMap((prev) => ({
      ...prev,
      [eventName]: !prev[eventName], // Inverse l'état uniquement pour cet événement
    }));
  };

  return (
    <Box sx={{ padding: "5px", width: "100%" }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
        Classement des équipes
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : Object.keys(classement).length > 0 ? (
        <Box sx={{ padding: 2 }}>
          {Object.keys(classement).map((eventName) => {
            const eventData = classement[eventName];
            const isPetanque = eventData["Classement Général"] && eventData["Classement Général"]["Classement Général"]?.length > 0 && "points_marques" in eventData["Classement Général"]["Classement Général"][0];
            const isBasket = eventData["Classement Général"] && eventData["Classement Général"]["Classement Général"]?.length > 0 && "v" in eventData["Classement Général"]["Classement Général"][0];

            // Vérifie s'il y a des phases disponibles (hors "Classement Général")
            const phaseKeys = Object.keys(eventData).filter(phase => phase !== "Classement Général");
            const firstPhase = phaseKeys.length > 0 ? phaseKeys[0] : "Aucune phase";


            return (
              <Box key={eventName} sx={{ mt: 2 }}>
                {/* Ajout du bouton sur la droite du titre */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",borderRadius:"0px", backgroundColor: "#ffd700", padding: "5px 5px 7px 5px", fontWeight: "bold", color: "black", mb: 1 }}>
                  <Typography variant="h5">
                     {eventName} - {firstPhase}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "transparent", color: "blue", fontSize: "12px",fontWeight: "bold" }}
                    onClick={() => toggleClassementJournalier(eventName)}
                  >
                    {showJournalierMap[eventName] ? " ▶  Voir classement général" : " ▶  Voir classement journalier"}
                  </Button>
                </Box>

                {/* Basculer entre classement général et journalier */}
                {!showJournalierMap[eventName] ? (
                  <TableContainer component={Paper} sx={{ mb: 4, mt: 4, p: 0 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e7ff", fontSize: "14px", color: "black" }}>
                            Équipe
                          </TableCell>
                          {isBasket ? (
                            <>
                              <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>MJ</TableCell>
                              <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>V</TableCell>
                              <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>D</TableCell>
                            </>
                          ) : (
                            <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>Pt</TableCell>
                          )}
                          <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>
                            {isPetanque || isBasket ? "PM" : "BM"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>
                            {isPetanque || isBasket ? "PC" : "BE"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "14px" }}>
                            {isPetanque || isBasket ? "DP" : "DB"}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eventData["Classement Général"]["Classement Général"].map((team, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ textAlign: "left", fontSize: "14px" }}>{team.nom_equipe}</TableCell>
                            {isBasket ? (
                              <>
                                <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{team.mj}</TableCell>
                                <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{team.v}</TableCell>
                                <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{team.d}</TableCell>
                              </>
                            ) : (
                              <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{team.points}</TableCell>
                            )}
                            <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>
                              {isPetanque || isBasket ? team.points_marques : team.buts_marques}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>
                              {isPetanque || isBasket ? team.points_concedes : team.buts_encaisses}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>
                              {isPetanque || isBasket ? team.difference_points : team.difference_buts}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography sx={{ textAlign: "center", mt: 3 }}>


                    {Object.keys(eventData).map((phaseName) => {
                      if (phaseName === "Classement Général") return null; // ✅ Évite la duplication

                      return (
                        <Box key={phaseName} sx={{ mt: 2 }}>

                          {Object.keys(eventData[phaseName]).map((journeeName) => (
                            <Box key={journeeName} sx={{ mt: 0 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  textAlign: "left",
                                  padding: "5px 20px",
                                  fontWeight: "bold",
                                  borderTop: "2px solid #bbb",
                                  borderBottom: "2px solid #bbb",
                                  textTransform: "uppercase", // 🔥 Ajout pour mettre en majuscules
                                }}
                              >
                                {journeeName.includes("Journée") ? journeeName : `Journée ${journeeName}`}
                              </Typography>

                              <Grid container spacing={2} sx={{ mt: 2 }}>
                                {Object.keys(eventData[phaseName][journeeName])
                                  .sort()
                                  .map((pouleName, index) => {
                                    let pouleData = eventData[phaseName][journeeName][pouleName] || [];

                                    if (!Array.isArray(pouleData)) {
                                      pouleData = [];
                                    }

                                    const isPetanque = pouleData.length > 0 && "points_marques" in pouleData[0];
                                    const isBasket = pouleData.length > 0 && "v" in pouleData[0];

                                    pouleData = [...pouleData].sort((a, b) => b.points - a.points);

                                    return (
                                      <Grid item xs={12} md={4} key={index}>
                                        <Typography
                                          sx={{
                                            textAlign: "center",
                                            backgroundColor: "#e0e7ff",
                                            padding: "5px",
                                            fontWeight: "bold",
                                            color: "black",
                                            mb: 0.6,
                                            fontSize: "14px",
                                            borderRadius: "5px"
                                          }}
                                        >
                                          {pouleName}
                                        </Typography>

                                        <TableContainer component={Paper} sx={{ mb: 2, p: 0 }}>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e7ff", textAlign: "left" }}>Équipe</TableCell>
                                                {isBasket ? (
                                                  <>
                                                    <TableCell sx={{ padding: "2px 7px", textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "12px", }}>MJ</TableCell>
                                                    <TableCell sx={{ padding: "2px 7px", textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "12px", }}>V</TableCell>
                                                    <TableCell sx={{ padding: "2px 7px", textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "12px", }}>D</TableCell>
                                                  </>
                                                ) : (
                                                  <TableCell sx={{ padding: "2px 7px", textAlign: "center", color: "black", backgroundColor: "#e0e7ff", fontWeight: "bold", fontSize: "12px", }}>Pt</TableCell>
                                                )}                                           
                                                 <TableCell sx={{ fontWeight: "bold",backgroundColor: "#e0e7ff", textAlign: "center",fontSize: "12px" }}>{isPetanque || isBasket ? "PM" : "BM"}</TableCell>
                                                <TableCell sx={{ fontWeight: "bold",backgroundColor: "#e0e7ff", textAlign: "center",fontSize: "12px" }}>{isPetanque || isBasket ? "PC" : "BE"}</TableCell>
                                                <TableCell sx={{ fontWeight: "bold",backgroundColor: "#e0e7ff", textAlign: "center",fontSize: "12px" }}>{isPetanque || isBasket ? "DP" : "DB"}</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {pouleData.map((team, idx) => (
                                                <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f9" }}>
                                                  <TableCell sx={{ fontSize: "12px"}}>{team.nom_equipe}</TableCell>
                                                  {isBasket ? (
                                                    <>
                                                      <TableCell sx={{ padding: "2px 7px", textAlign: "center", fontSize: "12px" }}>{team.mj}</TableCell>
                                                      <TableCell sx={{ padding: "2px 7px", textAlign: "center", fontSize: "12px" }}>{team.v}</TableCell>
                                                      <TableCell sx={{ padding: "2px 7px", textAlign: "center", fontSize: "12px" }}>{team.d}</TableCell>
                                                    </>
                                                  ) : (
                                                    <TableCell sx={{ padding: "2px 7px", textAlign: "center", fontSize: "12px" }}>{team.points}</TableCell>
                                                  )}                                              
                                                  <TableCell sx={{ textAlign: "center",fontSize: "12px" }}>{team.points_marques ?? team.buts_marques}</TableCell>
                                                  <TableCell sx={{ textAlign: "center",fontSize: "12px" }}>{team.points_concedes ?? team.buts_encaisses}</TableCell>
                                                  <TableCell sx={{ textAlign: "center",fontSize: "12px" }}>{team.difference_points ?? team.difference_buts}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                      </Grid>
                                    );
                                  })}
                              </Grid>
                            </Box>
                          ))}
                        </Box>
                      );
                    })}




                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={{ textAlign: "center", mt: 3 }}>Aucun classement disponible</Typography>
      )}
    </Box>
  );
};

export default ClassementEquipe;
