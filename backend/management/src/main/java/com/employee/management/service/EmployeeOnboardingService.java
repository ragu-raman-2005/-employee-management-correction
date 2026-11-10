package com.employee.management.service;

import com.employee.management.model.EmployeeOnboarding;
import com.employee.management.repository.EmployeeOnboardingRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeOnboardingService {

    private final EmployeeOnboardingRepository repository;

    public EmployeeOnboardingService(
            EmployeeOnboardingRepository repository) {
        this.repository = repository;
    }

    // Get all onboarding records
    public List<EmployeeOnboarding> getAll() {
        return repository.findAll();
    }

    // Get one employee by ID
    public EmployeeOnboarding getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee onboarding record not found"
                ));
    }

    // Add new employee
    public EmployeeOnboarding create(EmployeeOnboarding employee) {

        if (repository.existsByEmail(employee.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        employee.setId(null);

        if (employee.getStatus() == null ||
                employee.getStatus().isBlank()) {
            employee.setStatus("PENDING");
        }

        return repository.save(employee);
    }

    // Update employee
    public EmployeeOnboarding update(
            String id,
            EmployeeOnboarding updatedEmployee) {

        EmployeeOnboarding existing = getById(id);

        if (updatedEmployee.getEmail() != null &&
                !existing.getEmail().equalsIgnoreCase(
                        updatedEmployee.getEmail()) &&
                repository.existsByEmail(updatedEmployee.getEmail())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        existing.setFirstName(updatedEmployee.getFirstName());
        existing.setLastName(updatedEmployee.getLastName());
        existing.setEmail(updatedEmployee.getEmail());
        existing.setPhone(updatedEmployee.getPhone());
        existing.setDepartment(updatedEmployee.getDepartment());
        existing.setDesignation(updatedEmployee.getDesignation());
        existing.setJoiningDate(updatedEmployee.getJoiningDate());
        existing.setSalary(updatedEmployee.getSalary());
        existing.setAddress(updatedEmployee.getAddress());

        if (updatedEmployee.getStatus() != null) {
            existing.setStatus(updatedEmployee.getStatus());
        }

        return repository.save(existing);
    }

    // Update onboarding status
    public EmployeeOnboarding updateStatus(String id, String status) {

        EmployeeOnboarding employee = getById(id);

        if (!List.of("PENDING", "IN_PROGRESS", "COMPLETED")
                .contains(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid onboarding status"
            );
        }

        employee.setStatus(status);

        return repository.save(employee);
    }

    // Delete employee
    public void delete(String id) {
        EmployeeOnboarding employee = getById(id);
        repository.delete(employee);
    }
}