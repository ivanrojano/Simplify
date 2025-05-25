package com.fctapp.servicios.dto;

import jakarta.validation.constraints.NotBlank;

public class ActualizarEmpresaDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombreEmpresa;

    private String descripcion;

    private String direccion;

    private String fotoUrl;

    private String nif;

    private String horarioAtencion;

    private Integer numeroEmpleados;

    private String tipoEmpresa;

    private String codigoPostal;

    private String ciudad;

    private String provincia;

    private String pais;

    private String sitioWeb;

    private String telefono;

    public ActualizarEmpresaDTO() {
    }

    public ActualizarEmpresaDTO(String nombreEmpresa, String descripcion, String direccion, String fotoUrl,
            String nif, String horarioAtencion, Integer numeroEmpleados,
            String tipoEmpresa, String codigoPostal, String ciudad,
            String provincia, String pais, String sitioWeb, String telefono) {
        this.nombreEmpresa = nombreEmpresa;
        this.descripcion = descripcion;
        this.direccion = direccion;
        this.fotoUrl = fotoUrl;
        this.nif = nif;
        this.horarioAtencion = horarioAtencion;
        this.numeroEmpleados = numeroEmpleados;
        this.tipoEmpresa = tipoEmpresa;
        this.codigoPostal = codigoPostal;
        this.ciudad = ciudad;
        this.provincia = provincia;
        this.pais = pais;
        this.sitioWeb = sitioWeb;
        this.telefono = telefono;
    }

    // Getters y Setters

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

    public String getNif() {
        return nif;
    }

    public void setNif(String nif) {
        this.nif = nif;
    }

    public String getHorarioAtencion() {
        return horarioAtencion;
    }

    public void setHorarioAtencion(String horarioAtencion) {
        this.horarioAtencion = horarioAtencion;
    }

    public Integer getNumeroEmpleados() {
        return numeroEmpleados;
    }

    public void setNumeroEmpleados(Integer numeroEmpleados) {
        this.numeroEmpleados = numeroEmpleados;
    }

    public String getTipoEmpresa() {
        return tipoEmpresa;
    }

    public void setTipoEmpresa(String tipoEmpresa) {
        this.tipoEmpresa = tipoEmpresa;
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

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getSitioWeb() {
        return sitioWeb;
    }

    public void setSitioWeb(String sitioWeb) {
        this.sitioWeb = sitioWeb;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
