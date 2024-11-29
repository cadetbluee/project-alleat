package com.example.AllEat.repository;

import com.example.AllEat.entity.FoodInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodInfoRepository extends JpaRepository<FoodInfoEntity, Integer> {
    Optional<FoodInfoEntity> findById(long id);

}
