import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Fade,
  Snackbar,
  Alert,
  keyframes,
  InputAdornment,
  Tooltip,
} from "@mui/material";

import ConfirmModalLogout from "./ConfirmModalLogout";

import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";

type Empresa = {
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  email: string;
  fotoUrl?: string | null;
  nif?: string;
  telefono?: string;
  horarioAtencion?: string;
  numeroEmpleados?: number;
  tipoEmpresa?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  sitioWeb?: string;
};

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

const EditarEmpresa = () => {
  const [form, setForm] = useState<Empresa>({
    nombreEmpresa: "",
    descripcion: "",
    direccion: "",
    email: "",
    fotoUrl: "",
    nif: "",
    telefono: "",
    horarioAtencion: "",
    numeroEmpleados: undefined,
    tipoEmpresa: "",
    codigoPostal: "",
    ciudad: "",
    provincia: "",
    pais: "",
    sitioWeb: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
    if (!token || !empresaId) {
      navigate("/login");
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get<Empresa>(`http://localhost:8080/api/empresas/${empresaId}`, headers)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Error al cargar el perfil", severity: "error" });
        navigate("/empresa");
      });
  }, [token, empresaId, navigate]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.nombreEmpresa.trim()) newErrors.nombreEmpresa = "El nombre es obligatorio";
    if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";
    if (!form.email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Email inválido o vacío";

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "numeroEmpleados" ? parseInt(value) || 0 : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const dataToSend = { ...form, fotoUrl: form.fotoUrl?.trim() === "" ? null : form.fotoUrl };

    axios
      .put(`${import.meta.env.VITE_API_URL}/api/empresas/${empresaId}`, dataToSend, headers)
      .then(() => {
        setSnackbar({ open: true, message: "Perfil actualizado correctamente", severity: "success" });
        setTimeout(() => navigate("/empresa", { replace: true }), 1000); 
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Error al guardar los cambios", severity: "error" });
      });
  };


  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        px: 2,
        py: 4,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/empresa")}
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
            fontWeight: 600,
          }}
        >
          Cerrar Sesión
        </Button>
      </Fade>

      <Fade in timeout={800}>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          onClick={() => navigate("/")}
          sx={{
            width: 100,
            animation: `${pulse} 2.5s ease-in-out infinite`,
            mb: 2,
            cursor: "pointer",
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography variant="h4" fontWeight={700} color="#0d47a1" mb={3}>
          Editar Perfil de Empresa
        </Typography>
      </Fade>

      <Fade in timeout={1200}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
            maxWidth: 600,
          }}
        >
          {[
            { label: "Nombre de la Empresa", name: "nombreEmpresa", icon: <BusinessIcon /> },
            { label: "Descripción", name: "descripcion", icon: <DescriptionIcon />, multiline: true },
            { label: "Dirección", name: "direccion", icon: <LocationOnIcon /> },
            { label: "Email", name: "email", icon: <EmailIcon /> },
            { label: "Foto de Perfil (URL)", name: "fotoUrl", icon: <ImageIcon /> },
            { label: "NIF", name: "nif", icon: <FingerprintIcon /> },
            { label: "Teléfono", name: "telefono", icon: <PhoneIcon /> },
            { label: "Horario de Atención", name: "horarioAtencion", icon: <AccessTimeIcon /> },
            { label: "Número de Empleados", name: "numeroEmpleados", type: "number", icon: <PeopleAltIcon /> },
            { label: "Tipo de Empresa", name: "tipoEmpresa", icon: <ApartmentIcon /> },
            { label: "Código Postal", name: "codigoPostal", icon: <HomeIcon /> },
            { label: "Ciudad", name: "ciudad", icon: <LocationCityIcon /> },
            { label: "Provincia", name: "provincia", icon: <MapIcon /> },
            { label: "País", name: "pais", icon: <PublicIcon /> },
            { label: "Sitio Web", name: "sitioWeb", icon: <LanguageIcon /> },
          ].map(({ label, name, icon, multiline, type }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              value={(form as any)[name] || ""}
              onChange={handleChange}
              fullWidth
              multiline={multiline}
              type={type || "text"}
              error={Boolean(errors[name])}
              helperText={errors[name] || ""}
              InputProps={{
                startAdornment: icon ? (
                  <InputAdornment position="start">
                    <Tooltip title={label}>{icon}</Tooltip>
                  </InputAdornment>
                ) : undefined,
              }}
            />
          ))}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              bgcolor: "#0d47a1",
              fontWeight: 500,
              fontSize: "0.95rem",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            Guardar cambios
          </Button>
        </Box>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as "success" | "error"}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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

export default EditarEmpresa;
