package com.example.AllEat.service;

import com.example.AllEat.dto.data.DetailDataDTO;
import com.example.AllEat.entity.DiaryEntity;
import com.example.AllEat.entity.DiaryMappingEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.DiaryRepository;
import com.example.AllEat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.AllEat.repository.DiaryMappingRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class DetailDataService {

    @Autowired
    private DiaryRepository diaryRepository; // DiaryRepository 사용

    public Map<String, Object> getDiaryDetailsByDiaryId(Integer diaryId) {
        // diaryId를 사용하여 일기를 가져오기
        DiaryEntity diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new RuntimeException("Diary not found with id: " + diaryId));

        // 다이어리 총 영양 정보 계산을 위한 초기화
        AtomicInteger totalKcal = new AtomicInteger(0);
        AtomicReference<Double> totalCarbs = new AtomicReference<>(0.0);
        AtomicReference<Double> totalProtein = new AtomicReference<>(0.0);
        AtomicReference<Double> totalFat = new AtomicReference<>(0.0);

        // 각 DiaryMappingEntity에서 MenuEntity를 추출하여 DetailDataDTO로 변환하고, 영양 정보를 합산한다.
        List<DetailDataDTO> menus = diary.getDiaryMapping().stream()
                .map(mapping -> {
                    var menu = mapping.getMenu();
                    int personCount = mapping.getPersonCount() != null ? mapping.getPersonCount() : 1;

                    int adjustedCalories = menu.getMenuCalories() / personCount;
                    double adjustedCarbs = (menu.getMenuCarbohydrate() != null ? menu.getMenuCarbohydrate() : 0) / personCount;
                    double adjustedProtein = (menu.getMenuProtein() != null ? menu.getMenuProtein() : 0) / personCount;
                    double adjustedFat = (menu.getMenuFat() != null ? menu.getMenuFat() : 0) / personCount;
                    int adjustedPrice = menu.getMenuPrice() / personCount;

                    totalKcal.addAndGet(adjustedCalories);
                    totalCarbs.updateAndGet(v -> v + adjustedCarbs);
                    totalProtein.updateAndGet(v -> v + adjustedProtein);
                    totalFat.updateAndGet(v -> v + adjustedFat);

                    return new DetailDataDTO(
                            menu.getId(),
                            menu.getMenuName(),
                            adjustedPrice,
                            adjustedCalories,
                            menu.getRestaurants().getRestaurantsType().getType(),
                            menu.getRestaurants().getRestaurantsName(),
                            personCount
                    );
                })
                .collect(Collectors.toList());

        // 결과를 Map으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("diary_kcal", totalKcal.get());
        response.put("diary_carb", totalCarbs.get().intValue());
        response.put("diary_fat", totalFat.get().intValue());
        response.put("diary_protein", totalProtein.get().intValue());
        response.put("menus", menus);

        return response;
    }
}

