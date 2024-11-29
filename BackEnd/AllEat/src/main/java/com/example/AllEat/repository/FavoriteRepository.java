package com.example.AllEat.repository;

import com.example.AllEat.entity.FavoriteEntity;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Integer> {

    // 유저 기반으로 즐겨찾기된 메뉴 목록 조회
    List<FavoriteEntity> findByUser(UserEntity user);

    // 유저와 메뉴를 기준으로 즐겨찾기 조회
    Optional<FavoriteEntity> findByUserAndMenu(UserEntity user, MenuEntity menu);

    FavoriteEntity findByUserIdAndMenuId(Integer userId, Integer menuId);
}
