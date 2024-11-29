package com.example.AllEat.dto.menu;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MainDataDTO {

    @JsonProperty("day_kcal")
    private Integer dayKcal;

    @JsonProperty("day_carb")
    private Integer dayCarb;

    @JsonProperty("day_protein")
    private Integer dayProtein;

    @JsonProperty("day_fat")
    private Integer dayFat;

    @JsonProperty("day_cost")
    private Integer dayCost;

    @JsonProperty("day_diaries")
    private List<DiaryDetail> dayDiaries = new ArrayList<>();

    // Method to add diary detail
    public void addDiaryDetail(Integer diaryId, String diaryTime, Integer diaryKcal, Integer diaryCost) {
        DiaryDetail detail = new DiaryDetail(diaryId, diaryTime, diaryKcal, diaryCost);
        this.dayDiaries.add(detail);
    }

    @Data
    @AllArgsConstructor
    public static class DiaryDetail {
        @JsonProperty("diary_id")
        private Integer diaryId;

        @JsonProperty("diary_time")
        private String diaryTime;

        @JsonProperty("diary_kcal")
        private Integer diaryKcal;

        @JsonProperty("diary_cost")
        private Integer diaryCost;
    }
}
