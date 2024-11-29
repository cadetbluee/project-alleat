package com.example.AllEat.repository;

import com.example.AllEat.entity.RestaurantsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantsRepository extends JpaRepository<RestaurantsEntity, Integer> {

    // restaurant_name으로 레스토랑을 찾는 메서드
    Optional<RestaurantsEntity> findByRestaurantsName(String restaurantsName);
}