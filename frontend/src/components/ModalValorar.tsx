import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material"
import { useState } from "react"
import axios from "axios"

interface Props {
  open: boolean
  onClose: () => void
  solicitudId: number
  clienteId: number
  onValorada: () => void
}

const ModalValorar = ({ open, onClose, solicitudId, clienteId, onValorada }: Props) => {
  const [estrellas, setEstrellas] = useState(0)
  const [comentario, setComentario] = useState("")
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)

  const handleSubmit = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      console.error("Token no encontrado. El usuario no está autenticado.")
      setErrorSnackbarOpen(true)
      onClose()
      return
    }

    try {
      await axios.post(
        "http://localhost:8080/api/valoraciones/crear",
        {
          clienteId,
          solicitudId,
          estrellas,
          comentario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      onValorada()
      onClose()
    } catch (err) {
      console.error("Error al enviar valoración", err)
      setErrorSnackbarOpen(true)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Valorar Servicio</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>¿Cómo calificarías este servicio?</Typography>
          <Rating
            value={estrellas}
            onChange={(_, val) => setEstrellas(val || 0)}
            size="large"
          />
          <TextField
            label="Comentario"
            multiline
            fullWidth
            rows={3}
            sx={{ mt: 2 }}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={estrellas === 0 || comentario.trim() === ""}
            variant="contained"
          >
            Enviar Valoración
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          Error al enviar la valoración. Asegúrate de estar autenticado.
        </Alert>
      </Snackbar>
    </>
  )
}

export default ModalValorar
