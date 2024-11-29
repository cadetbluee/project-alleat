package com.example.AllEat.service;

import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.repository.MenuRepository;
import com.example.AllEat.repository.RestaurantsRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CsvToDatabaseService {

    private final RestaurantsRepository restaurantsRepository;
    private final MenuRepository menuRepository;

    @Transactional
    public void saveCsvToDatabase(String combinedCsvPath, String foodInfoPath) {
        Map<String, FoodInfo> foodInfoMap = readFoodInfoCsv(foodInfoPath);

        String outputCsvPath = "combinedData.csv";
        try (Reader reader = new FileReader(combinedCsvPath);
             BufferedWriter writer = new BufferedWriter(new FileWriter(outputCsvPath));
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                     .withHeader("음식점 이름", "메뉴 이름", "메뉴 가격", "에너지", "탄수화물", "단백질", "지방"));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : csvParser) {
                String restaurantName = record.get("음식점 이름").trim();
                String menuName = record.get("메뉴 이름").trim();
                String menuPriceStr = record.get("메뉴 가격").trim();

                int menuPrice;
                try {
                    menuPrice = Integer.parseInt(menuPriceStr.replaceAll("[^0-9]", "").trim());
                } catch (NumberFormatException e) {
                    menuPrice = 0;
                }

                String normalizedMenuName = normalizeString(menuName);

                // 메뉴 이름과 음식명을 비교할 때 모든 공백 제거
                FoodInfo foodInfo = foodInfoMap.entrySet()
                        .stream()
                        .filter(entry -> isNameMatched(normalizedMenuName, normalizeString(entry.getKey())))
                        .map(Map.Entry::getValue)
                        .findFirst()
                        .orElse(new FoodInfo(0, 0.0, 0.0, 0.0));  // 매칭되지 않을 경우 기본값 사용

                // CSV 파일에 결합된 데이터 저장
                csvPrinter.printRecord(
                        restaurantName,
                        menuName,
                        menuPrice,
                        foodInfo.getCalories(),
                        foodInfo.getCarbohydrate(),
                        foodInfo.getProtein(),
                        foodInfo.getFat()
                );

                saveToDatabase(restaurantName, menuName, menuPrice, foodInfo);
            }
            System.out.println("CSV 파일을 성공적으로 결합하고 저장했습니다!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveToDatabase(String restaurantName, String menuName, int menuPrice, FoodInfo foodInfo) {
        RestaurantsEntity restaurant = findOrCreateRestaurant(restaurantName);

        MenuEntity menuEntity = new MenuEntity();
        menuEntity.setRestaurants(restaurant);
        menuEntity.setMenuName(menuName);
        menuEntity.setMenuPrice(menuPrice);
        menuEntity.setMenuCalories(foodInfo.getCalories() != null ? foodInfo.getCalories() : 0);
        menuEntity.setMenuCarbohydrate(foodInfo.getCarbohydrate() != null ? foodInfo.getCarbohydrate() : 0.0);
        menuEntity.setMenuProtein(foodInfo.getProtein() != null ? foodInfo.getProtein() : 0.0);
        menuEntity.setMenuFat(foodInfo.getFat() != null ? foodInfo.getFat() : 0.0);
        menuEntity.setMenuType(0);
        menuEntity.setMenuValue(1.0);

        menuRepository.save(menuEntity);
    }

    private RestaurantsEntity findOrCreateRestaurant(String restaurantName) {
        return restaurantsRepository.findByRestaurantsName(restaurantName)
                .orElseGet(() -> {
                    RestaurantsEntity newRestaurant = new RestaurantsEntity();
                    newRestaurant.setRestaurantsName(restaurantName);
                    newRestaurant.setRestaurantsType(RestaurantsEntity.RestaurantsType.RESTAURANTS);
                    return restaurantsRepository.save(newRestaurant);
                });
    }

    private Map<String, FoodInfo> readFoodInfoCsv(String filePath) {
        Map<String, FoodInfo> foodInfoMap = new HashMap<>();
        try (Reader reader = new FileReader(filePath);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {

            for (CSVRecord record : csvParser) {
                String foodName = normalizeString(record.get("음 식 명").trim());

                // 에너지 값 소수점을 제거하고 정수로 변환 (소수점을 포함한 경우 반올림 처리)
                Double rawCalories = parseDouble(record.get("에너지(kcal)").replaceAll("[^\\d.]", "").trim());
                Integer calories = (rawCalories != null) ? (int) Math.round(rawCalories) : 0;

                Double carbohydrate = parseDouble(record.get("탄수화물(g)").replaceAll("[^\\d.]", "").trim());
                Double protein = parseDouble(record.get("단백질(g)").replaceAll("[^\\d.]", "").trim());
                Double fat = parseDouble(record.get("지방(g)").replaceAll("[^\\d.]", "").trim());

                // 디버그용 출력으로 값이 제대로 읽히는지 확인
                System.out.printf("음식명: %s, 에너지: %d, 탄수화물: %.2f, 단백질: %.2f, 지방: %.2f\n",
                        foodName, calories, carbohydrate, protein, fat);

                foodInfoMap.put(foodName, new FoodInfo(calories, carbohydrate, protein, fat));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return foodInfoMap;
    }


    private boolean isNameMatched(String menuName, String foodName) {
        return menuName.contains(foodName) || foodName.contains(menuName);
    }

    private Integer parseInteger(String value) {
        try {
            return value.isEmpty() ? 0 : Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private Double parseDouble(String value) {
        try {
            return value.isEmpty() ? 0.0 : Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private String normalizeString(String str) {
        return str.replaceAll("\\s|\\(|\\)|\\[|\\]|[^\\p{L}\\p{N}]", "").toLowerCase();
    }

    private static class FoodInfo {
        private Integer calories;
        private Double carbohydrate;
        private Double protein;
        private Double fat;

        public FoodInfo(Integer calories, Double carbohydrate, Double protein, Double fat) {
            this.calories = calories;
            this.carbohydrate = carbohydrate;
            this.protein = protein;
            this.fat = fat;
        }

        public Integer getCalories() { return calories; }
        public Double getCarbohydrate() { return carbohydrate; }
        public Double getProtein() { return protein; }
        public Double getFat() { return fat; }
    }
}
