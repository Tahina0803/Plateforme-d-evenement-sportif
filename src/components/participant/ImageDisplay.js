import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const Imagedisplay = () => {
  const { id_evenement } = useParams(); // Récupère l'ID de l'événement depuis l'URL
  const [event, setEvent] = useState(null); // Stocke les détails de l'événement
  const [loading, setLoading] = useState(true); // État de chargement

  // Récupère les détails de l'événement
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/organizer/event/${id_evenement}`
        );
        setEvent(response.data); // Stocke les données de l'événement
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'événement :",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchEventDetails();
  }, [id_evenement]);

  // Affichage conditionnel basé sur l'état de chargement ou les données
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!event || !event.images_contenu) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <p>Aucune image disponible</p>
      </Box>
    );
  }

  return (
    <>
      {/* Image de fond floue */}
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          width: "100vw",
          height: "375px",
          backgroundImage: `url(${event.images_contenu})`,
          backgroundSize: "cover",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backgroundBlendMode: "overlay",
          backgroundPosition: "center",
          filter: "blur(1px)",
          zIndex: 1,
          margin: 0, // Pas de marge
          padding: 0, // Pas de padding
          display: "flex", // Active Flexbox
          justifyContent: "center", // Centre horizontalement les enfants
          alignItems: "center", // (Optionnel) Centre verticalement les enfants
        }}
      ></Box>
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 2,
          padding: 0,
          margin: "0 auto", // Centre le container
          textAlign: "center", // (Optionnel) Aligne le contenu au centre
        }}
      >
        {/* Image principale */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            paddingTop: 10,
            marginBottom: 14,
          }}
        >
          <Box
            component="img"
            src={event.images_contenu}
            alt={event.nom_event}
            sx={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "cover",
              marginTop: "0px",
            }}
          />
        </Grid>
      </Container>
    </>
  );
};

export default Imagedisplay;
