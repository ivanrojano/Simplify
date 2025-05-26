package com.fctapp.servicios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.fctapp.servicios.entity.Mensaje;
import com.fctapp.servicios.entity.Rol;
import com.fctapp.servicios.entity.SolicitudServicio;
import com.fctapp.servicios.entity.Usuario;
import com.fctapp.servicios.repository.ClienteRepository;
import com.fctapp.servicios.repository.EmpresaRepository;
import com.fctapp.servicios.repository.MensajeRepository;
import com.fctapp.servicios.repository.SolicitudServicioRepository;
import com.fctapp.servicios.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final UsuarioRepository usuarioRepo;
    private final ClienteRepository clienteRepo;
    private final EmpresaRepository empresaRepo;
    private final SolicitudServicioRepository solicitudRepo;
    private final MensajeRepository mensajeRepo;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UsuarioRepository usuarioRepo,
                           ClienteRepository clienteRepo,
                           EmpresaRepository empresaRepo,
                           SolicitudServicioRepository solicitudRepo,
                           MensajeRepository mensajeRepo,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.clienteRepo = clienteRepo;
        this.empresaRepo = empresaRepo;
        this.solicitudRepo = solicitudRepo;
        this.mensajeRepo = mensajeRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioRepo.findAll();
    }

    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<Usuario> cambiarRol(@PathVariable("id") Long id,
                                              @RequestParam("nuevoRol") Rol nuevoRol) {
        return usuarioRepo.findById(id)
                .map(user -> {
                    user.setRol(nuevoRol);
                    return ResponseEntity.ok(usuarioRepo.save(user));
                }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/usuarios/{id}/reset-password")
    public ResponseEntity<String> resetearPassword(@PathVariable Long id) {
        return usuarioRepo.findById(id).map(usuario -> {
            String nuevaPassword = "123456";
            usuario.setPassword(passwordEncoder.encode(nuevaPassword));
            usuarioRepo.save(usuario);
            return ResponseEntity.ok("Contraseña reseteada a '123456'");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable("id") Long id) {
        if (usuarioRepo.existsById(id)) {
            usuarioRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/solicitudes")
    public List<SolicitudServicio> listarSolicitudes() {
        return solicitudRepo.findAll();
    }

    @GetMapping("/mensajes")
    public List<Mensaje> listarMensajes() {
        return mensajeRepo.findAll();
    }
}
