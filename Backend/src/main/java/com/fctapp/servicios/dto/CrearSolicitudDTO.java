package com.fctapp.servicios.dto;

import jakarta.validation.constraints.NotNull;

public class CrearSolicitudDTO {
    
	@NotNull
    private Long clienteId;
    
    @NotNull
	private Long servicioId;

    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }
}
