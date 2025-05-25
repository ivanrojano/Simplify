import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

interface CambiarPasswordProps {
  id: number;
  tipo: "cliente" | "empresa";
}

const CambiarPassword = ({ id, tipo }: CambiarPasswordProps) => {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [snackbarTipo, setSnackbarTipo] = useState<"success" | "error">("success");

  const mostrarSnackbar = (mensaje: string, tipo: "success" | "error") => {
    setSnackbarMensaje(mensaje);
    setSnackbarTipo(tipo);
    setSnackbarOpen(true);
  };

  const manejarCambioPassword = async () => {
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      mostrarSnackbar("Por favor completa todos los campos.", "error");
      return;
    }

    if (nuevaPassword.length < 6) {
      mostrarSnackbar("La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      mostrarSnackbar("Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        mostrarSnackbar("No estás autenticado.", "error");
        return;
      }

      const endpoint = `http://localhost:8080/api/${tipo}s/${id}/cambiar-password`;

      await axios.put(
        endpoint,
        { passwordActual, nuevaPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      mostrarSnackbar("Contraseña actualizada exitosamente.", "success");
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || "Error al actualizar la contraseña.";
      mostrarSnackbar(msg, "error");
    }
  };

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3} mt={4}>
      <Card elevation={8} sx={{ p: 3, flex: 1, bgcolor: "#fff" }}>
        <Typography variant="h6" fontWeight={900} mb={2}>
          Cambiar Contraseña
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Contraseña Actual"
            type={mostrarPasswordActual ? "text" : "password"}
            fullWidth
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarPasswordActual((prev) => !prev)}>
                    {mostrarPasswordActual ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nueva Contraseña"
            type={mostrarNuevaPassword ? "text" : "password"}
            fullWidth
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarNuevaPassword((prev) => !prev)}>
                    {mostrarNuevaPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar Nueva Contraseña"
            type={mostrarConfirmarPassword ? "text" : "password"}
            fullWidth
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarConfirmarPassword((prev) => !prev)}>
                    {mostrarConfirmarPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0d47a1" }}
              onClick={manejarCambioPassword}
            >
              Guardar Contraseña
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setPasswordActual("");
                setNuevaPassword("");
                setConfirmarPassword("");
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card elevation={8} sx={{ p: 3, flex: 1, bgcolor: "#fff" }}>
        <Typography variant="h6" fontWeight={900} mb={2}>
          Consejos de Seguridad
        </Typography>
        <Typography variant="subtitle1" mb={2}>
          Recomendaciones para una contraseña segura:
        </Typography>
        <List dense>
          {[
            "Usa al menos 12 caracteres",
            "Combina mayúsculas, minúsculas, números y símbolos",
            "Evita información personal fácil de adivinar",
            "No reutilices contraseñas en diferentes sitios",
            "Considera usar un gestor de contraseñas",
          ].map((text) => (
            <ListItem key={text}>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarTipo}
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
          {snackbarMensaje}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CambiarPassword;
