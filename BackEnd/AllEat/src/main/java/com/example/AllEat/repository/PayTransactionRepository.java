package com.example.AllEat.repository;

import com.example.AllEat.dto.weight.WeightResponseDTO;
import com.example.AllEat.entity.PayTransactionEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.entity.WeightEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

public interface PayTransactionRepository extends JpaRepository<PayTransactionEntity,Integer> {


    // 해당 유저의 모든 거래 내역 반환
    List<PayTransactionEntity> findByUser(UserEntity userEntity);

    // 유저의 오늘 결제 내역 중 기록되지 않은 내역 반환
    @Query("SELECT p FROM PayTransactionEntity p WHERE FUNCTION('DATE', p.transactionDate) = CURRENT_DATE AND p.user = :user AND p.record = false ")
    List<PayTransactionEntity> findTodayTransactionByUser(@Param("user") UserEntity user);

    // 해당 유저의 특정날의 거래내역 반환
    @Query("SELECT p FROM PayTransactionEntity p WHERE FUNCTION('DATE', p.transactionDate) = :currentDate AND p.user = :user")
    List<PayTransactionEntity> findByUserEntityAndDate(@Param("user") UserEntity user, @Param("currentDate") Date currentDate);

    // 해당 유저의 시작날부터 끝날까지의 거래 내역 반환
    @Query("SELECT p FROM PayTransactionEntity p WHERE p.user = :user AND p.transactionDate > :startDate AND p.transactionDate <= :endDate")
    List<PayTransactionEntity> findByUserEntityAndDateRange(@Param("user") UserEntity user, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    // 해당 유저의 시작날부터 끝날까지의 소비 금액 반환
    @Query("SELECT SUM(p.amount) FROM PayTransactionEntity p WHERE p.user = :user AND p.transactionDate > :startDate AND p.transactionDate <= :endDate AND p.restaurant.id != 1")
    Integer findByUserEntityAndDateAndRestId(@Param("user") UserEntity user, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    // 해당 유저의 오늘 소비 금액 반환
    @Query("SELECT SUM(p.amount) FROM PayTransactionEntity p WHERE p.user = :user AND FUNCTION('DATE', p.transactionDate) = CURRENT_DATE AND p.restaurant.id != 1")
    Integer findByUserEntityAndRestId(@Param("user") UserEntity user);

    @Query("SELECT p FROM PayTransactionEntity p WHERE p.user.id = :userId AND DATE(p.transactionDate) = :date")
    List<PayTransactionEntity> findByUser_idAndTransactionDate(@Param("userId")Integer userId, @Param("date") LocalDate date);


}
