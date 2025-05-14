package com.fctapp.servicios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fctapp.servicios.dto.ActualizarEstadoDTO;
import com.fctapp.servicios.dto.CrearSolicitudDTO;
import com.fctapp.servicios.entity.EstadoSolicitud;
import com.fctapp.servicios.entity.SolicitudServicio;
import com.fctapp.servicios.service.SolicitudServicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudServicioController {

	private final SolicitudServicioService solicitudService;

	public SolicitudServicioController(SolicitudServicioService solicitudService) {
		this.solicitudService = solicitudService;
	}

	@PostMapping("/crear")
	public ResponseEntity<SolicitudServicio> crearSolicitud(@Valid @RequestBody CrearSolicitudDTO dto) {
		return ResponseEntity.ok(solicitudService.crearSolicitud(dto.getClienteId(), dto.getServicioId()));
	}

	@PutMapping("/{id}/estado")
	public ResponseEntity<SolicitudServicio> actualizarEstado(@PathVariable Long id,
			@RequestBody ActualizarEstadoDTO dto) {
		EstadoSolicitud nuevoEstado = EstadoSolicitud.valueOf(dto.getEstado().toUpperCase());
		return ResponseEntity.ok(solicitudService.actualizarEstado(id, nuevoEstado));
	}

	@PutMapping("/{id}/finalizar")
	@PreAuthorize("hasAuthority('EMPRESA')")
	public ResponseEntity<SolicitudServicio> finalizarSolicitud(@PathVariable Long id) {
		return ResponseEntity.ok(solicitudService.marcarComoFinalizada(id));
	}

	@GetMapping("/cliente/{id}")
public ResponseEntity<List<SolicitudServicio>> obtenerPorCliente(@PathVariable Long id) {
    List<SolicitudServicio> solicitudes = solicitudService.obtenerSolicitudesPorCliente(id);
    return ResponseEntity.ok(solicitudes);
}
@GetMapping("/empresa/{empresaId}")
public ResponseEntity<List<SolicitudServicio>> obtenerPorEmpresa(@PathVariable Long empresaId) {
    List<SolicitudServicio> solicitudes = solicitudService.obtenerSolicitudesPorEmpresa(empresaId);
    return ResponseEntity.ok(solicitudes);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> eliminarSolicitud(@PathVariable Long id) {
    boolean eliminada = solicitudService.eliminarSiFinalizada(id);
    return eliminada ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().build();
}

@GetMapping("/{id}")
public ResponseEntity<SolicitudServicio> obtenerSolicitudPorId(@PathVariable Long id) {
    SolicitudServicio solicitud = solicitudService.obtenerPorId(id);
    return ResponseEntity.ok(solicitud);
}

}


