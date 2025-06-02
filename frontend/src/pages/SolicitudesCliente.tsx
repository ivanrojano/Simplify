import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Fade,
  Tooltip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import ConfirmModalLogout from "../components/ConfirmModalLogout";

interface Solicitud {
  id: number;
  estado: string;
  fechaCreacion: string;
  nombreEmpresa: string;
}

const SolicitudesCliente = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");
  const [rotating, setRotating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !clienteId) {
      navigate("/login");
      return;
    }

    axios
      .get<Solicitud[]>(`http://localhost:8080/api/solicitudes/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSolicitudes(res.data))
      .catch((err) => {
        console.error("Error al obtener solicitudes:", err);
      });
  }, [token, clienteId, navigate]);

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const coincideEstado = filtroEstado === "TODAS" || s.estado === filtroEstado;
    const coincideBusqueda = s.nombreEmpresa
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideFecha = !fechaFiltro || s.fechaCreacion.startsWith(fechaFiltro);
    return coincideEstado && coincideBusqueda && coincideFecha;
  });

  const limpiarFiltros = () => {
    setFiltroEstado("TODAS");
    setBusqueda("");
    setFechaFiltro("");
    setRotating(true);
    setTimeout(() => setRotating(false), 600);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getColorForEstado = (estado: string): string => {
    switch (estado) {
      case "PENDIENTE":
        return "#f5f5f5"; // gris claro
      case "ACEPTADA":
        return "#e3f2fd"; // azul claro
      case "FINALIZADA":
        return "#e8f5e9"; // verde claro
      case "RECHAZADA":
        return "#ffebee"; // rojo claro
      default:
        return "#ffffff";
    }
  };

  const getTextColor = (estado: string): string => {
    switch (estado) {
      case "PENDIENTE":
        return "#757575";
      case "ACEPTADA":
        return "#0d47a1";
      case "FINALIZADA":
        return "#2e7d32";
      case "RECHAZADA":
        return "#c62828";
      default:
        return "#000000";
    }
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
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      {/* Botón Atrás arriba a la izquierda */}
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/cliente")}
          sx={{
            position: "fixed",
            top: 8,
            left: 8,
            color: "#0d47a1",
            zIndex: 1300,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>


      {/* Botón Cerrar sesión arriba a la derecha */}
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


      {/* Título */}
      <Fade in timeout={800}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="#0d47a1"
          textAlign="center"
          mb={4}
        >
          Mis Solicitudes
        </Typography>
      </Fade>

      {/* Filtros */}
      <Fade in timeout={100}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={4}
          maxWidth={900}
          mx="auto"
          alignItems="center"
        >
          <FormControl fullWidth>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select
              value={filtroEstado}
              label="Filtrar por estado"
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <MenuItem value="TODAS">Todas</MenuItem>
              <MenuItem value="PENDIENTE">Pendiente</MenuItem>
              <MenuItem value="ACEPTADA">Aceptada</MenuItem>
              <MenuItem value="FINALIZADA">Finalizada</MenuItem>
              <MenuItem value="RECHAZADA">Rechazada</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Buscar empresa"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <TextField
            fullWidth
            label="Filtrar por fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />

          <Tooltip title="Limpiar filtros">
            <IconButton
              onClick={limpiarFiltros}
              sx={{
                backgroundColor: "#0d47a1",
                color: "#fff",
                borderRadius: "10px",
                p: 1.2,
                ml: { xs: 0, sm: 1 },
                mt: { xs: 1, sm: 0 },
                transition: "transform 0.6s ease",
                transform: rotating ? "rotate(360deg)" : "none",
                "&:hover": {
                  backgroundColor: "#08306b",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Fade>

      {/* Lista de solicitudes */}
      <Fade in timeout={1200}>
        {solicitudesFiltradas.length === 0 ? (
          <Typography textAlign="center">
            No se encontraron solicitudes con los filtros aplicados.
          </Typography>
        ) : (
          <Stack spacing={3} width="100%" maxWidth="1400px" mx="auto" px={2}>
            {solicitudesFiltradas.map((solicitud) => (
              <Paper
                key={solicitud.id}
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: getColorForEstado(solicitud.estado),
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body1">
                      <strong>Empresa:</strong> {solicitud.nombreEmpresa}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AssignmentIcon fontSize="small" />
                    <Typography variant="body1">
                      <strong>Estado:</strong>{" "}
                      <span
                        style={{
                          color: getTextColor(solicitud.estado),
                          fontWeight: 600,
                        }}
                      >
                        {solicitud.estado}
                      </span>
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarMonthIcon fontSize="small" />
                    <Typography variant="body1">
                      <strong>Fecha:</strong>{" "}
                      {new Date(solicitud.fechaCreacion).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Stack>

                {solicitud.estado === "ACEPTADA" && (
                  <Button
                    variant="contained"
                    startIcon={<ChatIcon />}
                    onClick={() =>
                      navigate(`/cliente/solicitud/${solicitud.id}/mensajes`)
                    }
                    sx={{ mt: 2, backgroundColor: "#0d47a1" }}
                  >
                    Ver Mensajes
                  </Button>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Fade>

      {logoutConfirm && (
        <ConfirmModalLogout
          onCancel={() => setLogoutConfirm(false)}
          onConfirm={() => {
            confirmLogout();
            setLogoutConfirm(false);
          }}
        />
      )}
    </Box>
  );
};

export default SolicitudesCliente;
