package com.fctapp.servicios.entity;

import jakarta.persistence.*;

@Entity
public class Valoracion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private int estrellas;

	private String comentario;

	@ManyToOne
	private Cliente cliente;

	@ManyToOne
	private Empresa empresa;

	@ManyToOne
	@JoinColumn(name = "solicitud_id", nullable = false)
	private SolicitudServicio solicitud;

	public Valoracion() {
		super();
	}

	public Valoracion(Long id, int estrellas, String comentario, Cliente cliente, Empresa empresa,
			SolicitudServicio solicitud) {
		super();
		this.id = id;
		this.estrellas = estrellas;
		this.comentario = comentario;
		this.cliente = cliente;
		this.empresa = empresa;
		this.solicitud = solicitud;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}

	public SolicitudServicio getSolicitud() {
		return solicitud;
	}

	public void setSolicitud(SolicitudServicio solicitud) {
		this.solicitud = solicitud;
	}
}
