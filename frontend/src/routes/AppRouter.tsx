import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import RegistroCliente from "../pages/RegistroCliente";
import RegistroEmpresa from "../pages/RegistroEmpresa";
import PanelCliente from "../pages/ClienteDashboard";
import PanelEmpresa from "../pages/EmpresaDashboard";
import PanelAdmin from "../pages/AdminDashboard";
import { InicioRegistro } from "../pages/InicioRegistro";
import { Index } from "../pages/Index";
import EditarEmpresa from "../components/EditarEmpresa";
import EditarCliente from "../pages/EditarCliente";
import SolicitudesCliente from "../pages/SolicitudesCliente";
import SolicitudesEmpresa from "../pages/SolicitudesEmpresa";
import MensajesEmpresa from "../pages/MensajesEmpresa";
import MensajesCliente from "../pages/MensajesClienteDetalle";
import { QueEsSimplify } from "../pages/QueEsSimplify";
import VerPerfilEmpresa from "../components/VerPerfilEmpresa";
import PoliticaPrivacidad from "../pages/PolitiicaPrivacidad";

const AppRouter = () => {

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/simplify" element={<QueEsSimplify />} />
        <Route path="/registro" element={<InicioRegistro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro/cliente" element={<RegistroCliente />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/cliente" element={<PanelCliente />} />
        <Route path="/empresa" element={<PanelEmpresa />} />
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/empresa/editar" element={<EditarEmpresa />} />
        <Route path="/cliente/editar" element={<EditarCliente />} />
        <Route path="/cliente/solicitudes" element={<SolicitudesCliente />} />
        <Route path="/empresa/solicitudes" element={<SolicitudesEmpresa />} />
        <Route path="/empresa/solicitud/:solicitudId/mensajes" element={<MensajesEmpresa />} />
        <Route path="/cliente/solicitud/:solicitudId/mensajes" element={<MensajesCliente />} />
        <Route path="/empresa/ver/:empresaId" element={<VerPerfilEmpresa />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
