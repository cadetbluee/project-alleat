package com.example.AllEat.repository;
import java.util.List;

import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<MenuEntity, Integer> {
    List<MenuEntity> findByRestaurants(RestaurantsEntity restaurants);

    List<MenuEntity> findByRestaurants_IdAndMenuPrice(Integer id, Integer balance);

    List<MenuEntity> findByRestaurants_idAndMenuPriceLessThanEqualOrderByMenuPriceDesc(Integer restaurantsId, Integer menuPrice);
}

