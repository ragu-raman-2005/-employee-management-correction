
package com.employee.management.repository;

import com.employee.management.model.Department;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    boolean existsByNameIgnoreCase(String name);
}
