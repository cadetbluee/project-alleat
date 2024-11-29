package com.example.AllEat.repository;

import com.example.AllEat.entity.NotificationEntity;
import com.example.AllEat.entity.PaymoneyEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {

    // 확인 안 한 알림 전부 받아오기
    @Query("SELECT n FROM NotificationEntity n WHERE n.user = :user")
    List<NotificationEntity> findAllByUserEntity(UserEntity user);


}

