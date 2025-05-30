import { useState } from "react";
import axios from "axios";
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
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

export default function RegistroCliente() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    direccion: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.nombre || !form.direccion) {
      showSnackbar("Todos los campos son obligatorios.", "warning");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/registro/cliente`, form);
      showSnackbar("Cliente registrado correctamente", "success");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      setForm({
        email: "",
        password: "",
        nombre: "",
        direccion: "",
      });
    } catch (err) {
      const status = (err as any)?.response?.status;
      if (status === 409 || status === 401) {
        showSnackbar("Ya existe un cliente con ese correo o nombre.", "error");
      } else if (status === 400) {
        showSnackbar("Datos inválidos. Revisa el formulario.", "error");
      } else {
        showSnackbar("Error al registrar cliente.", "error");
      }
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
        py: 4,
        textAlign: "center",
        position: "relative",
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
            width: { xs: 90, sm: 120 },
            animation: `${pulse} 2.5s ease-in-out infinite`,
            mb: 1,
            cursor: "pointer",
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          color="#0d47a1"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 1 }}
        >
          Registro de Cliente
        </Typography>
      </Fade>

      <Fade in timeout={1200}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 400,
            maxHeight: "70vh",
            overflowY: "auto",
            py: 1,
            px: { xs: 1, sm: 0 },
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
                  <Tooltip title={showPassword ? "Ocultar" : "Mostrar"}>
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Nombre completo">
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
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Dirección">
                    <HomeIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 1,
              py: 1.3,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#0d47a1",
              "&:hover": { backgroundColor: "#08306b" },
            }}
          >
            Registrarse
          </Button>
        </Box>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as "success" | "error" | "info" | "warning"}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
