import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import DeleteIcon from "@mui/icons-material/Delete"
import axios from "axios"
import ConfirmModalEliminarSolicitud from "../components/ConfirmModalEliminarSolicitud"

interface Solicitud {
  id: number
  estado: "PENDIENTE" | "ACEPTADA" | "FINALIZADA" | "RECHAZADA"
  fechaCreacion: string
  cliente: {
    nombre: string
    email: string
    direccion: string
    telefono: string
    codigoPostal: string
    ciudad: string
    fotoUrl: string
    fechaRegistro: string
  }
  servicio: {
    nombre: string
    descripcion: string
    precio: number
  }
}

const getChipColor = (estado: Solicitud["estado"]) => {
  switch (estado) {
    case "PENDIENTE":
      return "warning"
    case "ACEPTADA":
      return "info"
    case "FINALIZADA":
      return "success"
    case "RECHAZADA":
      return "error"
    default:
      return "default"
  }
}

const SolicitudesEmpresa = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState("")
  const [busquedaCliente, setBusquedaCliente] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [rotating, setRotating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<number | null>(null)

  const token = localStorage.getItem("token")
  const empresaId = localStorage.getItem("empresaId")

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (!token || !empresaId) return
      try {
        const res = await axios.get<Solicitud[]>(
          `${import.meta.env.VITE_API_URL}/api/solicitudes/empresa/${empresaId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const sorted = res.data.sort(
          (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        )
        setSolicitudes(sorted)
        setFilteredSolicitudes(sorted)
      } catch (error) {
        console.error("Error al obtener solicitudes", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSolicitudes()
  }, [token, empresaId])

  useEffect(() => {
    let resultado = [...solicitudes]

    if (filtroEstado) {
      resultado = resultado.filter((s) => s.estado === filtroEstado)
    }

    if (busquedaCliente) {
      resultado = resultado.filter((s) =>
        s.cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())
      )
    }

    if (filtroFecha) {
      resultado = resultado.filter((s) => s.fechaCreacion.startsWith(filtroFecha))
    }

    setFilteredSolicitudes(resultado)
  }, [filtroEstado, busquedaCliente, filtroFecha, solicitudes])

  const limpiarFiltros = () => {
    setFiltroEstado("")
    setBusquedaCliente("")
    setFiltroFecha("")
    setRotating(true)
    setTimeout(() => setRotating(false), 600)
  }

  const handleConfirmEliminar = async () => {
    if (!solicitudAEliminar || !token) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/solicitudes/${solicitudAEliminar}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudAEliminar))
      setModalOpen(false)
    } catch (err) {
      console.error("Error al eliminar la solicitud", err)
    }
  }

  const cambiarEstado = async (id: number, nuevoEstado: Solicitud["estado"]) => {
    if (!token) return
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/solicitudes/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
      )
    } catch (err) {
      console.error("Error al cambiar estado", err)
    }
  }

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: { xs: 2, sm: 3 },
        boxShadow: 4,
        bgcolor: "#fafafa",
        minHeight: 200,
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={0.5}>
        Solicitudes Recibidas
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Filtra y gestiona las solicitudes recibidas de los clientes
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filtroEstado}
            label="Estado"
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
            <MenuItem value="ACEPTADA">Aceptada</MenuItem>
            <MenuItem value="FINALIZADA">Finalizada</MenuItem>
            <MenuItem value="RECHAZADA">Rechazada</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Buscar por cliente"
          value={busquedaCliente}
          onChange={(e) => setBusquedaCliente(e.target.value)}
        />

        <TextField
          fullWidth
          label="Filtrar por fecha"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />

        <Tooltip title="Limpiar filtros">
          <IconButton
            onClick={limpiarFiltros}
            sx={{
              backgroundColor: "#0d47a1",
              color: "#fff",
              borderRadius: "10px",
              p: 1.2,
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
              transition: "transform 0.6s ease",
              transform: rotating ? "rotate(360deg)" : "none",
              "&:hover": { backgroundColor: "#08306b" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : solicitudes.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" my={5}>
          No hay solicitudes registradas aún.
        </Typography>
      ) : filteredSolicitudes.length === 0 ? (
        <Typography color="text.secondary" mt={2}>
          No se encontraron resultados con los filtros aplicados.
        </Typography>
      ) : (
        filteredSolicitudes.map((s) => (
          <Paper
            key={s.id}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 3,
              boxShadow: 5
            }}
          >

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>
                  SOL-{new Date(s.fechaCreacion).getFullYear()}-{s.id.toString().padStart(3, "0")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(s.fechaCreacion).toLocaleDateString("es-ES")}
                </Typography>
              </Stack>

              <Chip
                label={s.estado.toUpperCase()}
                color={getChipColor(s.estado)}
                size="small"
                sx={{ alignSelf: "flex-start", fontWeight: 600 }}
              />

              <Typography variant="subtitle2" fontWeight={700}>
                Servicio: {s.servicio.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.servicio.descripcion} - {s.servicio.precio.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>{s.cliente.nombre}</Typography>
                  {s.cliente.email && s.cliente.telefono && (
                    <Typography variant="body1" color="text.secondary">
                      {s.cliente.email} | {s.cliente.telefono}
                    </Typography>
                  )}
                  {(s.cliente.direccion || s.cliente.codigoPostal || s.cliente.ciudad) && (
                    <Typography variant="body1" color="text.secondary">
                      {[s.cliente.direccion, s.cliente.codigoPostal, s.cliente.ciudad].filter(Boolean).join(", ")}
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} mt={1} justifyContent="flex-end">
                {(s.estado === "PENDIENTE" || s.estado === "ACEPTADA") && (
                  <>
                    {s.estado === "PENDIENTE" && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: "none" }}
                        onClick={() => cambiarEstado(s.id, "ACEPTADA")}
                      >
                        Aceptar
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ textTransform: "none" }}
                      onClick={() => cambiarEstado(s.id, "RECHAZADA")}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
                {s.estado === "ACEPTADA" && (
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "none" }}
                    onClick={() => cambiarEstado(s.id, "FINALIZADA")}
                  >
                    Finalizar
                  </Button>
                )}
                {s.estado === "FINALIZADA" && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setSolicitudAEliminar(s.id)
                      setModalOpen(true)
                    }}
                  >
                    Eliminar
                  </Button>
                )}
              </Stack>

            </Stack>
          </Paper>
        ))
      )}

      <ConfirmModalEliminarSolicitud
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmEliminar}
      />
    </Box>
  )
}

export default SolicitudesEmpresa
