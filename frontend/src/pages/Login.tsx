import { useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Fade,
  keyframes,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface AuthResponse {
  token: string;
  id: number;
  rol: "CLIENTE" | "EMPRESA" | "ADMIN";
}

interface JwtPayload {
  sub: string;
  rol: "CLIENTE" | "EMPRESA" | "ADMIN";
  exp: number;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<AuthResponse>(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );

      const { token, id, rol } = response.data;
      const decoded = jwtDecode<JwtPayload>(token);

      login(token);
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("email", decoded.sub);

      if (rol === "EMPRESA") {
        localStorage.setItem("empresaId", id.toString());
      } else if (rol === "CLIENTE") {
        localStorage.setItem("clienteId", id.toString());
      }

      setSnackbarMessage(`Bienvenido ${decoded.sub} (rol: ${rol})`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      switch (rol) {
        case "CLIENTE":
          navigate("/cliente");
          break;
        case "EMPRESA":
          navigate("/empresa");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Error de login:", error);
      setSnackbarMessage("Credenciales incorrectas o error del servidor");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        px: 2,
        py: 4,
        position: "relative",
      }}
    >
      <Fade in timeout={600}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#0d47a1",
          }}
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
            width: { xs: 100, sm: 120 },
            animation: `${pulse} 2.5s ease-in-out infinite`,
            mb: 2,
            cursor: "pointer",
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography
          variant={isSmallScreen ? "h4" : "h3"}
          color="#0d47a1"
          fontWeight={700}
          gutterBottom
        >
          Iniciar Sesión
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
            mt: 2,
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
                  <EmailIcon sx={{ color: "#0d47a1" }} />
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
                  <LockIcon sx={{ color: "#0d47a1" }} />
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

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#0d47a1",
              "&:hover": { backgroundColor: "#08306b" },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Fade>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center" 
        textAlign="center"
        mt={4}
      >
        <Fade in timeout={1500}>
          <Typography fontSize="0.95rem">
            ¿No tienes una cuenta?
            <Button
              onClick={() => navigate("/registro")}
              sx={{
                ml: 1,
                textTransform: "none",
                fontWeight: 600,
                color: "#0d47a1",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Regístrate aquí
            </Button>
            .
            <br />
            Al registrarte, aceptas nuestra{" "}
            <Button
              onClick={() => navigate("/politica-privacidad")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#0d47a1",
                p: 0,
                minWidth: "auto",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Política de Privacidad
            </Button>
            .
          </Typography>
        </Fade>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
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
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Login;
