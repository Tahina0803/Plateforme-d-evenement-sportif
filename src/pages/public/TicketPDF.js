import React, { useRef, useState, useEffect} from "react";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from '../../assets/img/logo.png';
import { Phone } from "@mui/icons-material";

const TicketPDF = ({ event, selectedTicket, quantity, total, onComplete }) => {
  const ticketRefs = useRef([]);
  const [nomOrganisateur, setNomOrganisateur] = useState("Organisateur inconnu");

  // Récupérer le nom de l'organisateur depuis une API en fonction de id_organisateur
  useEffect(() => {
    if (!event || !event.id_organisateur) {
      console.warn("⚠️ Aucun ID organisateur disponible !");
      return;
    }
  
    const fetchOrganisateur = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/organizer/profile/${event.id_organisateur}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
  
        if (data.nom_organisateur) {
          setNomOrganisateur(data.nom_organisateur);
        } else {
          console.warn("⚠️ L'organisateur n'a pas de nom dans la réponse API :", data);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'organisateur :", error);
      }
    };
  
    fetchOrganisateur();
  }, [event]);
  
  // Générer une liste de numéros de billets uniques
  const ticketNumbers = Array.from({ length: quantity }, () =>
    `QEVT-${Math.floor(100000 + Math.random() * 900000)}`
  );

  console.log("les données dans event sont : ", event)
  
  const generatePDF = () => {
    // Détection de l'affichage mobile (largeur inférieure ou égale à 768 pixels)
    const isMobile = window.innerWidth <= 768;

    // Dimensions du format A4 en millimètres
    const pdfWidth = 210; // Largeur d'une page A4
    const pdfHeight = 297; // Hauteur d'une page A4

    // Dimensions des billets en fonction de l'affichage (mobile ou desktop)
    const ticketWidth = isMobile ? 90 : 180; // Billets plus petits sur mobile
    const ticketHeight = isMobile ? 140 : 65; // Hauteur uniforme sur les deux formats

    // Espacements entre les billets
    const spacingX = isMobile ? 5 : 0; // Espacement horizontal (0 sur desktop)
    const spacingY = isMobile ? 2 : 2; // Espacement vertical (plus espacé sur mobile)

    // Nombre de billets affichés par ligne et par colonne
    const ticketsPerRow = isMobile ? 2 : 1; // 2 billets par ligne sur mobile, 1 sur desktop
    const ticketsPerColumn = isMobile ? 2 : 4; // 2 lignes de billets sur mobile, 4 sur desktop

    // Nombre total de billets par page
    const ticketsPerPage = ticketsPerRow * ticketsPerColumn; // 4 billets par page sur mobile

    // Coordonnées initiales où le premier billet sera placé sur la page PDF
    let xOffset = 10;
    let yOffset = 10;

    // Création d'un document PDF avec les dimensions d'une page A4
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [pdfWidth, pdfHeight] });

    /**
     * Fonction asynchrone pour capturer une image d'un billet et l'ajouter au PDF
     * @param {number} index - L'index du billet à générer
     * @returns {Promise<void>}
     */
    const generateTicketImage = (index) => {
        return new Promise((resolve) => {
            // Récupération de l'élément HTML du billet correspondant à l'index
            const ticketElement = ticketRefs.current[index];

            // Vérification de l'existence de l'élément
            if (!ticketElement) {
                console.error(`Élément de billet manquant pour l'index ${index}`);
                return resolve(); // Résolution de la promesse même si l'élément est manquant
            }

            // Capture du billet sous forme d'image avec html2canvas
            html2canvas(ticketElement, { scale: 2, useCORS: true }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png"); // Conversion en image PNG

                // Ajout de l'image dans le PDF aux coordonnées actuelles
                pdf.addImage(imgData, "PNG", xOffset, yOffset, ticketWidth, ticketHeight);

                // Mise à jour des coordonnées pour positionner le prochain billet
                if ((index + 1) % ticketsPerRow === 0) {
                    // Si on atteint la fin d'une ligne, on passe à la ligne suivante
                    xOffset = 10;
                    yOffset += ticketHeight + spacingY;
                } else {
                    // Sinon, on place le billet suivant sur la même ligne
                    xOffset += ticketWidth + spacingX;
                }

                // Vérification si une nouvelle page est nécessaire (si on dépasse la limite par page)
                if ((index + 1) % ticketsPerPage === 0) {
                    pdf.addPage(); // Ajout d'une nouvelle page
                    xOffset = 10; // Réinitialisation des coordonnées pour la nouvelle page
                    yOffset = 10;
                }

                resolve(); // Résolution de la promesse une fois le billet ajouté au PDF
            });
        });
    };

    // Création d'un tableau de promesses pour générer les images des billets
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        promises.push(generateTicketImage(i));
    }

    // Une fois toutes les promesses résolues, le PDF est enregistré et une action de fin est exécutée
    Promise.all(promises).then(() => {
        pdf.save(`Billets_${event.nom_event}.pdf`); // Téléchargement du PDF sous un nom spécifique
        if (onComplete) onComplete(); // Exécution de la fonction de callback si elle est définie
    });
};
      
  
      
    

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {ticketNumbers.map((ticketNumber, index) => (
        <div
          key={index}
          ref={(el) => (ticketRefs.current[index] = el)}
          style={{ width: "100%", maxWidth: "800px", padding: "10px", backgroundColor: "#F8FAFC" }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 5,
              backgroundColor: "#F8FAFC",
              border: "2px solid #0A3D62"
            }}
          >
            <Box sx={{
              width: { xs: "100%", md: "25%" },
              height: { xs: "350px", md: "auto" },
              minHeight: "150px",
              backgroundImage: `url(${event.logo_event})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }} />

            <CardContent
              sx={{
                width: { xs: "100%", md: "50%" },
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <img src={Logo} alt="QuickEvent Logo" style={{ maxWidth: "100px", height: "auto" }} />
                <Typography variant="body2" color="#0A3D62" fontWeight="bold" sx={{ textTransform: "uppercase" }}>
                  {nomOrganisateur}
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight="bold" color="#0A3D62" mt={1}>
                {event.nom_event}
              </Typography>

              <Box sx={{ backgroundColor: "#0A3D62", color: "white", padding: 1, mt: 2, borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold">Date</Typography>
                <Typography variant="body2">
                  <strong>{new Date(event.date_debut).toLocaleDateString()}</strong> au <strong>{new Date(event.date_fin).toLocaleDateString()}</strong>
                </Typography>
                <Typography variant="body2"><strong>Lieu :</strong> {event.lieu_event}</Typography>
                <Typography variant="body2"><strong>Type de billet :</strong> {selectedTicket?.type || selectedTicket?.type_ticket}</Typography>
              </Box>
              <Box sx={{ mt: 2 }}> {/* Ajout d'une marge en haut pour espacer */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid #0A3D62",
                  borderRadius: "50px",
                  padding: "5px 15px",
                  color: "#0A3D62",
                  fontWeight: "bold",
                  width: "fit-content",
                }}
              >
                <Phone sx={{ color: "#0A3D62", marginRight: "8px" }} />
                <Typography variant="body2" fontWeight="bold">
                  infoline : {event.tel_organisateur || "Non disponible"}
                </Typography>
              </Box>
            </Box>

            </CardContent>

            <Box sx={{
              width: { xs: "100%", md: "25%" },
              backgroundColor: "#1E3A8A",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              borderLeft: "2px dashed white"
            }}>
              <Typography variant="body1" fontWeight="bold">TICKET CODE</Typography>
              <Typography variant="body2" fontWeight="bold">{ticketNumber}</Typography>
              <QRCodeCanvas value={`Numéro du billet: ${ticketNumber}\nÉvénement: ${event.nom_event}\nLieu: ${event.lieu_event}\nDate: ${new Date(event.date_debut).toLocaleDateString()} au ${new Date(event.date_fin).toLocaleDateString()}`} size={120} bgColor="#ffffff" fgColor="#000000" style={{ maxWidth: "100%", height: "auto" }} />
              <Typography variant="caption">Show this ticket to</Typography>
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>www.quickevent.com</Typography>
            </Box>
          </Card>
        </div>
      ))}

      <Button onClick={generatePDF} variant="contained" color="primary" sx={{ mt: 3 }}>
        Télécharger les billets en PDF
      </Button>
    </div>
  );
};

export default TicketPDF;






















