import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
import OrganizerEventList from "./OrganizerEventList"; // Import du composant OrganizerEventList

const AdminOrganizerEvent = () => {
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState(null);
  const [selectedOrganizerName, setSelectedOrganizerName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/auth/admin/organizers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrganizers(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des organisateurs :",
          error.response?.data.message || error.message
        );
      }
    };

    fetchOrganizers();
  }, [token]);

  const handleViewEvents = (id, name) => {
    setSelectedOrganizerId(id);
    setSelectedOrganizerName(name);
  };

  const handleBackToOrganizers = () => {
    setSelectedOrganizerId(null);
    setSelectedOrganizerName("");
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {!selectedOrganizerId ? (
        <>
          <Typography variant="h4" gutterBottom>
            Voir les événements de chaque Organisateur
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 3}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Nombre d'Événements</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organizers.map((organizer) => (
                  <TableRow key={organizer.id_organisateur}>
                    <TableCell>{organizer.nom_organisateur}</TableCell>
                    <TableCell>{organizer.prenom_organisateur}</TableCell>
                    <TableCell>{organizer.email_organisateur}</TableCell>
                    <TableCell>{organizer.eventCount || 0}</TableCell>
                    <TableCell>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleViewEvents(
                            organizer.id_organisateur,
                            `${organizer.nom_organisateur} ${organizer.prenom_organisateur}`
                          )
                        }
                      >
                        Voir les événements
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <OrganizerEventList
          organizerId={selectedOrganizerId}
          organizerName={selectedOrganizerName}
          onClose={handleBackToOrganizers}
          token={token}
        />
      )}
    </Box>
  );
};

export default AdminOrganizerEvent;
