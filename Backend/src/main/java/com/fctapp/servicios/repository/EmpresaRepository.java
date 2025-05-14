package com.fctapp.servicios.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fctapp.servicios.entity.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
