import { useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
} from "@mui/material";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<AuthResponse>(
        "http://localhost:8080/api/auth/login",
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

      toast.success(`Bienvenido ${decoded.sub} (rol: ${rol})`);

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
      toast.error("Credenciales incorrectas o error del servidor");
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
        textAlign: "center",
        position: "relative"
      }}
    >
      <Fade in timeout={600}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{ position: "absolute", top: 16, left: 16, color: "#0d47a1" }}
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
            mb: 2,
            cursor: "pointer"
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography variant="h3" color="#0d47a1" fontWeight={700} gutterBottom>
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
            mt: 2
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
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#0d47a1",
              "&:hover": { backgroundColor: "#08306b" },
              transition: "all 0.3s ease-in-out"
            }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Fade>

      <Fade in timeout={1500}>
        <Typography mt={4} fontSize="0.95rem">
          ¿No tienes una cuenta?
          <Button
            onClick={() => navigate("/registro")}
            sx={{
              ml: 1,
              textTransform: "none",
              fontWeight: 600,
              color: "#0d47a1",
              "&:hover": { textDecoration: "underline" }
            }}
          >
            Regístrate aquí
          </Button>
        </Typography>
      </Fade>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </Box>
  );
};

export default Login;
