package com.fctapp.servicios.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;

@Entity
@JsonIgnoreProperties
public class Cliente extends Usuario {

	private String nombre;
	
	private String direccion;
	
	private String fotoUrl;
	
	private String telefono;
	
	private String codigoPostal;
	
	private String ciudad;

	private LocalDateTime fechaRegistro;


	public Cliente() {
		super();
		this.fechaRegistro = LocalDateTime.now();
	}

	public Cliente(String nombre, String direccion, String fotoUrl, String telefono, String codigoPostal,
			String ciudad) {
		super();
		this.nombre = nombre;
		this.direccion = direccion;
		this.fotoUrl = fotoUrl;
		this.telefono = telefono;
		this.codigoPostal = codigoPostal;
		this.ciudad = ciudad;
		this.fechaRegistro = LocalDateTime.now();
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

	public LocalDateTime getFechaRegistro() {
		return fechaRegistro;
	}

	public void setFechaRegistro(LocalDateTime fechaRegistro) {
		this.fechaRegistro = fechaRegistro;
	}
}
