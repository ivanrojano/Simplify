package com.fctapp.servicios.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fctapp.servicios.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
