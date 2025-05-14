package com.fctapp.servicios.service;

import com.fctapp.servicios.dto.MensajeDTO;
import com.fctapp.servicios.entity.*;
import com.fctapp.servicios.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MensajeService {

    private final MensajeRepository mensajeRepo;
    private final UsuarioRepository usuarioRepo;
    private final SolicitudServicioRepository solicitudRepo;

    public MensajeService(MensajeRepository mensajeRepo, UsuarioRepository usuarioRepo, SolicitudServicioRepository solicitudRepo) {
        this.mensajeRepo = mensajeRepo;
        this.usuarioRepo = usuarioRepo;
        this.solicitudRepo = solicitudRepo;
    }

    public Mensaje enviarMensaje(MensajeDTO dto) {
    Usuario emisor = usuarioRepo.findById(dto.getEmisorId())
        .orElseThrow(() -> new RuntimeException("Emisor no encontrado"));

    Usuario receptor = usuarioRepo.findById(dto.getReceptorId())
        .orElseThrow(() -> new RuntimeException("Receptor no encontrado"));

    SolicitudServicio solicitud = solicitudRepo.findById(dto.getSolicitudId())
        .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

    Mensaje mensaje = new Mensaje();
    mensaje.setEmisor(emisor);
    mensaje.setReceptor(receptor);
    mensaje.setSolicitud(solicitud);
    mensaje.setContenido(dto.getContenido());
    mensaje.setFecha(LocalDateTime.now());

    return mensajeRepo.save(mensaje);
}


    public List<Mensaje> obtenerMensajesPorSolicitud(Long solicitudId) {
        SolicitudServicio solicitud = solicitudRepo.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        return mensajeRepo.findBySolicitud(solicitud);
    }
    
}
