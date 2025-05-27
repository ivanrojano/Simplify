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
  cliente: {
    nombre: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    fotoUrl?: string;
  };
  servicio: {
    nombre: string;
  };
}

const MensajesEmpresa = () => {
  const [chats, setChats] = useState<(Solicitud & { ultimoMensaje?: Mensaje })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
    const fetchChats = async () => {
      if (!token || !empresaId) return;

      try {
        const res = await axios.get<Solicitud[]>(
          `${import.meta.env.VITE_API_URL}/api/solicitudes/empresa/${empresaId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const solicitudesAceptadas = res.data.filter(
          (s) => s.estado === "ACEPTADA"
        );

        const chatsConMensajes = await Promise.all(
          solicitudesAceptadas.map(async (solicitud) => {
            try {
              const mensajesRes = await axios.get<Mensaje[]>(
                `${import.meta.env.VITE_API_URL}/api/mensajes/por-solicitud?solicitudId=${solicitud.id}`,
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
        console.error("Error al obtener solicitudes de la empresa", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, empresaId]);

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
        Conversaciones con Clientes
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Chats activos con los clientes sobre solicitudes aceptadas.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : chats.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" my={5}>
          Aún no tienes conversaciones activas con clientes.
        </Typography>
      ) : (
        chats.map((chat) => (
          <Paper
            key={chat.id}
            elevation={5}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={900} fontSize="1.1rem">
                  Chat #{chat.id.toString().padStart(4, "0")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(chat.fechaCreacion).toLocaleDateString("es-ES")}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography fontWeight={700} fontSize="1rem" color="text.primary">
                  Cliente:{" "}
                  <Typography component="span" fontWeight={700}>
                    {chat.cliente.nombre}
                  </Typography>
                </Typography>

                {chat.cliente.email && (
                  <Typography variant="body2" color="text.secondary" component="div">
                    <strong>Email:</strong> {chat.cliente.email}
                  </Typography>
                )}

                {chat.cliente.telefono && (
                  <Typography variant="body2" color="text.secondary" component="div">
                    <strong>Teléfono:</strong> {chat.cliente.telefono}
                  </Typography>
                )}

                {(chat.cliente.direccion || chat.cliente.ciudad) && (
                  <Typography variant="body2" color="text.secondary" component="div">
                    <strong>Dirección:</strong>{" "}
                    {[chat.cliente.direccion, chat.cliente.ciudad].filter(Boolean).join(", ")}
                  </Typography>
                )}

                <Typography fontWeight={700} fontSize="1rem" color="text.primary">
                  Servicio requerido:{" "}
                  <Typography component="span" fontWeight={700}>
                    {chat.servicio.nombre}
                  </Typography>
                </Typography>
              </Stack>

              {chat.ultimoMensaje ? (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontStyle: "italic",
                    color: "#444",
                    px: 2,
                    py: 2,
                    bgcolor: "#e3f2fd",
                    borderRadius: 3,
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
                onClick={() => navigate(`/empresa/solicitud/${chat.id}/mensajes`)}
                sx={{
                  mt: 5,
                  px: 5,
                  py: 1,
                  bgcolor: "#0d47a1",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  borderRadius: 2,
                  alignSelf: "flex-start",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1565c0" },
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

export default MensajesEmpresa;
