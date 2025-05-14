package com.fctapp.servicios.controller;

import com.fctapp.servicios.dto.ActualizarClienteDTO;
import com.fctapp.servicios.entity.Cliente;
import com.fctapp.servicios.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
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
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id,
            @RequestBody ActualizarClienteDTO dto) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    if (dto.getNombre() != null) {
                        cliente.setNombre(dto.getNombre());
                    }
                    if (dto.getDireccion() != null) {
                        cliente.setDireccion(dto.getDireccion());
                    }
                    if (dto.getFotoUrl() != null) {
                        String trimmed = dto.getFotoUrl().trim();
                        cliente.setFotoUrl(trimmed.isEmpty() ? null : trimmed);
                    }

                    clienteRepository.save(cliente);
                    return ResponseEntity.ok(cliente);
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
