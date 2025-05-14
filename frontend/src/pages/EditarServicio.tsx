import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Servicio = {
  nombre: string;
  descripcion: string;
  precio: number;
};

const EditarServicio = () => {
  const { servicioId } = useParams();
  const [form, setForm] = useState<Servicio>({
    nombre: "",
    descripcion: "",
    precio: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !servicioId) {
      navigate("/login");
      return;
    }

    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get<Servicio>(`http://localhost:8080/api/servicios/${servicioId}`, headers)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el servicio:", err);
        toast.error("No se pudo cargar el servicio.");
        navigate("/empresa");
      });
  }, [token, servicioId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precio" ? parseFloat(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio.");
      return false;
    }

    if (!form.descripcion.trim() || form.descripcion.length < 10) {
      toast.error("La descripción debe tener al menos 10 caracteres.");
      return false;
    }

    if (isNaN(form.precio) || form.precio <= 0) {
      toast.error("Precio inválido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      await axios.put(
        `http://localhost:8080/api/servicios/${servicioId}`,
        form,
        headers
      );
      toast.success("Servicio actualizado correctamente");
      setTimeout(() => navigate("/empresa"), 1500);
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      toast.error("No se pudo actualizar el servicio.");
    }
  };

  if (loading) return <p>Cargando servicio...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>
        Editar Servicio
      </h2>

      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
          />
        </label>
        <br />

        <button type="submit">Guardar cambios</button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
};

export default EditarServicio;
