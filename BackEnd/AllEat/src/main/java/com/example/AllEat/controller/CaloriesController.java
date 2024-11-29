package com.example.AllEat.controller;

import com.example.AllEat.dto.calories.CaloriesDTO;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.service.CaloriesService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/AllEat/record")
@RequiredArgsConstructor
public class CaloriesController {

    private final CaloriesService caloriesSercice;
    private final UserService userService;

    @GetMapping("/calories/{startDate}/{period}")
    public ResponseEntity<?> getCalories(HttpServletRequest request, @PathVariable(required = false) LocalDate startDate, @PathVariable(required = false) int period) {
        UserEntity findUser = userService.findByRequest(request);
        if (findUser != null) {
            if (startDate == null){
                startDate = LocalDate.now();
                List<CaloriesDTO> getCaloriesList = caloriesSercice.getCalories(startDate, period, findUser);
                return ResponseEntity.status(HttpStatus.OK).body(getCaloriesList);
            }
            List<CaloriesDTO> getCaloriesList = caloriesSercice.getCalories(startDate, period, findUser);
            return ResponseEntity.status(HttpStatus.OK).body(getCaloriesList);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
