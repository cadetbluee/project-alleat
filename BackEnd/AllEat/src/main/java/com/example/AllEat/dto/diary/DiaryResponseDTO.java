package com.example.AllEat.dto.diary;

import com.example.AllEat.entity.DiaryEntity;
import com.example.AllEat.entity.DiaryMappingEntity;
import com.example.AllEat.entity.MenuEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiaryResponseDTO {

    @JsonProperty("diary_id")
    private Integer diaryId;

    @JsonProperty("diary_mappings")
    private List<DiaryMappingConvertDTO> diaryMappings;

    @Getter
    public static class DiaryMappingConvertDTO{
        private String menuName;
        private Integer personCount;
        private Integer calories;
        private Integer price;

        public DiaryMappingConvertDTO(DiaryMappingEntity diaryMapping) {
            this.menuName = diaryMapping.getMenu().getMenuName();
            this.personCount = diaryMapping.getPersonCount();
            this.calories = diaryMapping.getMenu().getMenuCalories();
            this.price = diaryMapping.getMenu().getMenuPrice();
        }

    }
    public void fromEntity(DiaryEntity diary, List<DiaryMappingEntity> diaryMappingEntityList) {
        this.diaryId = diary.getId();
        diaryMappings = new ArrayList<>();
        for (DiaryMappingEntity diaryMapping : diaryMappingEntityList){
            this.diaryMappings.add(new DiaryMappingConvertDTO(diaryMapping));
        }
    }
}
