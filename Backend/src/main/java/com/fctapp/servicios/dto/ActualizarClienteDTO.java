package com.fctapp.servicios.dto;

import jakarta.validation.constraints.NotBlank;

public class ActualizarClienteDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "La dirección no puede estar vacía")
    private String direccion;

    private String fotoUrl;

    private String telefono;

    private String codigoPostal;

    private String ciudad;

    public ActualizarClienteDTO() {
    }

    public ActualizarClienteDTO(String nombre, String direccion, String fotoUrl, String telefono, String codigoPostal, String ciudad) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.fotoUrl = fotoUrl;
        this.telefono = telefono;
        this.codigoPostal = codigoPostal;
        this.ciudad = ciudad;
    }

    // Getters y Setters

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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }
}
