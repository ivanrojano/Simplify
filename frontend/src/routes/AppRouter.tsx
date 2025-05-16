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
import CrearServicio from "../pages/CrearServicio";
import EditarServicio from "../pages/EditarServicio";
import EditarCliente from "../pages/EditarCliente";
import ServiciosDisponibles from "../pages/ServiciosDisponibles";
import SolicitudesCliente from "../pages/SolicitudesCliente";
import SolicitudesEmpresa from "../pages/SolicitudesEmpresa";
import MensajesEmpresa from "../pages/MensajesEmpresa";
import MensajesCliente from "../pages/MensajesCliente";

const AppRouter = () => {

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/registro" element={<InicioRegistro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro/cliente" element={<RegistroCliente />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/cliente" element={<PanelCliente />} />
        <Route path="/empresa" element={<PanelEmpresa />} />
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/empresa/editar" element={<EditarEmpresa />} />
        <Route path="/empresa/crear-servicio" element={<CrearServicio />} />
        <Route path="/empresa/servicio/editar/:servicioId" element={<EditarServicio />} />
        <Route path="/cliente/editar" element={<EditarCliente />} />
        <Route path="/cliente/servicios" element={<ServiciosDisponibles />} />
        <Route path="/cliente/solicitudes" element={<SolicitudesCliente />} />
        <Route path="/empresa/solicitudes" element={<SolicitudesEmpresa />} />
        <Route path="/empresa/solicitud/:solicitudId/mensajes" element={<MensajesEmpresa />} />
        <Route path="/cliente/solicitud/:solicitudId/mensajes" element={<MensajesCliente />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
