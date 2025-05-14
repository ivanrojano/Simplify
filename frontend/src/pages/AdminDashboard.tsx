import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModalAceptar from "../components/ConfirmModalAceptar";
import ConfirmModalLogout from "../components/ConfirmModalLogout";
import ConfirmModalEliminar from "../components/ConfirmModalEliminar";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

interface Usuario {
  id: number;
  email: string;
  rol: string;
  nombre?: string;
  direccion?: string;
  nombreEmpresa?: string;
  descripcion?: string;
}

interface JwtPayload {
  sub: string;
  rol: string;
  exp: number;
}

const AdminDashboard = () => {
  const [mostrarLogoutModal, setMostrarLogoutModal] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioAAscender, setUsuarioAAscender] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [filtroRol, setFiltroRol] = useState<string>("TODOS");
  const navigate = useNavigate();

  let emailActual = "";
  let rolActual = "";

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      emailActual = decoded.sub;
      rolActual = decoded.rol;
    } catch { }
  }

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get<Usuario[]>("http://localhost:8080/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err: any) {
      setError("Error al obtener usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      toast.success("Usuario eliminado correctamente.");
    } catch {
      toast.warning("No se pudo eliminar el usuario.");
    }
  };

  const ascenderAAdmin = async (id: number) => {
    if (rolActual !== "ADMIN") {
      toast.warning("Solo un ADMIN puede ascender usuarios.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/admin/usuarios/${id}/rol?nuevoRol=ADMIN`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Usuario ascendido a ADMIN.");
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: "ADMIN" } : u))
      );
    } catch {
      toast.error("No se pudo ascender al usuario.");
    }
  };

  const confirmarAscenso = (usuario: Usuario) => {
    setUsuarioAAscender(usuario);
    setShowModal(true);
  };

  const confirmarEliminacion = (usuario: Usuario) => {
    setUsuarioAEliminar(usuario);
  };

  const handleLogout = () => {
    setMostrarLogoutModal(true);
  };

  const obtenerNombre = (usuario: Usuario) =>
    usuario.nombre || usuario.nombreEmpresa || usuario.email;

  const usuariosFiltrados =
    filtroRol === "TODOS"
      ? usuarios
      : usuarios.filter((u) => u.rol === filtroRol);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        px: { xs: 2, md: 4 },
        py: 4,
        position: "relative"
      }}
    >
      <IconButton
        onClick={handleLogout}
        sx={{ position: "absolute", top: 16, right: 16, color: "#e74c3c" }}
      >
        <LogoutIcon />
      </IconButton>

      <Typography
        variant="h3"
        fontWeight={800}
        color="#0d47a1"
        textAlign="center"
        mb={3}
      >
        Panel de Administración
      </Typography>

      <Typography variant="body1" textAlign="center" mb={3}>
        Logueado como <strong>{emailActual}</strong> | Rol: <strong>{rolActual}</strong>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          select
          label="Filtrar por rol"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="TODOS">Todos</MenuItem>
          <MenuItem value="CLIENTE">Cliente</MenuItem>
          <MenuItem value="EMPRESA">Empresa</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell><strong>Acción</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosFiltrados.map((u, index) => (
              <TableRow
                key={u.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
              >
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{obtenerNombre(u)}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={u.email === emailActual || (u.rol === "ADMIN" && rolActual === "ADMIN")}
                      onClick={() => confirmarEliminacion(u)}
                    >
                      Eliminar
                    </Button>
                    {rolActual === "ADMIN" && u.rol !== "ADMIN" && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#0d47a1", color: "white", '&:hover': { backgroundColor: "#27ae60" } }}
                        onClick={() => confirmarAscenso(u)}
                      >
                        Ascender a ADMIN
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showModal && usuarioAAscender && (
        <ConfirmModalAceptar
          title="Confirmar ascenso"
          message={`¿Estás seguro de que deseas ascender a ${obtenerNombre(usuarioAAscender)} a ADMIN?`}
          onCancel={() => {
            setShowModal(false);
            setUsuarioAAscender(null);
          }}
          onConfirm={() => {
            ascenderAAdmin(usuarioAAscender.id);
            setShowModal(false);
            setUsuarioAAscender(null);
          }}
        />
      )}

      {usuarioAEliminar && (
        <ConfirmModalEliminar
          open={!!usuarioAEliminar}
          nombre={obtenerNombre(usuarioAEliminar)}
          onCancel={() => setUsuarioAEliminar(null)}
          onConfirm={() => {
            if (usuarioAEliminar) eliminarUsuario(usuarioAEliminar.id);
            setUsuarioAEliminar(null);
          }}
        />
      )}

      {mostrarLogoutModal && (
        <ConfirmModalLogout
          onCancel={() => setMostrarLogoutModal(false)}
          onConfirm={() => {
            localStorage.clear();
            logout();
            navigate("/");
            setMostrarLogoutModal(false);
          }}
        />
      )}
    </Box>
  );
};

export default AdminDashboard;