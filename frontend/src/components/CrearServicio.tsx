import { useState } from "react"
import axios from "axios"
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import MuiAlert from "@mui/material/Alert"

const CrearServicio = () => {
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [precio, setPrecio] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

    const token = localStorage.getItem("token")
    const empresaId = localStorage.getItem("empresaId")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nombre.trim() || !descripcion.trim() || !precio.trim()) {
            setSnackbarMessage("Por favor, completa todos los campos.")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
            return
        }

        try {
            await axios.post(
                `http://localhost:8080/api/servicios/empresa/${empresaId}`,
                {
                    nombre,
                    descripcion,
                    precio: parseFloat(precio),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setSnackbarMessage("Servicio creado correctamente.")
            setSnackbarSeverity("success")
            setSnackbarOpen(true)
            setNombre("")
            setDescripcion("")
            setPrecio("")
        } catch (error) {
            console.error("Error al crear el servicio:", error)
            setSnackbarMessage("Error al crear el servicio.")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
        }
    }

    return (
        <Box
            sx={{
                width: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: 5,
                p: { xs: 2, sm: 3 },
                boxShadow: 4,
                bgcolor: "#fafafa",
                mt: 4,
            }}
        >
            <Typography variant="h6" fontWeight={900} mb={1}>
                Crear Servicio
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Aquí puedes crear los servicios que tu empresa ofrece. Añade un nombre, descripción y precio para que los clientes puedan encontrarlos fácilmente.
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Nombre del Servicio"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                />
                <TextField
                    label="Precio (€)"
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        mt: 2,
                        py: 1.2,
                        bgcolor: "#0d47a1",
                        fontWeight: 600,
                        fontSize: "1rem",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#1565c0" },
                    }}
                >
                    Crear Servicio
                </Button>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
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
        </Box>
    )
}

export default CrearServicio
