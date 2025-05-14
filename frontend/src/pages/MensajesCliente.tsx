import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  Divider,
  Avatar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";

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
  servicio: {
    empresa: {
      id: number;
      nombreEmpresa: string;
    };
  };
}

const MensajesCliente = () => {
  const { solicitudId } = useParams<{ solicitudId: string }>();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [receptorId, setReceptorId] = useState<number | null>(null);
  const [empresaNombre, setEmpresaNombre] = useState<string>("");
  const token = localStorage.getItem("token");
  const clienteId = Number(localStorage.getItem("clienteId"));
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!token || !solicitudId || !clienteId) {
      navigate("/login");
      return;
    }

    axios
      .get<Solicitud>(`http://localhost:8080/api/solicitudes/${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReceptorId(res.data.servicio.empresa.id);
        setEmpresaNombre(res.data.servicio.empresa.nombreEmpresa);
      })
      .catch(() => {
        toast.error("No se pudo obtener la empresa.");
      });

    axios
      .get<Mensaje[]>(`http://localhost:8080/api/mensajes/por-solicitud?solicitudId=${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMensajes(res.data))
      .catch((err) => {
        console.error("Error al cargar mensajes:", err);
        toast.error("No se pudieron cargar los mensajes.");
      });
  }, [token, solicitudId, clienteId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) {
      toast.warning("Escribe un mensaje antes de enviar.");
      return;
    }

    if (!receptorId) {
      toast.error("No se ha identificado a la empresa.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/mensajes/enviar",
        {
          emisorId: clienteId,
          receptorId: receptorId,
          solicitudId: Number(solicitudId),
          contenido: nuevoMensaje,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNuevoMensaje("");
      toast.success("Mensaje enviado");

      const res = await axios.get<Mensaje[]>(
        `http://localhost:8080/api/mensajes/por-solicitud?solicitudId=${solicitudId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar mensaje.");
    }
  };

  const obtenerNombreEmisor = (emisor: Usuario) => {
    return emisor.rol === "EMPRESA" ? emisor.nombreEmpresa : emisor.nombre;
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "2rem auto", px: 2, pb: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate("/cliente/solicitudes")}
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        Volver a Solicitudes
      </Button>

      <Typography variant="h4" fontWeight={800} color="#0d47a1" textAlign="center" mb={1}>
        Chat con {empresaNombre || "la Empresa"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Paper elevation={4} sx={{ backgroundColor: "#f9f9f9", height: 450, overflowY: "auto", p: 2, mb: 3, borderRadius: 3 }}>
        {mensajes.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">No hay mensajes todavía.</Typography>
        ) : (
          <Stack spacing={1}>
            {mensajes.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.emisor.id === clienteId ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.emisor.id === clienteId ? "flex-end" : "flex-start",
                    maxWidth: "75%"
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: msg.emisor.id === clienteId ? '#1976d2' : '#6d4c41' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="caption" fontWeight={600}>
                      {obtenerNombreEmisor(msg.emisor)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: msg.emisor.id === clienteId ? "#e3f2fd" : "#fff3e0",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      mt: 0.5
                    }}
                  >
                    <Typography variant="body1">{msg.contenido}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(msg.fecha).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Stack>
        )}
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" onClick={enviarMensaje}>
          Enviar
        </Button>
      </Stack>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </Box>
  );
};

export default MensajesCliente;
