package com.example.AllEat.dto.menu;

import com.example.AllEat.entity.DiaryEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddMenuRequestDTO {

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("diary_time")
    private DiaryEntity.DiaryTime diaryTime;

    @JsonProperty("menus")
    private List<MenuRequestDTO> menus;

}
