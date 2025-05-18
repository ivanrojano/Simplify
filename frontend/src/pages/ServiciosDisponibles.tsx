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
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
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
    fotoUrl?: string | null;
  };
};

type Solicitud = {
  id: number;
  estado: string;
  clienteId: number;
  servicio: {
    id: number;
    empresa: {
      id: number;
    };
  };
};

type EmpresaSolicitada = {
  empresaId: number;
  estado: string;
};

const ServiciosDisponibles = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empresasSolicitadas, setEmpresasSolicitadas] = useState<EmpresaSolicitada[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const clienteId = localStorage.getItem("clienteId");

  useEffect(() => {
    if (!token || !clienteId) {
      navigate("/login");
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const localData = localStorage.getItem("empresasSolicitadas");
    const empresasFromLocal: EmpresaSolicitada[] = localData ? JSON.parse(localData) : [];
    setEmpresasSolicitadas(empresasFromLocal);

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
        const solicitudes = res.data.map((s) => ({
          empresaId: s.servicio.empresa.id,
          estado: s.estado,
        }));

        const combined = [
          ...solicitudes,
          ...empresasFromLocal.filter(
            (local) => !solicitudes.some((s) => s.empresaId === local.empresaId)
          ),
        ];

        setEmpresasSolicitadas(combined);
        localStorage.setItem("empresasSolicitadas", JSON.stringify(combined));
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

      const nuevaEmpresa: EmpresaSolicitada = { empresaId, estado: "PENDIENTE" };

      setEmpresasSolicitadas((prev) => {
        const updated = [...prev.filter((e) => e.empresaId !== empresaId), nuevaEmpresa];
        localStorage.setItem("empresasSolicitadas", JSON.stringify(updated));
        return updated;
      });
    } catch {
      toast.error("No se pudo enviar la solicitud.");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const term = searchTerm.toLowerCase();
  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(term) ||
    servicio.empresa.nombreEmpresa.toLowerCase().includes(term) ||
    servicio.empresa.direccion.toLowerCase().includes(term) ||
    servicio.descripcion.toLowerCase().includes(term)
  );

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#ffffff",
        px: { xs: 2, sm: 4 },
        py: 4,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* Botones arriba en las esquinas */}
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/cliente")}
          sx={{ position: "fixed", top: 8, left: 8, color: "#0d47a1", zIndex: 1300 }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={800}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "fixed",
            top: 8,
            right: 8,
            color: "#e74c3c",
            textTransform: "none",
            fontWeight: 600,
            zIndex: 1300,
          }}
        >
          Cerrar Sesión
        </Button>
      </Fade>

      <Fade in timeout={800}>
        <Typography variant="h4" fontWeight={800} color="#0d47a1" mb={4}>
          Servicios Disponibles
        </Typography>
      </Fade>

      <Fade in timeout={800}>
        <Box mb={4} width="100%" maxWidth="800px" mx="auto">
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar por servicio, empresa o dirección"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Fade>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : serviciosFiltrados.length === 0 ? (
        <Typography>No hay servicios que coincidan con la búsqueda.</Typography>
      ) : (
        <Fade in timeout={1200}>
          <Stack spacing={3} width="100%" maxWidth="1400px" mx="auto" px={2}>
            {serviciosFiltrados.map((servicio) => {
              const solicitudExistente = empresasSolicitadas.find(
                (s) => s.empresaId === servicio.empresa.id
              );
              const yaSolicitado =
                solicitudExistente && solicitudExistente.estado !== "FINALIZADA";

              const hasFoto = servicio.empresa.fotoUrl?.trim();

              return (
                <Paper key={servicio.id} elevation={12} sx={{ p: 3, borderRadius: 3, textAlign: "left" }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Tooltip title={servicio.empresa.nombreEmpresa}>
                      <Avatar
                        alt={servicio.nombre}
                        src={hasFoto ? servicio.empresa.fotoUrl! : undefined}
                        sx={{
                          bgcolor: "#0d47a1",
                          width: 90,
                          height: 90,
                          fontWeight: 600,
                          border: '3px solid',
                          borderColor: '#0d47a1',
                        }}
                      >
                        {!hasFoto && servicio.nombre.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="#0d47a1">
                        {servicio.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {servicio.descripcion}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        Precio:{" "}
                        {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        }).format(servicio.precio)}
                      </Typography>
                    </Box>
                  </Stack>

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
                      ? "Ya solicitaste este servicio"
                      : "Solicitar Servicio"}
                  </Button>
                </Paper>
              );
            })}
          </Stack>
        </Fade>
      )}

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
