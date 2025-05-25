import type { FC } from "react";
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
import { useNavigate } from "react-router-dom";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";

import CambiarContraseña from "./CambiarContraseña";

interface PerfilEmpresaProps {
  id: number;
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  email: string;
  fotoUrl?: string | null;
  telefono?: string | null;
  codigoPostal?: string | null;
  ciudad?: string | null;
  provincia?: string | null;
  pais?: string | null;
  sitioWeb?: string | null;
  nif?: string | null;
  horarioAtencion?: string | null;
  numeroEmpleados?: number | null;
  tipoEmpresa?: string | null;
  fechaRegistro?: string | null;
}

const PerfilEmpresa: FC<PerfilEmpresaProps> = ({
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
}) => {
  const navigate = useNavigate();

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
  }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
      <Box sx={{ color: "#0d47a1", display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography component="span" fontWeight={600}>
        {label}:
      </Typography>
      <Typography component="span">
        {value && String(value).trim() !== "" ? value : "Rellena este campo"}
      </Typography>
    </Box>
  );

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

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: "#fafafa" }}>
      <Typography variant="h6" fontWeight={900} mb={1}>
        Perfil de Empresa
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Información general y de contacto de tu empresa
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
          <Typography variant="h5" fontWeight={800} color="#0d47a1">
            {nombreEmpresa || "Sin datos"}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            Registrada desde:{" "}
            {fechaRegistro ? new Date(fechaRegistro).toLocaleDateString() : "Rellena este campo"}
          </Typography>
        </Box>
      </Stack>

      {campoIncompleto && (
        <MuiAlert severity="warning" sx={{ mb: 3 }}>
          Tu perfil no está completo. Por favor, actualiza tus datos para aprovechar todas las funcionalidades.
        </MuiAlert>
      )}

      <Divider sx={{ my: 3 }} />

      <Stack spacing={3}>
        {[
          {
            title: "Datos de Contacto",
            items: [
              { icon: <EmailIcon />, label: "Email", value: email },
              { icon: <PhoneIcon />, label: "Teléfono", value: telefono },
              { icon: <FingerprintIcon />, label: "ID Empresa", value: `#${id.toString().padStart(6, "0")}` },
            ],
          },
          {
            title: "Dirección",
            items: [
              { icon: <LocationOnIcon />, label: "Dirección", value: direccion },
              { icon: <HomeIcon />, label: "Código Postal", value: codigoPostal },
              { icon: <LocationCityIcon />, label: "Ciudad", value: ciudad },
              { icon: <ApartmentIcon />, label: "Provincia", value: provincia },
              { icon: <PublicIcon />, label: "País", value: pais },
            ],
          },
          {
            title: "Información Fiscal",
            items: [{ icon: <BadgeIcon />, label: "NIF", value: nif }],
          },
          {
            title: "Empresa",
            items: [
              { icon: <WorkIcon />, label: "Tipo", value: tipoEmpresa },
              { icon: <PeopleAltIcon />, label: "Número de Empleados", value: numeroEmpleados?.toString() },
              { icon: <AccessTimeIcon />, label: "Horario de Atención", value: horarioAtencion },
            ],
          },
          {
            title: "Presencia Online",
            items: [{ icon: <LanguageIcon />, label: "Sitio Web", value: sitioWeb }],
          },
        ].map(({ title, items }) => (
          <Card key={title} elevation={8} sx={{ p: 2, borderRadius: 2, bgcolor: "#ffffff" }}>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                {title}
              </Typography>
              <Stack spacing={1}>
                {items.map((item, i) => (
                  <InfoRow key={i} icon={item.icon} label={item.label} value={item.value} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}

        <Card elevation={8} sx={{ p: 2, borderRadius: 2, bgcolor: "#ffffff" }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Descripción
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {descripcion?.trim() || "Rellena este campo"}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Button
        fullWidth
        startIcon={<EditIcon />}
        variant="contained"
        onClick={() => navigate("/empresa/editar")}
        sx={{ mt: 4, backgroundColor: "#0d47a1", fontWeight: 600, "&:hover": { backgroundColor: "#1565c0" } }}
      >
        Editar Perfil
      </Button>

      <Divider sx={{ my: 6 }} />

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
