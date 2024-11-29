package com.example.AllEat.controller;

import com.example.AllEat.dto.mealPay.MealPayAmountDTO;
import com.example.AllEat.dto.mealPay.MealPayRequestDTO;
import com.example.AllEat.entity.MealPayEntity;
import com.example.AllEat.entity.MonthlyMealPayEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.service.MealPayService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.AllEat.repository.MonthlyMealPayRepository;

import java.time.YearMonth;

@RestController
@RequestMapping("AllEat/record")
@RequiredArgsConstructor
public class MealPayController {

    private final MonthlyMealPayRepository monthlyMealPayRepository;
    private final MealPayService mealPayService;
    private final UserService userService;

    @PostMapping("/meal-pay")
    public ResponseEntity<?> recordMealPay(@RequestBody MealPayRequestDTO mealPayRequest, HttpServletRequest request) {
        UserEntity findUserEntity = userService.findByRequest(request);
        if (findUserEntity != null) {
            MealPayEntity mealPayEntity = mealPayService.getMealPayResult(mealPayRequest, findUserEntity);
            return ResponseEntity.status(HttpStatus.OK).body(mealPayEntity);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/meal-pay")
    public ResponseEntity<?> updateMealPay(@RequestBody MealPayRequestDTO mealPayRequest, HttpServletRequest request) {
        UserEntity findUserEntity = userService.findByRequest(request);
        if (findUserEntity != null) {
            MealPayEntity mealPayEntity = mealPayService.updateMealPayResult(mealPayRequest, findUserEntity);
            return ResponseEntity.status(HttpStatus.OK).body(mealPayEntity);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/meal-pay/monthly-amount")
    public ResponseEntity<?> getMealPayAmount(HttpServletRequest request){
        UserEntity user = userService.findByRequest(request);

        MonthlyMealPayEntity findMonth =  monthlyMealPayRepository.findByUserAndDate(user, YearMonth.now()).get(0);
        MealPayAmountDTO mealPayAmountDTO = new MealPayAmountDTO();

        if (findMonth != null){
            mealPayAmountDTO.setAmount(findMonth.getAmount());
            return ResponseEntity.status(HttpStatus.OK).body(mealPayAmountDTO);
        } else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/meal-pay")
    public ResponseEntity<?> getMealPay(HttpServletRequest request){
        UserEntity user = userService.findByRequest(request);
        // pay transaction 에서 한달 특정기간 긁어옴
        // 긁어온 거에서 DTO 구성해서 반환
        // 소비처 , 식비,  
        return ResponseEntity.status(HttpStatus.OK).body("아직 구현 안됨!");

    }

}
