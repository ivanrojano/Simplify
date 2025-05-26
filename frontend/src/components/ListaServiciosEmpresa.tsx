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
  Tooltip,
  TextField,
  Avatar,
} from "@mui/material"

import MuiAlert from "@mui/material/Alert"

import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ConfirmModalEliminar from "./ConfirmModalEliminar"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import ServicioForm from "./ServicioFormulario"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useNavigate } from "react-router-dom"

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  precio: number
  empresa: {
    id: number
    nombreEmpresa: string
    fotoUrl?: string
  }
}

const ListaServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  const [modalOpen, setModalOpen] = useState(false)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [busqueda, setBusqueda] = useState("")
  const [rotating, setRotating] = useState(false)

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
      setServicios((prev) => prev.filter((s) => s.id !== servicioSeleccionado.id))
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

  const actualizarServicio = (servicioActualizado: Servicio) => {
    setServicios((prev) =>
      prev.map((s) => (s.id === servicioActualizado.id ? servicioActualizado : s))
    )
    setEditandoId(null)
    setSnackbarMessage("Servicio actualizado correctamente")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
  }

  const limpiarBusqueda = () => {
    setBusqueda("")
    setRotating(true)
    setTimeout(() => setRotating(false), 600)
  }

  useEffect(() => {
    fetchServicios()
  }, [])

  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        p: 2,
        boxShadow: 5,
        bgcolor: "#fafafa",
        mt: 2,
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={0.5}>
        Servicios Registrados
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Aquí puedes ver todos tus servicios registrados. Revisa la información, edítalos o elimina los que ya no estén activos.
      </Typography>

      {/* Barra de búsqueda */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        width="100%"
        alignItems="center"
      >
        <TextField
          fullWidth
          label="Buscar servicio por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <Tooltip title="Limpiar búsqueda">
          <IconButton
            onClick={limpiarBusqueda}
            sx={{
              backgroundColor: "#0d47a1",
              color: "#fff",
              borderRadius: "10px",
              p: 1.2,
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
              transition: "transform 0.6s ease",
              transform: rotating ? "rotate(360deg)" : "none",
              "&:hover": {
                backgroundColor: "#08306b",
              },
              fontSize: 22,
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress color="primary" />
        </Box>
      ) : serviciosFiltrados.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={3}>
          No se encontraron servicios con ese nombre.
        </Typography>
      ) : (
        <Stack spacing={2} width="100%">
          {serviciosFiltrados.map((servicio) => (
            <Paper key={servicio.id} sx={{ p: 2, borderRadius: 3, boxShadow: 5 }} elevation={2}>
              {editandoId === servicio.id ? (
                <ServicioForm
                  servicio={servicio}
                  onCancel={() => setEditandoId(null)}
                  onSave={actualizarServicio}
                />
              ) : (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Avatar empresa */}
                    <Tooltip title="Ver perfil de la empresa">
                      <Avatar
                        src={servicio.empresa.fotoUrl || undefined}
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: "#0d47a1",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/empresa/ver/${servicio.empresa.id}`)}
                      >
                        {!servicio.empresa.fotoUrl
                          ? servicio.empresa.nombreEmpresa.charAt(0).toUpperCase()
                          : null}
                      </Avatar>
                    </Tooltip>

                    <Box>
                      <Tooltip title="Ver perfil de la empresa">
                        <Typography
                          variant="subtitle1"
                          fontWeight={900}
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/empresa/ver/${servicio.empresa.id}`)}
                        >
                          {servicio.nombre}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {servicio.descripcion}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} mt={1}>
                        Precio Estimado:{" "}
                        {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        }).format(servicio.precio)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Editar servicio">
                      <IconButton color="primary" onClick={() => setEditandoId(servicio.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar servicio">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setServicioSeleccionado(servicio)
                          setModalOpen(true)
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              )}
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
