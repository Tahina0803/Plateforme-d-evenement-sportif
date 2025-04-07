import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Grid, Table, TableBody, TableCell, TableRow, Paper, TableHead, TableContainer, Button
} from '@mui/material';
import Header from './../../components/public/Header';
import Footer from './../../components/public/Footer';

const ResultatSpecific = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [results, setResults] = useState([]);
  const [classement, setClassement] = useState(null);
  const [classementGeneral, setClassementGeneral] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [loadingClassement, setLoadingClassement] = useState(false);
  const [showClassement, setShowClassement] = useState(false);
  const [nomSport, setNomSport] = useState('');
  const [modeClassement, setModeClassement] = useState('general'); // "general" ou "journalier"

  const isBasket = nomSport === 'basketball';
  const isPetanque = nomSport === 'pétanque';

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/organizer/public/events');
      const allOption = { id_evenement: 'all', nom_event: 'Tous les événements' };
      setEvents([allOption, ...response.data]);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchResults = async (eventId) => {
    setLoadingResults(true);
    try {
      const url = eventId === 'all'
        ? 'http://localhost:3001/api/resultats/all'
        : `http://localhost:3001/api/resultats/${eventId}/matches`;
      const response = await axios.get(url);
      setResults(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats :", error);
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchClassement = async (eventId) => {
    setLoadingClassement(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/resultats/classement/${eventId}`);
      const data = response.data;

      if (data && data.sport) {
        setNomSport(data.sport.toLowerCase());
        setClassement(data.classement || {});
        setClassementGeneral(data.classement_general || []);
        setModeClassement('general'); // Affiche par défaut le classement général
      } else {
        console.error("Le champ 'sport' est manquant dans la réponse");
        setClassement({});
        setClassementGeneral([]);
        setNomSport("inconnu");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du classement :", error);
      setClassement({});
      setClassementGeneral([]);
    } finally {
      setLoadingClassement(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchResults('all');
  }, []);

  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);
    setShowClassement(false);
    fetchResults(eventId);
  };

  const handleVoirClassement = () => {
    if (selectedEvent !== 'all') {
      fetchClassement(selectedEvent);
      setShowClassement(true);
    }
  };

  const handleRetourResultats = () => {
    setShowClassement(false);
  };

  const groupResults = (results) => {
    const grouped = {};
    results.forEach(result => {
      const {
        eventName = 'Événement inconnu',
        phase = 'Phase inconnue',
        journee = 'Journée inconnue',
      } = result;

      const eventKey = selectedEvent === 'all' ? eventName : 'unique';
      if (!grouped[eventKey]) grouped[eventKey] = {};
      if (!grouped[eventKey][phase]) grouped[eventKey][phase] = {};
      if (!grouped[eventKey][phase][journee]) grouped[eventKey][phase][journee] = [];

      grouped[eventKey][phase][journee].push(result);
    });

    return grouped;
  };

  const groupedResults = groupResults(results);

  return (
    <>
      <Box sx={{ padding: { xs: "16px", sm: "32px" }, margin: "auto", width: { xs: "100%", md: "75%" } }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          Résultats des rencontres
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Choisir un événement</InputLabel>
            <Select
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              label="Choisir un événement"
            >
              {loadingEvents ? (
                <MenuItem disabled>Chargement...</MenuItem>
              ) : events.length > 0 ? (
                events.map(event => (
                  <MenuItem key={event.id_evenement} value={event.id_evenement}>
                    {event.nom_event}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun événement disponible</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ borderBottom: "2px solid #1976d2", marginBottom: 4, marginTop: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={10} lg={10} sx={{ margin: 'auto' }}>

            {showClassement ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRetourResultats}
                  sx={{ mb: 2 }}
                >
                  Retour aux résultats
                </Button>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    {modeClassement === "general" ? "Classement général" : "Classement journalier"}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setModeClassement(modeClassement === "general" ? "journalier" : "general")}
                  >
                    {modeClassement === "general" ? "Voir classement journalier" : "Retour au classement général"}
                  </Button>
                </Box>

                {loadingClassement ? (
                  <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                ) : (
                  <TableContainer component={Paper} sx={{ width: '100%', margin: "auto" }}>
                    <Table>
                      <TableHead>
                        {modeClassement === "general" && (
                          <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, border: "none", }}>Équipe</TableCell>
                            {isBasket ? (
                              <>
                                <TableCell align="center" sx={{ border: "none", fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, }}>MJ</TableCell>
                                <TableCell align="center" sx={{ border: "none", fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, }}>V</TableCell>
                                <TableCell align="center" sx={{ border: "none", fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, }}>D</TableCell>
                              </>
                            ) : (
                              <TableCell align="center">Pt</TableCell>
                            )}
                            <TableCell align="center">{isPetanque || isBasket ? "PM" : "BM"}</TableCell>
                            <TableCell align="center">{isPetanque || isBasket ? "PC" : "BE"}</TableCell>
                            <TableCell align="center">{isPetanque || isBasket ? "DP" : "DB"}</TableCell>
                          </TableRow>
                        )}
                      </TableHead>

                      <TableBody>
                        {modeClassement === "general" ? (
                          classementGeneral.map((team, index) => (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "white" : "#f5f5f9" }}>
                              <TableCell align="center" sx={{ padding: "5px 8px", border: "none", }}>{team.nom_equipe}</TableCell>
                              {isBasket ? (
                                <>
                                  <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{team.mj}</TableCell>
                                  <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{team.v}</TableCell>
                                  <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{team.d}</TableCell>
                                </>
                              ) : (
                                <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{team.points}</TableCell>
                              )}
                              <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{isBasket || isPetanque ? team.points_marques : team.buts_marques}</TableCell>
                              <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{isBasket || isPetanque ? team.points_concedes : team.buts_encaisses}</TableCell>
                              <TableCell align="center" sx={{ border: "none", padding: "5px 8px" }}>{isBasket || isPetanque ? team.difference_points : team.difference_buts}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          classement && Object.entries(classement).map(([phase, phasesData]) => (
                            <Box key={phase} sx={{ mb: 4 }}>

                              {Object.entries(phasesData).map(([journee, journeeData]) => (
                                <Box key={phase} sx={{ mb: 4 }}>
                                  <Typography variant="h5" sx={{ mb: 2 }}>{phase}</Typography>
                                  {Object.entries(phasesData).map(([journee, journeeData]) => (
                                    <Box key={journee} sx={{ ml: 2, mb: 3 }}>
                                      <Typography variant="h6">{`${journee}`}</Typography>
                                      <Grid container spacing={2}>
                                        {Object.entries(journeeData).map(([poule, pouleData], idx) => (
                                          <Grid item xs={6} key={poule} sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>{`${poule}`}</Typography>
                                            <TableContainer component={Paper} sx={{ mb: 2 }}>
                                              <Table size="small">
                                                <TableHead>
                                                  <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                                                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, border: "none", }}>Équipe</TableCell>
                                                    {isBasket ? (
                                                      <>
                                                        <TableCell align="center" sx={{ border: "none", fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, }}>MJ</TableCell>
                                                        <TableCell align="center" sx={{ border: "none", fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, }}>V</TableCell>
                                                        <TableCell align="center" sx={{ border: "none", fontWeight: "bold", fontSize: { xs: "12px", md: "15px" }, }}>D</TableCell>
                                                      </>
                                                    ) : (
                                                      <TableCell align="center">Pt</TableCell>
                                                    )}
                                                    <TableCell align="center">{isPetanque || isBasket ? "PM" : "BM"}</TableCell>
                                                    <TableCell align="center">{isPetanque || isBasket ? "PC" : "BE"}</TableCell>
                                                    <TableCell align="center">{isPetanque || isBasket ? "DP" : "DB"}</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {pouleData.map((team, index) => (
                                                    <TableRow key={index}>
                                                      <TableCell>{team.nom_equipe}</TableCell>
                                                      {isBasket ? (
                                                        <>
                                                          <TableCell align="center">{team.mj}</TableCell>
                                                          <TableCell align="center">{team.v}</TableCell>
                                                          <TableCell align="center">{team.d}</TableCell>
                                                        </>
                                                      ) : (
                                                        <TableCell align="center">{team.points}</TableCell>
                                                      )}
                                                      <TableCell align="center">{isBasket || isPetanque ? team.points_marques : team.buts_marques}</TableCell>
                                                      <TableCell align="center">{isBasket || isPetanque ? team.points_concedes : team.buts_encaisses}</TableCell>
                                                      <TableCell align="center">{isBasket || isPetanque ? team.difference_points : team.difference_buts}</TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            </TableContainer>
                                          </Grid>
                                        ))}
                                      </Grid>
                                    </Box>
                                  ))}
                                </Box>

                              ))}
                            </Box>

                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            ) : (
              <>
                {loadingResults ? (
                  <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                ) : results.length > 0 ? (
                  Object.entries(groupedResults).map(([eventName, phases]) => (
                    <Box key={eventName} sx={{ mb: 6 }}>
                      {Object.entries(phases).map(([phase, journees]) => (
                        <Box key={phase} sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4">
                              {selectedEvent === 'all'
                                ? eventName
                                : events.find(event => event.id_evenement === selectedEvent)?.nom_event || "Événement inconnu"}
                            </Typography>

                            {selectedEvent !== 'all' && (
                              <Button
                                variant="text"
                                color="primary"
                                onClick={handleVoirClassement}
                                sx={{ textTransform: "none", fontSize: "18px" }}
                              >
                                Voir Classement
                              </Button>
                            )}
                          </Box>

                          <Typography variant="h5" sx={{ mb: 1 }}>{`Phase : ${phase}`}</Typography>
                          {Object.entries(journees).map(([journee, matchs]) => (
                            <Box key={journee} sx={{ mb: 3 }}>
                              <Typography variant="h6" sx={{ mb: 1 }}>{`Journée : ${journee}`}</Typography>
                              <TableContainer component={Paper}>
                                <Table>
                                  <TableHead>
                                    <TableRow sx={{ backgroundColor: "#e0e7ff", p: 1, fontWeight: "bold", textTransform: "uppercase", }}>
                                      <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase", padding: "8px 5px", borderRight: "1px solid white ", }}>Date</TableCell>
                                      <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase", padding: "8px 5px", borderRight: "1px solid white ", }}>Heure</TableCell>
                                      <TableCell sx={{ textTransform: "uppercase", border: "none", borderRight: "1px solid white ", fontWeight: "bold", textAlign: "center", fontSize: { xs: "12px", md: "15px" }, padding: "8px 5px" }} colSpan={3}>Résultats</TableCell>

                                      <TableCell align="center" sx={{ fontWeight: "bold", padding: "8px 5px" }}>Lieu</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {matchs.map((match, idx) => (
                                      <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f9" }}>
                                        <TableCell sx={{ border: "none", textAlign: "center", padding: "4px 5px", fontSize: { xs: "12px", md: "12px" } }}>
                                          {
                                            new Date(match.date_rencontre).toLocaleDateString("fr-FR", {
                                              weekday: "long",
                                              day: "numeric",
                                              month: "long"
                                            }).replace(/janvier/i, 'jan.')
                                              .replace(/février/i, 'fév.')
                                              .replace(/mars/i, 'mar.')
                                              .replace(/avril/i, 'avr.')
                                              .replace(/mai/i, 'mai.')
                                              .replace(/juin/i, 'juin.')
                                              .replace(/juillet/i, 'juil.')
                                              .replace(/août/i, 'août.')
                                              .replace(/septembre/i, 'sept.')
                                              .replace(/octobre/i, 'oct.')
                                              .replace(/novembre/i, 'nov.')
                                              .replace(/décembre/i, 'déc.')
                                          }
                                        </TableCell>
                                        <TableCell sx={{ padding: "4px 5px", border: "none", fontSize: { xs: "12px", md: "12px" }, textAlign: "center", padding: "4px 5px" }}>
                                          {match.heure_rencontre ? match.heure_rencontre.split(":").slice(0, 2).join("h") : "--h--"}
                                        </TableCell>
                                        <TableCell align="right" sx={{ padding: "4px 5px", border: "none", fontSize: { xs: "12px", md: "12px" } }}>{match.participant_a}</TableCell>
                                        <TableCell align="center" sx={{ padding: "4px 10px", border: "none", fontWeight: "bold", color: "#f50057", fontSize: { xs: "12px", md: "12px" } }}>
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span style={{ flex: 1, textAlign: 'center' }}>{match.score_A}</span>
                                            <span style={{ flex: 0, textAlign: 'center', padding:"0px 7px"}}> - </span>
                                            <span style={{ flex: 1, textAlign: 'center' }}>{match.score_B}</span>
                                          </Box>
                                        </TableCell>
                                        <TableCell align="left" sx={{ padding: "4px 5px", border: "none", fontSize: { xs: "12px", md: "12px" } }}>{match.participant_b}</TableCell>
                                        <TableCell align="center" sx={{ padding: "4px 5px", border: "none", fontSize: { xs: "12px", md: "12px" } }}>{match.lieu_rencontre}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>Aucun résultat disponible</Typography>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default ResultatSpecific;
