// import { useState, useEffect } from 'react';

// const Newsletter = () => {
//   const [subscribers, setSubscribers] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/newsletter/list')
//       .then(res => res.json())
//       .then(data => {
//         console.log("Réponse API :", data); // Vérifier la structure de la réponse
//         setSubscribers(data);
//       })
//       .catch(error => console.error(error));
//   }, []);
  

//   return (
//     <div>
//       <h2>Liste des abonnés</h2>
//       <ul>
//         {subscribers.map(subscriber => (
//           <li key={subscriber.id}>{subscriber.email}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Newsletter;
import { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SendNewsletter from "./SendNewsletter";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/newsletter/list")
      .then((res) => res.json())
      .then((data) => {
        console.log("Réponse API :", data); // Vérifier la structure de la réponse
        setSubscribers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Liste des abonnés */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Liste des abonnés
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Formulaire d'envoi de newsletter */}
        <Grid item xs={12} md={6}>
          <SendNewsletter subscribers={subscribers} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Newsletter;
