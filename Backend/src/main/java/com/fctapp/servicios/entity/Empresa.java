package com.fctapp.servicios.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Empresa extends Usuario {

	private String nombreEmpresa;
	private String descripcion;
	private String direccion;

	@OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<Servicio> servicios = new ArrayList<>();

	public Empresa() {
		super();
	}

	public Empresa(String nombreEmpresa, String descripcion, String direccion) {
		super();
		this.nombreEmpresa = nombreEmpresa;
		this.descripcion = descripcion;
		this.direccion = direccion;
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

	public List<Servicio> getServicios() {
		return servicios;
	}

	public void setServicios(List<Servicio> servicios) {
		this.servicios = servicios;
	}
}
