package com.fctapp.servicios.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenido;

    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "emisor_id")
    private Usuario emisor;

    @ManyToOne
    @JoinColumn(name = "receptor_id")
    private Usuario receptor;

    @ManyToOne
    @JoinColumn(name = "solicitud_id")
    private SolicitudServicio solicitud;

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Usuario getEmisor() {
        return emisor;
    }

    public void setEmisor(Usuario emisor) {
        this.emisor = emisor;
    }

    public Usuario getReceptor() {
        return receptor;
    }

    public void setReceptor(Usuario receptor) {
        this.receptor = receptor;
    }

    public SolicitudServicio getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(SolicitudServicio solicitud) {
        this.solicitud = solicitud;
    }
}
