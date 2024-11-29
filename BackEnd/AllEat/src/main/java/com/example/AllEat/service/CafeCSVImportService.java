package com.example.AllEat.service;

import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.repository.MenuRepository;
import com.example.AllEat.repository.RestaurantsRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

@Service
@RequiredArgsConstructor
public class CafeCSVImportService {

    private final RestaurantsRepository restaurantsRepository;
    private final MenuRepository menuRepository;

    public void importCafeData(String csvFilePath) {
        try (Reader reader = new FileReader(csvFilePath);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withHeader("카페 이름", "메뉴 이름", "메뉴 가격").withSkipHeaderRecord())) {

            for (CSVRecord record : csvParser) {
                try {
                    String cafeName = record.get("카페 이름");
                    String menuName = record.get("메뉴 이름");
                    String menuPriceString = record.get("메뉴 가격").trim();

                    // 메뉴 가격이 숫자인지 확인
                    if (!isNumeric(menuPriceString)) {
                        System.out.printf("잘못된 메뉴 가격 데이터: %s (카페: %s, 메뉴: %s) - 레코드를 건너뜁니다.%n", menuPriceString, cafeName, menuName);
                        continue;
                    }

                    int menuPrice = Integer.parseInt(menuPriceString);

                    // 카페 이름으로 RestaurantsEntity 조회, 없으면 새로 생성
                    RestaurantsEntity restaurant = restaurantsRepository.findByRestaurantsName(cafeName)
                            .orElseGet(() -> {
                                // 새로운 RestaurantsEntity 생성 및 필드 값 설정
                                RestaurantsEntity newRestaurant = new RestaurantsEntity();
                                newRestaurant.setRestaurantsName(cafeName);
                                newRestaurant.setRestaurantsType(RestaurantsEntity.RestaurantsType.valueOf("RESTAURANTS")); // 식당 유형을 'RESTAURANTS'로 설정
                                return restaurantsRepository.save(newRestaurant);
                            });

                    // MenuEntity 생성 및 필드 값 설정
                    MenuEntity menuEntity = new MenuEntity();
                    menuEntity.setRestaurants(restaurant); // 식당 ID 설정
                    menuEntity.setMenuName(menuName); // 메뉴 이름 설정
                    menuEntity.setMenuPrice(menuPrice); // 메뉴 가격 설정
                    menuEntity.setMenuType(0); // 메뉴 타입 (고정값 0)
                    menuEntity.setMenuValue(1.0); // 메뉴 수량 (고정값 1.0)
                    menuEntity.setMenuCarbohydrate(0.0); // 기본값 null
                    menuEntity.setMenuProtein(0.0); // 기본값 null
                    menuEntity.setMenuFat(0.0); // 기본값 null
                    menuEntity.setMenuCalories(0); // 기본값 null

                    menuRepository.save(menuEntity);
                } catch (NumberFormatException e) {
                    System.out.printf("숫자 형식 오류: %s - 레코드를 건너뜁니다.%n", e.getMessage());
                }
            }
            System.out.println("CSV 데이터를 데이터베이스에 성공적으로 저장했습니다.");

        } catch (IOException e) {
            System.out.println("CSV 파일을 읽는 중 오류 발생: " + e.getMessage());
        }
    }

    // 문자열이 숫자인지 확인하는 유틸리티 메서드
    private boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
