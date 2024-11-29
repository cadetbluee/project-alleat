package com.example.AllEat.service;

import com.example.AllEat.entity.*;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.DailyDiaryRepository;
import com.example.AllEat.repository.GoalRepository;
import com.example.AllEat.repository.UserRepository;
import com.example.AllEat.repository.WeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WeekReportService {

    @Autowired
    private DailyDiaryRepository dailyDiaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeightRepository weightRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${fast.api.url}")
    private String fastApi;

    public Map<String, Object> collectWeekReport(String day, HttpServletRequest request) {
        // JWT 토큰 및 사용자 식별
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing Authorization header");
        }
        token = token.substring(7);
        String email = jwtUtil.getEmail(token);
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // 목표 체중과 식비 가져오기
        GoalEntity goal = goalRepository.findByUserId(user.getId()).orElse(null);
        Double goalWeight = goal != null ? goal.getGoalWeight() : null;
        Integer goalCost = goal != null ? goal.getGoalCost() : null;

        // 최근 체중 가져오기
        Optional<WeightEntity> recentWeightRecord = weightRepository.findTopByUserOrderByCreatedAtDesc(user);
        Double currentWeight = recentWeightRecord.map(WeightEntity::getWeight).orElse(null);

        // 일주일간 데이터를 가져와서 계산
        LocalDate endDate = LocalDate.parse(day);
        LocalDate startDate = endDate.minusDays(6);
        List<DailyDiaryEntity> weeklyDiaries = dailyDiaryRepository.findByUserAndDateBetween(user, startDate, endDate);
        int diaryCount = weeklyDiaries.size();
        if (diaryCount == 0) {
            throw new RuntimeException("No diary entries found for the week.");
        }

        double totalCarbohydrates = 0.0;
        double totalProteins = 0.0;
        double totalFats = 0.0;
        double totalCalories = 0;
        double totalCost = 0;
        List<Map<String, Object>> menuEntries = new ArrayList<>();

        for (DailyDiaryEntity diary : weeklyDiaries) {
            for (DiaryEntity diaryEntity : diary.getDiaryEntities()) {
                for (DiaryMappingEntity diaryMapping : diaryEntity.getDiaryMapping()) {
                    MenuEntity menu = diaryMapping.getMenu();
                    int personCount = diaryMapping.getPersonCount(); // person_count를 가져옴

                    // 각 메뉴의 영양소 정보를 person_count로 나눔
                    double carbohydrates = menu.getMenuCarbohydrate() != null ? menu.getMenuCarbohydrate() / personCount : 0.0;
                    double proteins = menu.getMenuProtein() != null ? menu.getMenuProtein() / personCount : 0.0;
                    double fats = menu.getMenuFat() != null ? menu.getMenuFat() / personCount : 0.0;
                    double calories = menu.getMenuCalories() != null ? menu.getMenuCalories() / personCount : 0.0;
                    double cost = menu.getMenuPrice() != null ? menu.getMenuPrice() / personCount : 0.0;

                    totalCarbohydrates += carbohydrates;
                    totalProteins += proteins;
                    totalFats += fats;
                    totalCalories += calories;
                    totalCost += cost;

                    menuEntries.add(new HashMap<>(Map.of(
                            "menu_name", menu.getMenuName(),
                            "carbohydrates", carbohydrates,
                            "proteins", proteins,
                            "fats", fats,
                            "calories", calories,
                            "cost", cost,
                            "restaurant_type", menu.getRestaurants().getRestaurantsType().name()
                    )));
                }
            }
        }

        // 평균값 계산
        double carbAvg = totalCarbohydrates / diaryCount;
        double proteinAvg = totalProteins / diaryCount;
        double fatAvg = totalFats / diaryCount;
        double kcalAvg = totalCalories / diaryCount;
        // 일 수 계산 (해당 월의 일 수)
        int daysInMonth = endDate.lengthOfMonth();
        double costAvg = totalCost / daysInMonth;
        // 레스토랑 타입별 카운트
        Map<String, Integer> restaurantTypeCount = new HashMap<>();
        menuEntries.forEach(entry -> {
            String type = entry.get("restaurant_type").toString();
            restaurantTypeCount.put(type, restaurantTypeCount.getOrDefault(type, 0) + 1);
        });

        // 수집된 데이터를 모두 포함한 Map 반환
        Map<String, Object> finalReport = new HashMap<>();
        finalReport.put("goal_weight", goalWeight);
        finalReport.put("goal_cost", goalCost);
        finalReport.put("current_weight", currentWeight);
        finalReport.put("carb_avg", carbAvg);
        finalReport.put("protein_avg", proteinAvg);
        finalReport.put("fat_avg", fatAvg);
        finalReport.put("kcal_average", kcalAvg);
        finalReport.put("total_cost", totalCost);
        finalReport.put("cost_avg", costAvg);
        finalReport.put("cost_where", getCostWhere(restaurantTypeCount));

        // 메뉴 영양소 랭킹
        finalReport.put("menu_kcal", getRanking(menuEntries, "calories", 10));
        finalReport.put("protein_ranking", getRanking(menuEntries, "proteins", 5));
        finalReport.put("carb_ranking", getRanking(menuEntries, "carbohydrates", 5));
        finalReport.put("fat_ranking", getRanking(menuEntries, "fats", 5));
        finalReport.put("cost_ranking", getRanking(menuEntries, "cost", 10));

        return finalReport;
    }

    private List<Map<String, Object>> getRanking(List<Map<String, Object>> menuEntries, String key, int limit) {
        // 메뉴별로 영양소 및 비용을 합산하여 그룹화
        Map<String, Map<String, Object>> groupedMenuEntries = new HashMap<>();

        for (Map<String, Object> entry : menuEntries) {
            String menuName = (String) entry.get("menu_name");
            double value = ((Number) entry.get(key)).doubleValue();

            if (!groupedMenuEntries.containsKey(menuName)) {
                // 초기화
                Map<String, Object> newEntry = new HashMap<>(entry);
                newEntry.put(key, value); // 필요한 key의 값으로 초기화
                groupedMenuEntries.put(menuName, newEntry);
            } else {
                // 기존 값에 누적
                Map<String, Object> existingEntry = groupedMenuEntries.get(menuName);
                existingEntry.put(key, ((Number) existingEntry.get(key)).doubleValue() + value);
            }
        }

        // 합산된 결과를 내림차순으로 정렬하고 상위 limit 개수만 선택
        return groupedMenuEntries.values().stream()
                .sorted((entry1, entry2) -> Double.compare(((Number) entry2.get(key)).doubleValue(), ((Number) entry1.get(key)).doubleValue()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getCostWhere(Map<String, Integer> restaurantTypeCount) {
        return restaurantTypeCount.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("restaurant_type", entry.getKey());
                    map.put("count", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
