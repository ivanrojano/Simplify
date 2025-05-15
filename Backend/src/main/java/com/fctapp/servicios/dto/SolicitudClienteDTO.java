package com.fctapp.servicios.dto;

import com.fctapp.servicios.entity.SolicitudServicio;

public class SolicitudClienteDTO {

    private Long id;
    private String estado;
    private String fechaCreacion;
    private String nombreEmpresa;

    public SolicitudClienteDTO(SolicitudServicio solicitud) {
        this.id = solicitud.getId();
        this.estado = solicitud.getEstado().name();
        this.fechaCreacion = solicitud.getFechaCreacion().toString();

        if (solicitud.getServicio() != null && solicitud.getServicio().getEmpresa() != null) {
            this.nombreEmpresa = solicitud.getServicio().getEmpresa().getNombreEmpresa();
        } else {
            this.nombreEmpresa = "Empresa no disponible";
        }
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(String fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }
}
