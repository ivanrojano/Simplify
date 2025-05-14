package com.fctapp.servicios.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fctapp.servicios.entity.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByEmpresaId(Long empresaId);
}
