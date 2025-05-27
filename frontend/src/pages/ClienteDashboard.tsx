import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Tabs,
  Tab,
} from "@mui/material"

import LogoutIcon from "@mui/icons-material/Logout"

import ConfirmModalLogout from "../components/ConfirmModalLogout"
import PerfilCliente from "../components/PerfilCliente"
import ServiciosCliente from "../components/ServiciosClientes"
import SolicitudesCliente from "../components/SolicitudesClientes"
import ResumenCliente from "../components/ResumenCliente"
import MensajesCliente from "../components/MensajesClientes"
import ServiciosFinalizadoCliente from "../components/ServiciosFinalizadoCliente"

interface Cliente {
  id: number
  nombre: string
  direccion: string
  email: string
  fotoUrl?: string | null
  telefono?: string | null
  codigoPostal?: string | null
  ciudad?: string | null
  fechaRegistro?: string
}

interface Solicitud {
  id: number
  estado: string
  fechaCreacion: string
  servicio: {
    nombre: string
    empresa: {
      nombreEmpresa: string
    }
  }
}

const ClienteDashboard = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const navigate = useNavigate()

  const cargarSolicitudes = () => {
    const token = localStorage.getItem("token")
    const clienteId = localStorage.getItem("clienteId")
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    if (!token || !clienteId) return

    axios
      .get<Solicitud[]>(`${import.meta.env.VITE_API_URL}/api/solicitudes/cliente/${clienteId}`, headers)
      .then((res) => setSolicitudes(res.data))
      .catch(() => console.error("Error al cargar solicitudes"))
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const clienteId = localStorage.getItem("clienteId")

    if (!token || !clienteId) {
      navigate("/login")
      return
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } }

    axios
      .get<Cliente>(`${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}`, headers)
      .then((res) => {
        setCliente(res.data)
        window.scrollTo({ top: 0, behavior: "smooth" })
        cargarSolicitudes()
      })
      .catch(() => navigate("/login"))
  }, [navigate])

  const confirmLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  if (!cliente)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          px: 2,
          py: 4,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Botón cerrar sesión (desktop) */}
        <Button
          onClick={() => setLogoutConfirm(true)}
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

        {/* Header cliente + Tabs */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: cliente.fotoUrl ? "transparent" : "#0d47a1",
                border: "2px solid #0d47a1",
                fontWeight: 700,
                fontSize: 28,
                color: "#fff",
              }}
              src={cliente.fotoUrl || undefined}
            >
              {!cliente.fotoUrl ? cliente.nombre?.charAt(0).toUpperCase() : null}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={900} color="#0d47a1">
                Panel del Cliente
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ¡Bienvenido de nuevo, {cliente.nombre}!
              </Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Tabs
              value={tabValue}
              onChange={(_e, newVal) => {
                setTabValue(newVal)
                if (newVal === 0 || newVal === 3) cargarSolicitudes()
              }}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Resumen" />
              <Tab label="Mi Perfil" />
              <Tab label="Servicios" />
              <Tab label="Solicitudes" />
              <Tab label="Mensajes" />
              <Tab label="Servicios Finalizados" />
            </Tabs>
          </Box>
        </Box>

        {/* Contenido dinámico */}
        <Box>
          {tabValue === 0 && (
            <ResumenCliente
              nombre={cliente.nombre}
              solicitudes={solicitudes}
              onVerSolicitudes={() => setTabValue(3)}
            />
          )}
          {tabValue === 1 && (
            <PerfilCliente
              nombre={cliente.nombre}
              direccion={cliente.direccion}
              email={cliente.email}
              id={cliente.id}
              fotoUrl={cliente.fotoUrl}
              telefono={cliente.telefono}
              codigoPostal={cliente.codigoPostal}
              ciudad={cliente.ciudad}
              fechaRegistro={cliente.fechaRegistro}
            />
          )}

          {tabValue === 2 && <ServiciosCliente />}

          {tabValue === 3 && <SolicitudesCliente />}

          {tabValue === 4 && <MensajesCliente />}

          {tabValue === 5 && <ServiciosFinalizadoCliente />}
        </Box>

        {/* Botón cerrar sesión (mobile) */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => setLogoutConfirm(true)}
            startIcon={<LogoutIcon />}
          >
            Cerrar
          </Button>
        </Box>

        {/* Modal confirmación logout */}
        {logoutConfirm && (
          <ConfirmModalLogout
            onCancel={() => setLogoutConfirm(false)}
            onConfirm={() => {
              confirmLogout()
              setLogoutConfirm(false)
            }}
          />
        )}
      </Box>
    </Fade>
  )
}

export default ClienteDashboard
