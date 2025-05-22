package com.fctapp.servicios.controller;

import com.fctapp.servicios.dto.ActualizarClienteDTO;
import com.fctapp.servicios.dto.CambiarContraseñaDTO;
import com.fctapp.servicios.entity.Cliente;
import com.fctapp.servicios.repository.ClienteRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteController(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable("id") Long id) {
        return clienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarClienteDTO dto) {

        return clienteRepository.findById(id)
                .map(cliente -> {
                    if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
                        cliente.setNombre(dto.getNombre().trim());
                    }
                    if (dto.getDireccion() != null && !dto.getDireccion().isBlank()) {
                        cliente.setDireccion(dto.getDireccion().trim());
                    }
                    if (dto.getFotoUrl() != null) {
                        String trimmed = dto.getFotoUrl().trim();
                        cliente.setFotoUrl(trimmed.isEmpty() ? null : trimmed);
                    }
                    cliente.setTelefono(
                            dto.getTelefono() != null && !dto.getTelefono().isBlank()
                                    ? dto.getTelefono().trim()
                                    : null);

                    cliente.setCodigoPostal(
                            dto.getCodigoPostal() != null && !dto.getCodigoPostal().isBlank()
                                    ? dto.getCodigoPostal().trim()
                                    : null);

                    cliente.setCiudad(
                            dto.getCiudad() != null && !dto.getCiudad().isBlank()
                                    ? dto.getCiudad().trim()
                                    : null);

                    clienteRepository.save(cliente);
                    return ResponseEntity.ok(cliente);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id,
            @RequestBody CambiarContraseñaDTO dto) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    if (!passwordEncoder.matches(dto.getPasswordActual(), cliente.getPassword())) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("mensaje", "La contraseña actual es incorrecta"));
                    }

                    cliente.setPassword(passwordEncoder.encode(dto.getNuevaPassword()));
                    clienteRepository.save(cliente);

                    return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
