import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const GestionAdministrateurs = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/auth/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
    }
  };

  const handleAddOpen = () => {
    setCurrentAdmin(null);
    setNewAdmin({ name: '', email: '', password: '' });
    setOpen(true);
  };

  const handleEditOpen = (admin) => {
    setCurrentAdmin(admin);
    setNewAdmin({ name: admin.nom_admin, email: admin.email_admin, password: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (currentAdmin) {
        // Update admin
        await axios.put(`http://localhost:3001/api/auth/admin/update/${currentAdmin.id_admin}`, newAdmin, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new admin
        await axios.post('http://localhost:3001/api/auth/admin/create', newAdmin, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchAdmins();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'administrateur:', error);
    }
  };

  const handleDelete = async (adminId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/auth/admin/delete/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAdmins();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'administrateur:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gestion des Administrateurs</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddOpen}
        sx={{ mb: 2 }}
      >
        Ajouter un administrateur
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id_admin}>
                <TableCell>{admin.nom_admin}</TableCell>
                <TableCell>{admin.email_admin}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditOpen(admin)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(admin.id_admin)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing admin */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentAdmin ? 'Modifier Administrateur' : 'Ajouter Administrateur'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            fullWidth
            margin="dense"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="dense"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Annuler</Button>
          <Button onClick={handleSave} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionAdministrateurs;
