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
  keyframes,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import ConfirmModalLogout from "../components/ConfirmModalLogout";

import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

type Cliente = {
  nombre: string;
  direccion: string;
  email: string;
  fotoUrl?: string | null;
  telefono?: string;
  codigoPostal?: string;
  ciudad?: string;
};

const EditarCliente = () => {
  const [form, setForm] = useState<Cliente>({
    nombre: "",
    direccion: "",
    email: "",
    fotoUrl: "",
    telefono: "",
    codigoPostal: "",
    ciudad: "",
  });

  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  useEffect(() => {
    if (!token || !clienteId) {
      navigate("/login");
      return;
    }

    axios
      .get<Cliente>(`http://localhost:8080/api/clientes/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        showSnackbar("Error al cargar el perfil.", "error");
        navigate("/cliente");
      });
  }, [token, clienteId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = (): boolean => {
    if (!form.nombre.trim()) {
      showSnackbar("El nombre es obligatorio.", "error");
      return false;
    }

    if (form.nombre.trim().length > 20) {
      showSnackbar("El nombre no puede tener más de 20 caracteres.", "error");
      return false;
    }

    if (!form.direccion.trim() || form.direccion.length < 5) {
      showSnackbar("La dirección debe tener al menos 5 caracteres.", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      showSnackbar("Email inválido.", "error");
      return false;
    }

    if (form.telefono && form.telefono.trim().length < 7) {
      showSnackbar("El teléfono debe tener al menos 7 dígitos.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const dataToSend = {
      ...form,
      fotoUrl: form.fotoUrl?.trim() === "" ? null : form.fotoUrl?.trim(),
    };

    axios
      .put(`http://localhost:8080/api/clientes/${clienteId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        showSnackbar("Perfil actualizado correctamente", "success");
        setTimeout(() => navigate("/cliente"), 1500);
      })
      .catch((error) => {
        console.error(error.response?.data || error);
        showSnackbar(error.response?.data?.mensaje || "Error al guardar los cambios.", "error");
      });
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#ffffff",
        px: 2,
        py: 4,
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
          Editar Perfil del Cliente
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
            maxWidth: 450,
          }}
        >
          {[
            { label: "Nombre", name: "nombre", icon: <PersonIcon />, required: true },
            { label: "Dirección", name: "direccion", icon: <LocationOnIcon />, required: true },
            { label: "Email", name: "email", icon: <EmailIcon />, type: "email", required: true },
            { label: "Teléfono", name: "telefono", icon: <PhoneIcon /> },
            { label: "Código Postal", name: "codigoPostal", icon: <HomeIcon /> },
            { label: "Ciudad", name: "ciudad", icon: <LocationCityIcon /> },
            {
              label: "Foto de Perfil (URL)",
              name: "fotoUrl",
              icon: <ImageIcon />,
              placeholder: "https://ejemplo.com/foto.jpg",
            },
          ].map(({ label, name, icon, type, required, placeholder }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              value={(form as any)[name] || ""}
              onChange={handleChange}
              fullWidth
              required={required}
              type={type || "text"}
              placeholder={placeholder}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title={label}>{icon}</Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          ))}

          <Button
            variant="contained"
            type="submit"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#0d47a1",
              "&:hover": { backgroundColor: "#08306b" },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Guardar cambios
          </Button>
        </Box>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </Box>
  );
};

export default EditarCliente;
