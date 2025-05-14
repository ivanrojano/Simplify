package com.fctapp.servicios.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class MensajeDTO {

    @NotNull
    private Long solicitudId;

    @NotNull
    private Long emisorId;

    @NotNull
    private Long receptorId;

    @NotBlank(message = "El contenido no puede estar vacío")
    private String contenido;

    // Getters y Setters

    public Long getSolicitudId() {
        return solicitudId;
    }

    public void setSolicitudId(Long solicitudId) {
        this.solicitudId = solicitudId;
    }

    public Long getEmisorId() {
        return emisorId;
    }

    public void setEmisorId(Long emisorId) {
        this.emisorId = emisorId;
    }

    public Long getReceptorId() {
        return receptorId;
    }

    public void setReceptorId(Long receptorId) {
        this.receptorId = receptorId;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
}
