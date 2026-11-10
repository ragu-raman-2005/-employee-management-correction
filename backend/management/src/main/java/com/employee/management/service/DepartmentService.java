
package com.employee.management.service;

import com.employee.management.model.Department;
import com.employee.management.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department addDepartment(Department department) {
        if (departmentRepository.existsByNameIgnoreCase(department.getName())) {
            throw new RuntimeException("Department already exists");
        }

        department.setId(null);
        return departmentRepository.save(department);
    }

    public Department updateDepartment(String id, Department department) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        existing.setName(department.getName());
        existing.setDescription(department.getDescription());

        return departmentRepository.save(existing);
    }

    public void deleteDepartment(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        departmentRepository.delete(department);
    }
}
