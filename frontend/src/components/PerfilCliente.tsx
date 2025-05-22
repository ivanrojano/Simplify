import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
} from "@mui/material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import MuiAlert from "@mui/material/Alert"

import EditIcon from "@mui/icons-material/Edit"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import EmailIcon from "@mui/icons-material/Email"
import FingerprintIcon from "@mui/icons-material/Fingerprint"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationCityIcon from "@mui/icons-material/LocationCity"
import HomeIcon from "@mui/icons-material/Home"

interface Props {
  nombre: string
  direccion: string
  email: string
  id: number
  fotoUrl?: string | null
  telefono?: string | null
  codigoPostal?: string | null
  ciudad?: string | null
  fechaRegistro?: string
}

const PerfilCliente = ({
  nombre,
  direccion,
  email,
  id,
  fotoUrl,
  telefono,
  codigoPostal,
  ciudad,
  fechaRegistro,
}: Props) => {
  const navigate = useNavigate()

  const [passwordActual, setPasswordActual] = useState("")
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMensaje, setSnackbarMensaje] = useState("")
  const [snackbarTipo, setSnackbarTipo] = useState<"success" | "error">("success")

  const mostrarSnackbar = (mensaje: string, tipo: "success" | "error") => {
    setSnackbarMensaje(mensaje)
    setSnackbarTipo(tipo)
    setSnackbarOpen(true)
  }

  const manejarCambioPassword = async () => {
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      mostrarSnackbar("Por favor completa todos los campos.", "error")
      return
    }

    if (nuevaPassword.length < 6) {
      mostrarSnackbar("La nueva contraseña debe tener al menos 6 caracteres.", "error")
      return
    }

    if (nuevaPassword !== confirmarPassword) {
      mostrarSnackbar("Las contraseñas no coinciden.", "error")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        mostrarSnackbar("No estás autenticado.", "error")
        return
      }

      await axios.put(
        `http://localhost:8080/api/clientes/${id}/cambiar-password`,
        {
          passwordActual,
          nuevaPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      mostrarSnackbar("Contraseña actualizada exitosamente.", "success")
      setPasswordActual("")
      setNuevaPassword("")
      setConfirmarPassword("")
    } catch (error: any) {
      const msg =
        error.response?.data?.mensaje ||
        "Error al actualizar la contraseña. Intenta nuevamente."
      mostrarSnackbar(msg, "error")
    }
  }

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: 3,
        boxShadow: 4,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={0.5}>
        Información Personal
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Detalles de tu cuenta y perfil
      </Typography>

      {/* Avatar + Nombre y Fecha */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
        mb={3}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: fotoUrl ? "transparent" : "#0d47a1",
            border: "2px solid #0d47a1",
            fontWeight: 700,
            fontSize: 40,
            color: "#fff",
          }}
          src={fotoUrl || undefined}
        >
          {!fotoUrl ? nombre.charAt(0).toUpperCase() : null}
        </Avatar>

        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h5" fontWeight={800} color="#0d47a1">
            {nombre || "Sin datos"}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            Cliente desde:{" "}
            {fechaRegistro
              ? new Date(fechaRegistro).toLocaleDateString()
              : "Sin datos"}
          </Typography>
        </Box>
      </Stack>

      {/* Alerta si perfil incompleto */}
      {(!telefono || !ciudad || !codigoPostal) && (
        <Box mb={3}>
          <MuiAlert severity="warning" sx={{ mb: 2 }}>
            Tu perfil no está completo. Por favor, actualiza tus datos para aprovechar todas las funcionalidades.
          </MuiAlert>
        </Box>
      )}

      {/* Datos personales - 3 columnas por fila */}
      <Stack spacing={3} mb={3}>
        {/* Fila 1 */}
        <Stack
          direction="row"
          gap={3}
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Box sx={{ flex: 1, minWidth: "280px", textAlign: "left", mb: 3}}>
            <Typography>
              <EmailIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
              <strong>Email:</strong> {email || "Sin datos"}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: "280px", textAlign: "center" }}>
            <Typography>
              <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
              <strong>Dirección:</strong> {direccion?.trim() || "Sin datos"}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: "280px", textAlign: "right" }}>
            <Typography>
              <PhoneIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
              <strong>Teléfono:</strong> {telefono?.trim() || "Sin datos"}
            </Typography>
          </Box>
        </Stack>

        {/* Fila 2 */}
        <Stack
          direction="row"
          gap={3}
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{ width: "100%"}}
        >
          <Box sx={{ flex: 1, minWidth: "280px", textAlign: "left" }}>
            <Typography>
              <LocationCityIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
              <strong>Ciudad:</strong> {ciudad?.trim() || "Sin datos"}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: "280px", textAlign: "center" }}>
            <Typography>
              <HomeIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
              <strong>Código Postal:</strong> {codigoPostal?.trim() || "Sin datos"}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: "280px", textAlign: "right" }}>
            <Typography>
              <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
              <strong>ID de Cliente:</strong> #{id.toString().padStart(6, "0")}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Button
        variant="contained"
        fullWidth
        startIcon={<EditIcon />}
        onClick={() => navigate("/cliente/editar")}
        sx={{
          mt:3,
          backgroundColor: "#0d47a1",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        Editar Perfil
      </Button>


      <Divider sx={{ mt: 6 }} />

      {/* Cambiar Contraseña */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight={900} mb={1}>
          Cambiar Contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Actualiza tu contraseña para mantener tu cuenta segura. Te recomendamos usar una
          contraseña fuerte y única.
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Formulario */}
          <Paper elevation={4} sx={{ p: 3, flex: 1 }}>
            <Stack spacing={2}>
              <TextField
                label="Contraseña Actual"
                type="password"
                fullWidth
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
              />
              <TextField
                label="Nueva Contraseña"
                type="password"
                fullWidth
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
              />
              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                fullWidth
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
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
                    setPasswordActual("")
                    setNuevaPassword("")
                    setConfirmarPassword("")
                  }}
                >
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Consejos de Seguridad */}
          <Paper elevation={4} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h5" fontWeight={900} mb={2}>
              Consejos de Seguridad
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              Recomendaciones para crear una contraseña segura
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Usa al menos 12 caracteres" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Combina mayúsculas, minúsculas, números y símbolos" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Evita información personal fácil de adivinar" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="No reutilices contraseñas en diferentes sitios" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Considera usar un gestor de contraseñas" />
              </ListItem>
            </List>
          </Paper>
        </Stack>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
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
        </MuiAlert>
      </Snackbar>
    </Box>
  )
}

export default PerfilCliente
