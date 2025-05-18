import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Fade,
  keyframes,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import EuroIcon from "@mui/icons-material/Euro";
import ConfirmModalLogout from "../components/ConfirmModalLogout";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}


const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

const EditarServicio = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get<Servicio[]>(`http://localhost:8080/api/servicios`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const servicio = res.data.find((s) => s.id === Number(id));
        if (servicio) {
          setNombre(servicio.nombre);
          setDescripcion(servicio.descripcion);
          setPrecio(servicio.precio);
        } else {
          toast.error("Servicio no encontrado");
          navigate("/empresa");
        }
      })
      .catch(() => {
        toast.error("Error al cargar el servicio");
        navigate("/empresa");
      });

  }, [id, navigate, token]);

  const validarCampos = (): boolean => {
    if (!nombre.trim() || nombre.length < 5 || nombre.length > 40) {
      toast.error("El nombre debe tener entre 5 y 40 caracteres.");
      return false;
    }

    if (!descripcion.trim() || descripcion.length < 10 || descripcion.length > 200) {
      toast.error("La descripción debe tener entre 10 y 200 caracteres.");
      return false;
    }

    if (precio === "" || isNaN(Number(precio)) || Number(precio) <= 0) {
      toast.error("El precio debe ser un número positivo.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      await axios.put(
        `http://localhost:8080/api/servicios/${id}`,
        { nombre, descripcion, precio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Servicio actualizado correctamente");
      setTimeout(() => navigate("/empresa"), 2000);
    } catch (error) {
      toast.error("Error al actualizar el servicio");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        px: 2,
        py: 4,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Fade in timeout={1000}>
        <IconButton
          onClick={() => navigate("/empresa")}
          sx={{ position: "absolute", top: 16, left: 16, color: "#0d47a1" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={1000}>
        <Button
          onClick={() => setLogoutConfirm(true)}
          endIcon={<LogoutIcon />}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#e74c3c",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cerrar Sesión
        </Button>
      </Fade>

      <Fade in timeout={1000}>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          onClick={() => navigate("/")}
          sx={{
            width: 100,
            animation: `${pulse} 2.5s ease-in-out infinite`,
            mb: 2,
            cursor: "pointer",
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography variant="h4" fontWeight={700} color="#0d47a1" mb={3}>
          Editar Servicio
        </Typography>
      </Fade>

      <Fade in timeout={1200}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
            maxWidth: 450,
          }}
        >
          <TextField
            label="Nombre del Servicio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Nombre del servicio">
                    <DriveFileRenameOutlineIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            required
            multiline
            minRows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Descripción del servicio">
                    <DescriptionIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Precio (€)"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Precio">
                    <EuroIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            type="submit"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#0d47a1",
              "&:hover": { backgroundColor: "#08306b" },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Fade>

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

export default EditarServicio;
