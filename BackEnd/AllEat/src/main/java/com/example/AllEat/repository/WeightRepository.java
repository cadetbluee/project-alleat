package com.example.AllEat.repository;
import com.example.AllEat.dto.weight.WeightResponseDTO;
import com.example.AllEat.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AllEat.entity.WeightEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.sql.Date;
import java.util.List;

public interface WeightRepository extends JpaRepository<WeightEntity, Integer> {
    // 해당 유저의 특정날의 weight값 반환
    @Query("SELECT new com.example.AllEat.dto.weight.WeightResponseDTO(w.id, w.createdAt, w.weight) FROM WeightEntity w WHERE FUNCTION('DATE', w.createdAt) = :currentDate AND w.user = :user")
    List<WeightResponseDTO> findByUserEntityAndDate(@Param("user") UserEntity user, @Param("currentDate") Date currentDate);

    // 해당 유저의 모든 weight값 반환
    List<WeightEntity> findByUser(UserEntity userEntity);

    // 해당 유저의 시작날부터 끝날까지의 weight값 반환
    @Query("SELECT new com.example.AllEat.dto.weight.WeightResponseDTO(w.id, w.createdAt, w.weight) FROM WeightEntity w WHERE w.user = :user AND w.createdAt > :startDate AND w.createdAt <= :endDate")
    List<WeightResponseDTO> findByUserEntityAndDateRange(@Param("user") UserEntity user, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    // 변경을 위해 해당 유저의 오늘 weight값을 받아옴
    @Query("SELECT w FROM WeightEntity w WHERE FUNCTION('DATE', w.createdAt) = CURRENT_DATE AND w.user = :user")
    WeightEntity findTodayWeightsByUser(@Param("user") UserEntity user);

    @Query("SELECT w FROM WeightEntity w WHERE w.user = :user ORDER BY w.createdAt DESC LIMIT 1")
    WeightEntity findRecent(@Param("user") UserEntity user);

    @Query("SELECT new com.example.AllEat.dto.weight.WeightResponseDTO(w.id, w.createdAt, w.weight) FROM WeightEntity w WHERE FUNCTION('DATE', w.createdAt) = :exactDate AND w.user = :user")
    List<WeightResponseDTO> findByUserEntityAndExactDate(@Param("user") UserEntity user, @Param("exactDate") Date exactDate);

    Optional<WeightEntity> findTopByUserOrderByCreatedAtDesc(UserEntity user);
}
