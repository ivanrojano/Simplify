import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import ConfirmModalLogout from "../components/ConfirmModalLogout";

type Servicio = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  empresa: {
    id: number;
    nombreEmpresa: string;
    descripcion: string;
    direccion: string;
    email: string;
  };
};

type Solicitud = {
  id: number;
  clienteId: number;
  servicio: {
    id: number;
    empresa: {
      id: number;
    };
  };
};


const ServiciosDisponibles = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empresasSolicitadas, setEmpresasSolicitadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  useEffect(() => {
    if (!token || !clienteId) {
      navigate("/login");
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get<Servicio[]>("http://localhost:8080/api/servicios", headers)
      .then((res) => {
        setServicios(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("No se pudieron cargar los servicios.");
        setLoading(false);
      });

    axios
      .get<Solicitud[]>(`http://localhost:8080/api/solicitudes/cliente/${clienteId}`, headers)
      .then((res) => {
        const empresasYaSolicitadas = res.data.map((s) => s.servicio.empresa.id);
        setEmpresasSolicitadas(empresasYaSolicitadas);
      })
      .catch(() => {
        toast.error("No se pudieron cargar las solicitudes previas.");
      });
  }, [token, clienteId, navigate]);

  const solicitarServicio = async (servicioId: number, empresaId: number) => {
    try {
      await axios.post(
        "http://localhost:8080/api/solicitudes/crear",
        { clienteId: Number(clienteId), servicioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Solicitud enviada correctamente");

      setEmpresasSolicitadas((prev) =>
        prev.includes(empresaId) ? prev : [...prev, empresaId]
      );
    } catch {
      toast.error("No se pudo enviar la solicitud.");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#ffffff",
        px: 2,
        py: 4,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        textAlign: "center"
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/cliente")}
          sx={{ position: "absolute", top: 16, left: 16, color: "#0d47a1" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={800}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#e74c3c",
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Cerrar Sesión
        </Button>
      </Fade>

      <Fade in timeout={1000}>
        <Typography variant="h4" fontWeight={700} color="#0d47a1" mb={4}>
          Servicios Disponibles
        </Typography>
      </Fade>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : servicios.length === 0 ? (
        <Typography>No hay servicios disponibles en este momento.</Typography>
      ) : (
        <Fade in timeout={1200}>
          <Stack spacing={3} maxWidth={800} mx="auto">
            {servicios.map((servicio) => {
              const yaSolicitado = empresasSolicitadas.includes(servicio.empresa.id);

              return (
                <Paper
                  key={servicio.id}
                  elevation={12}
                  sx={{ p: 3, borderRadius: 3, textAlign: "left" }}
                >
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {servicio.nombre}
                  </Typography>
                  <Typography gutterBottom>{servicio.descripcion}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BusinessIcon fontSize="small" />
                      <Typography variant="body2">
                        <strong>Empresa:</strong> {servicio.empresa.nombreEmpresa}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">
                        <strong>Dirección:</strong> {servicio.empresa.direccion}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <DescriptionIcon fontSize="small" />
                      <Typography variant="body2">
                        <strong>Descripción:</strong> {servicio.empresa.descripcion}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">
                        <strong>Email:</strong> {servicio.empresa.email}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={() => solicitarServicio(servicio.id, servicio.empresa.id)}
                    sx={{ borderRadius: 2, mt: 2 }}
                    disabled={yaSolicitado}
                  >
                    {yaSolicitado
                      ? "Ya solicitaste un servicio de esta empresa"
                      : "Solicitar Servicio"}
                  </Button>
                </Paper>
              );
            })}
          </Stack>
        </Fade>
      )}

      {/* Modal logout */}
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

export default ServiciosDisponibles;
