import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Fade,
  keyframes,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ConfirmModalLogout from "../components/ConfirmModalLogout";

import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


type Empresa = {
  nombreEmpresa: string;
  descripcion: string;
  direccion: string;
  fotoUrl?: string | null;
};

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

const EditarEmpresa = () => {
  const [form, setForm] = useState<Empresa>({
    nombreEmpresa: "",
    descripcion: "",
    direccion: "",
    fotoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
    if (!token || !empresaId) {
      navigate("/login");
      return;
    }

    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get<Empresa>(`http://localhost:8080/api/empresas/${empresaId}`, headers)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar empresa:", err);
        toast.error("Error al cargar el perfil.");
        navigate("/empresa");
      });
  }, [token, empresaId, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const { nombreEmpresa, descripcion, direccion } = form;

    if (!nombreEmpresa.trim()) {
      toast.error("El nombre es obligatorio");
      return false;
    }

    if (nombreEmpresa.length > 20) {
      toast.error("El nombre no puede tener más de 20 caracteres");
      return false;
    }

    if (!descripcion.trim() || descripcion.length < 10) {
      toast.error("La descripción debe tener al menos 10 caracteres");
      return false;
    }

    if (!direccion.trim() || direccion.length < 5) {
      toast.error("La dirección debe tener al menos 5 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const dataToSend = {
      ...form,
      fotoUrl: form.fotoUrl?.trim() === "" ? null : form.fotoUrl,
    };

    axios
      .put(`http://localhost:8080/api/empresas/${empresaId}`, dataToSend, headers)
      .then(() => {
        toast.success("Perfil actualizado correctamente");
        setTimeout(() => navigate("/empresa"), 2000);
      })
      .catch((err) => {
        console.error("Error al actualizar empresa:", err);
        toast.error("Error al guardar los cambios.");
      });
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );

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
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate("/empresa")}
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

      <Fade in timeout={800}>
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
          Editar Perfil de Empresa
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
            maxWidth: 500,
          }}
        >
          <TextField
            label="Nombre de la Empresa"
            name="nombreEmpresa"
            value={form.nombreEmpresa}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Nombre de la Empresa">
                    <BusinessIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            fullWidth
            required
            multiline
            minRows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Descripción de la empresa">
                    <DescriptionIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Dirección física">
                    <LocationOnIcon sx={{ color: "#0d47a1" }} />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Foto de Perfil (URL)"
            name="fotoUrl"
            value={form.fotoUrl || ""}
            onChange={handleChange}
            fullWidth
            placeholder="https://cdn.ejemplo.com/logo.png"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="URL de la imagen">
                    <ImageIcon sx={{ color: "#0d47a1" }} />
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
            Guardar cambios
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

export default EditarEmpresa;
