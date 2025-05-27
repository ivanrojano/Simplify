import {
    Box,
    Typography,
    Stack,
    Chip,
    Paper
} from "@mui/material"

import { useEffect, useState } from "react"
import axios from "axios"

import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import MailOutlineIcon from "@mui/icons-material/MailOutline"

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

interface Props {
    nombre: string
    solicitudes: Solicitud[]
    onVerSolicitudes: () => void
}

interface Cliente {
    nombre: string
    email: string
    ciudad?: string
    fechaRegistro?: string
}


const ResumenCliente = ({ nombre, solicitudes }: Props) => {
    const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE")
    const aceptadas = solicitudes.filter((s) => s.estado === "ACEPTADA")
    const finalizadas = solicitudes.filter((s) => s.estado === "FINALIZADA")
    const [cliente, setCliente] = useState<Cliente | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const clienteId = localStorage.getItem("clienteId")

        if (!token || !clienteId) return

        axios
            .get<Cliente>(`${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCliente(res.data))
            .catch((err) => console.error("Error al cargar cliente", err))
    }, [])

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

    const recientes = [...solicitudes]
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .slice(0, 2)

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

    const getEstadoBackground = (estado: string) => {
        switch (estado) {
            case "PENDIENTE":
                return "#fffde7"
            case "ACEPTADA":
                return "#e3f2fd"
            case "FINALIZADA":
                return "#e8f5e9"
            case "RECHAZADA":
                return "#fdecea"
            default:
                return "#f5f5f5"
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
                mb: 4,
            }}
        >
            <Typography variant="h6" fontWeight={900} mb={1}>
                ¡Hola, {nombre}!
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

            {/* Últimas solicitudes */}
            <Box mt={6}>
                <Typography variant="h6" fontWeight={900} mb={1}>
                    Últimas Solicitudes
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Aquí puedes ver tus dos solicitudes más recientes.
                </Typography>

                <Stack spacing={2}>
                    {recientes.length === 0 ? (
                        <Typography color="text.secondary">No tienes solicitudes aún.</Typography>
                    ) : (
                        recientes.map((s) => (
                            <Paper
                                key={s.id}
                                elevation={5}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: getEstadoBackground(s.estado),
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography fontWeight={700}>
                                        SOL-{new Date(s.fechaCreacion).getFullYear()}-{s.id.toString().padStart(3, "0")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(s.fechaCreacion).toLocaleDateString()}
                                    </Typography>
                                </Stack>

                                <Typography variant="subtitle1" fontWeight={700}>
                                    {s.servicio.nombre}
                                </Typography>
                                <Typography fontWeight={600} color="text.secondary">
                                    {s.servicio.empresa.nombreEmpresa}
                                </Typography>

                                <Chip
                                    label={s.estado}
                                    size="small"
                                    color={getChipColor(s.estado)}
                                    sx={{ mt: 1, width: "fit-content" }}
                                />
                            </Paper>
                        ))
                    )}
                </Stack>
            </Box>

            {/* Perfil del cliente */}
            {cliente && (
                <Box mt={6}>
                    <Typography variant="h6" fontWeight={900} mb={1}>
                        Información de tu perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Estos son los datos asociados a tu cuenta.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {/* Tarjeta Correo */}
                        <Box
                            sx={{
                                flex: "1 1 30%",
                                minWidth: "250px",
                                backgroundColor: "#ede7f6", 
                                borderRadius: 3,
                                p: 2,
                                boxShadow: 5,
                            }}
                        >
                            <Stack spacing={1} alignItems="center">
                                <MailOutlineIcon sx={{ color: "#5e35b1", fontSize: 36 }} />
                                <Typography fontWeight={600}>Correo</Typography>
                                <Typography variant="h6" fontWeight={900}>
                                    {cliente.email}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Tarjeta Ciudad */}
                        <Box
                            sx={{
                                flex: "1 1 30%",
                                minWidth: "250px",
                                backgroundColor: "#fce4ec", 
                                borderRadius: 3,
                                p: 2,
                                boxShadow: 5,
                            }}
                        >
                            <Stack spacing={1} alignItems="center">
                                <AccessTimeIcon sx={{ color: "#c2185b", fontSize: 36 }} />
                                <Typography fontWeight={600}>Ciudad</Typography>
                                <Typography variant="h6" fontWeight={900}>
                                    {cliente.ciudad || "No especificada"}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Tarjeta Fecha de Registro */}
                        <Box
                            sx={{
                                flex: "1 1 30%",
                                minWidth: "250px",
                                backgroundColor: "#e0f2f1", 
                                borderRadius: 3,
                                p: 2,
                                boxShadow: 5,
                            }}
                        >
                            <Stack spacing={1} alignItems="center">
                                <CheckCircleIcon sx={{ color: "#00796b", fontSize: 36 }} />
                                <Typography fontWeight={600}>Fecha de Registro</Typography>
                                <Typography variant="h6" fontWeight={900}>
                                    {cliente.fechaRegistro
                                        ? new Date(cliente.fechaRegistro).toLocaleDateString("es-ES")
                                        : "No disponible"}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default ResumenCliente
