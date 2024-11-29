package com.example.AllEat.repository;

import com.example.AllEat.entity.MealPayEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface MealPayRepository extends JpaRepository<MealPayEntity, Integer> {

    MealPayEntity findByPayTransaction_id(Integer payTransaction_id);

}
