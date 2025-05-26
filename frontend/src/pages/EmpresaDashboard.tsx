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
import PerfilEmpresa from "../components/PerfilEmpresa"
import CrearServicio from "../components/CrearServicio"
import TusServiciosEmpresa from "../components/ListaServiciosEmpresa"
import ResumenEmpresa from "../components/ResumenEmpresa"
import SolicitudesEmpresa from "../components/SolicitudesEmpresa"
import MensajesEmpresa from "../components/MensajeEmpresa"


interface Empresa {
  id: number
  email: string
  nombreEmpresa: string
  descripcion: string
  direccion: string
  rol: string
  fotoUrl?: string
}

const EmpresaDashboard = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const empresaId = localStorage.getItem("empresaId")

  useEffect(() => {
    if (!token || !empresaId) {
      navigate("/login")
      return
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } }

    axios
      .get<Empresa>(`http://localhost:8080/api/empresas/${empresaId}`, headers)
      .then((res) => {
        setEmpresa(res.data)
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
      .catch(() => navigate("/login"))
  }, [navigate, token, empresaId])

  const confirmLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  if (!empresa)
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

        {/* Header empresa + Tabs */}
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
                width: 110,
                height: 110,
                bgcolor: empresa.fotoUrl ? "transparent" : "#0d47a1",
                border: "2px solid #0d47a1",
                fontWeight: 700,
                fontSize: 28,
                color: "#fff",
              }}
              src={empresa.fotoUrl || undefined}
            >
              {!empresa.fotoUrl ? empresa.nombreEmpresa?.charAt(0).toUpperCase() : null}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={900} color="#0d47a1">
                Panel de Empresa
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ¡Bienvenido, {empresa.nombreEmpresa}!
              </Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Tabs
              value={tabValue}
              onChange={(_e, newVal) => setTabValue(newVal)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Resumen" />
              <Tab label="Perfil" />
              <Tab label="Crear Servicio" />
              <Tab label="Solicitudes" />
              <Tab label="Tus Servicios" />
              <Tab label="Mensajes" />

            </Tabs>
          </Box>
        </Box>

        {/* Contenido dinámico */}
        <Box>
          {tabValue === 0 && (<ResumenEmpresa/>)}


          {tabValue === 1 && (
            <PerfilEmpresa
              id={empresa.id}
              nombreEmpresa={empresa.nombreEmpresa}
              descripcion={empresa.descripcion}
              direccion={empresa.direccion}
              email={empresa.email}
              fotoUrl={empresa.fotoUrl}
            />
          )}

          {tabValue === 2 && (<CrearServicio />)}

          {tabValue === 3 && (<SolicitudesEmpresa />)}

          {tabValue === 4 && (<TusServiciosEmpresa />)}

          {tabValue === 5 && (<MensajesEmpresa />)}

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

export default EmpresaDashboard
