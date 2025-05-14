package com.fctapp.servicios.repository;

import com.fctapp.servicios.entity.Mensaje;
import com.fctapp.servicios.entity.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findBySolicitud(SolicitudServicio solicitud);
    void deleteBySolicitudId(Long solicitudId);
    
}
