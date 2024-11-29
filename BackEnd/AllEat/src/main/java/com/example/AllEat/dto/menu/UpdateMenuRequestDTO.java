package com.example.AllEat.dto.menu;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMenuRequestDTO {

    @JsonProperty("diary_id")
    private Integer diaryId;

    @JsonProperty("menus")
    private List<MenuRequestDTO> menus;
}
