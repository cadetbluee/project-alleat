package com.example.AllEat.service;

import com.example.AllEat.dto.menu.MainDataDTO;
import com.example.AllEat.entity.DiaryEntity;
import com.example.AllEat.entity.DiaryMappingEntity;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.DiaryRepository;
import com.example.AllEat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;

@Service
public class MainDataService {

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public MainDataDTO getDiaryByDate(String date, HttpServletRequest request) {
        // JWT 토큰에서 사용자 이메일 추출
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing Authorization header");
        }
        token = token.substring(7); // "Bearer " 부분 제거
        String email = jwtUtil.getEmail(token);

        // 사용자 찾기
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        LocalDate localDate = LocalDate.parse(date);
        List<DiaryEntity> diaries = diaryRepository.findByDailyDiary_UserAndDailyDiary_Date(user, localDate);

        if (diaries == null || diaries.isEmpty()) {
            MainDataDTO emptyDataDTO = new MainDataDTO();
            emptyDataDTO.setDayKcal(null);
            emptyDataDTO.setDayCarb(null);
            emptyDataDTO.setDayProtein(null);
            emptyDataDTO.setDayFat(null);
            emptyDataDTO.setDayCost(null);
            return emptyDataDTO;
        }

        MainDataDTO mainDataDTO = new MainDataDTO();
        int totalKcal = 0, totalCarb = 0, totalProtein = 0, totalFat = 0, totalCost = 0;

        for (DiaryEntity diary : diaries) {
            int diaryCost = 0;
            double diaryKcal = 0.0; // Initialize diary-specific kcal


            for (DiaryMappingEntity mapping : diary.getDiaryMapping()) {
                MenuEntity menu = mapping.getMenu();
                if (menu != null && mapping.getPersonCount() != null && mapping.getPersonCount() > 0) {
                    int adjustedPrice = (int) Math.round(menu.getMenuPrice() / (double) mapping.getPersonCount());
                    int adjustedCarb = (int) Math.round((menu.getMenuCarbohydrate() != null ? menu.getMenuCarbohydrate() : 0) / (double) mapping.getPersonCount());
                    int adjustedProtein = (int) Math.round((menu.getMenuProtein() != null ? menu.getMenuProtein() : 0) / (double) mapping.getPersonCount());
                    int adjustedFat = (int) Math.round((menu.getMenuFat() != null ? menu.getMenuFat() : 0) / (double) mapping.getPersonCount());
                    double adjustedKcal = (menu.getMenuCalories() / (double) mapping.getPersonCount());

                    diaryCost += adjustedPrice;
                    totalCarb += adjustedCarb;
                    totalProtein += adjustedProtein;
                    totalFat += adjustedFat;
                    diaryKcal += adjustedKcal;
                }
            }

            totalKcal += diaryKcal;
            totalCost += diaryCost;
            mainDataDTO.addDiaryDetail(diary.getId(), diary.getDiaryTime().name(), (int) Math.round(diaryKcal), diaryCost);
        }

        mainDataDTO.setDayKcal(totalKcal);
        mainDataDTO.setDayCarb(totalCarb);
        mainDataDTO.setDayProtein(totalProtein);
        mainDataDTO.setDayFat(totalFat);
        mainDataDTO.setDayCost(totalCost);

        return mainDataDTO;
    }
}
