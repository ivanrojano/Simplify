import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Divider,
  Button,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import ConfirmModalEliminarSolicitud from "../components/ConfirmModalEliminarSolicitud";

interface Solicitud {
  id: number;
  estado: string;
  fechaCreacion: string;
  cliente: {
    nombre: string;
    email: string;
    direccion: string;
  };
  servicio: {
    nombre: string;
    descripcion: string;
  };
}

const SolicitudesEmpresa = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (!token || !empresaId) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<Solicitud[]>(
          `http://localhost:8080/api/solicitudes/empresa/${empresaId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSolicitudes(res.data);
      } catch {
        setSnackbarMessage("No se pudieron cargar las solicitudes.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [token, empresaId, navigate]);

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/solicitudes/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbarMessage(`Solicitud ${nuevoEstado.toLowerCase()}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
      );
    } catch {
      setSnackbarMessage("No se pudo actualizar el estado.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const confirmarEliminacion = async () => {
    if (!solicitudAEliminar || !token) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/solicitudes/${solicitudAEliminar}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbarMessage("Solicitud eliminada");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudAEliminar));
    } catch {
      setSnackbarMessage("No se pudo eliminar la solicitud.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setModalOpen(false);
      setSolicitudAEliminar(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
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
        Solicitudes Recibidas
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Revisa las solicitudes que han llegado a tu empresa
      </Typography>

      {solicitudes.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" my={5}>
          Aún no tienes solicitudes registradas.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {solicitudes.map((s) => (
            <Paper key={s.id} elevation={8} sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography fontWeight={700}>
                  SOL-{new Date(s.fechaCreacion).getFullYear()}-{s.id
                    .toString()
                    .padStart(3, "0")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(s.fechaCreacion).toLocaleDateString("es-ES")}
                </Typography>
                <Divider />
                <Typography><strong>Servicio:</strong> {s.servicio.nombre}</Typography>
                <Typography color="text.secondary">
                  {s.servicio.descripcion}
                </Typography>
                <Divider />
                <Typography><strong>Cliente:</strong> {s.cliente.nombre}</Typography>
                <Typography color="text.secondary">
                  {s.cliente.email} | {s.cliente.direccion}
                </Typography>
                <Typography><strong>Estado:</strong> {s.estado}</Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  {s.estado === "PENDIENTE" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => cambiarEstado(s.id, "ACEPTADA")}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => cambiarEstado(s.id, "RECHAZADA")}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                  {s.estado === "ACEPTADA" && (
                    <Button
                      variant="contained"
                      onClick={() => cambiarEstado(s.id, "FINALIZADA")}
                    >
                      Finalizar
                    </Button>
                  )}
                  {s.estado === "FINALIZADA" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setSolicitudAEliminar(s.id);
                        setModalOpen(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <ConfirmModalEliminarSolicitud
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarEliminacion}
      />

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
  );
};

export default SolicitudesEmpresa;
