package com.fctapp.servicios.dto;

import com.fctapp.servicios.entity.Empresa;

public class EmpresaDTO {
    private Long id;
    
    private String nombreEmpresa;

    public EmpresaDTO(Empresa empresa) {
        this.id = empresa.getId();
        this.nombreEmpresa = empresa.getNombreEmpresa();
    }

    public Long getId() {
        return id;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }
}
