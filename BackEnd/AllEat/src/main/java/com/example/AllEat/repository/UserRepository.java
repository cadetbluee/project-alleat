package com.example.AllEat.repository;
import com.example.AllEat.entity.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);

    Boolean existsByRefreshToken(String refresh);

    @Transactional
    void deleteByRefreshToken(String refresh);

    @Query("SELECT u.fcmToken FROM UserEntity u WHERE u.fcmToken IS NOT NULL ")
    List<String> findAllWithFCM();
}
