package com.fctapp.servicios.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fctapp.servicios.dto.CrearValoracionDTO;
import com.fctapp.servicios.dto.ValoracionDTO;
import com.fctapp.servicios.entity.Valoracion;
import com.fctapp.servicios.repository.ValoracionRepository;
import com.fctapp.servicios.service.ValoracionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionController {

    private final ValoracionService valoracionService;
    private final ValoracionRepository valoracionRepository;

    // Constructor con inyección de dependencias
    public ValoracionController(
            ValoracionService valoracionService,
            ValoracionRepository valoracionRepository) {
        this.valoracionService = valoracionService;
        this.valoracionRepository = valoracionRepository;
    }

    // Endpoint para crear una valoración
    @PostMapping("/crear")
    public ResponseEntity<Valoracion> valorar(@Valid @RequestBody CrearValoracionDTO dto) {
        return ResponseEntity.ok(
                valoracionService.dejarValoracion(
                        dto.getClienteId(),
                        dto.getSolicitudId(),
                        dto.getEstrellas(),
                        dto.getComentario()));
    }

    // Endpoint para obtener valoraciones de una empresa
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<ValoracionDTO>> obtenerValoracionesPorEmpresa(@PathVariable Long empresaId) {
        List<Valoracion> valoraciones = valoracionRepository.findBySolicitudServicioEmpresaId(empresaId);

        List<ValoracionDTO> dtoList = valoraciones.stream()
            .map(v -> new ValoracionDTO(
                v.getEstrellas(),
                v.getComentario(),
                v.getCliente() != null ? v.getCliente().getNombre() : "Cliente desconocido",
                v.getSolicitud() != null && v.getSolicitud().getServicio() != null
                    ? v.getSolicitud().getServicio().getNombre()
                    : "Servicio no disponible"
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }
}
