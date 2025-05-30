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
                    if (dto.getNombreEmpresa() != null && !dto.getNombreEmpresa().isBlank()) {
                        empresa.setNombreEmpresa(dto.getNombreEmpresa().trim());
                    }
                    if (dto.getDescripcion() != null && !dto.getDescripcion().isBlank()) {
                        empresa.setDescripcion(dto.getDescripcion().trim());
                    }
                    if (dto.getDireccion() != null && !dto.getDireccion().isBlank()) {
                        empresa.setDireccion(dto.getDireccion().trim());
                    }
                    if (dto.getFotoUrl() != null) {
                        String trimmed = dto.getFotoUrl().trim();
                        empresa.setFotoUrl(trimmed.isEmpty() ? null : trimmed);
                    }
                    empresa.setTelefono(dto.getTelefono() != null && !dto.getTelefono().isBlank()
                            ? dto.getTelefono().trim()
                            : null);

                    empresa.setCodigoPostal(dto.getCodigoPostal() != null && !dto.getCodigoPostal().isBlank()
                            ? dto.getCodigoPostal().trim()
                            : null);

                    empresa.setCiudad(dto.getCiudad() != null && !dto.getCiudad().isBlank()
                            ? dto.getCiudad().trim()
                            : null);

                    empresa.setProvincia(dto.getProvincia() != null && !dto.getProvincia().isBlank()
                            ? dto.getProvincia().trim()
                            : null);

                    empresa.setPais(dto.getPais() != null && !dto.getPais().isBlank()
                            ? dto.getPais().trim()
                            : null);

                    empresa.setSitioWeb(dto.getSitioWeb() != null && !dto.getSitioWeb().isBlank()
                            ? dto.getSitioWeb().trim()
                            : null);

                    empresa.setNif(dto.getNif() != null && !dto.getNif().isBlank()
                            ? dto.getNif().trim()
                            : null);

                    empresa.setHorarioAtencion(dto.getHorarioAtencion() != null && !dto.getHorarioAtencion().isBlank()
                            ? dto.getHorarioAtencion().trim()
                            : null);

                    empresa.setTipoEmpresa(dto.getTipoEmpresa() != null && !dto.getTipoEmpresa().isBlank()
                            ? dto.getTipoEmpresa().trim()
                            : null);

                    empresa.setNumeroEmpleados(dto.getNumeroEmpleados()); // puede ser null sin problema

                    empresaRepository.save(empresa);
                    return ResponseEntity.ok(empresa);
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
