package com.example.AllEat.service;

import com.example.AllEat.dto.calories.CaloriesDTO;
import com.example.AllEat.entity.DailyDiaryEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.DailyDiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaloriesService {

    private final DailyDiaryRepository dailyDiaryRepository;

    public List<CaloriesDTO> getCalories(LocalDate startDate, int period, UserEntity findUser){
        LocalDate endDate = startDate.plusDays(period);
        List<DailyDiaryEntity> findDailyDiary = dailyDiaryRepository.findByUser_idAndDateBetween(findUser.getId(), startDate, endDate).orElseThrow(()-> new IllegalArgumentException("daily diary not found"));
        List<CaloriesDTO> caloriesDTOList = new ArrayList<>();
        if(findDailyDiary.size() != 0){
            for(DailyDiaryEntity dailyDiary : findDailyDiary){
                CaloriesDTO caloriesDTO = CaloriesDTO.builder()
                        .date(dailyDiary.getDate())
                        .calories(dailyDiary.getDailyCalories())
                        .build();
                caloriesDTOList.add(caloriesDTO);
            }
        }
        return caloriesDTOList;
    }
}
