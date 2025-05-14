package com.fctapp.servicios.dto;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fctapp.servicios.entity.Admin;
import com.fctapp.servicios.entity.Cliente;
import com.fctapp.servicios.entity.Empresa;
import com.fctapp.servicios.entity.Rol;
import com.fctapp.servicios.repository.UsuarioRepository;

import jakarta.annotation.PostConstruct;

@Component
public class DataInitializer {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if (usuarioRepo.findByEmail("admin@example.com").isEmpty()) {
        	Admin admin = new Admin();
        	admin.setEmail("admin@example.com");
        	admin.setPassword(passwordEncoder.encode("admin123"));
        	admin.setRol(Rol.ADMIN);
        	usuarioRepo.save(admin);
        }
        
        // CLIENTE por defecto
        if (usuarioRepo.findByEmail("cliente@example.com").isEmpty()) {
            Cliente cliente = new Cliente();
            cliente.setEmail("cliente@example.com");
            cliente.setPassword(passwordEncoder.encode("1234"));
            cliente.setNombre("Cliente Test");
            cliente.setDireccion("Calle Ejemplo 123");
            cliente.setRol(Rol.CLIENTE);
            usuarioRepo.save(cliente);
        }

        // EMPRESA por defecto
        if (usuarioRepo.findByEmail("empresa@example.com").isEmpty()) {
            Empresa empresa = new Empresa();
            empresa.setEmail("empresa@example.com");
            empresa.setPassword(passwordEncoder.encode("1234"));
            empresa.setNombreEmpresa("Empresa Test");
            empresa.setDescripcion("Servicios generales");
            empresa.setDireccion("Polígono Industrial 7");
            empresa.setRol(Rol.EMPRESA);
            usuarioRepo.save(empresa);
        }
    }
}
