import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/ConfirmModal";
import ConfirmModalLogout from "../components/ConfirmModalLogout";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
  Divider,
  Avatar,
  Fade
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Empresa {
  id: number;
  email: string;
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  rol: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

const EmpresaDashboard = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioAEliminar, setServicioAEliminar] = useState<Servicio | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
    if (!token || !empresaId) {
      navigate("/login");
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get<Empresa>(`http://localhost:8080/api/empresas/${empresaId}`, headers)
      .then((res) => setEmpresa(res.data))
      .catch(() => navigate("/login"));

    axios
      .get<Servicio[]>(`http://localhost:8080/api/servicios/empresa/${empresaId}`, headers)
      .then((res) => setServicios(res.data))
      .catch(() => {});
  }, [token, empresaId, navigate]);

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEdit = () => navigate("/empresa/editar");
  const handleCrearServicio = () => navigate("/empresa/crear-servicio");

  const confirmarEliminacion = async () => {
    if (!servicioAEliminar) return;

    try {
      await axios.delete(`http://localhost:8080/api/servicios/${servicioAEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicios((prev) => prev.filter((s) => s.id !== servicioAEliminar.id));
      toast.success("Servicio eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el servicio.");
    } finally {
      setServicioAEliminar(null);
    }
  };

  if (!empresa) return <Typography textAlign="center" mt={4}>Cargando datos...</Typography>;

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          px: 2,
          py: 4,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative"
        }}
      >
        <IconButton
          onClick={() => setLogoutConfirm(true)}
          sx={{ position: "absolute", top: 16, right: 16, color: "#e74c3c" }}
        >
          <LogoutIcon />
        </IconButton>

        <Fade in timeout={1000}>
          <Typography variant="h4" fontWeight={800} color="#0d47a1" textAlign="center" mb={2}>
            Panel de Empresa
          </Typography>
        </Fade>

        <Fade in timeout={1100}>
          <Typography variant="h6" fontWeight={500} textAlign="center" mb={3} sx={{ paddingBottom: '10px' }}>
            ¡Hola, {empresa.nombreEmpresa}!
          </Typography>
        </Fade>

        <Fade in timeout={1200}>
          <Paper elevation={12} sx={{ maxWidth: 1100, mx: "auto", p: 4, mb: 4, borderRadius: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center">
              <Avatar sx={{ width: 100, height: 100, bgcolor: "#0d47a1", flexShrink: 0 }}>
                <BusinessIcon sx={{ fontSize: 48 }} />
              </Avatar>

              <Box flex={1}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Tu Empresa
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography><strong>Nombre:</strong> {empresa.nombreEmpresa}</Typography>
                  <Typography><strong>Descripción:</strong> {empresa.descripcion}</Typography>
                  <Typography><strong>Dirección:</strong> {empresa.direccion}</Typography>
                  <Typography><strong>Email:</strong> {empresa.email}</Typography>
                </Stack>
                <Divider sx={{ mb: 2, mt: 2 }} />
                <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                      backgroundColor: "#0d47a1",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#1976d2" }
                    }}
                    onClick={handleEdit}
                  >
                    Editar Perfil
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddBusinessIcon />}
                    sx={{
                      backgroundColor: "#0d47a1",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#1976d2" }
                    }}
                    onClick={handleCrearServicio}
                  >
                    Crear Servicio
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    sx={{
                      backgroundColor: "#0d47a1",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#1976d2" }
                    }}
                    onClick={() => navigate("/empresa/solicitudes")}
                  >
                    Ver Solicitudes
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Fade>

        <Fade in timeout={1300}>
          <Paper elevation={12} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Tus Servicios</Typography>
            {servicios.length === 0 ? (
              <Typography>No tienes servicios registrados.</Typography>
            ) : (
              <Stack spacing={2}>
                {servicios.map((servicio) => (
                  <Paper key={servicio.id} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography><strong>Servicio:</strong> {servicio.nombre}</Typography>
                    <Typography><strong>Descripción:</strong> {servicio.descripcion}</Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/empresa/servicio/editar/${servicio.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => setServicioAEliminar(servicio)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Fade>

        {servicioAEliminar && (
          <ConfirmModal
            title="¿Eliminar servicio?"
            message={`¿Estás seguro de eliminar "${servicioAEliminar.nombre}"?`}
            onCancel={() => setServicioAEliminar(null)}
            onConfirm={confirmarEliminacion}
          />
        )}

        {logoutConfirm && (
          <ConfirmModalLogout
            onCancel={() => setLogoutConfirm(false)}
            onConfirm={() => {
              confirmLogout();
              setLogoutConfirm(false);
            }}
          />
        )}

        <ToastContainer position="top-center" autoClose={2000} theme="colored" />
      </Box>
    </Fade>
  );
};

export default EmpresaDashboard;
