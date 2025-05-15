import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,

  Fade,
  Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import BuildIcon from "@mui/icons-material/Build";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModalLogout from "../components/ConfirmModalLogout";
import ConfirmModalEliminarSolicitud from "../components/ConfirmModalEliminarSolicitud";

interface Solicitud {
  id: number;
  estado: string;
  cliente: {
    nombre: string;
    email: string;
    direccion: string;
  };
  servicio: {
    nombre: string;
    descripcion: string;
  };
}

const SolicitudesEmpresa = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<number | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !empresaId) {
      navigate("/login");
      return;
    }

    axios
      .get<Solicitud[]>(`http://localhost:8080/api/solicitudes/empresa/${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSolicitudes(res.data))
      .catch(() => toast.error("No se pudieron cargar las solicitudes."));
  }, [token, empresaId, navigate]);

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/solicitudes/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Solicitud ${nuevoEstado.toLowerCase()}`);
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
      );
    } catch {
      toast.error("No se pudo actualizar el estado.");
    }
  };

  const finalizarSolicitud = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:8080/api/solicitudes/${id}/finalizar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Solicitud finalizada");
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: "FINALIZADA" } : s))
      );
    } catch {
      toast.error("No se pudo finalizar la solicitud.");
    }
  };

  const abrirModalEliminar = (id: number) => {
    setSolicitudAEliminar(id);
    setShowModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!solicitudAEliminar) return;
    try {
      await axios.delete(`http://localhost:8080/api/solicitudes/${solicitudAEliminar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Solicitud eliminada");
      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudAEliminar));
    } catch {
      toast.error("No se pudo eliminar la solicitud.");
    } finally {
      setShowModal(false);
      setSolicitudAEliminar(null);
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#ffffff",
        px: 2,
        py: 4,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        textAlign: "center"
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/empresa")}
          sx={{ position: "absolute", top: 16, left: 16, color: "#0d47a1" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={800}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#e74c3c",
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Cerrar Sesión
        </Button>
      </Fade>

      <Fade in timeout={1000}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="#0d47a1"
          textAlign="center"
          mb={4}
        >
          Solicitudes Recibidas
        </Typography>
      </Fade>

      {solicitudes.length === 0 ? (
        <Typography textAlign="center">No hay solicitudes registradas.</Typography>
      ) : (
        <Stack spacing={2} maxWidth={800} mx="auto">
          {solicitudes.map((s) => (
            <Paper key={s.id} elevation={12} sx={{ p: 3, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BuildIcon fontSize="small" />
                  <Typography><strong>Servicio:</strong> {s.servicio.nombre}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <DescriptionIcon fontSize="small" />
                  <Typography><strong>Descripción:</strong> {s.servicio.descripcion}</Typography>
                </Stack>

                <Divider></Divider>

                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon fontSize="small" />
                  <Typography><strong>Cliente:</strong> {s.cliente.nombre} – {s.cliente.email}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon fontSize="small" />
                  <Typography><strong>Dirección:</strong> {s.cliente.direccion}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <AssignmentIcon fontSize="small" />
                  <Typography><strong>Estado:</strong> {s.estado}</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                {s.estado === "PENDIENTE" && (
                  <>
                    <Button variant="contained" color="success" onClick={() => cambiarEstado(s.id, "ACEPTADA")}>Aceptar</Button>
                    <Button variant="contained" color="error" onClick={() => cambiarEstado(s.id, "RECHAZADA")}>Rechazar</Button>
                  </>
                )}

                {s.estado === "ACEPTADA" && (
                  <>
                    <Button variant="contained" onClick={() => finalizarSolicitud(s.id)}>Finalizar</Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#0d47a1", '&:hover': { bgcolor: "#007bff" } }}
                      onClick={() => navigate(`/empresa/solicitud/${s.id}/mensajes`)}
                      startIcon={<ChatIcon />}
                    >
                      Ver Mensajes
                    </Button>
                  </>
                )}

                {s.estado === "FINALIZADA" && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => abrirModalEliminar(s.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <ConfirmModalEliminarSolicitud
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmarEliminacion}
      />

      {/* Modal logout */}
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
  );
};

export default SolicitudesEmpresa;
