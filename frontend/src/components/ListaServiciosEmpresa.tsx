import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material"
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { useNavigate } from "react-router-dom"
import ConfirmModalEliminar from "../components/ConfirmModalEliminar"
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  precio: number
}

const ListaServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  const [modalOpen, setModalOpen] = useState(false)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)

  const empresaId = localStorage.getItem("empresaId")
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const fetchServicios = async () => {
    try {
      const res = await axios.get<Servicio[]>(
        `http://localhost:8080/api/servicios/empresa/${empresaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setServicios(res.data)
    } catch {
      setSnackbarMessage("Error al cargar los servicios")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const eliminarServicio = async () => {
    if (!servicioSeleccionado) return
    try {
      await axios.delete(
        `http://localhost:8080/api/servicios/${servicioSeleccionado.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setServicios((prev) => prev.filter(s => s.id !== servicioSeleccionado.id))
      setSnackbarMessage("Servicio eliminado correctamente")
      setSnackbarSeverity("success")
    } catch {
      setSnackbarMessage("Error al eliminar el servicio")
      setSnackbarSeverity("error")
    } finally {
      setSnackbarOpen(true)
      setModalOpen(false)
    }
  }

  useEffect(() => {
    fetchServicios()
  }, [])

  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: { xs: 2, sm: 3 },
        boxShadow: 4,
        bgcolor: "#fafafa",
        mt: 4,
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={1}>
        Servicios Registrados
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Aquí puedes ver todos tus servicios registrados. Revisa la información, edítalos o elimina los que ya no estén activos.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : servicios.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          No tienes servicios registrados actualmente.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {servicios.map((servicio) => (
            <Paper
              key={servicio.id}
              sx={{ p: 2, borderRadius: 3, position: "relative" }}
              elevation={3}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {servicio.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {servicio.descripcion}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} mt={1}>
                    Precio:{" "}
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(servicio.precio)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/empresa/servicio/editar/${servicio.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setServicioSeleccionado(servicio)
                      setModalOpen(true)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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

      {modalOpen && servicioSeleccionado && (
        <ConfirmModalEliminar
          open={modalOpen}
          nombre={servicioSeleccionado.nombre}
          onCancel={() => setModalOpen(false)}
          onConfirm={eliminarServicio}
        />
      )}
    </Box>
  )
}

export default ListaServicios
