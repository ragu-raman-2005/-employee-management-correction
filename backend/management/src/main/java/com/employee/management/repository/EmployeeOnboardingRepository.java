package com.employee.management.repository;

import com.employee.management.model.EmployeeOnboarding;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmployeeOnboardingRepository
        extends MongoRepository<EmployeeOnboarding, String> {

    boolean existsByEmail(String email);
}