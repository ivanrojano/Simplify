import {
  Avatar,
  Box,
  Typography,
  Stack,
  Divider,
  Card,
  CardContent,
  Rating,
  Fade,
  IconButton,
  Button,
} from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LogoutIcon from "@mui/icons-material/Logout"
import ConfirmModalLogout from "../components/ConfirmModalLogout"

interface Empresa {
  id: number
  nombreEmpresa: string
  descripcion: string
  direccion: string
  email: string
  ciudad?: string
  provincia?: string
  pais?: string
  sitioWeb?: string
  nif?: string
  numeroEmpleados?: number
  tipoEmpresa?: string
  fotoUrl?: string
  codigoPostal?: string
  horarioAtencion?: string
}

interface ValoracionDTO {
  estrellas: number
  comentario: string
  nombreCliente: string
  nombreServicio: string
}

const VerPerfilEmpresa = () => {
  const { empresaId } = useParams()
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [valoraciones, setValoraciones] = useState<ValoracionDTO[]>([])
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const [empresaRes, valoracionesRes] = await Promise.all([
          axios.get<Empresa>(`${import.meta.env.VITE_API_URL}/api/empresas/${empresaId}`, headers),
          axios.get<ValoracionDTO[]>(`${import.meta.env.VITE_API_URL}/api/valoraciones/empresa/${empresaId}`, headers),
        ])

        setEmpresa(empresaRes.data)
        setValoraciones(valoracionesRes.data)
      } catch (err) {
        console.error("Error al cargar perfil de empresa", err)
      }
    }

    if (empresaId && token) fetchData()
  }, [empresaId, token])

  const promedioEstrellas =
    valoraciones.length > 0
      ? valoraciones.reduce((sum, v) => sum + v.estrellas, 0) / valoraciones.length
      : 0

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("empresaId")
    navigate("/login")
  }

  if (!empresa) return <Typography>Cargando perfil de empresa...</Typography>

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        p: { xs: 2, sm: 4 },
        bgcolor: "#ffffff", // fondo blanco general
        position: "relative",
      }}
    >
      {/* Botón volver */}
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", top: 12, left: 12, color: "#0d47a1" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      {/* Botón cerrar sesión - escritorio */}
      <Button
        onClick={() => setLogoutModalOpen(true)}
        endIcon={<LogoutIcon />}
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          color: "#e74c3c",
          fontWeight: 600,
          display: { xs: "none", sm: "flex" },
        }}
      >
        Cerrar Sesión
      </Button>

      {/* Botón cerrar sesión - móvil */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => setLogoutModalOpen(true)}
          startIcon={<LogoutIcon />}
        >
          Cerrar
        </Button>
      </Box>

      {/* Título e introducción */}
      <Typography variant="h6" fontWeight={900} mb={1} mt={3}>
        Perfil de Empresa
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Información general de la empresa y opiniones de clientes
      </Typography>

      {/* Header con avatar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" mb={3}>
        <Avatar
          src={empresa.fotoUrl || undefined}
          sx={{
            width: 100,
            height: 100,
            bgcolor: "#0d47a1",
            border: "2px solid #0d47a1",
            fontWeight: 700,
            fontSize: 36,
            color: "#fff",
          }}
        >
          {!empresa.fotoUrl ? empresa.nombreEmpresa.charAt(0).toUpperCase() : null}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} color="black">
            {empresa.nombreEmpresa}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Rating value={promedioEstrellas} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              {valoraciones.length > 0
                ? `(${valoraciones.length} valoración${valoraciones.length > 1 ? "es" : ""})`
                : "Sin valoraciones aún"}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" mt={1}>
            {empresa.descripcion || "Sin descripción"}
          </Typography>
        </Box>
      </Stack>

      {/* Información de contacto */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: "#f9f9f9", boxShadow: 5 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1" fontWeight={900} mb={2}>
            Información de contacto
          </Typography>
          <Stack spacing={1}>
            <Typography><strong>Email:</strong> {empresa.email}</Typography>
            <Typography><strong>Dirección:</strong> {empresa.direccion}</Typography>
            {empresa.codigoPostal && <Typography><strong>Código Postal:</strong> {empresa.codigoPostal}</Typography>}
            {empresa.ciudad && <Typography><strong>Ciudad:</strong> {empresa.ciudad}</Typography>}
            {empresa.provincia && <Typography><strong>Provincia:</strong> {empresa.provincia}</Typography>}
            {empresa.pais && <Typography><strong>País:</strong> {empresa.pais}</Typography>}
            {empresa.horarioAtencion && <Typography><strong>Horario de atención:</strong> {empresa.horarioAtencion}</Typography>}
            {empresa.sitioWeb && <Typography><strong>Sitio Web:</strong> {empresa.sitioWeb}</Typography>}
            {empresa.nif && <Typography><strong>NIF:</strong> {empresa.nif}</Typography>}
            {empresa.numeroEmpleados && <Typography><strong>Empleados:</strong> {empresa.numeroEmpleados}</Typography>}
            {empresa.tipoEmpresa && <Typography><strong>Tipo:</strong> {empresa.tipoEmpresa}</Typography>}
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Valoraciones */}
      <Typography variant="h6" fontWeight={900} mb={2}>
        Valoraciones de clientes
      </Typography>

      {valoraciones.length === 0 ? (
        <Typography color="text.secondary">Esta empresa aún no tiene valoraciones.</Typography>
      ) : (
        valoraciones.map((v, i) => (
          <Box
            key={i}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "#fffde7",
              borderRadius: 3,
              boxShadow: 5,
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
          </Box>
        ))
      )}

      {logoutModalOpen && (
        <ConfirmModalLogout
          onCancel={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </Box>
  )
}

export default VerPerfilEmpresa
