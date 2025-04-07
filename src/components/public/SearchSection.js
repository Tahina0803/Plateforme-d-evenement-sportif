import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, Typography, Grid } from '@mui/material';

const SearchSection = ({ onSearch }) => {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('November');
  const [sport, setSport] = useState('Tous les sports');
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    onSearch({ year, month, sport, search });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} justifyContent="space-between">
        
        {/* Section Années */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" gutterBottom>
            ANNÉES
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 , mt: { xs: 2, md: 2 }}}>
            <Button variant={year === '2023' ? 'contained' : 'outlined'} onClick={() => setYear('2023')}>
              2023
            </Button>
            <Button variant={year === '2024' ? 'contained' : 'outlined'} onClick={() => setYear('2024')}>
              2024
            </Button>
            <Button variant={year === '2025' ? 'contained' : 'outlined'} onClick={() => setYear('2025')}>
              2025
            </Button>
          </Box>
        </Grid>
        
        {/* Section Mois */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom>
            MOIS
          </Typography>
          <Select value={month} onChange={(e) => setMonth(e.target.value)} fullWidth>
            <MenuItem value="January">January</MenuItem>
            <MenuItem value="February">February</MenuItem>
            <MenuItem value="March">March</MenuItem>
            <MenuItem value="April">April</MenuItem>
            <MenuItem value="May">May</MenuItem>
            <MenuItem value="June">June</MenuItem>
            <MenuItem value="July">July</MenuItem>
            <MenuItem value="August">August</MenuItem>
            <MenuItem value="September">September</MenuItem>
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem>
          </Select>
        </Grid>

        {/* Section Sports */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom>
            SPORTS
          </Typography>
          <Select value={sport} onChange={(e) => setSport(e.target.value)} fullWidth>
            <MenuItem value="Tous les sports">Tous les sports</MenuItem>
            <MenuItem value="Football">Football</MenuItem>
            <MenuItem value="Basketball">Basketball</MenuItem>
            <MenuItem value="Pétanque">Pétanque</MenuItem>
          </Select>
        </Grid>

        {/* Section Recherche */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            RECHERCHE
          </Typography>
          <TextField
            placeholder="Nom / lieu de l'événement"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Bouton Rechercher */}
        <Grid item xs={12} sm={6} md={2}>
          <Button variant="contained" color="primary" sx={{ mt: { xs: 2, md: 6 },}} onClick={handleSearch} fullWidth>
            Rechercher
          </Button>
        </Grid>
      </Grid>
      
    </Box>
  );
};

export default SearchSection;
