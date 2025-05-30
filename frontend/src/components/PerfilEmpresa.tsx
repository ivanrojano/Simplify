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
  CircularProgress,
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
import { useEffect, useState } from "react";
import axios from "axios";
import CambiarContraseña from "./CambiarContraseña";

const PerfilEmpresa = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");

  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !empresaId) {
      navigate("/login");
      return;
    }

    const fetchEmpresa = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/empresas/${empresaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpresa(res.data);
      } catch {
        navigate("/empresa/editar");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, []);


  const infoRow = (icon: React.ReactNode, label: string, value?: string | number | null) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <strong>{label}:</strong> {value && String(value).trim() !== "" ? value : "Sin datos"}
    </Box>
  );

  const campoIncompleto = empresa && (
    !empresa.nombreEmpresa?.trim() ||
    !empresa.descripcion?.trim() ||
    !empresa.direccion?.trim() ||
    !empresa.email?.trim() ||
    !empresa.telefono?.trim() ||
    !empresa.codigoPostal?.trim() ||
    !empresa.ciudad?.trim() ||
    !empresa.provincia?.trim() ||
    !empresa.pais?.trim() ||
    !empresa.sitioWeb?.trim() ||
    !empresa.nif?.trim() ||
    !empresa.horarioAtencion?.trim() ||
    !empresa.numeroEmpleados ||
    !empresa.tipoEmpresa?.trim() ||
    !empresa.fechaRegistro
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!empresa) return null;

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
            bgcolor: empresa.fotoUrl ? "transparent" : "#0d47a1",
            border: "2px solid #0d47a1",
            fontWeight: 700,
            fontSize: 36,
            color: "#fff",
          }}
          src={empresa.fotoUrl || undefined}
        >
          {!empresa.fotoUrl ? empresa.nombreEmpresa.charAt(0).toUpperCase() : null}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            {empresa.nombreEmpresa}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            Registrada desde: {new Date(empresa.fechaRegistro).toLocaleDateString()}
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
            {infoRow(<EmailIcon sx={{ color: "#0d47a1" }} />, "Email", empresa.email)}
            {infoRow(<PhoneIcon sx={{ color: "#0d47a1" }} />, "Teléfono", empresa.telefono)}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Dirección</Typography>
          <Stack spacing={1.5}>
            {infoRow(<LocationOnIcon sx={{ color: "#0d47a1" }} />, "Dirección", empresa.direccion)}
            {infoRow(<LocationCityIcon sx={{ color: "#0d47a1" }} />, "Ciudad", empresa.ciudad)}
            {infoRow(<HomeIcon sx={{ color: "#0d47a1" }} />, "Código Postal", empresa.codigoPostal)}
            {infoRow(<ApartmentIcon sx={{ color: "#0d47a1" }} />, "Provincia", empresa.provincia)}
            {infoRow(<PublicIcon sx={{ color: "#0d47a1" }} />, "País", empresa.pais)}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Información Fiscal</Typography>
          {infoRow(<BadgeIcon sx={{ color: "#0d47a1" }} />, "NIF", empresa.nif)}
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Empresa</Typography>
          <Stack spacing={1.5}>
            {infoRow(<WorkIcon sx={{ color: "#0d47a1" }} />, "Tipo", empresa.tipoEmpresa)}
            {infoRow(<PeopleAltIcon sx={{ color: "#0d47a1" }} />, "Número de empleados", empresa.numeroEmpleados)}
            {infoRow(<AccessTimeIcon sx={{ color: "#0d47a1" }} />, "Horario de atención", empresa.horarioAtencion)}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Presencia Online</Typography>
          {infoRow(<LanguageIcon sx={{ color: "#0d47a1" }} />, "Sitio Web", empresa.sitioWeb)}
        </CardContent>
      </Card>

      <Card elevation={8} sx={{ p: 3, mb: 4, bgcolor: "#fff" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Descripción</Typography>
          <Typography variant="body2" color="text.secondary">
            {empresa.descripcion?.trim() || "Sin datos"}
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

      <CambiarContraseña id={empresa.id} tipo="empresa" />
    </Paper>
  );
};

export default PerfilEmpresa;
