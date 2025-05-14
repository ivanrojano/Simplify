package com.fctapp.servicios.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CrearValoracionDTO {

	@NotNull
    private Long clienteId;
	
	@NotNull
    private Long solicitudId;
	
    @Min(1)
    @Max(5)
    private int estrellas;
    
    @NotBlank
    private String comentario;

    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getSolicitudId() {
        return solicitudId;
    }

    public void setSolicitudId(Long solicitudId) {
        this.solicitudId = solicitudId;
    }

    public int getEstrellas() {
        return estrellas;
    }

    public void setEstrellas(int estrellas) {
        this.estrellas = estrellas;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
