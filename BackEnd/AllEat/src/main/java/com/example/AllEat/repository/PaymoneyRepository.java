package com.example.AllEat.repository;

import com.example.AllEat.entity.PaymoneyEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.entity.WeightEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymoneyRepository extends JpaRepository<PaymoneyEntity, Integer> {

    PaymoneyEntity findByUser(UserEntity userEntity);

}
