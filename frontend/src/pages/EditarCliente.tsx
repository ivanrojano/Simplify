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
} from "@mui/material";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  useEffect(() => {
    if (!token || !clienteId) {
      navigate("/login");
      return;
    }

    axios
      .get<Cliente>(`${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar el perfil.");
        navigate("/cliente");
      });
  }, [token, clienteId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio.");
    if (form.nombre.length > 20)
      return toast.error("El nombre no puede tener más de 20 caracteres.");
    if (!form.direccion.trim() || form.direccion.length < 5)
      return toast.error("La dirección debe tener al menos 5 caracteres.");
    if (!form.email.includes("@")) return toast.error("Email inválido.");
    if (form.telefono && form.telefono.length < 7)
      return toast.error("El teléfono debe tener al menos 7 dígitos.");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSend = {
      ...form,
      fotoUrl: form.fotoUrl?.trim() === "" ? null : form.fotoUrl,
    };

    axios
      .put(`${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Perfil actualizado correctamente");
        setTimeout(() => navigate("/cliente"), 1500);
      })
      .catch((error) => {
        console.error(error.response?.data || error);
        toast.error(error.response?.data?.mensaje || "Error al guardar los cambios.");
      });
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );

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
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Nombre">
                    <PersonIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Dirección">
                    <LocationOnIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Correo electrónico">
                    <EmailIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Teléfono">
                    <PhoneIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Código Postal"
            name="codigoPostal"
            value={form.codigoPostal || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Código Postal">
                    <HomeIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Ciudad"
            name="ciudad"
            value={form.ciudad || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Ciudad">
                    <LocationCityIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Foto de Perfil (URL)"
            name="fotoUrl"
            value={form.fotoUrl || ""}
            onChange={handleChange}
            fullWidth
            placeholder="https://ejemplo.com/foto.jpg"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="URL de la foto">
                    <ImageIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
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

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </Box>
  );
};

export default EditarCliente;
