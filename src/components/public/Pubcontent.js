import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Icone pour le processus de création
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icone pour le contenu visuel

const Pubcontent = () => {
  return (
    <Box sx={{ padding: { xs: '0px', md: '0px' } }}>
      {/* Titre Principal */}
      <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
      Pourquoi utiliser [ Quick Event ] ?
      </Typography>

      {/* Grid Contenant les deux cartes */}
      <Grid container spacing={4} justifyContent="center">
        {/* Carte 1 : Simplifiez votre processus */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={6}
            sx={{
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '15px' // Espace entre l'icône et le texte
            }}
          >
            <AccessTimeIcon sx={{ fontSize: '40px', color: '#00b8d4' }} /> {/* Icone horloge */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Simplifiez la gestion de vos événements sportifs              </Typography>
              <Typography variant="body1" color="textSecondary">
              Grâce à notre plateforme, tout organisateur peut facilement créer, gérer et partager des événements sportifs tels que le basketball, la pétanque et le football en quelques clics. Plus besoin de dépendre de systèmes complexes, notre interface intuitive vous aide à tout centraliser et à accélérer la gestion de vos compétitions et inscriptions.              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Carte 2 : Professionnalisez votre contenu visuel */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={6}
            sx={{
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '15px' // Espace entre l'icône et le texte
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: '40px', color: '#00897b' }} /> {/* Icone flèche */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Professionnalisez l'organisation de vos tournois              </Typography>
              <Typography variant="body1" color="textSecondary">
              Nos solutions personnalisées vous permettent de créer des événements sportifs cohérents et bien organisés sans effort supplémentaire. Vous pouvez gérer les calendriers, les résultats et les classements en toute simplicité, ce qui augmente l'engagement des participants et la visibilité de votre événement.              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>



      {/* Section des badges */}
      <Box sx={{ backgroundColor: '#3A00FF', padding: '5px 5px', marginTop: '40px' }}>
        {/* Container de la section en utilisant Grid pour séparer le texte et les badges */}
        <Grid container spacing={4} alignItems="center" justifyContent="center">

          {/* Texte à gauche */}
          <Grid item xs={12} md={8} lg={6}>
            <Typography sx={{ color: 'white', mb: 2, fontSize: '16px' }}>
            Quick Event a été reconnue pour son efficacité dans la gestion d'événements sportifs dans plusieurs rapports et témoignages d'utilisateurs. Gagnez du temps et simplifiez l’organisation de vos compétitions sportives.            </Typography>
            <Button
              sx={{ color: 'white', textDecoration: 'underline' }}
              href="#"
            >
              Consultez les évaluations de notre plateforme →
            </Button>
          </Grid>

          {/* Badges à droite */}
          <Grid item xs={12} md={4} lg={3}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: '20px',
              }}
            >
              <Box
                component="img"
                src={require('../../assets/img/F7.jpg')} // Remplacez par votre badge
                alt="High Performer Winter 2024"
                sx={{ width: '70px', height: 'auto' }}
              />
              <Box
                component="img"
                src={require('../../assets/img/F7.jpg')} // Remplacez par votre badge
                alt="Users Love Us"
                sx={{ width: '70px', height: 'auto' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: { xs: '20px', md: '50px' } }}>

        {/* Titre principal */}
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 8 }}>
        Découvrez notre plateforme de gestion d'événements sportifs        </Typography>

        {/* Section 1: Créez des contenus chartés */}
        <Grid container spacing={6} alignItems="center" >
          <Grid item xs={0} md={1}>
          </Grid>
          <Grid item xs={12} md={4}>
            <img
              src={require('../../assets/img/pub1.png')} // Remplacez par votre image
              alt="Create content"
              style={{ width: '100%', borderRadius: '10px', height: '350px' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#333' }}>
            CRÉEZ            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Organisez rapidement vos événements sportifs avec nos outils sur mesure            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Notre solution la plus efficace pour organiser des événements sportifs ! Nous proposons des outils personnalisés pour gérer facilement des tournois et compétitions de sports comme le basketball, la pétanque et le football. Vous pouvez planifier des matchs, gérer les équipes et publier les résultats en quelques clics. Idéal pour les organisateurs qui souhaitent gérer plusieurs événements de manière fluide et professionnelle.            </Typography>
          </Grid>
        </Grid>

        {/* Section 2: Ajoutez des éléments de design */}
        <Grid container spacing={6} alignItems="center" sx={{ mt: 10 }}>
        <Grid item xs={0} md={1} >
           </Grid> 
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#333' }}>
            OPTIMISATION MOBILE
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Accédez à votre événements depuis n'importe quel appareil            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Notre plateforme est entièrement optimisée pour une utilisation sur mobile. Que vous soyez organisateur ou participant, gérez vos événements, consultez les calendriers et suivez les résultats en direct depuis n'importe quel appareil, sans compromis sur la qualité. Conçue pour être responsive, notre plateforme vous offre une expérience utilisateur exceptionnelle, que vous soyez sur un smartphone, une tablette ou un ordinateur.            </Typography>
          </Grid>
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
            <img
              src={require('../../assets/img/vf.png')} // Remplacez par votre image
              alt="Live App"
              style={{ width: '100%', borderRadius: '10px',height: '350px' }}
            />
          </Grid>
        </Grid>

        {/* Section 3: Mobilisez vos employés */}
        <Grid container spacing={6} alignItems="center" sx={{ mt: 10 }}>
        <Grid item xs={0} md={1} >
           </Grid> 
          <Grid item xs={12} md={4}>
            <img
              src={require('../../assets/img/eo3.png')}// Remplacez par votre image
              alt="Network"
              style={{ width: '100%', borderRadius: '10px',height: '350px' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#333' }}>
              INTERNET
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Mobilisez vos participants à partager vos événements sur leurs propres réseaux sociaux            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Distribuez facilement vos contenus chartés avec vos employés, vos joueurs ou encore vos partenaires qui pourront les publier sur leurs propres réseaux sociaux. Ils renforceront vos messages et vous augmenterez votre visibilité.
            </Typography>
          </Grid>
        </Grid>

        {/* Footer - lien vers plus d'informations */}
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Button
            href="#"
            variant="text"
            onClick={() => window.location.href = './apropos'}
            sx={{
              fontSize: '16px',
              color: '#3A00FF',
            }}
          >
            En savoir plus sur notre plateforme →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Pubcontent;
