package com.example.AllEat.repository;
import com.example.AllEat.entity.MonthlyMealPayEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.YearMonth;
import java.util.List;

public interface MonthlyMealPayRepository extends JpaRepository<MonthlyMealPayEntity, Integer> {
    List<MonthlyMealPayEntity> findByUserAndDate(UserEntity user, YearMonth date);

}
