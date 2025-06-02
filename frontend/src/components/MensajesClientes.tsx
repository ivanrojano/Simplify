import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Usuario {
  id: number;
  rol: string;
  nombre?: string;
  nombreEmpresa?: string;
}

interface Mensaje {
  id: number;
  contenido: string;
  emisor: Usuario;
  receptor: Usuario;
  fecha: string;
}

interface Solicitud {
  id: number;
  estado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "FINALIZADA";
  fechaCreacion: string;
  servicio: {
    nombre: string;
    empresa: {
      nombreEmpresa: string;
    };
  };
}

const MensajesCliente = () => {
  const [chats, setChats] = useState<(Solicitud & { ultimoMensaje?: Mensaje })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  useEffect(() => {
    const fetchChats = async () => {
      if (!token || !clienteId) return;

      try {
        const res = await axios.get<Solicitud[]>(
          `http://localhost:8080/api/solicitudes/cliente/${clienteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filtrar solo las aceptadas
        const solicitudesAceptadas = res.data.filter(
          (s) => s.estado === "ACEPTADA"
        );

        const chatsConMensajes = await Promise.all(
          solicitudesAceptadas.map(async (solicitud) => {
            try {
              const mensajesRes = await axios.get<Mensaje[]>(
                `http://localhost:8080/api/mensajes/por-solicitud?solicitudId=${solicitud.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const mensajes = mensajesRes.data;
              const ultimoMensaje = mensajes.length > 0 ? mensajes[mensajes.length - 1] : undefined;
              return { ...solicitud, ultimoMensaje };
            } catch {
              return null;
            }
          })
        );

        const filtrados = chatsConMensajes.filter(Boolean) as (Solicitud & {
          ultimoMensaje?: Mensaje;
        })[];

        setChats(filtrados);
      } catch (error) {
        console.error("Error al obtener solicitudes del cliente", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, clienteId]);

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 5,
        p: { xs: 2, sm: 3 },
        boxShadow: 4,
        bgcolor: "#fafafa",
        minHeight: 200,
      }}
    >
      <Typography variant="h6" fontWeight={900} mb={0.5}>
        Mis Conversaciones
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Chats activos con nuestros técnicos para tus solicitudes aceptadas.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : chats.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" my={5}>
          Aún no tienes conversaciones activas.
        </Typography>
      ) : (
        chats.map((chat) => (
          <Paper
            key={chat.id}
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
              border: "1px solid #e0e0e0",
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={800} fontSize="1.1rem" color="#0d47a1">
                  Chat #{chat.id.toString().padStart(4, "0")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(chat.fechaCreacion).toLocaleDateString("es-ES")}
                </Typography>
              </Stack>

              <Typography fontWeight={600} fontSize="1rem" color="text.primary">
                Empresa:{" "}
                <Typography component="span" color="#0d47a1" fontWeight={700}>
                  {chat.servicio.empresa.nombreEmpresa}
                </Typography>
              </Typography>

              <Typography fontWeight={700} fontSize="0.95rem" color="text.secondary">
                SERV-{new Date(chat.fechaCreacion).getFullYear()}-{chat.id.toString().padStart(3, "0")}
              </Typography>

              {chat.ultimoMensaje ? (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontStyle: "italic",
                    color: "#444",
                    px: 1,
                    py: 1,
                    bgcolor: "#e3f2fd",
                    borderRadius: 2,
                  }}
                >
                  Último mensaje: {chat.ultimoMensaje.contenido.slice(0, 80)}...
                </Typography>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Inicia el chat ahora haciendo clic en “Iniciar conversación”.
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={() => navigate(`/cliente/solicitud/${chat.id}/mensajes`)}
                sx={{
                  backgroundColor: "#0d47a1",
                  color: "#fff",
                  fontWeight: 600,
                  py: 0.45,
                  fontSize: "1rem",
                  borderRadius: 3,
                  alignSelf: "flex-end",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                {chat.ultimoMensaje ? "Ver conversación" : "Iniciar conversación"}
              </Button>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default MensajesCliente;
