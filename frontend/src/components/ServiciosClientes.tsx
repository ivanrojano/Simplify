import { useEffect, useState } from "react"
import axios from "axios"
import {
  Avatar,
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material"

import BusinessIcon from "@mui/icons-material/Business"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import EmailIcon from "@mui/icons-material/Email"
import DescriptionIcon from "@mui/icons-material/Description"
import MuiAlert from "@mui/material/Alert"
import type { AlertColor } from "@mui/material/Alert"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  precio: number
  empresa: {
    id: number
    nombreEmpresa: string
    descripcion: string
    direccion: string
    email: string
    fotoUrl?: string | null
  }
}

interface SolicitudRaw {
  estado: string
  servicio: {
    id: number
  }
}

interface Solicitud {
  servicioId: number
  estado: string
}

const ServiciosCliente = () => {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [enviandoSolicitudId, setEnviandoSolicitudId] = useState<number | null>(null)

  const [filtro, setFiltro] = useState("")

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success")

  const token = localStorage.getItem("token")
  const clienteId = localStorage.getItem("clienteId")

  useEffect(() => {
    if (!token || !clienteId) return

    const headers = { headers: { Authorization: `Bearer ${token}` } }

    axios
      .get<Servicio[]>("http://localhost:8080/api/servicios", headers)
      .then((res) => {
        setServicios(res.data)
        setLoading(false)
      })
      .catch(() => {
        console.error("Error al cargar servicios")
        setLoading(false)
      })

    axios
      .get<SolicitudRaw[]>(`http://localhost:8080/api/solicitudes/cliente/${clienteId}`, headers)
      .then((res) => {
        const mapped = res.data.map((s) => ({
          servicioId: s.servicio.id,
          estado: s.estado,
        }))
        setSolicitudes(mapped)
      })
      .catch(() => {
        console.error("Error al cargar solicitudes")
      })
  }, [token, clienteId])

  const solicitarServicio = async (servicioId: number) => {
    setEnviandoSolicitudId(servicioId)

    try {
      await axios.post(
        "http://localhost:8080/api/solicitudes/crear",
        { clienteId: Number(clienteId), servicioId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSolicitudes((prev) => [...prev, { servicioId, estado: "PENDIENTE" }])
      showSnackbar("Solicitud enviada correctamente", "success")
    } catch {
      showSnackbar("Error al solicitar el servicio", "error")
    } finally {
      setEnviandoSolicitudId(null)
    }
  }

  const yaSolicitado = (servicioId: number) => {
    const solicitud = solicitudes.find((s) => s.servicioId === servicioId)
    return solicitud && solicitud.estado !== "FINALIZADA" && solicitud.estado !== "RECHAZADA"
  }

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const serviciosFiltrados = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    s.empresa.nombreEmpresa.toLowerCase().includes(filtro.toLowerCase()) ||
    s.empresa.direccion.toLowerCase().includes(filtro.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: { xs: 2, sm: 3, md: 4 },
        boxShadow: 4,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={0.5}>
        Nuestros Servicios
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Explora y selecciona los servicios que necesitas
      </Typography>

      <TextField
        fullWidth
        label="Buscar por servicio, empresa o dirección"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : serviciosFiltrados.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" my={5}>
          No se encontraron servicios.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {serviciosFiltrados.slice(0, 6).map((servicio) => {
              const empresa = servicio.empresa
              const hasFoto = empresa.fotoUrl?.trim()
              const isSolicitado = yaSolicitado(servicio.id)
              const isEnviando = enviandoSolicitudId === servicio.id

              return (
                <Paper key={servicio.id} elevation={8} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={2}
                  >
                    <Avatar
                      src={hasFoto ? empresa.fotoUrl! : undefined}
                      sx={{
                        width: 90,
                        height: 90,
                        bgcolor: "#0d47a1",
                        fontSize: 32,
                        fontWeight: 600,
                      }}
                    >
                      {!hasFoto && empresa.nombreEmpresa.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography variant="h6" fontWeight={700} color="#0d47a1">
                        {servicio.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {servicio.descripcion}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        Precio: {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        }).format(servicio.precio)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1} mb={2}>
                    <Typography>
                      <BusinessIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
                      <strong>Empresa:</strong> {empresa.nombreEmpresa}
                    </Typography>
                    <Typography>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
                      <strong>Dirección:</strong> {empresa.direccion}
                    </Typography>
                    <Typography>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
                      <strong>Email:</strong> {empresa.email}
                    </Typography>
                    <Typography>
                      <DescriptionIcon fontSize="small" sx={{ mr: 1, color: "#0d47a1" }} />
                      <strong>Descripción:</strong> {empresa.descripcion}
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={() => solicitarServicio(servicio.id)}
                    disabled={isSolicitado || isEnviando}
                    sx={{
                      px: 5,
                      py: 1,
                      bgcolor: "#0d47a1",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      borderRadius: 2,
                      textTransform: "none",
                      alignSelf: "flex-start",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
                  >
                    {isSolicitado
                      ? "Ya solicitaste este servicio"
                      : isEnviando
                      ? "Enviando..."
                      : "Solicitar servicio"}
                  </Button>
                </Paper>
              )
            })}
          </Box>
        </>
      )}

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
  )
}

export default ServiciosCliente
