package com.example.AllEat.repository;

import com.example.AllEat.entity.DailyDiaryEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyDiaryRepository extends JpaRepository<DailyDiaryEntity, Integer> {

  DailyDiaryEntity findByUser_idAndDate(Integer userId, LocalDate localDate);
    // UserEntity와 LocalDate를 기반으로 검색
    DailyDiaryEntity findByUserAndDate(UserEntity user, LocalDate date);

    // 사용자 ID를 기반으로 검색하는 경우를 유지하고 싶을 때 (optional)
    DailyDiaryEntity findByUser_IdAndDate(Integer userId, LocalDate localDate);

    // UserEntity와 날짜 범위로 검색하는 새로운 메서드 추가
    List<DailyDiaryEntity> findByUserAndDateBetween(UserEntity user, LocalDate startDate, LocalDate endDate);

    Optional<List<DailyDiaryEntity>> findByUser_idAndDateBetween(Integer userId, LocalDate startDate, LocalDate endDate);
}
