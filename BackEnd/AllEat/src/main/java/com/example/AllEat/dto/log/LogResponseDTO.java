package com.example.AllEat.dto.log;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogResponseDTO {
    private String date; // 해당 날짜
    private List<DiaryDTO> diaries; // 해당 날짜에 기록된 다이어리 리스트

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiaryDTO {

        @JsonProperty("diary_kcal")
        private int diaryKcal; // 다이어리의 총 칼로리

        @JsonProperty("diary_cost")
        private int diaryCost; // 다이어리의 총 비용

        @JsonProperty("diary_time")
        private String diaryTime; // 식사 시간 (BREAKFAST, LUNCH, DINNER 등)

        private List<MenuDTO> menus; // 다이어리에 포함된 메뉴 리스트
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MenuDTO {
        @JsonProperty("menu_name")
        private String menuName; // 메뉴 이름

        @JsonProperty("restaurant_name")
        private String restaurantName; // 레스토랑 이름

        @JsonProperty("menu_kcal")
        private int menuKcal; // 메뉴의 칼로리

        @JsonProperty("menu_cost")
        private int menuCost; // 메뉴의 비용
    }
}
