import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tabs, Tab, Typography, Checkbox, Grid, Box, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const GestionRoles = () => {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [tabValue, setTabValue] = useState(0);
  const [openAddAdmin, setOpenAddAdmin] = useState(false); // State for Add Admin Modal
  const [openListAdmins, setOpenListAdmins] = useState(false); // State for List Admins Modal

  // Liste statique des rôles avec permissions et collaborateurs
  const roles = [
    { name: 'Chef de Projet', permissions: 8, collaborators: 3 },
    { name: 'Membre', permissions: 3, collaborators: 0 },
    { name: 'Directeur', permissions: 16, collaborators: 2 },
    { name: 'Admin', permissions: 'Tout', collaborators: 5 },
    { name: 'Comptable', permissions: 12, collaborators: 1 },
  ];

  // Permissions statiques pour le rôle sélectionné
  const permissions = [
    { category: 'Honoraires', items: [{ name: 'Voir les honoraires', allowed: true }] },
    { category: 'Planning', items: [
      { name: 'Gérer les phases', allowed: true },
      { name: 'Voir les zones', allowed: false },
      { name: 'Afficher la planification des ressources', allowed: true }
    ]},
    { category: 'Budget', items: [
      { name: 'Voir les Budgets', allowed: true },
      { name: 'Gérer les coûts', allowed: false }
    ]}
  ];

  // Gère le changement d'onglet (Permissions équipe ou projet)
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Ouvrir/fermer le modal d'ajout d'administrateur
  const handleOpenAddAdmin = () => {
    setOpenAddAdmin(true);
  };
  const handleCloseAddAdmin = () => {
    setOpenAddAdmin(false);
  };

  // Ouvrir/fermer le modal de la liste des administrateurs
  const handleOpenListAdmins = () => {
    setOpenListAdmins(true);
  };
  const handleCloseListAdmins = () => {
    setOpenListAdmins(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Onglets pour Permissions équipe et projet */}
      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary">
        <Tab label="Permissions Équipe" />
        <Tab label="Permissions Projet" />
      </Tabs>
<Typography variant="h6">Groupes de permissions</Typography>
      <Grid container spacing={3} mt={3}>
        {/* Tableau de gauche : Groupes de permissions */}
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            
            <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpenAddAdmin}>
              + Ajouter Admin
            </Button>
            {/* Bouton pour afficher la liste des administrateurs */}
            <Button variant="outlined" color="secondary" onClick={handleOpenListAdmins}>
              Voir la Liste des Admins
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nom</strong></TableCell>
                  <TableCell><strong>Permissions</strong></TableCell>
                  <TableCell><strong>Collaborateurs</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow
                    key={role.name}
                    hover
                    onClick={() => setSelectedRole(role.name)}
                    selected={selectedRole === role.name}
                  >
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.permissions}</TableCell>
                    <TableCell>{role.collaborators}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Les super admin prennent la main sur toutes les permissions du logiciel.
          </Typography>
        </Grid>

        {/* Permissions pour le rôle sélectionné */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            Permissions - {selectedRole}
          </Typography>
          <Paper elevation={1} style={{ padding: '16px' }}>
            {permissions.map((section, index) => (
              <div key={index}>
                <Typography variant="subtitle1" gutterBottom>
                  {section.category}
                </Typography>
                {section.items.map((permission, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Typography>{permission.name}</Typography>
                    <Checkbox checked={permission.allowed} />
                  </div>
                ))}
                {index < permissions.length - 1 && <hr />}
              </div>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Modal pour Ajouter un Administrateur */}
      <Dialog open={openAddAdmin} onClose={handleCloseAddAdmin}>
        <DialogTitle>Ajouter un nouvel Administrateur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remplissez les informations pour ajouter un nouvel administrateur.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="role"
            label="Rôle"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAdmin}>Annuler</Button>
          <Button onClick={handleCloseAddAdmin} variant="contained" color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Modal pour afficher la Liste des Administrateurs */}
      <Dialog open={openListAdmins} onClose={handleCloseListAdmins}>
        <DialogTitle>Liste des Administrateurs</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voici la liste des administrateurs actuels.
          </DialogContentText>
          <ul>
            <li>Alice Dupont - Admin</li>
            <li>Bob Martin - Directeur</li>
            <li>Charles Durand - Comptable</li>
            <li>Marie Leclerc - Chef de Projet</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseListAdmins}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GestionRoles;
