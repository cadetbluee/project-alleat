//package com.example.AllEat.service;
//
//
//import org.springframework.stereotype.Service;
//import org.apache.commons.csv.CSVFormat;
//import org.apache.commons.csv.CSVParser;
//import org.apache.commons.csv.CSVPrinter;
//import org.apache.commons.csv.CSVRecord;
//import org.springframework.stereotype.Service;
//
//import java.io.FileReader;
//import java.io.FileWriter;
//import java.io.IOException;
//import java.io.Reader;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class CsvComparisonService {
//    public void generateCombinedCsv(String foodInfoPath, String crawledDataPath, String outputCsvPath) throws IOException {
//        // 1. foodInfo.csv 파일 읽기 (음식명 -> 영양 성분)
//        Map<String, FoodInfo> foodInfoMap = readFoodInfoCsv(foodInfoPath);
//
//        // 2. Crawled Data CSV 읽기 및 결합된 CSV 파일 생성
//        try (Reader reader = new FileReader(crawledDataPath);
//             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader());
//             FileWriter out = new FileWriter(outputCsvPath);
//             // 이미 존재하는 헤더에 맞춰 파일 생성
//             CSVPrinter csvPrinter = new CSVPrinter(out, CSVFormat.DEFAULT.withHeader("음식점 이름", "메뉴 이름", "메뉴 가격", "에너지", "탄수화물", "단백질", "지방"))) {
//
//            List<CSVRecord> records = csvParser.getRecords();
//
//            // 3. Crawled Data의 각 메뉴 이름이 foodInfo의 음식명을 포함하거나 같을 경우, 영양 성분 추가
//            for (CSVRecord record : records) {
//                String restaurantName = record.get("음식점 이름");
//                String menuName = record.get("메뉴 이름");
//                String menuPrice = record.get("메뉴 가격");
//                String energy = record.get("에너지");
//                String carbohydrate = record.get("탄수화물");
//                String protein = record.get("단백질");
//                String fat = record.get("지방");
//
//                // 음식명이 메뉴 이름에 포함되거나 같은 경우 영양 정보 추가 (빈 칸만 업데이트)
//                FoodInfo foodInfo = foodInfoMap.entrySet()
//                        .stream()
//                        .filter(entry -> menuName.contains(entry.getKey()))  // 메뉴 이름에 음식명이 포함되거나 같을 때
//                        .map(Map.Entry::getValue)
//                        .findFirst()
//                        .orElse(new FoodInfo(energy, carbohydrate, protein, fat));  // 이미 값이 있으면 기본값 사용
//
//                // 4. 결합된 CSV 파일에 데이터 쓰기
//                csvPrinter.printRecord(restaurantName, menuName, menuPrice, foodInfo.getEnergy(), foodInfo.getCarbohydrate(), foodInfo.getProtein(), foodInfo.getFat());
//            }
//
//            System.out.println("결합된 CSV 파일이 성공적으로 생성되었습니다: " + outputCsvPath);
//        }
//    }
//
//    // FoodInfo CSV를 읽고, 음식명 -> FoodInfo 객체를 맵에 저장
//    private Map<String, FoodInfo> readFoodInfoCsv(String filePath) throws IOException {
//        Map<String, FoodInfo> foodInfoMap = new HashMap<>();
//        try (Reader reader = new FileReader(filePath);
//             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
//
//            for (CSVRecord record : csvParser) {
//                String foodName = record.get("음식 명");
//                String energy = record.get("에너지(kcal)");
//                String carbohydrate = record.get("탄수화물(g)");
//                String protein = record.get("단백질(g)");
//                String fat = record.get("지방(g)");
//
//                foodInfoMap.put(foodName, new FoodInfo(energy, carbohydrate, protein, fat));
//            }
//        }
//        return foodInfoMap;
//    }
//
//    // 영양 성분 데이터를 담기 위한 내부 클래스
//    private static class FoodInfo {
//        private String energy;
//        private String carbohydrate;
//        private String protein;
//        private String fat;
//
//        public FoodInfo(String energy, String carbohydrate, String protein, String fat) {
//            this.energy = energy;
//            this.carbohydrate = carbohydrate;
//            this.protein = protein;
//            this.fat = fat;
//        }
//
//        public String getEnergy() {
//            return energy;
//        }
//
//        public String getCarbohydrate() {
//            return carbohydrate;
//        }
//
//        public String getProtein() {
//            return protein;
//        }
//
//        public String getFat() {
//            return fat;
//        }
//    }
//}
