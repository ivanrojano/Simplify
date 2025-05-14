package com.fctapp.servicios.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fctapp.servicios.entity.Valoracion;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {
    List<Valoracion> findByEmpresaId(Long empresaId);
        Optional<Valoracion> findBySolicitudId(Long solicitudId); 

}
