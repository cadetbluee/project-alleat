package com.example.AllEat.dto.favorite;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FavoriteCreateDTO {

    @JsonProperty("restaurant_id")
    private Integer restaurantId;

    @JsonProperty("menu_id")
    private Integer menuId;

    // Getters and setters
    public Integer getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Integer restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Integer getMenuId() {
        return menuId;
    }

    public void setMenuId(Integer menuId) {
        this.menuId = menuId;
    }
}