import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Fade,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
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
      .then((res) => setCliente(res.data))
      .catch(() => navigate("/login"));
  }, [token, clienteId, navigate]);

  const handleLogout = () => setLogoutConfirm(true);

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
        <IconButton
          onClick={handleLogout}
          sx={{ position: "absolute", top: 16, right: 16, color: "#e74c3c" }}
        >
          <LogoutIcon />
        </IconButton>

        <Fade in timeout={1000}>
          <Typography variant="h4" fontWeight={800} color="#0d47a1" textAlign="center" mb={1}>
            Panel del Cliente
          </Typography>
        </Fade>

        <Fade in timeout={1200}>
          <Typography variant="h6" fontWeight={500} textAlign="center" mb={3}>
            ¡Hola, {cliente.nombre}!
          </Typography>
        </Fade>

        <Fade in timeout={1300}>
          <Paper elevation={12} sx={{ maxWidth: 900, mx: "auto", p: 4, mb: 4, borderRadius: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center">
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  bgcolor: cliente.fotoUrl ? "transparent" : "#0d47a1",
                  border: "2px solid #0d47a1",
                }}
                src={cliente.fotoUrl && cliente.fotoUrl.trim() !== "" ? cliente.fotoUrl : undefined}
              >
                {(!cliente.fotoUrl || cliente.fotoUrl.trim() === "") && (
                  <PersonIcon sx={{ fontSize: 48 }} />
                )}
              </Avatar>



              <Box flex={1}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Tu Perfil
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography><strong>Nombre:</strong> {cliente.nombre}</Typography>
                  <Typography><strong>Dirección:</strong> {cliente.direccion}</Typography>
                  <Typography><strong>Email:</strong> {cliente.email}</Typography>
                </Stack>

                <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={handleEditarPerfil}
                    sx={{
                      backgroundColor: "#0d47a1",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#1976d2" },
                    }}
                  >
                    Editar Perfil
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#0d47a1",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#1976d2" },
                    }}
                    onClick={handleVerServicios}
                  >
                    Ver Servicios Disponibles
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#0d47a1",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#1976d2" },
                    }}
                    onClick={() => navigate("/cliente/solicitudes")}
                  >
                    Ver Mis Solicitudes
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
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
    </Fade>
  );
};

export default ClienteDashboard;
