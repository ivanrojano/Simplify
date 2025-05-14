package com.fctapp.servicios.controller;

import com.fctapp.servicios.entity.Empresa;
import com.fctapp.servicios.repository.EmpresaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fctapp.servicios.dto.ActualizarEmpresaDTO;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;

    public EmpresaController(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @GetMapping
    public List<Empresa> listar() {
        return empresaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtener(@PathVariable("id") Long id) {
        return empresaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empresa> actualizar(@PathVariable("id") Long id, @RequestBody ActualizarEmpresaDTO dto) {
        return empresaRepository.findById(id)
                .map(empresa -> {
                    if (dto.getNombreEmpresa() != null) {
                        empresa.setNombreEmpresa(dto.getNombreEmpresa());
                    }
                    if (dto.getDescripcion() != null) {
                        empresa.setDescripcion(dto.getDescripcion());
                    }
                    if (dto.getDireccion() != null) {
                        empresa.setDireccion(dto.getDireccion());
                    }
                    if (dto.getFotoUrl() != null) {
                        if (dto.getFotoUrl().isBlank()) {
                            empresa.setFotoUrl(null);
                        } else {
                            empresa.setFotoUrl(dto.getFotoUrl());
                        }
                    }
                    return ResponseEntity.ok(empresaRepository.save(empresa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        if (empresaRepository.existsById(id)) {
            empresaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
