package com.example.AllEat.dto.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetailDataDTO {
    @JsonProperty("menu_id")
    private Integer menuId;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("menu_price")
    private Integer menuPrice;

    @JsonProperty("menu_calories")
    private Integer menuCalories;

    @JsonProperty("restaurants_type")
    private String restaurantsType;

    @JsonProperty("restaurants_name")
    private String restaurantsName;

    @JsonProperty("person_count")
    private Integer personCount;
}
