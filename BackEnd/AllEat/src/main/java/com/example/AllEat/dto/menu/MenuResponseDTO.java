package com.example.AllEat.dto.menu;

import com.example.AllEat.entity.MenuEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuResponseDTO {

    @JsonProperty("restaurants_name")
    private String restaurantName;
    //레스토랑 아이디 레스토랑 타입
    @JsonProperty("restaurants_id")
    private String restaurantId;

    @JsonProperty("restaurants_type")
    private String restaurantType;

    @JsonProperty("menu_id")
    private Integer menuId;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("menu_price")
    private Integer menuPrice;

    @JsonProperty("menu_calories")
    private Integer menuCalories;

    @JsonProperty("menu_carbohydrate")
    private Double menuCarbohydrate;

    @JsonProperty("menu_protein")
    private Double menuProtein;

    @JsonProperty("menu_fat")
    private Double menuFat;

    @JsonProperty("menu_type")
    private Integer menuType;

    @JsonProperty("menu_value")
    private double menuValue;

    @JsonProperty("favorite")
    private Boolean favorite;

    public MenuResponseDTO(MenuEntity menu, boolean isFavorite){
        this.restaurantName = menu.getRestaurants().getRestaurantsName();
        this.menuId = menu.getId();
        this.menuName = menu.getMenuName();
        this.menuPrice = menu.getMenuPrice();
        this.menuCalories = menu.getMenuCalories();
        this.menuCarbohydrate = menu.getMenuCarbohydrate();
        this.menuFat = menu.getMenuFat();
        this.menuProtein = menu.getMenuProtein();
        this.menuType = menu.getMenuType();
        this.menuValue = menu.getMenuValue();
        this.favorite = isFavorite;

    }
}
