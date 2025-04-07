// import React, { useEffect, useState } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Typography, CircularProgress, Box
// } from '@mui/material';

// const ContactMessagesList = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/contact/messages')
//       .then(res => res.json())
//       .then(data => {
//         setMessages(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Erreur de récupération :", err);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <Box sx={{ maxWidth: '1000px', margin: 'auto', padding: 3 }}>
//       <Typography variant="h5" gutterBottom align="center">
//         📩 Messages de contact
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <TableContainer component={Paper} elevation={3}>
//           <Table>
//             <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//               <TableRow>
//                 <TableCell><strong>Nom</strong></TableCell>
//                 <TableCell><strong>Email</strong></TableCell>
//                 <TableCell><strong>Objet</strong></TableCell>
//                 <TableCell><strong>Message</strong></TableCell>
//                 <TableCell><strong>Date</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {messages.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">Aucun message trouvé.</TableCell>
//                 </TableRow>
//               ) : (
//                 messages.map((msg) => (
//                   <TableRow key={msg.id}>
//                     <TableCell>{msg.name}</TableCell>
//                     <TableCell>{msg.email}</TableCell>
//                     <TableCell>{msg.subject}</TableCell>
//                     <TableCell>{msg.message}</TableCell>
//                     <TableCell>{new Date(msg.created_at).toLocaleString()}</TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default ContactMessagesList;
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, IconButton, Tooltip, useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ContactMessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

   const theme = useTheme();

  const fetchMessages = () => {
    fetch('http://localhost:3001/api/contact/messages')
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de récupération :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/contact/messages/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        alert("Message supprimé !");
        fetchMessages(); // 🔄 Refresh
      } else {
        alert(result.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur serveur.");
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: 'auto', padding: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Messages de contact
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5"   }}>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Objet</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Aucun message trouvé.</TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>{msg.message}</TableCell>
                    <TableCell>{new Date(msg.created_at).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDelete(msg.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ContactMessagesList;
