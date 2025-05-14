package com.fctapp.servicios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fctapp.servicios.dto.CrearValoracionDTO;
import com.fctapp.servicios.entity.Valoracion;
import com.fctapp.servicios.service.ValoracionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionController {

    private final ValoracionService valoracionService;

    public ValoracionController(ValoracionService valoracionService) {
        this.valoracionService = valoracionService;
    }

    @PostMapping("/crear")
    public ResponseEntity<Valoracion> valorar(@Valid @RequestBody CrearValoracionDTO dto) {
        return ResponseEntity.ok(
            valoracionService.dejarValoracion(
                dto.getClienteId(),
                dto.getSolicitudId(),
                dto.getEstrellas(),
                dto.getComentario()
            )
        );
    }

    @GetMapping("/empresa/{empresaId}")
    public List<Valoracion> valoracionesEmpresa(@PathVariable("empresaId") Long empresaId) {
        return valoracionService.listarValoracionesEmpresa(empresaId);
    }
}
