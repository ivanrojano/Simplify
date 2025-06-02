import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  Fade,
  Divider,
  Snackbar,
  Alert,
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      .catch(() => showSnackbar("No se pudieron cargar las solicitudes.", "error"));
  }, [token, empresaId, navigate]);

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/solicitudes/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar(`Solicitud ${nuevoEstado.toLowerCase()}`, "success");
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
      );
    } catch {
      showSnackbar("No se pudo actualizar el estado.", "error");
    }
  };

  const finalizarSolicitud = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:8080/api/solicitudes/${id}/finalizar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar("Solicitud finalizada", "success");
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: "FINALIZADA" } : s))
      );
    } catch {
      showSnackbar("No se pudo finalizar la solicitud.", "error");
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
      showSnackbar("Solicitud eliminada", "success");
      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudAEliminar));
    } catch {
      showSnackbar("No se pudo eliminar la solicitud.", "error");
    } finally {
      setShowModal(false);
      setSolicitudAEliminar(null);
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getColorForEstado = (estado: string): string => {
    switch (estado) {
      case "PENDIENTE": return "#f5f5f5";
      case "ACEPTADA": return "#e3f2fd";
      case "FINALIZADA": return "#e8f5e9";
      case "RECHAZADA": return "#ffebee";
      default: return "#ffffff";
    }
  };

  const getTextColor = (estado: string): string => {
    switch (estado) {
      case "PENDIENTE": return "#757575";
      case "ACEPTADA": return "#0d47a1";
      case "FINALIZADA": return "#2e7d32";
      case "RECHAZADA": return "#c62828";
      default: return "#000000";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#ffffff",
        px: { xs: 2, sm: 4 },
        py: 4,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        textAlign: "center",
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/empresa")}
          sx={{ position: "fixed", top: 8, left: 8, color: "#0d47a1", zIndex: 1300 }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={800}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "fixed",
            top: 8,
            right: 8,
            color: "#e74c3c",
            textTransform: "none",
            fontWeight: 600,
            zIndex: 1300,
          }}
        >
          Cerrar Sesión
        </Button>
      </Fade>

      <Fade in timeout={800}>
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
        <Fade in timeout={1200}>
          <Stack spacing={3} width="100%" maxWidth="1400px" mx="auto" px={2}>
            {solicitudes.map((s) => (
              <Paper
                key={s.id}
                elevation={12}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "left",
                  backgroundColor: getColorForEstado(s.estado),
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BuildIcon fontSize="small" />
                    <Typography><strong>Servicio:</strong> {s.servicio.nombre}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <DescriptionIcon fontSize="small" />
                    <Typography><strong>Descripción:</strong> {s.servicio.descripcion}</Typography>
                  </Stack>

                  <Divider />

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
                    <Typography>
                      <strong>Estado:</strong>{" "}
                      <span style={{ color: getTextColor(s.estado), fontWeight: 600 }}>
                        {s.estado}
                      </span>
                    </Typography>
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
                        sx={{ bgcolor: "#0d47a1", '&:hover': { bgcolor: "#08306b" } }}
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
        </Fade>
      )}

      <ConfirmModalEliminarSolicitud
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmarEliminacion}
      />

      {logoutConfirm && (
        <ConfirmModalLogout
          onCancel={() => setLogoutConfirm(false)}
          onConfirm={() => {
            confirmLogout();
            setLogoutConfirm(false);
          }}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SolicitudesEmpresa;
