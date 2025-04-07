import Dashboardcontent from "./Dashboard"; // Composant pour le tableau de bord
// import GestionAdministrateurs from './GestionAdministrateurs';  // Composant pour la gestion des admins
import AddAdminForm from "../AddAdminForm";
import OrganisationAdmin from "./OrganisationAdmin";
import FAQComponent from "./FAQComponent";
import Newsletter from "./Newsletter";
import AdminOrganizerList from "./AdminOrganizerList";
import AdminOrganizerEvent from "./AdminOrganizerEvent";
import AdminTickets from "./AdminTickets";
import ParticipantsList from "./ParticipantsList";
import TicketSalesManagement from "./TicketSalesManagement";
import CertificatesList from "./CertificatesList";
import ContactMessagesList from "./ContactMessagesList";

const SidebarComponents = {
  Dashboardcontent: Dashboardcontent,
  AddAdminForm: AddAdminForm,
  OrganisationAdmin: OrganisationAdmin,
  FAQComponent: FAQComponent,
  AdminOrganizerList: AdminOrganizerList,
  AdminOrganizerEvent: AdminOrganizerEvent,
  Newsletter: Newsletter,
  AdminTickets: AdminTickets,
  ParticipantsList: ParticipantsList,
  TicketSalesManagement: TicketSalesManagement,
  CertificatesList: CertificatesList,
  ContactMessagesList: ContactMessagesList,
};

export default SidebarComponents;
