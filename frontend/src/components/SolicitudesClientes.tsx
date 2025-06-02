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
} from "@mui/material"
import axios from "axios"

import RefreshIcon from "@mui/icons-material/Refresh"

interface Solicitud {
  id: number
  estado: "PENDIENTE" | "ACEPTADA" | "FINALIZADA" | "RECHAZADA"
  fechaCreacion: string
  servicio: {
    nombre: string
    empresa: {
      nombreEmpresa: string
    }
  }
  valorada: boolean
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

const SolicitudesCliente = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState("")
  const [busquedaEmpresa, setBusquedaEmpresa] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [rotating, setRotating] = useState(false)

  const token = localStorage.getItem("token")
  const clienteId = localStorage.getItem("clienteId")

  const fetchSolicitudes = async () => {
    if (!token || !clienteId) return

    try {
      const res = await axios.get<Solicitud[]>(
        `http://localhost:8080/api/solicitudes/cliente/${clienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const sorted = res.data.sort(
        (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      )
      setSolicitudes(sorted)
      setFilteredSolicitudes(sorted.filter((s) => s.estado !== "FINALIZADA"))
    } catch (error) {
      console.error("Error al obtener solicitudes", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  useEffect(() => {
    let resultado = [...solicitudes]

    if (filtroEstado) {
      resultado = resultado.filter((s) => s.estado === filtroEstado)
    }
    if (busquedaEmpresa) {
      resultado = resultado.filter((s) =>
        s.servicio.empresa.nombreEmpresa.toLowerCase().includes(busquedaEmpresa.toLowerCase())
      )
    }
    if (filtroFecha) {
      resultado = resultado.filter((s) => s.fechaCreacion.startsWith(filtroFecha))
    }

    // Excluir FINALIZADA
    setFilteredSolicitudes(resultado.filter((s) => s.estado !== "FINALIZADA"))
  }, [filtroEstado, busquedaEmpresa, filtroFecha, solicitudes])

  const limpiarFiltros = () => {
    setFiltroEstado("")
    setBusquedaEmpresa("")
    setFiltroFecha("")
    setRotating(true)
    setTimeout(() => setRotating(false), 600)
  }

  return (
    <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 5, p: { xs: 2, sm: 3 }, boxShadow: 4, bgcolor: "#fafafa" }}>
      <Typography variant="h6" fontWeight={900} mb={0.5}>Mis Solicitudes</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Historial y estado de todas tus solicitudes de servicio</Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select value={filtroEstado} label="Estado" onChange={(e) => setFiltroEstado(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
            <MenuItem value="ACEPTADA">Aceptada</MenuItem>
            <MenuItem value="RECHAZADA">Rechazada</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth label="Buscar por empresa" value={busquedaEmpresa} onChange={(e) => setBusquedaEmpresa(e.target.value)} />
        <TextField fullWidth label="Filtrar por fecha" type="date" InputLabelProps={{ shrink: true }} value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />

        <Tooltip title="Limpiar filtros">
          <IconButton onClick={limpiarFiltros} sx={{ backgroundColor: "#0d47a1", color: "#fff", borderRadius: "10px", p: 1.2, ml: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 }, transition: "transform 0.6s ease", transform: rotating ? "rotate(360deg)" : "none", "&:hover": { backgroundColor: "#08306b" } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : filteredSolicitudes.length === 0 ? (
        <Typography color="text.secondary" mt={2}>No se encontraron solicitudes con los filtros aplicados.</Typography>
      ) : (
        filteredSolicitudes.map((solicitud) => (
          <Paper key={solicitud.id} elevation={8} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>SOL-{new Date(solicitud.fechaCreacion).getFullYear()}-{solicitud.id.toString().padStart(3, "0")}</Typography>
                <Typography variant="body2" color="text.secondary">{new Date(solicitud.fechaCreacion).toLocaleDateString("es-ES")}</Typography>
              </Stack>

              <Chip label={solicitud.estado.toUpperCase()} color={getChipColor(solicitud.estado)} size="small" sx={{ alignSelf: "flex-start", fontWeight: 600 }} />

              <Typography variant="body2" color="text.secondary">Empresa: {solicitud.servicio.empresa.nombreEmpresa}</Typography>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  )
}

export default SolicitudesCliente
