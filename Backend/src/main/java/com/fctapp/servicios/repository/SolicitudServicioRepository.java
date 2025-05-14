package com.fctapp.servicios.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fctapp.servicios.entity.SolicitudServicio;

public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    List<SolicitudServicio> findByClienteId(Long clienteId);
    List<SolicitudServicio> findByServicioEmpresaId(Long empresaId);
    void deleteByServicioId(Long servicioId);
}
