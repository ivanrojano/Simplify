package com.fctapp.servicios.dto;

import com.fctapp.servicios.entity.SolicitudServicio;

public class SolicitudDTO {
    private Long id;
    private Long clienteId;
    private String estado;
    private String fechaCreacion;
    private ServicioDTO servicio;
    private String nombreEmpresa;
    private boolean valorada;

    public SolicitudDTO(SolicitudServicio solicitud) {
        this.id = solicitud.getId();
        this.clienteId = solicitud.getCliente().getId();
        this.estado = solicitud.getEstado().name();
        this.fechaCreacion = solicitud.getFechaCreacion().toString();
        this.servicio = new ServicioDTO(solicitud.getServicio());
        this.valorada = solicitud.isValorada();
        if (solicitud.getServicio() != null && solicitud.getServicio().getEmpresa() != null) {
            this.nombreEmpresa = solicitud.getServicio().getEmpresa().getNombreEmpresa();
        } else {
            this.nombreEmpresa = "Empresa desconocida";
        }
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public String getEstado() {
        return estado;
    }

    public String getFechaCreacion() {
        return fechaCreacion;
    }

    public ServicioDTO getServicio() {
        return servicio;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public boolean isValorada() {
        return valorada;
    }
}
