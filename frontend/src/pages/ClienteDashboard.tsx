import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Fade,
  Stack,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ViewListIcon from "@mui/icons-material/ViewList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import ConfirmModalLogout from "../components/ConfirmModalLogout";

interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  email: string;
  fotoUrl?: string | null;
}

const ClienteDashboard = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  useEffect(() => {
    if (!token || !clienteId) {
      navigate("/login");
      return;
    }

    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get<Cliente>(`http://localhost:8080/api/clientes/${clienteId}`, headers)
      .then((res) => {
        setCliente(res.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => navigate("/login"));
  }, [token, clienteId, navigate]);

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEditarPerfil = () => navigate("/cliente/editar");
  const handleVerServicios = () => navigate("/cliente/servicios");

  if (!cliente)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          px: 2,
          py: 4,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Botón cerrar sesión (desktop) */}
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            color: "#e74c3c",
            fontWeight: 600,
            display: { xs: "none", sm: "flex" },
          }}
        >
          Cerrar Sesión
        </Button>

        {/* Contenido principal */}
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            color="#0d47a1"
            mb={1}
          >
            Panel del Cliente
          </Typography>

          <Typography variant="subtitle1" textAlign="center" mb={4}>
            ¡Hola, {cliente.nombre}!
          </Typography>

          {/* Información del Perfil */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center"
            mb={4}
          >
            <Avatar
              sx={{
                width: 130,
                height: 130,
                bgcolor: cliente.fotoUrl ? "transparent" : "#0d47a1",
                border: "2px solid #0d47a1",
              }}
              src={
                cliente.fotoUrl && cliente.fotoUrl.trim() !== ""
                  ? cliente.fotoUrl
                  : undefined
              }
            >
              {!cliente.fotoUrl && <PersonIcon sx={{ fontSize: 48, color: "#fff" }} />}
            </Avatar>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Typography variant="h6" fontWeight={700}>
                  Información del Perfil
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ color: "#0d47a1" }} />
                  <Typography>
                    <strong>Nombre:</strong> {cliente.nombre}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon sx={{ color: "#0d47a1" }} />
                  <Typography>
                    <strong>Dirección:</strong> {cliente.direccion}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ color: "#0d47a1" }} />
                  <Typography>
                    <strong>Email:</strong> {cliente.email}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* Botones de acción */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditarPerfil}
              sx={{
                backgroundColor: "#0d47a1",
                color: "#fff",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Editar Perfil
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ViewListIcon />}
              onClick={handleVerServicios}
              sx={{
                backgroundColor: "#0d47a1",
                color: "#fff",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Ver Servicios
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ListAltIcon />}
              onClick={() => navigate("/cliente/solicitudes")}
              sx={{
                backgroundColor: "#0d47a1",
                color: "#fff",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Ver Mis Solicitudes
            </Button>
          </Stack>
        </Box>

        {/* Cerrar sesión en mobile */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => setLogoutConfirm(true)}
            startIcon={<LogoutIcon />}
          >
            Cerrar
          </Button>
        </Box>

        {/* Modal de confirmación */}
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
    </Fade>
  );
};

export default ClienteDashboard;
