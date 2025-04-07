import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Divider,
    Card,
    Button,
} from '@mui/material';
import {
    DateRange as DateRangeIcon,
    HelpOutline as HelpOutlineIcon,
    Room as RoomIcon,
    PhoneAndroid as PhoneAndroidIcon,
    Mail as MailIcon,
    Nfc as NfcIcon,
} from '@mui/icons-material';
import DOMPurify from 'dompurify';

const ContenuPrincipal = ({ event, onScrollToInscrire }) => {
    if (!event) {
        console.error('Aucun événement fourni à ContenuPrincipal.');
        return null;
    }

    return (
        <Container
            sx={{
                position: 'relative',
                zIndex: 2,
                marginTop: 7,
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                '@media (max-width: 960px)': { padding: '0 16px' },
            }}
            disableGutters
        >
            <Grid
                container
                spacing={4}
                sx={{
                    maxWidth: 'md',
                    padding: 0,
                    marginLeft: { md: 15 },
                    justifyContent: 'center',
                    '@media (max-width: 960px)': { width: '100%' },
                }}
            >
                {/* Texte principal */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                            {event.nom_event}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: 'gray', marginY: '20px' }}
                        >
                            <DateRangeIcon
                                sx={{ verticalAlign: 'middle', mr: 1, color: '#f50057' }}
                                aria-label="Date"
                            />
                            <span style={{ fontSize: '12px' }}>
                                {new Date(event.date_debut).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>{' '}
                            |{' '}
                            <HelpOutlineIcon
                                sx={{ verticalAlign: 'middle', mx: 1, color: '#f50057' }}
                                aria-label="Sport"
                            />
                            <span style={{ fontSize: '12px' }}>{event.nom_sport}</span>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mb: 3 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'rgb(43, 173, 224)',
                                    padding: '3px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                }}
                            >
                                {event.type_event}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'rgb(43, 173, 224)',
                                    padding: '2px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                }}
                            >
                                {event.genre_participant}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-line' }}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(event.description_detail),
                        }}
                    />
                </Grid>

                {/* Section de pré-inscription et informations */}
                <Grid item xs={12} md={4} sx={{ marginTop: { xs: 0, sm: 4 } }}>
                    <Box>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onScrollToInscrire} // Défilement vers "S'INSCRIRE"
                            sx={{
                                backgroundColor: '#f50057',
                                color: 'white',
                                padding: '8px',
                                fontSize: '13px',
                                mb: 3,
                                borderRadius: '0px',
                                '&:hover': {
                                    backgroundColor: '#d4004c',
                                },
                            }}
                        >
                            INSCRIPTION
                        </Button>
                        <Card
                            sx={{
                                padding: '10px',
                                backgroundColor: 'rgb(250, 250, 250)',
                                boxShadow: 'none',
                            }}
                        >
                            <Typography sx={{ marginBottom: '15px' }}>
                                Rendez-vous sur le lieu de l'événement !
                            </Typography>
                            <Divider sx={{ borderColor: '#898D8F', marginY: 2 }} />
                            <Box sx={{ marginTop: '10px' }}>
                                <iframe
                                    title="Google Map"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                                        event.lieu_event
                                    )}&output=embed`}
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </Box>
                            <Divider sx={{ borderColor: '#898D8F', marginY: 2 }} />
                            <Box>
                                <RoomIcon
                                    sx={{ verticalAlign: 'middle', mr: 1, fontSize: '30px', mb: 2 }}
                                />
                                <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '30px', color: 'red', }}>
                                    Lieu
                                </Typography>
                                <Typography variant="body2" sx={{ marginLeft: 0 }}>
                                    {event.lieu_event}
                                </Typography>
                            </Box>
                            <Divider sx={{ borderColor: '#898D8F', marginY: 2 }} />
                            <Box>
                                <PhoneAndroidIcon
                                    sx={{ verticalAlign: 'middle', mr: 1, fontSize: '30px', mb: 2 }}
                                    aria-label="Icône de contact"
                                />
                                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', fontSize: '30px', color: 'red', }}>
                                    Contact
                                </Typography>
                                {event.tel_organisateur && (
                                    <Typography
                                        variant="body2"
                                        sx={{ display: 'flex', alignItems: 'center', marginLeft: 0, mt: 1 }}
                                    >
                                        <PhoneAndroidIcon
                                            sx={{ verticalAlign: 'middle', mr: 1, width: 18 }}
                                            aria-label="Téléphone"
                                        />
                                        {event.tel_organisateur}
                                    </Typography>
                                )}
                                {!event.tel_organisateur && (
                                    <Typography variant="body2" sx={{ marginLeft: 4, mt: 1 }}>
                                        Téléphone : Non disponible
                                    </Typography>
                                )}
                                {event.email_organisateur && (
                                    <Typography
                                        variant="body2"
                                        sx={{ display: 'flex', alignItems: 'center', marginLeft: 0, mt: 1 }}
                                    >
                                        <MailIcon
                                            sx={{ verticalAlign: 'middle', mr: 1, width: 18 }}
                                            aria-label="Email"
                                        />
                                        {event.email_organisateur}
                                    </Typography>
                                )}
                                {!event.email_organisateur && (
                                    <Typography variant="body2" sx={{ marginLeft: 2, mt: 1 }}>
                                        Email : Non disponible
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ borderColor: '#898D8F', marginY: 2 }} />
                            <Box>
                                <NfcIcon
                                    sx={{ verticalAlign: 'middle', mr: 1, fontSize: '30px', mb: 2 }}
                                />
                                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', fontSize: '30px', color: 'red', }}>
                                    Informations
                                </Typography>
                                <Typography variant="body2" sx={{ marginLeft: 0, paddingBottom: 2, paddingTop: 1 }}>
                                    Frais d'inscription : {parseInt(event.frais_inscription).toLocaleString('fr-FR')} Ar
                                </Typography>

                                <Typography variant="body2" sx={{ marginLeft: 0 }}>
                                    Nombre de participants : {event.nbr_participant}
                                </Typography>
                            </Box>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContenuPrincipal;
