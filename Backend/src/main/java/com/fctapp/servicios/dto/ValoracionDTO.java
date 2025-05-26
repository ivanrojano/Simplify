package com.fctapp.servicios.dto;

public class ValoracionDTO {
    private int estrellas;
    private String comentario;
    private String nombreCliente;
    private String nombreServicio;

    public ValoracionDTO(int estrellas, String comentario, String nombreCliente, String nombreServicio) {
        this.estrellas = estrellas;
        this.comentario = comentario;
        this.nombreCliente = nombreCliente;
        this.nombreServicio = nombreServicio;
    }

    // Getters y Setters
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

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }
}
