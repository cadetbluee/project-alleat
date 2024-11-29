package com.example.AllEat.controller;


import com.example.AllEat.dto.weight.WeightDTO;
import com.example.AllEat.dto.weight.WeightResponseDTO;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.entity.WeightEntity;
import com.example.AllEat.repository.WeightRepository;
import com.example.AllEat.service.UserService;
import com.example.AllEat.service.WeightRecordService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/AllEat/weight")
public class WeightController {

    private final UserService userService;
    private final WeightRecordService weightRecordService;
    private final WeightRepository weightRepository;

    public WeightController(WeightRecordService weightRecordService, UserService userService, WeightRepository weightRepository) {
        this.weightRecordService = weightRecordService;
        this.userService = userService;
        this.weightRepository = weightRepository;
    }

    @PostMapping("")
    public ResponseEntity<?> recordWeight(HttpServletRequest request, @RequestBody WeightDTO weightDTO) {
        try{
            weightRecordService.recordWeight(weightDTO,request);
            return ResponseEntity.ok("Successfully Recorded");
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());

        }
    }

    // 그날 체중 수정
    @PutMapping("")
    public ResponseEntity<?> modifyWeight(HttpServletRequest request, @RequestBody WeightDTO weightDTO) {
        try{
            weightRecordService.modifyWeight(weightDTO,request);
            return ResponseEntity.ok("Successfully edited");
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());

        }
    }

    // 특정날부터 특정기간까지의 체중 반환, params가 없는 경우 오늘 체중 반환
    @GetMapping("")
    public ResponseEntity<?> getAllWeight(HttpServletRequest request,
                                          @RequestParam(required = false) Integer year,
                                          @RequestParam(required = false) Integer month,
                                          @RequestParam(required = false) Integer day,
                                          @RequestParam(required = false) Integer period
                                          ) {

        try{
            UserEntity user = userService.findByRequest(request);
            List<WeightResponseDTO> weightEntities;
            if (year != null && month != null && day != null && period != null) {
                Date date = Date.valueOf(LocalDate.of(year, month, day));
                Date next_date = Date.valueOf(LocalDate.of(year, month, day).plusDays(period));
                weightEntities = weightRepository.findByUserEntityAndDateRange(user, date, next_date);
            } else {
                Date date = Date.valueOf(LocalDate.now());
                weightEntities = weightRepository.findByUserEntityAndDate(user, date);
            }

            return ResponseEntity.ok(weightEntities);
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }


    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentWeight(HttpServletRequest request) {
        try{
            UserEntity user = userService.findByRequest(request);
            WeightEntity weight = weightRepository.findRecent(user);
            return ResponseEntity.ok(weight);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());

        }
    }
}
