package com.fctapp.servicios.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fctapp.servicios.entity.Cliente;
import com.fctapp.servicios.entity.EstadoSolicitud;
import com.fctapp.servicios.entity.Servicio;
import com.fctapp.servicios.entity.SolicitudServicio;
import com.fctapp.servicios.repository.ClienteRepository;
import com.fctapp.servicios.repository.MensajeRepository;
import com.fctapp.servicios.repository.ServicioRepository;
import com.fctapp.servicios.repository.SolicitudServicioRepository;

import jakarta.transaction.Transactional;

@Service
public class SolicitudServicioService {

    private final SolicitudServicioRepository solicitudRepo;
    private final ClienteRepository clienteRepo;
    private final ServicioRepository servicioRepo;
    private final MensajeRepository mensajeRepo;

    public SolicitudServicioService(
        SolicitudServicioRepository solicitudRepo,
        ClienteRepository clienteRepo,
        ServicioRepository servicioRepo,
        MensajeRepository mensajeRepo
    ) {
        this.solicitudRepo = solicitudRepo;
        this.clienteRepo = clienteRepo;
        this.servicioRepo = servicioRepo;
        this.mensajeRepo = mensajeRepo;
    }

    public SolicitudServicio crearSolicitud(Long clienteId, Long servicioId) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Servicio servicio = servicioRepo.findById(servicioId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        SolicitudServicio solicitud = new SolicitudServicio();
        solicitud.setCliente(cliente);
        solicitud.setServicio(servicio);
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        solicitud.setFechaCreacion(LocalDateTime.now());

        return solicitudRepo.save(solicitud);
    }

    public SolicitudServicio actualizarEstado(Long solicitudId, EstadoSolicitud nuevoEstado) {
        SolicitudServicio solicitud = solicitudRepo.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado(nuevoEstado);

        if (nuevoEstado == EstadoSolicitud.RECHAZADA) {
            solicitudRepo.delete(solicitud);
            return null;
        }

        return solicitudRepo.save(solicitud);
    }

    public SolicitudServicio marcarComoFinalizada(Long id) {
        SolicitudServicio solicitud = solicitudRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (solicitud.getEstado() != EstadoSolicitud.ACEPTADA) {
            throw new RuntimeException("Solo se pueden finalizar solicitudes aceptadas.");
        }

        solicitud.setEstado(EstadoSolicitud.FINALIZADA);
        return solicitudRepo.save(solicitud);
    }

    public List<SolicitudServicio> obtenerSolicitudesPorCliente(Long clienteId) {
        return solicitudRepo.findByClienteId(clienteId);
    }

    public List<SolicitudServicio> obtenerSolicitudesPorEmpresa(Long empresaId) {
        return solicitudRepo.findByServicioEmpresaId(empresaId);
    }

    @Transactional
    public boolean eliminarSiFinalizada(Long id) {
        Optional<SolicitudServicio> optional = solicitudRepo.findById(id);
        if (optional.isPresent()) {
            SolicitudServicio solicitud = optional.get();
            if (solicitud.getEstado() == EstadoSolicitud.FINALIZADA) {
                mensajeRepo.deleteBySolicitudId(id); 
                solicitudRepo.deleteById(id);         
                return true;
            }
        }
        return false;
    }

    public SolicitudServicio obtenerPorId(Long id) {
        return solicitudRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }
}
