import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Fade,
  keyframes,
  InputAdornment,
  Tooltip,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

export default function RegistroEmpresa() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombreEmpresa: "",
    descripcion: "",
    direccion: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.email ||
      !form.password ||
      !form.nombreEmpresa ||
      !form.descripcion ||
      !form.direccion
    ) {
      toast.warn("Todos los campos son obligatorios.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/registro/empresa", form);
      toast.success("Empresa registrada correctamente");
      setTimeout(() => {
        navigate("/");
      }, 3000);
      setForm({
        email: "",
        password: "",
        nombreEmpresa: "",
        descripcion: "",
        direccion: "",
      });
    } catch (err) {
      const status = (err as any)?.response?.status;
      if (status === 409 || status === 401) {
        toast.error("Ya existe una empresa con ese correo o nombre.");
      } else if (status === 400) {
        toast.error("Datos inválidos. Revisa el formulario.");
      } else {
        toast.error("Error al registrar empresa.");
      }
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        px: 2,
        textAlign: "center",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", top: 12, left: 12, color: "#0d47a1" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={800}>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          onClick={() => navigate("/")}
          sx={{
            width: 120,
            animation: `${pulse} 2.5s ease-in-out infinite`,
            mb: 1,
            cursor: "pointer",
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography
          variant="h5"
          color="#0d47a1"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 1 }}
        >
          Registro de Empresa
        </Typography>
      </Fade>

      <Fade in timeout={1200}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            width: "100%",
            maxWidth: 360,
            maxHeight: "75vh",
            overflowY: "auto",
            py: 1,
          }}
        >
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
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
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Contraseña">
                    <LockIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Nombre de la Empresa"
            name="nombreEmpresa"
            value={form.nombreEmpresa}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Nombre de la empresa">
                    <BusinessIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Descripción"
            name="descripcion"
            multiline
            rows={3}
            value={form.descripcion}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Descripción de la empresa">
                    <DescriptionIcon sx={{ color: "#0d47a1" }} />
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
            required
            fullWidth
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

          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 1,
              py: 1.2,
              backgroundColor: "#0d47a1",
              fontWeight: 600,
              fontSize: "0.95rem",
              "&:hover": { backgroundColor: "#08306b" },
            }}
          >
            Registrarse
          </Button>
        </Box>
      </Fade>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Box>
  );
}
