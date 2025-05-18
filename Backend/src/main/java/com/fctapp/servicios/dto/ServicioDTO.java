package com.fctapp.servicios.dto;

import com.fctapp.servicios.entity.Servicio;

public class ServicioDTO {
    private Long id;
    private EmpresaDTO empresa;

    public ServicioDTO(Servicio servicio) {
        this.id = servicio.getId();
        this.empresa = new EmpresaDTO(servicio.getEmpresa());
    }

    public Long getId() {
        return id;
    }

    public EmpresaDTO getEmpresa() {
        return empresa;
    }
}
