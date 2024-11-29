package com.example.AllEat.service;

import com.example.AllEat.dto.log.LogResponseDTO;
import com.example.AllEat.entity.DiaryEntity;
import com.example.AllEat.entity.DiaryMappingEntity;
import com.example.AllEat.entity.DailyDiaryEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.DailyDiaryRepository;
import com.example.AllEat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class LogService {

    @Autowired
    private DailyDiaryRepository dailyDiaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public List<LogResponseDTO> getMealPayLogsByMonth(String yearMonth, HttpServletRequest request) {
        // JWT 토큰을 사용하여 사용자 식별
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.getEmail(token);
        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // yearMonth를 기준으로 해당 월의 시작일과 마지막 날 계산
        LocalDate startDate = LocalDate.parse(yearMonth + "-01");
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // 해당 월의 일일 데이터를 내림차순으로 정렬하여 가져옴
        List<DailyDiaryEntity> dailyDiaries = dailyDiaryRepository.findByUserAndDateBetween(user, startDate, endDate);

        // 반환할 LogResponseDTO 리스트 생성
        List<LogResponseDTO> logResponseList = new ArrayList<>();

        for (DailyDiaryEntity dailyDiary : dailyDiaries) {
            LogResponseDTO logResponse = new LogResponseDTO();
            logResponse.setDate(dailyDiary.getDate().toString());

            List<LogResponseDTO.DiaryDTO> diaryDTOList = new ArrayList<>();

            for (DiaryEntity diaryEntity : dailyDiary.getDiaryEntities()) {
                LogResponseDTO.DiaryDTO diaryDTO = new LogResponseDTO.DiaryDTO();

                // 메뉴 정보를 저장할 리스트
                List<LogResponseDTO.MenuDTO> menuDTOList = new ArrayList<>();

                int totalDiaryKcal = 0;
                int totalDiaryCost = 0;

                // DiaryMappingEntity를 통해 메뉴 정보를 가져옴
                for (DiaryMappingEntity diaryMapping : diaryEntity.getDiaryMapping()) {
                    LogResponseDTO.MenuDTO menuDTO = new LogResponseDTO.MenuDTO();

                    // 메뉴와 관련된 정보를 가져옴
                    menuDTO.setMenuName(diaryMapping.getMenu().getMenuName());
                    menuDTO.setRestaurantName(diaryMapping.getMenu().getRestaurants().getRestaurantsName());

                    // person_count로 칼로리와 비용을 나눔
                    int personCount = diaryMapping.getPersonCount();
                    int menuKcal = diaryMapping.getMenu().getMenuCalories() != null ? diaryMapping.getMenu().getMenuCalories() / personCount : 0;
                    int menuCost = diaryMapping.getMenu().getMenuPrice() != null ? diaryMapping.getMenu().getMenuPrice() / personCount : 0;

                    // 메뉴 정보를 메뉴 DTO에 설정
                    menuDTO.setMenuKcal(menuKcal);
                    menuDTO.setMenuCost(menuCost);

                    // 총 칼로리와 비용을 계산하여 diaryDTO에 반영
                    totalDiaryKcal += menuKcal;
                    totalDiaryCost += menuCost;

                    menuDTOList.add(menuDTO);
                }

                // diaryDTO에 총 칼로리, 비용, 시간, 그리고 메뉴 리스트 설정
                diaryDTO.setDiaryKcal(totalDiaryKcal);
                diaryDTO.setDiaryCost(totalDiaryCost);
                diaryDTO.setDiaryTime(diaryEntity.getDiaryTime().toString());
                diaryDTO.setMenus(menuDTOList);

                diaryDTOList.add(diaryDTO);
            }

            // 해당 날짜의 다이어리 리스트를 로그 응답에 설정
            logResponse.setDiaries(diaryDTOList);
            logResponseList.add(logResponse);
        }

        // 날짜를 내림차순으로 정렬
        logResponseList.sort((log1, log2) -> log2.getDate().compareTo(log1.getDate()));

        return logResponseList;
    }

}
