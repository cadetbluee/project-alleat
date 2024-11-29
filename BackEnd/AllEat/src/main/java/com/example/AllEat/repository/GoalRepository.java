package com.example.AllEat.repository;

import com.example.AllEat.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoalRepository extends JpaRepository<GoalEntity, Integer> {
    Optional<GoalEntity> findByUserId(Integer userId);  // 사용자 ID로 목표를 찾는 메서드
}
