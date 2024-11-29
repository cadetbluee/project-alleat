package com.example.AllEat.controller;

import com.example.AllEat.dto.goal.GoalDTO;
import com.example.AllEat.entity.GoalEntity;
import com.example.AllEat.service.GoalService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/AllEat/users/goals")
public class GoalController {

    private final GoalService goalService;

    @Autowired
    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    // 목표 생성
    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody GoalDTO goalDTO, HttpServletRequest request) {
        try {
            GoalEntity goalEntity = goalService.createGoal(goalDTO, request);
            GoalDTO responseDto = convertToDTO(goalEntity);
            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 목표 수정
    @PutMapping
    public ResponseEntity<GoalDTO> updateGoal(@RequestBody GoalDTO goalDTO, HttpServletRequest request) {
        try {
            GoalEntity updatedGoal = goalService.updateGoal(goalDTO, request);
            GoalDTO responseDto = convertToDTO(updatedGoal);
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 사용자 자신의 목표 조회
    @GetMapping
    public ResponseEntity<GoalDTO> getUserGoal(HttpServletRequest request) {
        try {
            GoalEntity goalEntity = goalService.getUserGoal(request);
            GoalDTO responseDto = convertToDTO(goalEntity);
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    private GoalDTO convertToDTO(GoalEntity goalEntity) {
        GoalDTO goalDTO = new GoalDTO();
        goalDTO.setGoalWeight(goalEntity.getGoalWeight());
        goalDTO.setGoalCost(goalEntity.getGoalCost());
        return goalDTO;
    }
}
