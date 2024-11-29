package com.example.AllEat.repository;

import com.example.AllEat.entity.DailyDiaryEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LogRepository extends JpaRepository<DailyDiaryEntity, Integer> {

    // 특정 유저의 start_date를 기준으로 30일치 데이터를 가져오는 쿼리
    @Query("SELECT d FROM DailyDiaryEntity d WHERE d.user = :user AND d.date BETWEEN :startDate AND :endDate ORDER BY d.date ASC")
    List<DailyDiaryEntity> findDiariesByUserAndDateRange(@Param("user") UserEntity user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
