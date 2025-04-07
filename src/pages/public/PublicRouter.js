import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Error from "../../_utils/Error";
import Layout from "./Layout";
import Login from "./OrganizerLogin";
import DashboardParticipant from "../participant/Dashboard";
import Connexion from "./Connexion";
import Calendrier from "./Calendrier";
import Pagevent from "./Pagevent";
import DetailEvent from "./DetailEvent";
import ResultatPage from "./Resultat";
import Apropos from "./Apropos";
import Pubevent from "./Pubevent";
import Signuppart from "../../components/participant/SignUpPart"
import OrganizerDashboard from "../../pages/organizer/OrganizerDashboard";
import MdpOublier from "../organizer/MdpOublier";
import OrganizerSignUpForm from "../organizer/SignUpFrom";
import UpdateEvent from "../../pages/organizer/content/UpdateEvent"; // Importer la page de modification
import OrganizerEvents from "../../pages/organizer/content/ListEvent";
import DashboardLayoutAccount from "../participant/Dashboard";


import Dashboard from "../../../src/components/participant/content/dashboard";
import Profil from "../../../src/components/participant/content/Profil";
import Recherche from "../../../src/components/participant/content/Recherche";
import MesInscriptions from "../../../src/components/participant/content/MesInscriptions";
import MonEquipe from "../../../src/components/participant/content/MonEquipe";
import Paiements from "../../../src/components/participant/content/Paiements";
import SuiviActivite from "../../../src/components/participant/content/SuiviActivite";
import Parametres from "../../../src/components/participant/content/Parametres";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Récupère le token du localStorage

  if (!token) {
    // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
    return <Navigate to="/login" />;
  }

  return children; // Retourne le composant enfant si le token est présent
};

const PublicRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/participant" element={<DashboardParticipant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/calendar" element={<Calendrier />} />
        <Route path="/pagevent" element={<Pagevent />} />
        <Route path="/DetailEvent/:id_evenement" element={<DetailEvent />} />
        <Route path="/resultat" element={<ResultatPage />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/pubevent" element={<Pubevent />} />
        <Route path="/mdpoublier" element={<MdpOublier />} />
        <Route path="/organizersignupform" element={<OrganizerSignUpForm />} />
        <Route path="/listevent" element={<OrganizerEvents />} />
        <Route path="/signuppart" element={<Signuppart />} />

        <Route path="/" element={<Dashboard />} />
            <Route path="/Profil" element={<Profil />} />
            <Route path="/Recherche" element={<Recherche />} />
            <Route path="/MesInscriptions" element={<MesInscriptions />} />
            <Route path="/MonEquipe" element={<MonEquipe />} />
            <Route path="/Paiements" element={<Paiements />} />
            <Route path="/SuiviActivite" element={<SuiviActivite />} />
            <Route path="/Parametres" element={<Parametres />} />


        {/* Tableau de bord du participant, avec protection */}
        <Route
          path="/participant/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayoutAccount />
            </PrivateRoute>
          }
        />


        {/* Route protégée pour l'accès au tableau de bord de l'organisateur */}
        <Route path="/organisateur" element={<PrivateRoute><OrganizerDashboard /></PrivateRoute>} />

        {/* Route protégée pour la modification des événements */}
        <Route
          path="/organizer/events/:eventId/edit"
          element={<PrivateRoute><UpdateEvent /></PrivateRoute>}
        />

        {/* Gestion des routes non trouvées */}
        <Route path="*" element={<Error />} />
        
        
      </Route>

    </Routes>
  );
};

export default PublicRouter;

