import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
  Alert as MuiAlert,
  Card,
  CardContent,
} from "@mui/material";
import {
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  LocationCity as LocationCityIcon,
  Home as HomeIcon,
  Fingerprint as FingerprintIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CambiarContraseña from "./CambiarContraseña";

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

  const campoIncompleto = !telefono || !ciudad || !codigoPostal;

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={1}>
        Perfil del Cliente
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Información general y datos personales
      </Typography>

      {/* Avatar e Identidad */}
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ p: 3, mb: 2 }} spacing={3} alignItems="center">
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: fotoUrl ? "transparent" : "#0d47a1",
            border: "2px solid #0d47a1",
            fontWeight: 700,
            fontSize: 36,
            color: "#fff",
          }}
          src={fotoUrl || undefined}
        >
          {!fotoUrl ? nombre.charAt(0).toUpperCase() : null}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={900}>
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

      {campoIncompleto && (
        <MuiAlert severity="warning" sx={{ mb: 3 }}>
          Tu perfil no está completo. Por favor, actualiza tus datos para aprovechar todas las funcionalidades.
        </MuiAlert>
      )}

      {/* Datos de Contacto */}
      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Datos de Contacto
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon sx={{ color: "#0d47a1" }} />
              <strong>Email:</strong> {email || "Sin datos"}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ color: "#0d47a1" }} />
              <strong>Teléfono:</strong> {telefono || "Sin datos"}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Dirección */}
      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Dirección
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon sx={{ color: "#0d47a1" }} />
              <strong>Dirección:</strong> {direccion || "Sin datos"}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationCityIcon sx={{ color: "#0d47a1" }} />
              <strong>Ciudad:</strong> {ciudad || "Sin datos"}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HomeIcon sx={{ color: "#0d47a1" }} />
              <strong>Código Postal:</strong> {codigoPostal || "Sin datos"}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Identificación */}
      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Identificación
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FingerprintIcon sx={{ color: "#0d47a1" }} />
            <strong>ID Cliente:</strong> #{id.toString().padStart(6, "0")}
          </Box>
        </CardContent>
      </Card>

      <Button
        startIcon={<EditIcon />}
        variant="contained"
        onClick={() => navigate("/cliente/editar")}
        sx={{
          mt: 2,
          px: 5,
          py: 1,
          bgcolor: "#0d47a1",
          fontWeight: 500,
          fontSize: "0.95rem",
          borderRadius: 2,
          textTransform: "none",
          mb: 5,
          alignSelf: "flex-start",
          "&:hover": {
            bgcolor: "#1565c0",
          },
        }}
      >
        Editar perfil
      </Button>



      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" fontWeight={900} mb={1}>
        Seguridad
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Puedes actualizar tu contraseña aquí.
      </Typography>

      <CambiarContraseña id={id} tipo="cliente" />
    </Paper>
  );
};

export default PerfilCliente;
