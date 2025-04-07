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
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import SendEmailDialog from "./SendEmailDialog";

const AdminOrganizerList = () => {
  const [organizers, setOrganizers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // pour ouvrir/fermer le popup
  const [selectedOrganizer, setSelectedOrganizer] = useState(null); // Organisateur sélectionné
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrganizers = async () => {
      const token = localStorage.getItem("token");
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

  const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet organisateur ?")) {
      try {
        await axios.delete(
          `http://localhost:3001/api/auth/admin/organizers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrganizers((prev) =>
          prev.filter((org) => org.id_organisateur !== id)
        );
        alert("Organisateur supprimé avec succès.");
      } catch (error) {
        console.error(
          "Erreur lors de la suppression :",
          error.response?.data.message || error.message
        );
      }
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Organisateurs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizers.map((organizer) => (
              <TableRow key={organizer.id_organisateur}>
                <TableCell>{organizer.nom_organisateur}</TableCell>
                <TableCell>{organizer.email_organisateur}</TableCell>
                <TableCell>{organizer.tel_organisateur}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(organizer)}
                    sx={{ mr: 1 }}
                  >
                    Envoyer un email
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(organizer.id_organisateur)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* inclusion du composant "Envoyer un email" */}
      {selectedOrganizer && (
        <SendEmailDialog
          open={openDialog}
          onClose={handleCloseDialog}
          organizer={selectedOrganizer}
          token={token}
        />
      )}
    </Box>
  );
};

export default AdminOrganizerList;
