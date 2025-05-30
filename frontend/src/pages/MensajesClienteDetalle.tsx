import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  Divider,
  IconButton,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";

import ConfirmModalLogout from "../components/ConfirmModalLogout";
import MensajeCortosCliente from "../components/MensajeCortosCliente";

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
  const [empresaNombre, setEmpresaNombre] = useState("Empresa no disponible");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const token = localStorage.getItem("token");
  const clienteId = Number(localStorage.getItem("clienteId"));
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const showSnackbar = (message: string, severity: "error" | "success" | "info" | "warning") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (!token || !solicitudId || !clienteId) {
      navigate("/login");
      return;
    }

    axios
      .get<Solicitud>(`${import.meta.env.VITE_API_URL}/api/solicitudes/${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const empresa = res.data?.servicio?.empresa;
        if (empresa?.id) {
          setReceptorId(empresa.id);
          setEmpresaNombre(empresa.nombreEmpresa || "Empresa sin nombre");
        } else {
          showSnackbar("No se pudo identificar la empresa.", "error");
        }
      })
      .catch(() => {
        showSnackbar("Error al cargar los datos de la empresa.", "error");
      });

    axios
      .get<Mensaje[]>(`${import.meta.env.VITE_API_URL}/api/mensajes/por-solicitud?solicitudId=${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMensajes(res.data))
      .catch(() => {
        showSnackbar("No se pudieron cargar los mensajes.", "error");
      });
  }, [token, solicitudId, clienteId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) {
      showSnackbar("Escribe un mensaje antes de enviar.", "warning");
      return;
    }

    if (!receptorId) {
      showSnackbar("No se ha identificado a la empresa.", "error");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mensajes/enviar`,
        {
          emisorId: clienteId,
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

      const res = await axios.get<Mensaje[]>(
        `${import.meta.env.VITE_API_URL}/api/mensajes/por-solicitud?solicitudId=${solicitudId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensajes(res.data);
    } catch {
      showSnackbar("Error al enviar mensaje.", "error");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "2rem auto", px: 2, pb: 5, position: "relative" }}>
      <Fade in timeout={600}>
        <IconButton
          onClick={() => navigate("/cliente")}
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

      <Typography variant="h4" fontWeight={800} color="#0d47a1" textAlign="center" mb={1}>
        Chat con {empresaNombre}
      </Typography>

      <Divider sx={{ mb: 3 }} />

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
              const esEmisor = msg.emisor.id === clienteId;
              const nombreEmisor = msg.emisor.rol === "EMPRESA"
                ? msg.emisor.nombreEmpresa || "Empresa"
                : msg.emisor.nombre || "Usuario";

              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: esEmisor ? "flex-end" : "flex-start",
                  }}
                >
                  <MensajeCortosCliente
                    contenido={msg.contenido}
                    fecha={msg.fecha}
                    esEmpresa={msg.emisor.rol === "EMPRESA"}
                    esEmisor={esEmisor}
                    nombreEmisor={nombreEmisor}
                  />
                </Box>
              );
            })}
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
        <Button variant="contained" onClick={enviarMensaje} sx={{ background: "#0d47a1" }}>
          Enviar
        </Button>
      </Stack>

      {logoutConfirm && (
        <ConfirmModalLogout
          onCancel={() => setLogoutConfirm(false)}
          onConfirm={() => {
            confirmLogout();
            setLogoutConfirm(false);
          }}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as "success" | "error" | "info" | "warning"}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MensajesCliente;
