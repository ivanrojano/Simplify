package com.fctapp.servicios.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fctapp.servicios.dto.RegistroClienteDTO;
import com.fctapp.servicios.dto.RegistroEmpresaDTO;
import com.fctapp.servicios.entity.Cliente;
import com.fctapp.servicios.entity.Empresa;
import com.fctapp.servicios.entity.Rol;
import com.fctapp.servicios.repository.ClienteRepository;
import com.fctapp.servicios.repository.EmpresaRepository;

@Service
public class UsuarioService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UsuarioService(ClienteRepository clienteRepository, EmpresaRepository empresaRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public Cliente registrarCliente(RegistroClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setEmail(dto.getEmail());
        cliente.setPassword(passwordEncoder.encode(dto.getPassword()));
        cliente.setRol(Rol.CLIENTE);
        cliente.setNombre(dto.getNombre());
        cliente.setDireccion(dto.getDireccion());
        return clienteRepository.save(cliente);
    }

    public Empresa registrarEmpresa(RegistroEmpresaDTO dto) {
        Empresa empresa = new Empresa();
        empresa.setEmail(dto.getEmail());
        empresa.setPassword(passwordEncoder.encode(dto.getPassword()));
        empresa.setRol(Rol.EMPRESA);
        empresa.setNombreEmpresa(dto.getNombreEmpresa());
        empresa.setDescripcion(dto.getDescripcion());
        empresa.setDireccion(dto.getDireccion());
        return empresaRepository.save(empresa);
    }
}
