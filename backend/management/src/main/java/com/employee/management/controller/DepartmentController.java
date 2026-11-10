
package com.employee.management.controller;

import com.employee.management.model.Department;
import com.employee.management.service.DepartmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }

    @PostMapping
    public ResponseEntity<Department> addDepartment(
            @RequestBody Department department) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departmentService.addDepartment(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable String id,
            @RequestBody Department department) {
        return ResponseEntity.ok(
                departmentService.updateDepartment(id, department));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(
            @PathVariable String id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
