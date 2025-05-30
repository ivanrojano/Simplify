import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  Alert as MuiAlert,
  Paper,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  LocationCity as LocationCityIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Apartment as ApartmentIcon,
  Public as PublicIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  PeopleAlt as PeopleAltIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CambiarContraseña from "./CambiarContraseña";

interface EmpresaProps {
  id: number;
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  email: string;
  fotoUrl?: string;
  telefono?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  sitioWeb?: string;
  nif?: string;
  horarioAtencion?: string;
  numeroEmpleados?: number;
  tipoEmpresa?: string;
  fechaRegistro?: string;
}

const PerfilEmpresa = ({
  id,
  nombreEmpresa,
  descripcion,
  direccion,
  email,
  fotoUrl,
  telefono,
  codigoPostal,
  ciudad,
  provincia,
  pais,
  sitioWeb,
  nif,
  horarioAtencion,
  numeroEmpleados,
  tipoEmpresa,
  fechaRegistro,
}: EmpresaProps) => {
  const navigate = useNavigate();

  const campoIncompleto =
    !nombreEmpresa?.trim() ||
    !descripcion?.trim() ||
    !direccion?.trim() ||
    !email?.trim() ||
    !telefono?.trim() ||
    !codigoPostal?.trim() ||
    !ciudad?.trim() ||
    !provincia?.trim() ||
    !pais?.trim() ||
    !sitioWeb?.trim() ||
    !nif?.trim() ||
    !horarioAtencion?.trim() ||
    !numeroEmpleados ||
    !tipoEmpresa?.trim() ||
    !fechaRegistro;

  const infoRow = (icon: React.ReactNode, label: string, value?: string | number | null) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <strong>{label}:</strong> {value && String(value).trim() !== "" ? value : "Sin datos"}
    </Box>
  );

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: "#fafafa" }}>
      <Typography variant="h6" fontWeight={900} mb={1}>
        Perfil de Empresa
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Información general y datos de la empresa
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" mb={3}>
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
          {!fotoUrl ? nombreEmpresa.charAt(0).toUpperCase() : null}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            {nombreEmpresa}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            Registrada desde: {fechaRegistro ? new Date(fechaRegistro).toLocaleDateString() : "Sin datos"}
          </Typography>
        </Box>
      </Stack>

      {campoIncompleto && (
        <MuiAlert severity="warning" sx={{ mb: 3 }}>
          Tu perfil no está completo. Por favor, actualiza tus datos para aprovechar todas las funcionalidades.
        </MuiAlert>
      )}

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Datos de Contacto</Typography>
          <Stack spacing={1.5}>
            {infoRow(<EmailIcon sx={{ color: "#0d47a1" }} />, "Email", email)}
            {infoRow(<PhoneIcon sx={{ color: "#0d47a1" }} />, "Teléfono", telefono)}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Dirección</Typography>
          <Stack spacing={1.5}>
            {infoRow(<LocationOnIcon sx={{ color: "#0d47a1" }} />, "Dirección", direccion)}
            {infoRow(<LocationCityIcon sx={{ color: "#0d47a1" }} />, "Ciudad", ciudad)}
            {infoRow(<HomeIcon sx={{ color: "#0d47a1" }} />, "Código Postal", codigoPostal)}
            {infoRow(<ApartmentIcon sx={{ color: "#0d47a1" }} />, "Provincia", provincia)}
            {infoRow(<PublicIcon sx={{ color: "#0d47a1" }} />, "País", pais)}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Información Fiscal</Typography>
          {infoRow(<BadgeIcon sx={{ color: "#0d47a1" }} />, "NIF", nif)}
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Empresa</Typography>
          <Stack spacing={1.5}>
            {infoRow(<WorkIcon sx={{ color: "#0d47a1" }} />, "Tipo", tipoEmpresa)}
            {infoRow(<PeopleAltIcon sx={{ color: "#0d47a1" }} />, "Número de empleados", numeroEmpleados)}
            {infoRow(<AccessTimeIcon sx={{ color: "#0d47a1" }} />, "Horario de atención", horarioAtencion)}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Presencia Online</Typography>
          {infoRow(<LanguageIcon sx={{ color: "#0d47a1" }} />, "Sitio Web", sitioWeb)}
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Descripción</Typography>
          <Typography variant="body2" color="text.secondary">
            {descripcion?.trim() || "Sin datos"}
          </Typography>
        </CardContent>
      </Card>

      <Button
        startIcon={<EditIcon />}
        variant="contained"
        onClick={() => navigate("/empresa/editar")}
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
        Puedes actualizar la contraseña de tu empresa aquí.
      </Typography>

      <CambiarContraseña id={id} tipo="empresa" />
    </Paper>
  );
};

export default PerfilEmpresa;
