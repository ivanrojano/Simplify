package com.fctapp.servicios.dto;

import com.fctapp.servicios.entity.SolicitudServicio;

public class SolicitudDTO {
    private Long id;
    private Long clienteId;
    private ServicioDTO servicio;

    public SolicitudDTO(SolicitudServicio solicitud) {
        this.id = solicitud.getId();
        this.clienteId = solicitud.getCliente().getId();
        this.servicio = new ServicioDTO(solicitud.getServicio());
    }

    public Long getId() {
        return id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public ServicioDTO getServicio() {
        return servicio;
    }
}
