package com.example.AllEat.repository;

import com.example.AllEat.entity.DayReportEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface DayReportRepository extends JpaRepository<DayReportEntity, Integer> {

    // 특정 사용자와 날짜에 해당하는 DayReport를 찾기 위한 메소드
    Optional<DayReportEntity> findByUserAndReportDay(UserEntity user, LocalDate reportDay);

    // 특정 사용자에 대한 모든 DayReport를 가져오기 위한 메소드
    List<DayReportEntity> findByUser(UserEntity user);
}
