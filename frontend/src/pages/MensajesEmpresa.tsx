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
  Avatar,
  IconButton,
  Fade,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import ConfirmModalLogout from "../components/ConfirmModalLogout";
import MensajeBubble from "../components/MensajesCortosEmpresa";

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
  cliente: {
    id: number;
    nombre: string;
  };
}

const MensajesEmpresa = () => {
  const { solicitudId } = useParams<{ solicitudId: string }>();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [receptorId, setReceptorId] = useState<number | null>(null);
  const [clienteNombre, setClienteNombre] = useState<string>("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const empresaId = Number(localStorage.getItem("empresaId"));
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!token || !solicitudId || !empresaId) {
      navigate("/login");
      return;
    }

    axios
      .get<Solicitud>(`http://localhost:8080/api/solicitudes/${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReceptorId(res.data.cliente.id);
        setClienteNombre(res.data.cliente.nombre);
      })
      .catch(() => {
        toast.error("No se pudo obtener el cliente.");
      });

    axios
      .get<Mensaje[]>(`http://localhost:8080/api/mensajes/por-solicitud?solicitudId=${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMensajes(res.data))
      .catch(() => {
        toast.error("No se pudieron cargar los mensajes.");
      });
  }, [token, solicitudId, empresaId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) {
      toast.warning("Escribe un mensaje antes de enviar.");
      return;
    }

    if (!receptorId) {
      toast.error("No se ha identificado al cliente.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/mensajes/enviar",
        {
          emisorId: empresaId,
          receptorId,
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
    } catch {
      toast.error("Error al enviar mensaje.");
    }
  };

  const obtenerNombreEmisor = (emisor: Usuario) =>
    emisor.rol === "EMPRESA" ? emisor.nombreEmpresa : emisor.nombre;

  const obtenerInicial = (nombre?: string) => {
    return nombre?.charAt(0).toUpperCase() || "?";
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "2rem auto", px: 2, pb: 5, position: "relative" }}>
      {/* Botón volver */}
      <Fade in timeout={600}>
        <IconButton
          onClick={() => navigate("/empresa")}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            color: "#0d47a1",
            zIndex: 1300,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      {/* Botón cerrar sesión */}
      <Fade in timeout={600}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            color: "#e74c3c",
            fontWeight: 600,
            textTransform: "none",
            zIndex: 1300,
          }}
        >
          Cerrar sesión
        </Button>
      </Fade>

      {/* Título */}
      <Typography variant="h4" fontWeight={800} color="#0d47a1" textAlign="center" mb={1}>
        Chat con {clienteNombre || "el Cliente"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Lista de mensajes */}
      <Paper
        elevation={4}
        sx={{
          backgroundColor: "#f9f9f9",
          height: 450,
          overflowY: "auto",
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >
        {mensajes.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No hay mensajes todavía.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {mensajes.map((msg) => {
              const esEmpresa = msg.emisor.id === empresaId;
              const nombre = obtenerNombreEmisor(msg.emisor);
              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: esEmpresa ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: esEmpresa ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: "#0d47a1", fontSize: 14 }}>
                        {nombre ? obtenerInicial(nombre) : <PersonIcon fontSize="small" />}
                      </Avatar>
                      <Typography variant="caption" fontWeight={600}>
                        {nombre}
                      </Typography>
                    </Box>

                    <MensajeBubble
                      contenido={msg.contenido}
                      fecha={msg.fecha}
                      esEmpresa={esEmpresa}
                    />
                  </Box>
                </Box>
              );
            })}
            <div ref={chatEndRef} />
          </Stack>
        )}
      </Paper>

      {/* Input para enviar mensaje */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" onClick={enviarMensaje} sx={{ background: "#0d47a1" }}>
          Enviar
        </Button>
      </Stack>

      {/* Confirmación logout */}
      {logoutConfirm && (
        <ConfirmModalLogout
          onCancel={() => setLogoutConfirm(false)}
          onConfirm={() => {
            confirmLogout();
            setLogoutConfirm(false);
          }}
        />
      )}

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </Box>
  );
};

export default MensajesEmpresa;
