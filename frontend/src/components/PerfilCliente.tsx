import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";

import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";

interface Props {
  nombre: string;
  direccion: string;
  email: string;
  id: number;
  fotoUrl?: string | null;
  telefono?: string | null;
  codigoPostal?: string | null;
  ciudad?: string | null;
  fechaRegistro?: string;
}

const PerfilCliente = ({
  nombre,
  direccion,
  email,
  id,
  fotoUrl,
  telefono,
  codigoPostal,
  ciudad,
  fechaRegistro,
}: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [snackbarTipo, setSnackbarTipo] = useState<"success" | "error">("success");

  const mostrarSnackbar = (mensaje: string, tipo: "success" | "error") => {
    setSnackbarMensaje(mensaje);
    setSnackbarTipo(tipo);
    setSnackbarOpen(true);
  };

  const manejarCambioPassword = async () => {
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      mostrarSnackbar("Por favor completa todos los campos.", "error");
      return;
    }

    if (nuevaPassword.length < 6) {
      mostrarSnackbar("La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      mostrarSnackbar("Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        mostrarSnackbar("No estás autenticado.", "error");
        return;
      }

      await axios.put(
        `http://localhost:8080/api/clientes/${id}/cambiar-password`,
        {
          passwordActual,
          nuevaPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      mostrarSnackbar("Contraseña actualizada exitosamente.", "success");
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || "Error al actualizar la contraseña.";
      mostrarSnackbar(msg, "error");
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: { xs: 2, sm: 3 },
        boxShadow: 4,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={1}>
        Información Personal
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Detalles de tu cuenta y perfil
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
        mb={3}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: fotoUrl ? "transparent" : "#0d47a1",
            border: "2px solid #0d47a1",
            fontWeight: 700,
            fontSize: 40,
            color: "#fff",
          }}
          src={fotoUrl || undefined}
        >
          {!fotoUrl ? nombre.charAt(0).toUpperCase() : null}
        </Avatar>

        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h5" fontWeight={800} color="#0d47a1">
            {nombre || "Sin datos"}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            Cliente desde:{" "}
            {fechaRegistro
              ? new Date(fechaRegistro).toLocaleDateString()
              : "Sin datos"}
          </Typography>
        </Box>
      </Stack>

      {(!telefono || !ciudad || !codigoPostal) && (
        <MuiAlert severity="warning" sx={{ mb: 3 }}>
          Tu perfil no está completo. Por favor, actualiza tus datos para aprovechar todas las funcionalidades.
        </MuiAlert>
      )}

      <Stack spacing={3} mb={3}>
        {/* Fila 1 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box flex={1}>
            <Typography>
              <EmailIcon sx={{ mr: 1, color: "#0d47a1" }} fontSize="small" />
              <strong>Email:</strong> {email || "Sin datos"}
            </Typography>
          </Box>
          <Box flex={1} textAlign={isMobile ? "left" : "center"}>
            <Typography>
              <LocationOnIcon sx={{ mr: 1, color: "#0d47a1" }} fontSize="small" />
              <strong>Dirección:</strong> {direccion?.trim() || "Sin datos"}
            </Typography>
          </Box>
          <Box flex={1} textAlign={isMobile ? "left" : "right"}>
            <Typography>
              <PhoneIcon sx={{ mr: 1, color: "#0d47a1" }} fontSize="small" />
              <strong>Teléfono:</strong> {telefono?.trim() || "Sin datos"}
            </Typography>
          </Box>
        </Stack>

        {/* Fila 2 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box flex={1}>
            <Typography>
              <LocationCityIcon sx={{ mr: 1, color: "#0d47a1" }} fontSize="small" />
              <strong>Ciudad:</strong> {ciudad?.trim() || "Sin datos"}
            </Typography>
          </Box>
          <Box flex={1} textAlign={isMobile ? "left" : "center"}>
            <Typography>
              <HomeIcon sx={{ mr: 1, color: "#0d47a1" }} fontSize="small" />
              <strong>Código Postal:</strong> {codigoPostal?.trim() || "Sin datos"}
            </Typography>
          </Box>
          <Box flex={1} textAlign={isMobile ? "left" : "right"}>
            <Typography>
              <FingerprintIcon sx={{ mr: 1, color: "#0d47a1" }} fontSize="small" />
              <strong>ID Cliente:</strong> #{id.toString().padStart(6, "0")}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Button
        fullWidth
        startIcon={<EditIcon />}
        variant="contained"
        onClick={() => navigate("/cliente/editar")}
        sx={{
          backgroundColor: "#0d47a1",
          fontWeight: 600,
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        Editar Perfil
      </Button>

      <Divider sx={{ my: 6 }} />

      {/* Cambiar Contraseña */}
      <Typography variant="h6" fontWeight={900} mb={1}>
        Cambiar Contraseña
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Actualiza tu contraseña para mantener tu cuenta segura. Te recomendamos usar una
        contraseña fuerte y única.
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Formulario */}
        <Paper elevation={4} sx={{ p: 3, flex: 1 }}>
          <Stack spacing={2}>
            <TextField
              label="Contraseña Actual"
              type="password"
              fullWidth
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
            />
            <TextField
              label="Nueva Contraseña"
              type="password"
              fullWidth
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <TextField
              label="Confirmar Nueva Contraseña"
              type="password"
              fullWidth
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#0d47a1" }}
                onClick={manejarCambioPassword}
              >
                Guardar Contraseña
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setPasswordActual("");
                  setNuevaPassword("");
                  setConfirmarPassword("");
                }}
              >
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Consejos */}
        <Paper elevation={4} sx={{ p: 3, flex: 1 }}>
          <Typography variant="h5" fontWeight={900} mb={2}>
            Consejos de Seguridad
          </Typography>
          <Typography variant="subtitle1" mb={2}>
            Recomendaciones para crear una contraseña segura
          </Typography>
          <List dense>
            {[
              "Usa al menos 12 caracteres",
              "Combina mayúsculas, minúsculas, números y símbolos",
              "Evita información personal fácil de adivinar",
              "No reutilices contraseñas en diferentes sitios",
              "Considera usar un gestor de contraseñas",
            ].map((text) => (
              <ListItem key={text}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Stack>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarTipo}
          elevation={6}
          variant="filled"
          iconMapping={{
            success: <CheckCircleIcon sx={{ color: "#0d47a1", fontSize: 28 }} />,
            error: <ErrorIcon sx={{ color: "#0d47a1", fontSize: 28 }} />,
          }}
          sx={{
            backgroundColor: "#e3f2fd",
            color: "#0d47a1",
            fontWeight: 600,
            fontSize: "1rem",
            px: 3,
            py: 2.5,
            minWidth: "300px",
          }}
        >
          {snackbarMensaje}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default PerfilCliente;
