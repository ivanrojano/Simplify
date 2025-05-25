import {
    Box,
    Typography,
    Stack,
    Paper,
    Chip,
    Button,
} from "@mui/material"

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

const ResumenCliente = ({ nombre, solicitudes, onVerSolicitudes }: Props) => {
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
                            boxShadow: 2,
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

            {/* Servicios personalizados */}
            <Box mt={6}>
                <Typography variant="h6" fontWeight={900} mb={1}>
                    Servicios Personalizados
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Accede rápidamente a las opciones más recomendadas para ti.
                </Typography>
            </Box>

            {/* Últimas solicitudes */}
            <Box mt={6}>
                <Typography variant="h6" fontWeight={900} mb={1}>
                    Últimas Solicitudes
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Aquí puedes ver las dos solicitudes más recientes.
                </Typography>

                <Stack spacing={2}>
                    {recientes.map((s) => (
                        <Paper key={s.id} elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                            >
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
                    ))}

                    <Box mt={3} width="100%">
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onVerSolicitudes}
                            sx={{
                                backgroundColor: "#0d47a1",
                                color: "#fff",
                                fontWeight: 600,
                                py: 1.2,
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: "#1565c0",
                                },
                            }}
                        >
                            Ver todas las solicitudes
                        </Button>
                    </Box>

                </Stack>
            </Box>
        </Box>
    )
}

export default ResumenCliente
