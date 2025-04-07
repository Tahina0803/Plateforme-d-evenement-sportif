import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Footer from './../../components/public/Footer';
import Header from './../../components/public/Header';

const Apropos = () => {
  // État pour suivre la page active
  const [activeStep, setActiveStep] = useState(0);

  // Contenus pour chaque étape
  const stepsContent = [
    {
      title: "",
      blueSection: (
        <Box sx={{ paddingTop: 8, paddingBottom: 0 }}>
          <Typography variant="h4" align="left" color="var(--accent-color)">
            <b>ORGANISEZ VOS EVENEMENTS SPORTIFS</b>
          </Typography>
        </Box>
      ),
      content: (
        <>
          <Typography variant="h4" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
            Travaillez à plusieurs
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            L’organisation d’un événement sportif demande beaucoup de travail.
             C’est pourquoi nous avons pensé que vous souhaiterez être épaulé.
              Pour cela, vous aurez la possibilité de créer une organisation 
              (équipe organisatrice) dans laquelle plusieurs utilisateurs pourront collaborer. 
              Vous pourrez définir un rôle à chaque utilisateur afin que chacun ait une tâche
               différente.
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            Dans votre organisation, vous pourrez également gérer vos
             les photos de vos différents événements, et les participants (que vous pourrez 
             même exporter !).
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
            Vos événements sur mesure
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            Créez autant d’événements que vous le souhaitez ! Qu’il s’agisse d’une compétition du Basketball, Pétanques ou Football. 
            Donnez leur un nom, un lieu et une date, configurez vos événements 
            sportifs comme vous les aviez imaginés !
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            Si l’inscription à votre événement est payante, vous pouvez donner la possibilité 
            aux participants de s’inscrire et de payer en ligne. Vous êtes informé à chaque 
            paiement et vous pouvez à tout moment consulter votre solde depuis l’application.
          </Typography>
          <Box sx={{ display: 'flex',
           justifyContent: 'flex-end', 
           mt: 2, 
           paddingTop: { xs: '8%', sm: '8%', md: '8%' },
           paddingBottom: { xs: '8%', sm: '8%', md: '8%' },
           }}>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(1)}
              sx={{
                padding: '10px',
                // Couleurs par défaut
                backgroundColor: 'white', // Couleur de fond initiale
                color: 'blue',           // Couleur du texte initiale
                borderColor: 'blue',     // Bordure du bouton
                // Couleurs au survol (hover)
                '&:hover': {
                  backgroundColor: 'blue',  // Couleur de fond au survol
                  color: 'white',           // Couleur du texte au survol
                  borderColor: 'blue',      // Garder la bordure bleue
                }
              }}
            >
               PROMOTION ➡
            </Button>
          </Box>
        </>
      )
    },
    {
      title: "",
      blueSection: (
        <Box sx={{ paddingTop: 8, paddingBottom: 0 }}>
          <Typography variant="h4" align="left" color="var(--accent-color)">
            <b>COMMUNIQUEZ SUR VOS EVENEMENTS</b>
          </Typography>
        </Box>
      ),
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
          Optimisez la visibilité de vos événements sportifs
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
          Quick Event vous permet de partager vos événements sportifs avec vos participants et vos 
          partenaires via des canaux de communication personnalisés. Que ce soit par email, 
          réseaux sociaux ou SMS, vous pouvez informer vos participants rapidement des mises à
           jour importantes et des nouvelles dates d’événements.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
          Simplicité de gestion
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
          Vous n'avez pas besoin d'être un expert en technologie pour gérer vos événements. 
          Toutes les informations nécessaires (dates, lieu, épreuves, partenaires, etc.) 
          sont déjà organisées dans votre tableau de bord, 
          et vous pouvez facilement les partager avec vos participants.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
          Personnalisez vos communications
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
          Vous pouvez personnaliser les communications que vous envoyez à vos participants pour qu'elles correspondent 
          aux valeurs et à l'identité de votre structure. Ajoutez des informations importantes telles 
          que les horaires, les mises à jour d'événements ou des offres spéciales pour vos participants.
          </Typography>
          <Box sx={{ display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%', 
          mt: 2,
          paddingTop: { xs: '8%', sm: '8%', md: '8%' },
          paddingBottom: { xs: '8%', sm: '8%', md: '8%' },
          }}>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(0)}
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
              ⬅  ORGANISATION
            </Button>

            <Button
              variant="outlined"
              onClick={() => setActiveStep(2)}
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
               GESTION ➡
            </Button>
          </Box>
        </>
      )
    },
    {
      title: "",
      blueSection: (
        <Box sx={{ paddingTop: 8, paddingBottom: 0 }}>
          <Typography variant="h4" align="left" color="var(--accent-color)">
            <b>GERER VOS EVENEMENTS SPORTIFS</b>
          </Typography>
        </Box>
      ),
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
            Gardez un œil sur votre événement
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            Grâce au tableau de bord, toutes les informations sur votre événement sont rassemblées au
             même endroit ! Nombre de participants, suivi des paiements, places restantes… Retrouvez
              toutes les informations dont vous avez besoin pour gérer votre événement au même
               endroit !
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
            Gestion des inscriptions
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
          La réussite de votre événement repose sur une gestion optimale des inscriptions. 
          Avec notre système intuitif, l'enregistrement des participants devient rapide et efficace.
           Vous pouvez ajouter facilement les informations des participants, tout en réduisant les
            erreurs et en gagnant du temps. Grâce à une interface claire et accessible,
             la gestion des inscriptions se fait sans effort, permettant ainsi de mieux vous concentrer sur d'autres aspects clés de l'organisation.
          </Typography>
          <Box sx={{ display: 'flex',
           justifyContent: 'space-between',
            width: '100%', 
            mt: 2,
            paddingTop: { xs: '8%', sm: '8%', md: '8%' },
            paddingBottom: { xs: '8%', sm: '8%', md: '8%' }, }}>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(1)}
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
              ⬅  PROMOTION
            </Button>

            <Button
              variant="outlined"
              onClick={() => setActiveStep(3)}
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
               STATISTIQUE ➡
            </Button>
          </Box>
        </>
      )
    },
    {
      title: "",
      blueSection: (
        <Box sx={{ paddingTop: 8, paddingBottom: 0 }}>
          <Typography variant="h4" align="left" color="var(--accent-color)">
            <b>BILAN ET STATISTIQUES</b>
          </Typography>
        </Box>
      ),
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
            Base de données
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            Quick Event vous permet de constituer une véritable base de données de sportifs.
             Tous les informations sur les participants de vos événements sont disponibles depuis 
             l’application. Vous pouvez consulter ces informations à tout moment et faire des exports
              au format Excel afin de les exploiter.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'black', paddingTop: '10px' }}>
            Chiffres clés de vos événements
          </Typography>
          <Typography paragraph sx={{ color: 'gray' }}>
            Vous aimeriez savoir si vous attirez de plus en plus de participants chaque année ? 
            Vous aimeriez également en savoir plus sur vos participants ? Quick Event met à votre 
            disposition une palette de statistiques vous permettant de mieux connaître vos
             participants et d’analyser l’évolution de vos événements.
          </Typography>
          <Box sx={{ display: 'flex',
           justifyContent: 'space-between',
            width: '100%', 
            mt: 2,
             mb: 2,
             paddingTop: { xs: '8%', sm: '8%', md: '8%' },
             paddingBottom: { xs: '8%', sm: '8%', md: '8%' },
             }}>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(2)}
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
              ⬅  GESTION
            </Button>

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
              PUBLIER UN EVENEMENT ➡
            </Button>
          </Box>
        </>
      )
    }
  ];

  // Rendu de la page
  return (
    <>
      <Header />
      <Box sx={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        maxWidth: { xs: '90%', sm: '80%', md: '60%' }, // Responsive widths
        margin: 'auto',
      }}>
        {stepsContent[activeStep].blueSection}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h4" gutterBottom>
            {stepsContent[activeStep].title}
          </Typography>
          {stepsContent[activeStep].content}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Apropos;
