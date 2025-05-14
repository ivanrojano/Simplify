package com.fctapp.servicios.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Servicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;

	private String descripcion;

	@ManyToOne
	@JoinColumn(name = "empresa_id", nullable = false)
	@JsonBackReference
	private Empresa empresa;

	public Servicio() {
		super();
	}

	public Servicio(Long id, String nombre, String descripcion, Empresa empresa) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.empresa = empresa;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}
}
