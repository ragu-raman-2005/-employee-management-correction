package com.employee.management.controller;

import com.employee.management.model.EmployeeOnboarding;
import com.employee.management.service.EmployeeOnboardingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
public class EmployeeOnboardingController {

    private final EmployeeOnboardingService service;

    public EmployeeOnboardingController(
            EmployeeOnboardingService service) {
        this.service = service;
    }

    // GET all employees
    @GetMapping
    public List<EmployeeOnboarding> getAll() {
        return service.getAll();
    }

    // GET employee by ID
    @GetMapping("/{id}")
    public EmployeeOnboarding getById(@PathVariable String id) {
        return service.getById(id);
    }

    // POST - Add employee
    @PostMapping
    public EmployeeOnboarding create(
            @RequestBody EmployeeOnboarding employee) {
        return service.create(employee);
    }

    // PUT - Update employee
    @PutMapping("/{id}")
    public EmployeeOnboarding update(
            @PathVariable String id,
            @RequestBody EmployeeOnboarding employee) {
        return service.update(id, employee);
    }

    // PATCH - Update status
    @PatchMapping("/{id}/status")
    public EmployeeOnboarding updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        return service.updateStatus(id, request.get("status"));
    }

    // DELETE - Delete employee
    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        service.delete(id);
        return Map.of("message", "Employee deleted successfully");
    }
}