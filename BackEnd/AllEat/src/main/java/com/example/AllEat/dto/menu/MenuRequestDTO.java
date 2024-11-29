package com.example.AllEat.dto.menu;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MenuRequestDTO {

    @JsonProperty("menu_id")
    private Integer menuId;

    @JsonProperty("person_count")
    private Integer personCount;
}
