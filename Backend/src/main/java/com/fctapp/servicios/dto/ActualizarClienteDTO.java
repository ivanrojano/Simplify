package com.fctapp.servicios.dto;

public class ActualizarClienteDTO {
    private String nombre;
    private String direccion;
    private String fotoUrl;

    public ActualizarClienteDTO() {
    }

    public ActualizarClienteDTO(String nombre, String direccion, String fotoUrl) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.fotoUrl = fotoUrl;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

}
