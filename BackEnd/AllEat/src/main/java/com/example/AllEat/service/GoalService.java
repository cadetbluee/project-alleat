package com.example.AllEat.service;

import com.example.AllEat.dto.goal.GoalDTO;
import com.example.AllEat.entity.GoalEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.GoalRepository;
import com.example.AllEat.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public GoalService(GoalRepository goalRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // JWT 토큰을 이용해 사용자 식별
    public UserEntity findUserByRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.getEmail(token);
        return userRepository.findByEmail(email);
    }

    // 목표 생성
    public GoalEntity createGoal(GoalDTO goalDTO, HttpServletRequest request) {
        UserEntity userEntity = findUserByRequest(request);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }

        GoalEntity goalEntity = GoalEntity.builder()
                .user(userEntity)
                .goalWeight(goalDTO.getGoalWeight())
                .goalCost(goalDTO.getGoalCost())
                .build();

        return goalRepository.save(goalEntity);
    }

    // 목표 수정
    public GoalEntity updateGoal(GoalDTO goalDTO, HttpServletRequest request) {
        UserEntity userEntity = findUserByRequest(request);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }

        Optional<GoalEntity> optionalGoal = goalRepository.findByUserId(userEntity.getId());
        if (optionalGoal.isPresent()) {
            GoalEntity goalEntity = optionalGoal.get();
            goalEntity.update(goalDTO.getGoalWeight(), goalDTO.getGoalCost());
            return goalRepository.save(goalEntity);
        } else {
            throw new RuntimeException("Goal not found or user does not have permission to update this goal");
        }
    }

    // 사용자 자신의 목표 조회
    public GoalEntity getUserGoal(HttpServletRequest request) {
        UserEntity userEntity = findUserByRequest(request);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }

        Optional<GoalEntity> optionalGoal = goalRepository.findByUserId(userEntity.getId());
        if (optionalGoal.isPresent()) {
            return optionalGoal.get();
        } else {
            throw new RuntimeException("Goal not found for this user");
        }
    }
}
