import { useEffect, useState, type FC } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Paper,
  Rating
} from "@mui/material"
import axios from "axios"

import AccessTimeIcon from "@mui/icons-material/AccessTime"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

interface EmpresaProps {
  nombreEmpresa: string
  numeroEmpleados: number
  sitioWeb?: string
}

interface Servicio {
  id: number
  nombre: string
  descripcion: string
}

interface Solicitud {
  id: number
  fechaCreacion: string
  estado: string
  servicio: {
    nombre: string
  }
  cliente: {
    nombre: string
  }
}

interface Valoracion {
  estrellas: number
  comentario: string
  nombreCliente: string
  nombreServicio: string
  fecha: string
}



const ResumenEmpresa: FC = () => {
  const [empresa, setEmpresa] = useState<EmpresaProps | null>(null)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([])

  const getChipColor = (estado: string) => {
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

  const getCardBgColor = (estado: string) => {
    switch (estado) {
      case "FINALIZADA":
        return "#e8f5e9"
      case "ACEPTADA":
        return "#e3f2fd"
      case "PENDIENTE":
        return "#fffde7"
      case "RECHAZADA":
        return "#ffebee"
      default:
        return "#f5f5f5"
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const empresaId = localStorage.getItem("empresaId")

    if (!token || !empresaId) {
      setLoading(false)
      return
    }

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    axios
      .get<EmpresaProps>(`${import.meta.env.VITE_API_URL}/api/empresas/${empresaId}`, headers)
      .then((res) => {
        setEmpresa(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al cargar la empresa:", err)
        setLoading(false)
      })

    axios
      .get<Servicio[]>(`${import.meta.env.VITE_API_URL}/api/servicios/empresa/${empresaId}`, headers)
      .then((res) => {
        setServicios(res.data)
      })
      .catch((err) => {
        console.error("Error al cargar servicios:", err)
      })

    axios
      .get<Solicitud[]>(`${import.meta.env.VITE_API_URL}/api/solicitudes/empresa/${empresaId}`, headers)
      .then((res) => {
        setSolicitudes(res.data)
      })
      .catch((err) => {
        console.error("Error al cargar solicitudes:", err)
      })

    axios
      .get<Valoracion[]>(`${import.meta.env.VITE_API_URL}/api/valoraciones/empresa/${empresaId}`, headers)
      .then((res) => {
        const recientes = res.data
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 2)
        setValoraciones(recientes)
      })
      .catch((err) => {
        console.error("Error al cargar valoraciones:", err)
      })
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (!empresa) return null

  const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE")
  const aceptadas = solicitudes.filter((s) => s.estado === "ACEPTADA")
  const finalizadas = solicitudes.filter((s) => s.estado === "FINALIZADA")

  const cards = [
    {
      title: "Pendientes",
      count: pendientes.length,
      icon: <AccessTimeIcon sx={{ color: "#fbc02d", fontSize: 36 }} />,
      color: "#fffde7",
      descripcion: "Servicios en Proceso",
    },
    {
      title: "Aceptadas",
      count: aceptadas.length,
      icon: <MailOutlineIcon sx={{ color: "#1976d2", fontSize: 36 }} />,
      color: "#e3f2fd",
      descripcion: "Servicios Aceptados",
    },
    {
      title: "Finalizadas",
      count: finalizadas.length,
      icon: <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: 36 }} />,
      color: "#e8f5e9",
      descripcion: "Servicios Finalizados",
    },
  ]

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: { xs: 2, sm: 3 },
        boxShadow: 4,
        bgcolor: "#fafafa",
        mb: 4,
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={1}>
        ¡Hola, {empresa.nombreEmpresa}!
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Resumen de tu panel
      </Typography>

      {/* Tarjetas de estado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mt: 4,
        }}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
            sx={{
              flex: "1 1 30%",
              minWidth: "250px",
              backgroundColor: card.color,
              borderRadius: 3,
              p: 2,
              boxShadow: 5,
            }}
          >
            <Stack spacing={1} alignItems="center">
              {card.icon}
              <Typography fontWeight={600}>{card.title}</Typography>
              <Typography variant="h5" fontWeight={900}>
                {card.count}
              </Typography>
              <Typography>{card.descripcion}</Typography>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Servicios */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight={900} mb={1}>
          Tus Servicios
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Estos son los servicios que has registrado en tu empresa.
        </Typography>

        {servicios.length === 0 ? (
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              p: 3,
              bgcolor: "#ffffff",
              boxShadow: 2,
              textAlign: "center",
            }}
          >
            <Typography fontWeight={600} mb={1}>
              No tienes servicios registrados.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Añade servicios desde el panel de administración para que los clientes puedan verlos y solicitarlos.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {servicios.map((servicio) => (
              <Box
                key={servicio.id}
                sx={{
                  flex: "1 1 250px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  p: 2,
                  boxShadow: 5,
                }}
              >
                <Stack spacing={1}>
                  <CheckCircleIcon sx={{ color: "#1976d2", fontSize: 32 }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {servicio.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {servicio.descripcion}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Últimas Solicitudes */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight={900} mb={1}>
          Últimas Solicitudes
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Estas son las solicitudes más recientes que has recibido.
        </Typography>

        {solicitudes.length === 0 ? (
          <Typography color="text.secondary">No hay solicitudes recientes.</Typography>
        ) : (
          <Stack spacing={2}>
            {[...solicitudes]
              .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
              .slice(0, 3)
              .map((s) => (
                <Paper
                  key={s.id}
                  elevation={5}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: getCardBgColor(s.estado),
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

                    <Typography variant="subtitle1" fontWeight={700}>
                      {s.servicio.nombre}
                    </Typography>
                    <Typography fontWeight={600} color="text.secondary">
                      Cliente: {s.cliente.nombre}
                    </Typography>

                    <Chip
                      label={s.estado}
                      size="small"
                      color={getChipColor(s.estado)}
                      sx={{ width: "fit-content" }}
                    />
                  </Stack>
                </Paper>

              ))}
          </Stack>
        )}
      </Box>

      {/* Valoraciones Recientes */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight={900} mb={1}>
          Valoraciones Recientes
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Opiniones de clientes sobre tus servicios.
        </Typography>

        {valoraciones.length === 0 ? (
          <Typography color="text.secondary">No tienes valoraciones recientes.</Typography>
        ) : (
          <Stack spacing={2}>
            {[...valoraciones]
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .slice(0, 2)
              .map((v, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#fffde7",
                    boxShadow: 3,
                  }}
                >
                  <Stack spacing={1}>
                    <Rating value={v.estrellas} readOnly />
                    <Typography variant="body1" fontWeight={600} color="black">
                      {v.comentario}
                    </Typography>
                    <Typography variant="caption" color="black">
                      Servicio: <strong>{v.nombreServicio}</strong> — Cliente: <strong>{v.nombreCliente}</strong>
                    </Typography>
                  </Stack>
                </Paper>
              ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default ResumenEmpresa
