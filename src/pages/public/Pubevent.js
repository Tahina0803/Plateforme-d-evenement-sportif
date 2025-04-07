import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Footer from './../../components/public/Footer';
import Header from './../../components/public/Header';
import Pubcontent from '../../components/public/Pubcontent';
const Pubevent = () => {
  return (
    <>
    <Header />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '20px', md: '50px' },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Left Section (Text and Button) */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: 'left', md: 'left' },
          marginBottom: { xs: '20px', md: '0' },
          paddingTop: { xs: '20px', md: '20px' },
          paddingBottom: { xs: '20px', md: '80px' },
          paddingLeft: { xs: '20px', md: '80px' },
          paddingRight: { xs: '20px', md: '80px' },
        }}
      >
        <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', mb: 3, fontSize:{ xs: '30px', md:'45px' } }}>
          La plateforme de création la plus simple à utiliser dans le secteur du sport
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 , color:'grey'}}>
        Découvrez pourquoi de nombreux organisateurs d’événements sportifs,
         couvrant des disciplines telles que le basketball, la pétanque et le football,
          ont choisi notre plateforme pour simplifier la gestion de leurs compétitions,
          promouvoir leurs événements, renforcer la visibilité de leurs partenaires,
           et engager leurs participants et supporters.
        </Typography>
        <Button
              variant="outlined"
              onClick={() => window.location.href = './login'}
              sx={{
                padding: '10px',
                backgroundColor: 'white',
                color: 'blue',
                borderColor: 'blue',
                '&:hover': {
                  backgroundColor: 'blue',
                  color: 'white',
                  borderColor: 'blue',
                }
              }}
            >
              Publier un évènement
            </Button>
      </Box>

      {/* Right Section (Images with Soft Reflections and Shadows) */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', position: 'relative', height: '500px' }}>
        
        {/* Image 1 */}
        <Box
          sx={{
            width: '220px',
            height: 'auto',
            borderRadius: '10px',
            position: 'absolute',
            top: '10px',
            right: '70px',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={require('../../assets/img/p2.jpg')}
            alt="Event 1"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 15px 15px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>

        {/* Image 2 */}
        <Box
          sx={{
            width: '180px',
            height: 'auto',
            borderRadius: '10px',
            position: 'absolute',
            top: '100px',
            right: '250px',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={require('../../assets/img/ppp.jpg')}
            alt="Event 2"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 15px 15px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>

        {/* Image 3 */}
        <Box
          sx={{
            width: '200px',
            height: 'auto',
            borderRadius: '10px',
            position: 'absolute',
            top: '200px',
            right: '380px',
            overflow: 'hidden',
            zIndex: 2, // Image 3 au premier plan
          }}
        >
          <Box
            component="img"
            src={require('../../assets/img/b3.jpg')}
            alt="Event 3"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 15px 15px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>

        {/* Image 4 */}
        <Box
          sx={{
            width: '250px',
            height: 'auto',
            borderRadius: '10px',
            position: 'absolute',
            top: '300px',
            right: '150px',
            overflow: 'hidden',
            zIndex: 1, // Image 4 en arrière-plan
          }}
        >
          <Box
            component="img"
            src={require('../../assets/img/F7.jpg')}
            alt="Event 4"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 15px 15px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>
        
      </Box>
      
    </Box>
    <Pubcontent />
     <Footer />
     </>
  );
};

export default Pubevent;
