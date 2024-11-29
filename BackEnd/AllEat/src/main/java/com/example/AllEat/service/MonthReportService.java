package com.example.AllEat.service;
import java.util.stream.Collectors;
import com.example.AllEat.dto.weight.WeightResponseDTO;
import com.example.AllEat.entity.*;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.DailyDiaryRepository;
import com.example.AllEat.repository.GoalRepository;
import com.example.AllEat.repository.UserRepository;
import com.example.AllEat.repository.WeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class MonthReportService {

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

    public Map<String, Object> collectMonthReport(String yearMonth, HttpServletRequest request) {
        // JWT 토큰에서 사용자 식별
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.getEmail(token);
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Goal 정보 가져오기
        GoalEntity goal = goalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Goal information not found for the user"));

        // 해당 월의 시작일과 종료일 계산
        LocalDate startDate = LocalDate.parse(yearMonth + "-01");
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth()); // 해당 월의 마지막 날로 설정

        // 해당 월에 기록된 몸무게 데이터 가져오기 (날짜만을 기준으로 가져옴)
        List<WeightResponseDTO> weightRecords = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<WeightResponseDTO> dailyWeights = weightRepository.findByUserEntityAndExactDate(user, java.sql.Date.valueOf(date));
            weightRecords.addAll(dailyWeights);
        }
        // 기록된 몸무게 데이터의 날짜 변환 및 저장
        List<Map<String, Object>> processedWeightRecords = new ArrayList<>();
        Double startWeight = null, endWeight = null;
        if (!weightRecords.isEmpty()) {
            startWeight = weightRecords.get(0).getWeight();
            endWeight = weightRecords.get(weightRecords.size() - 1).getWeight();
        }

        for (WeightResponseDTO record : weightRecords) {
            Map<String, Object> weightData = new HashMap<>();
            LocalDate date = record.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            weightData.put("date", date.toString());
            weightData.put("weight", record.getWeight());
            processedWeightRecords.add(weightData);
        }

        // 해당 월에 먹었던 메뉴의 영양 정보 계산
        List<DailyDiaryEntity> monthlyDiaries = dailyDiaryRepository.findByUserAndDateBetween(user, startDate, endDate);

        double totalCarbohydrates = 0.0;
        double totalProteins = 0.0;
        double totalFats = 0.0;
        int totalCalories = 0;
        int totalCost = 0;
        int dayCount = 0;
        Map<String, Integer> restaurantTypeCount = new HashMap<>();
        List<Map<String, Object>> menuEntries = new ArrayList<>();

        for (DailyDiaryEntity diary : monthlyDiaries) {
            dayCount++;
            for (DiaryEntity diaryEntity : diary.getDiaryEntities()) {
                for (DiaryMappingEntity diaryMapping : diaryEntity.getDiaryMapping()) {
                    MenuEntity menu = diaryMapping.getMenu();
                    RestaurantsEntity restaurant = menu.getRestaurants();

                    totalCarbohydrates += menu.getMenuCarbohydrate() != null ? menu.getMenuCarbohydrate() : 0.0;
                    totalProteins += menu.getMenuProtein() != null ? menu.getMenuProtein() : 0.0;
                    totalFats += menu.getMenuFat() != null ? menu.getMenuFat() : 0.0;
                    totalCalories += menu.getMenuCalories() != null ? menu.getMenuCalories() : 0;
                    int menuCost = menu.getMenuPrice() != null ? menu.getMenuPrice() : 0;
                    totalCost += menuCost;

                    menuEntries.add(Map.of(
                            "menu_name", menu.getMenuName(),
                            "carbohydrates", menu.getMenuCarbohydrate(),
                            "proteins", menu.getMenuProtein(),
                            "fats", menu.getMenuFat(),
                            "calories", menu.getMenuCalories(),
                            "cost", menuCost,
                            "restaurant_type", restaurant.getRestaurantsType().name()
                    ));

                    String restaurantType = restaurant.getRestaurantsType().name();
                    restaurantTypeCount.put(restaurantType, restaurantTypeCount.getOrDefault(restaurantType, 0) + 1);
                }
            }
        }

        // 평균값 계산
        double averageCarbohydrates = totalCarbohydrates / dayCount;
        double averageProteins = totalProteins / dayCount;
        double averageFats = totalFats / dayCount;
        double averageCalories = (double) totalCalories / dayCount;
        double costAvg = (double) totalCost / dayCount;
        // 수집된 데이터를 모두 포함한 Map 반환
        Map<String, Object> collectedData = new HashMap<>();
        collectedData.put("user", user);
        collectedData.put("yearMonth", yearMonth);
        collectedData.put("goalWeight", goal.getGoalWeight());
        collectedData.put("goalCost", goal.getGoalCost());
        collectedData.put("startWeight", startWeight);
        collectedData.put("endWeight", endWeight);
        collectedData.put("carbAvg", averageCarbohydrates);
        collectedData.put("proteinAvg", averageProteins);
        collectedData.put("fatAvg", averageFats);
        collectedData.put("kcalAvg", averageCalories);
        collectedData.put("totalCost", totalCost);
        collectedData.put("costAvg", costAvg);
        collectedData.put("restaurantTypeCount", restaurantTypeCount);
        collectedData.put("menuEntries", menuEntries);
        collectedData.put("weightRecords", processedWeightRecords);

        return collectedData;
    }

    public Map<String, Object> prepareFrontendResponse(Map<String, Object> collectedData) {
        // collectMonthReport에서 필요한 데이터 추출
        List<Map<String, Object>> menuEntries = (List<Map<String, Object>>) collectedData.get("menuEntries");

        // 메뉴 이름으로 그룹화하고 칼로리와 비용 합산
        Map<String, Map<String, Object>> groupedMenuEntries = menuEntries.stream()
                .collect(Collectors.toMap(
                        entry -> entry.get("menu_name").toString(),
                        entry -> new HashMap<>(Map.of(
                                "menu_name", entry.get("menu_name"),
                                "calories", entry.get("calories") != null ? ((Number) entry.get("calories")).doubleValue() : 0.0,
                                "cost", entry.get("cost") != null ? ((Number) entry.get("cost")).doubleValue() : 0.0
                        )),
                        (existing, newEntry) -> {
                            existing.put("calories", ((Number) existing.get("calories")).doubleValue() + ((Number) newEntry.get("calories")).doubleValue());
                            existing.put("cost", ((Number) existing.get("cost")).doubleValue() + ((Number) newEntry.get("cost")).doubleValue());
                            return existing;
                        }
                ));

        // 그룹화된 데이터를 리스트로 변환하여 칼로리와 비용으로 각각 정렬
        List<Map<String, Object>> kcalRanking = groupedMenuEntries.values().stream()
                .sorted(Comparator.comparingDouble(entry -> ((Number) ((Map<String, Object>) entry).get("calories")).doubleValue()).reversed())
                .limit(10)
                .collect(Collectors.toList());

        List<Map<String, Object>> costRanking = groupedMenuEntries.values().stream()
                .sorted(Comparator.comparingDouble(entry -> ((Number) ((Map<String, Object>) entry).get("cost")).doubleValue()).reversed())
                .limit(10)
                .collect(Collectors.toList());

        Map<String, Integer> restaurantTypeCount = (Map<String, Integer>) collectedData.get("restaurantTypeCount");

        // 일별 비용 계산을 위한 초기화
        String yearMonth = collectedData.get("yearMonth").toString();
        LocalDate startDate = LocalDate.parse(yearMonth + "-01");
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<Integer> dailyCosts = new ArrayList<>(Collections.nCopies(endDate.getDayOfMonth(), 0));

        // 일별 비용 계산
        List<DailyDiaryEntity> monthlyDiaries = dailyDiaryRepository.findByUserAndDateBetween((UserEntity) collectedData.get("user"), startDate, endDate);
        for (DailyDiaryEntity diary : monthlyDiaries) {
            int day = diary.getDate().getDayOfMonth() - 1;
            int dailyTotalCost = 0;

            for (DiaryEntity diaryEntity : diary.getDiaryEntities()) {
                for (DiaryMappingEntity diaryMapping : diaryEntity.getDiaryMapping()) {
                    MenuEntity menu = diaryMapping.getMenu();
                    dailyTotalCost += menu.getMenuPrice() != null ? menu.getMenuPrice() : 0;
                }
            }
            dailyCosts.set(day, dailyCosts.get(day) + dailyTotalCost);
        }

        // 프론트엔드에 반환할 데이터 구성
        Map<String, Object> finalReport = new HashMap<>();
        finalReport.put("monthly_weight_records", collectedData.get("weightRecords"));
        finalReport.put("cost_avg", collectedData.get("costAvg"));
        finalReport.put("total_cost", collectedData.get("totalCost"));
        finalReport.put("average_calories", collectedData.get("kcalAvg"));
        finalReport.put("kcal_ranking", kcalRanking);
        finalReport.put("cost_ranking", costRanking);
        finalReport.put("restaurant_type_count", restaurantTypeCount);
        finalReport.put("monthly_cost_records", dailyCosts);

        return finalReport;
    }
}
