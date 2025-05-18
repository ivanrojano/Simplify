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
  Button,
  Stack,
  Divider,
  Avatar,
  Fade,
  Tabs,
  Tab,
  Tooltip,
  Paper,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

interface Empresa {
  id: number;
  email: string;
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  rol: string;
  fotoUrl?: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

const EmpresaDashboard = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioAEliminar, setServicioAEliminar] = useState<Servicio | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [tab, setTab] = useState(0);
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
      <Box sx={{bgcolor: "#ffffff", px: 2, pt: 4, pb: 6, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#e74c3c",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "2px",
          }}
        >
          Cerrar Sesión
        </Button>

        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Typography variant="h4" fontWeight={800} color="#0d47a1" textAlign="center" mb={1}>
            Panel de Empresa
          </Typography>

          <Typography variant="h6" fontWeight={500} textAlign="center" mb={4}>
            ¡Hola, {empresa.nombreEmpresa}!
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center" mb={5}>
            <Avatar
              src={empresa.fotoUrl?.trim() ? empresa.fotoUrl : undefined}
              sx={{ width: 150, height: 150, bgcolor: "#0d47a1", border: "3px solid #0d47a1" }}
            >
              {(!empresa.fotoUrl || !empresa.fotoUrl.trim()) && (
                <BusinessIcon sx={{ fontSize: 48, color: "#fff" }} />
              )}
            </Avatar>

            <Box flex={1}>
              <Typography variant="h6" fontWeight={700} mb={1}>Tu Empresa</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography><strong>Nombre:</strong> {empresa.nombreEmpresa}</Typography>
                <Typography><strong>Descripción:</strong> {empresa.descripcion}</Typography>
                <Typography><strong>Dirección:</strong> {empresa.direccion}</Typography>
                <Typography><strong>Email:</strong> {empresa.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
                <Tooltip title="Editar Perfil">
                  <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit} sx={{ backgroundColor: "#0d47a1", color: "#fff", borderRadius: "20px" }}>Editar Perfil</Button>
                </Tooltip>

                <Tooltip title="Crear Nuevo Servicio">
                  <Button variant="contained" startIcon={<AddBusinessIcon />} onClick={handleCrearServicio} sx={{ backgroundColor: "#0d47a1", color: "#fff", borderRadius: "20px" }}>Crear Servicio</Button>
                </Tooltip>

                <Tooltip title="Ver Solicitudes">
                  <Button variant="contained" startIcon={<VisibilityIcon />} onClick={() => navigate("/empresa/solicitudes")} sx={{ backgroundColor: "#0d47a1", color: "#fff", borderRadius: "20px" }}>Ver Solicitudes</Button>
                </Tooltip>
              </Stack>
            </Box>
          </Stack>
            <Box flex={1}>
              
            </Box>

              <Divider sx={{ mb: 2 }} />


          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered sx={{ mb: 4 }}>
            <Tooltip title="Ver tus Servicios">
              <Tab label="Servicios" />
            </Tooltip>
            <Tooltip title="Ver tus Solicitudes">
              <Tab label="Solicitudes" />
            </Tooltip>
          </Tabs>

          {tab === 0 && (
            <Box>
              {servicios.length === 0 ? (
                <Typography color="text.secondary" sx={{textAlign: 'center'}}>No tienes servicios registrados.</Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    gap: 3,
                  }}
                >
                  {servicios.map((servicio) => (
                    <Paper
                      key={servicio.id}
                      elevation={3}
                      sx={{
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "#fff",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.12)",
                        },
                      }}
                    >
                      <Box mb={1}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0d47a1" }}>
                          {servicio.nombre}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {servicio.descripcion}
                      </Typography>

                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/empresa/servicio/editar/${servicio.id}`)}
                          sx={{
                            backgroundColor: "#fff",
                            color: "#0d47a1",
                            border: "1.5px solid #0d47a1",
                            borderRadius: "20px",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "#e3f2fd",
                              borderColor: "#08306b",
                              color: "#08306b",
                            },
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => setServicioAEliminar(servicio)}
                          sx={{
                            backgroundColor: "#fff",
                            color: "#e74c3c",
                            border: "1.5px solid #e74c3c",
                            borderRadius: "20px",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "#fdecea",
                              borderColor: "#c0392b",
                              color: "#c0392b",
                            },
                          }}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

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
