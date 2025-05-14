package com.fctapp.servicios.dto;

public class ActualizarEmpresaDTO {

    private String nombreEmpresa;
    private String descripcion;
    private String direccion;
    private String fotoUrl; 

    public ActualizarEmpresaDTO() {}

    public ActualizarEmpresaDTO(String nombreEmpresa, String descripcion, String direccion, String fotoUrl) {
        this.nombreEmpresa = nombreEmpresa;
        this.descripcion = descripcion;
        this.direccion = direccion;
        this.fotoUrl = fotoUrl;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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
