package com.fctapp.servicios.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties
public class SolicitudServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JsonIgnoreProperties({"solicitudes"}) 
	private Cliente cliente;

	@ManyToOne
	@JsonIgnoreProperties({"solicitudes"}) 
	private Servicio servicio;

	@Enumerated(EnumType.STRING)
	private EstadoSolicitud estado;

	private LocalDateTime fechaCreacion;

	public SolicitudServicio() {}

	public SolicitudServicio(Long id, Cliente cliente, Servicio servicio, EstadoSolicitud estado, LocalDateTime fechaCreacion) {
		this.id = id;
		this.cliente = cliente;
		this.servicio = servicio;
		this.estado = estado;
		this.fechaCreacion = fechaCreacion;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Servicio getServicio() {
		return servicio;
	}

	public void setServicio(Servicio servicio) {
		this.servicio = servicio;
	}

	public EstadoSolicitud getEstado() {
		return estado;
	}

	public void setEstado(EstadoSolicitud estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}
}
