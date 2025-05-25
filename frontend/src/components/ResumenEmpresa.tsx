import { useEffect, useState, type FC } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material"
import axios from "axios"

import BusinessIcon from "@mui/icons-material/Business"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import LanguageIcon from "@mui/icons-material/Language"

interface EmpresaProps {
  nombreEmpresa: string
  numeroEmpleados: number
  sitioWeb?: string
  tipoEmpresa?: string
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

const ResumenEmpresa: FC = () => {
  const [empresa, setEmpresa] = useState<EmpresaProps | null>(null)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const empresaId = localStorage.getItem("empresaId")

    if (!token || !empresaId) {
      setLoading(false)
      return
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } }

    axios
      .get<EmpresaProps>(`http://localhost:8080/api/empresas/${empresaId}`, headers)
      .then((res) => {
        setEmpresa(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al cargar empresa:", err)
        setLoading(false)
      })

    axios
      .get<Servicio[]>(`http://localhost:8080/api/servicios/empresa/${empresaId}`, headers)
      .then((res) => {
        setServicios(res.data)
      })
      .catch((err) => {
        console.error("Error al cargar servicios:", err)
      })

    axios
      .get<Solicitud[]>(`http://localhost:8080/api/solicitudes/empresa/${empresaId}`, headers)
      .then((res) => {
        const recientes = res.data
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
          .slice(0, 3)
        setSolicitudes(recientes)
      })
      .catch((err) => {
        console.error("Error al cargar solicitudes:", err)
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

  const empresaCards = [
    {
      title: "Nombre de Empresa",
      value: empresa.nombreEmpresa || "Sin datos",
      icon: <BusinessIcon sx={{ color: "#0d47a1", fontSize: 36 }} />,
    },
    {
      title: "Empleados",
      value: empresa.numeroEmpleados?.toString() || "Sin datos",
      icon: <PeopleAltIcon sx={{ color: "#0d47a1", fontSize: 36 }} />,
    },
    {
      title: "Sitio Web",
      value: empresa.sitioWeb || "Sin datos",
      icon: <LanguageIcon sx={{ color: "#0d47a1", fontSize: 36 }} />,
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
        ¡Hola, {empresa.nombreEmpresa || "Empresa"}!
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Resumen de tu panel
      </Typography>

      {/* Tarjetas Empresa */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {empresaCards.map((card, i) => (
          <Box
            key={i}
            sx={{
              flex: "1 1 30%",
              minWidth: "250px",
              borderRadius: 3,
              p: 2,
              boxShadow: 5,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 10,
              },
            }}
          >
            <Stack spacing={1} alignItems="center">
              {card.icon}
              <Typography>{card.title}</Typography>
              <Typography variant="h6" fontWeight={900}>
                {card.value}
              </Typography>
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
              boxShadow: 5,
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
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {servicios.map((servicio) => (
              <Box
                key={servicio.id}
                sx={{
                  flex: "1 1 30%",
                  minWidth: "250px",
                  borderRadius: 3,
                  p: 2,
                  boxShadow: 5,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 10,
                  },
                }}
              >
                <Stack spacing={1} alignItems="center" textAlign="center">
                  <BusinessIcon sx={{ color: "#0d47a1", fontSize: 36 }} />
                  <Typography fontWeight={600}>{servicio.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {servicio.descripcion}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Solicitudes recientes */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight={900} mb={1}>
          Últimas Solicitudes
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Estas son las últimas solicitudes que has recibido.
        </Typography>

        <Stack spacing={2}>
          {solicitudes.length === 0 ? (
            <Typography color="text.secondary">No hay solicitudes recientes.</Typography>
          ) : (
            solicitudes.map((s) => (
              <Box
                key={s.id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  p: 2,
                  bgcolor: "#ffffff",
                  boxShadow: 2,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: 4,
                  },
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={700}>
                      #{s.id.toString().padStart(3, "0")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(s.fechaCreacion).toLocaleDateString("es-ES")}
                    </Typography>
                  </Stack>

                  <Typography>
                    <strong>Servicio:</strong> {s.servicio.nombre}
                  </Typography>
                  <Typography>
                    <strong>Cliente:</strong> {s.cliente.nombre}
                  </Typography>

                  <Chip
                    label={s.estado}
                    color={
                      s.estado === "ACEPTADA"
                        ? "success"
                        : s.estado === "PENDIENTE"
                          ? "warning"
                          : s.estado === "RECHAZADA"
                            ? "error"
                            : "default"
                    }
                    size="small"
                    sx={{ alignSelf: "flex-start" }}
                  />
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default ResumenEmpresa
