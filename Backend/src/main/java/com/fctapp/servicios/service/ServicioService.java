package com.fctapp.servicios.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fctapp.servicios.dto.EditarServicioDTO;
import com.fctapp.servicios.entity.Empresa;
import com.fctapp.servicios.entity.Servicio;
import com.fctapp.servicios.repository.EmpresaRepository;
import com.fctapp.servicios.repository.ServicioRepository;
import com.fctapp.servicios.repository.SolicitudServicioRepository;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final EmpresaRepository empresaRepository;
    private final SolicitudServicioRepository solicitudServicioRepository;

    public ServicioService(
            ServicioRepository servicioRepository,
            EmpresaRepository empresaRepository,
            SolicitudServicioRepository solicitudServicioRepository) {
        this.servicioRepository = servicioRepository;
        this.empresaRepository = empresaRepository;
        this.solicitudServicioRepository = solicitudServicioRepository;
    }

    public Servicio crearServicio(Long empresaId, Servicio servicio) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        servicio.setEmpresa(empresa);
        return servicioRepository.save(servicio);
    }

    public List<Servicio> obtenerServiciosDeEmpresa(Long empresaId) {
        return servicioRepository.findByEmpresaId(empresaId);
    }

    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    @Transactional
    public boolean eliminarServicio(Long id) {
        if (servicioRepository.existsById(id)) {
            solicitudServicioRepository.deleteByServicioId(id);
            servicioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Servicio editarServicio(Long id, EditarServicioDTO dto) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecio(dto.getPrecio());

        return servicioRepository.save(servicio);
    }
}
