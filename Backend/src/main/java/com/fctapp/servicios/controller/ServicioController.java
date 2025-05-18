package com.fctapp.servicios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fctapp.servicios.entity.Servicio;
import com.fctapp.servicios.service.ServicioService;
import com.fctapp.servicios.dto.EditarServicioDTO;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @PostMapping("/empresa/{empresaId}")
    public ResponseEntity<Servicio> crearServicio(@PathVariable Long empresaId, @RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioService.crearServicio(empresaId, servicio));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Servicio>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(servicioService.obtenerServiciosDeEmpresa(empresaId));
    }

    @GetMapping
    public ResponseEntity<List<Servicio>> listarTodos() {
        return ResponseEntity.ok(servicioService.obtenerTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = servicioService.eliminarServicio(id);
        return eliminado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> editarServicio(
            @PathVariable Long id,
            @RequestBody EditarServicioDTO dto) {
        Servicio servicioActualizado = servicioService.editarServicio(id, dto);
        return ResponseEntity.ok(servicioActualizado);
    }

}
