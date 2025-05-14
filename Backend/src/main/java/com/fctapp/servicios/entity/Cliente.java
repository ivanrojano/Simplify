package com.fctapp.servicios.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;

@Entity
@JsonIgnoreProperties
public class Cliente extends Usuario {

	private String nombre;

	private String direccion;

	private String fotoUrl;

	public Cliente() {
		super();
	}

	public Cliente(String nombre, String direccion, String fotoUrl) {
		super();
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
