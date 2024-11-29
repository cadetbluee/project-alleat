package com.example.AllEat.repository;

import com.example.AllEat.entity.AlarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepository extends JpaRepository<AlarmEntity, Integer> {
    AlarmEntity findByUser_id(Integer id);

    void deleteByUser_id(Integer id);
}
