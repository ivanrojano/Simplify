import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import ModalValorar from "../components/ModalValorar";

interface Solicitud {
  id: number;
  estado: "PENDIENTE" | "ACEPTADA" | "FINALIZADA" | "RECHAZADA";
  fechaCreacion: string;
  servicio: {
    nombre: string;
    empresa: {
      nombreEmpresa: string;
    };
  };
  valorada: boolean;
}

const SolicitudesFinalizadas = () => {
  const [solicitudesFinalizadas, setSolicitudesFinalizadas] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalValorarOpen, setModalValorarOpen] = useState(false);
  const [solicitudAValorar, setSolicitudAValorar] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  const fetchSolicitudes = async () => {
    if (!token || !clienteId) return;

    try {
      const res = await axios.get<Solicitud[]>(
        `${import.meta.env.VITE_API_URL}/api/solicitudes/cliente/${clienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const finalizadas = res.data.filter((s) => s.estado === "FINALIZADA");
      setSolicitudesFinalizadas(finalizadas);
    } catch (error) {
      console.error("Error al obtener solicitudes finalizadas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return (
    <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 5, p: { xs: 2, sm: 3 }, boxShadow: 4, bgcolor: "#fafafa" }}>
      <Typography variant="h6" fontWeight={900} mb={0.5}>Servicios Finalizadoss</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Servicios que han sido finalizadaos</Typography>

      {loading ? (
        <CircularProgress />
      ) : solicitudesFinalizadas.length === 0 ? (
        <Typography color="text.secondary" mt={2}>No tienes servicios finalizadas aún.</Typography>
      ) : (
        solicitudesFinalizadas.map((solicitud) => (
          <Paper key={solicitud.id} elevation={8} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>SOL-{new Date(solicitud.fechaCreacion).getFullYear()}-{solicitud.id.toString().padStart(3, "0")}</Typography>
                <Typography variant="body2" color="text.secondary">{new Date(solicitud.fechaCreacion).toLocaleDateString("es-ES")}</Typography>
              </Stack>

              <Chip label={solicitud.estado} color="success" size="small" sx={{ alignSelf: "flex-start", fontWeight: 600 }} />
              <Typography variant="body2" color="text.secondary">Empresa: {solicitud.servicio.empresa.nombreEmpresa}</Typography>

              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1}>
                {!solicitud.valorada ? (
                  <Button variant="outlined" color="primary" onClick={() => {
                    setSolicitudAValorar(solicitud.id);
                    setModalValorarOpen(true);
                  }}>Valorar</Button>
                ) : (
                  <Button variant="contained" disabled>Valorada</Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        ))
      )}

      {modalValorarOpen && solicitudAValorar !== null && (
        <ModalValorar
          open={modalValorarOpen}
          onClose={() => setModalValorarOpen(false)}
          solicitudId={solicitudAValorar}
          clienteId={parseInt(clienteId!)}
          onValorada={() => {
            setSolicitudesFinalizadas((prev) =>
              prev.map((s) =>
                s.id === solicitudAValorar ? { ...s, valorada: true } : s
              )
            );
          }}
        />
      )}
    </Box>
  );
};

export default SolicitudesFinalizadas;
