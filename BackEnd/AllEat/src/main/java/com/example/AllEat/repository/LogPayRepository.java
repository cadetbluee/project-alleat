package com.example.AllEat.repository;

import com.example.AllEat.entity.PayTransactionEntity;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LogPayRepository extends JpaRepository<PayTransactionEntity, Integer> {

    // 특정 유저와 해당 월의 트랜잭션을 조회하는 쿼리
    @Query("SELECT p FROM PayTransactionEntity p " +
            "WHERE p.user = :user " +
            "AND FUNCTION('DATE_FORMAT', p.transactionDate, '%Y-%m') = :yearMonth " +
            "ORDER BY p.transactionDate DESC")
    List<PayTransactionEntity> findTransactionsByUserAndMonth(@Param("user") UserEntity user,
                                                              @Param("yearMonth") String yearMonth);
}
