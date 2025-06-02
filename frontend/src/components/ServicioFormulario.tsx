import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface ServicioFormProps {
  servicio: Servicio;
  onSave: (servicioActualizado: Servicio) => void;
  onCancel: () => void;
}

const ServicioForm = ({ servicio, onSave, onCancel }: ServicioFormProps) => {
  const [nombre, setNombre] = useState(servicio.nombre);
  const [descripcion, setDescripcion] = useState(servicio.descripcion);
  const [precio, setPrecio] = useState(servicio.precio.toString());
  const [loading, setLoading] = useState(false);

  const [nombreError, setNombreError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [precioError, setPrecioError] = useState("");

  const token = localStorage.getItem("token");

  const validarCampos = (): boolean => {
    let isValid = true;
    setNombreError("");
    setDescripcionError("");
    setPrecioError("");

    if (!nombre.trim()) {
      setNombreError("Este campo es obligatorio.");
      isValid = false;
    } else if (nombre.length > 50) {
      setNombreError("Máximo 50 caracteres.");
      isValid = false;
    }

    if (!descripcion.trim()) {
      setDescripcionError("Este campo es obligatorio.");
      isValid = false;
    } else if (descripcion.length < 5) {
      setDescripcionError("Mínimo 5 caracteres.");
      isValid = false;
    } else if (descripcion.length > 500) {
      setDescripcionError("Máximo 500 caracteres.");
      isValid = false;
    }

    const precioNum = parseFloat(precio);
    if (!precio.trim()) {
      setPrecioError("Este campo es obligatorio.");
      isValid = false;
    } else if (isNaN(precioNum) || precioNum < 0) {
      setPrecioError("El precio debe ser un número positivo.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    setLoading(true);

    try {
      const res = await axios.put<Servicio>(
        `http://localhost:8080/api/servicios/${servicio.id}`,
        {
          nombre,
          descripcion,
          precio: parseFloat(precio),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSave(res.data);
    } catch (err) {
      console.error("Error al actualizar servicio", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          error={!!nombreError}
          helperText={nombreError}
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          multiline
          rows={3}
          error={!!descripcionError}
          helperText={descripcionError}
        />
        <TextField
          label="Precio Estimado (€)"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          fullWidth
          error={!!precioError}
          helperText={precioError}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              px: 5,
              py: 1,
              bgcolor: "#0d47a1",
              fontWeight: 500,
              fontSize: "0.95rem",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            Guardar
          </Button>

          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{
              px: 4,
              py: 1,
              fontWeight: 500,
              fontSize: "0.95rem",
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
        </Stack>

      </Stack>
    </Box>
  );
};

export default ServicioForm;
