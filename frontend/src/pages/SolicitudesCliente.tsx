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
  Fade
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import ConfirmModalLogout from "../components/ConfirmModalLogout";

interface Solicitud {
  id: number;
  estado: string;
  servicio: {
    nombre: string;
    empresa: {
      nombreEmpresa: string;
    };
  };
}

const SolicitudesCliente = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODAS");
  const [busqueda, setBusqueda] = useState<string>("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");
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

  const solicitudesFiltradas = solicitudes.filter(s => {
    const coincideEstado = filtroEstado === "TODAS" || s.estado === filtroEstado;
    const coincideBusqueda = s.servicio.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

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
        position: "relative"
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/cliente")}
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

      <Fade in timeout={100}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={4}
          maxWidth={800}
          mx="auto"
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
            label="Buscar servicio"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Stack>
      </Fade>

      <Fade in timeout={1200}>
        {solicitudesFiltradas.length === 0 ? (
          <Typography textAlign="center">No tienes solicitudes registradas.</Typography>
        ) : (
          <Stack spacing={3} maxWidth={800} mx="auto">
            {solicitudesFiltradas.map((solicitud) => (
              <Paper key={solicitud.id} elevation={12} sx={{ p: 3, borderRadius: 3 }}>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BuildIcon fontSize="small" />
                    <Typography variant="body1">
                      <strong>Servicio:</strong> {solicitud.servicio.nombre}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body1">
                      <strong>Empresa:</strong> {solicitud.servicio.empresa.nombreEmpresa}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AssignmentIcon fontSize="small" />
                    <Typography variant="body1">
                      <strong>Estado:</strong> {solicitud.estado}
                    </Typography>
                  </Stack>
                </Stack>

                {solicitud.estado === "ACEPTADA" && (
                  <Button
                    variant="contained"
                    startIcon={<ChatIcon />}
                    onClick={() => navigate(`/cliente/solicitud/${solicitud.id}/mensajes`)}
                    sx={{ mt: 2, backgroundColor: '#0d47a1' }}
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
