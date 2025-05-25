package com.fctapp.servicios.controller;

import com.fctapp.servicios.entity.Empresa;
import com.fctapp.servicios.repository.EmpresaRepository;
import com.fctapp.servicios.dto.ActualizarEmpresaDTO;
import com.fctapp.servicios.dto.CambiarContraseñaDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaController(EmpresaRepository empresaRepository, PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
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
                    if (dto.getNombreEmpresa() != null) empresa.setNombreEmpresa(dto.getNombreEmpresa());
                    if (dto.getDescripcion() != null) empresa.setDescripcion(dto.getDescripcion());
                    if (dto.getDireccion() != null) empresa.setDireccion(dto.getDireccion());
                    if (dto.getFotoUrl() != null) empresa.setFotoUrl(dto.getFotoUrl().isBlank() ? null : dto.getFotoUrl());
                    if (dto.getNif() != null) empresa.setNif(dto.getNif());
                    if (dto.getHorarioAtencion() != null) empresa.setHorarioAtencion(dto.getHorarioAtencion());
                    if (dto.getNumeroEmpleados() != null) empresa.setNumeroEmpleados(dto.getNumeroEmpleados());
                    if (dto.getTipoEmpresa() != null) empresa.setTipoEmpresa(dto.getTipoEmpresa());
                    if (dto.getCodigoPostal() != null) empresa.setCodigoPostal(dto.getCodigoPostal());
                    if (dto.getCiudad() != null) empresa.setCiudad(dto.getCiudad());
                    if (dto.getProvincia() != null) empresa.setProvincia(dto.getProvincia());
                    if (dto.getPais() != null) empresa.setPais(dto.getPais());
                    if (dto.getSitioWeb() != null) empresa.setSitioWeb(dto.getSitioWeb());
                    if (dto.getTelefono() != null) empresa.setTelefono(dto.getTelefono());

                    return ResponseEntity.ok(empresaRepository.save(empresa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody CambiarContraseñaDTO dto) {
        return empresaRepository.findById(id)
                .map(empresa -> {
                    if (!passwordEncoder.matches(dto.getPasswordActual(), empresa.getPassword())) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("mensaje", "La contraseña actual es incorrecta"));
                    }

                    empresa.setPassword(passwordEncoder.encode(dto.getNuevaPassword()));
                    empresaRepository.save(empresa);

                    return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
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
