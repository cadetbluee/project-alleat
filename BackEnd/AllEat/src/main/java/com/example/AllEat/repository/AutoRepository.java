package com.example.AllEat.repository;

import com.example.AllEat.entity.AutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutoRepository extends JpaRepository<AutoEntity, Integer> {
    AutoEntity findByUser_idAndId(Integer userId, Integer id);
}
