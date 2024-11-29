package com.example.AllEat.dto.auto;

import com.example.AllEat.entity.AutoEntity;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AutoResponseDTO {

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("restaurants_name")
    private String restaurantsName;

    @JsonProperty("restaurants_type")
    private RestaurantsEntity.RestaurantsType restaurantsType;

    @JsonProperty("amount")
    private Integer amount;

    public void FromEntity(AutoEntity autoEntity){
        this.menuName = autoEntity.getMenu().getMenuName();
        this.restaurantsName = autoEntity.getMenu().getRestaurants().getRestaurantsName();
        this.restaurantsType = autoEntity.getMenu().getRestaurants().getRestaurantsType();
        this.amount = autoEntity.getAmount();
    }
}
