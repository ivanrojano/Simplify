package com.fctapp.servicios.controller;

import com.fctapp.servicios.dto.MensajeDTO;
import com.fctapp.servicios.entity.Mensaje;
import com.fctapp.servicios.service.MensajeService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    private final MensajeService mensajeService;

    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

@PostMapping("/enviar")
public ResponseEntity<Mensaje> enviarMensaje(@Valid @RequestBody MensajeDTO dto) {
    Mensaje mensaje = mensajeService.enviarMensaje(dto);
    return ResponseEntity.ok(mensaje);
}


    @GetMapping("/por-solicitud")
    public ResponseEntity<List<Mensaje>> obtenerMensajes(@RequestParam Long solicitudId) {
        return ResponseEntity.ok(mensajeService.obtenerMensajesPorSolicitud(solicitudId));
    }

    
}

