
package com.employee.management.service;

import com.employee.management.model.Employee;
import com.employee.management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found: " + id));
    }

    public Employee addEmployee(Employee employee) {
        employee.setId(null);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(String id, Employee employee) {
        Employee existing = getEmployeeById(id);

        existing.setName(employee.getName());
        existing.setEmail(employee.getEmail());
        existing.setPhone(employee.getPhone());
        existing.setDepartment(employee.getDepartment());
        existing.setDesignation(employee.getDesignation());
        existing.setSalary(employee.getSalary());

        return employeeRepository.save(existing);
    }

    public void deleteEmployee(String id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}
