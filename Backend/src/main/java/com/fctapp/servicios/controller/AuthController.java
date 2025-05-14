package com.fctapp.servicios.controller;

import org.springframework.security.core.AuthenticationException;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fctapp.servicios.dto.LoginDTO;
import com.fctapp.servicios.entity.Usuario;
import com.fctapp.servicios.repository.UsuarioRepository;
import com.fctapp.servicios.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager,
                          UsuarioRepository usuarioRepository,
                          JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );
    
            Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    
            String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().name());
    
            return ResponseEntity.ok(Map.of(
                "token", token,
                "id", usuario.getId(),
                "rol", usuario.getRol().name()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
    

}


