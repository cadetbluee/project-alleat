package com.example.AllEat.dto.menu;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MenuCreateDTO {

    @JsonProperty("restaurant_name")
    private String restaurantName;  // 가게 이름

    @JsonProperty("restaurant_type")
    private String restaurantType; // 가게 타입

    @JsonProperty("restaurant_id")
    private Integer restaurantId;  // 가게 ID (기존 가게를 참조하는 경우)

    @JsonProperty("menu_name")
    private String menuName;  // 메뉴 이름

    @JsonProperty("menu_calories")
    private Integer menuCalories;  // 메뉴 칼로리

    @JsonProperty("menu_carbohydrate")
    private Double menuCarbohydrate;  // 메뉴 탄수화물

    @JsonProperty("menu_protein")
    private Double menuProtein;  // 메뉴 단백질

    @JsonProperty("menu_fat")
    private Double menuFat;  // 메뉴 지방

    @JsonProperty("menu_price")
    private Integer menuPrice;  // 메뉴 가격

    @JsonProperty("menu_type")
    private Integer menuType;  // 메뉴 타입 (단위: 예, GRAM, ML 등)

    @JsonProperty("menu_value")
    private Double menuValue;  // 메뉴 값 (단위에 따른 값)

    // Getters and Setters
    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getRestaurantType() {
        return restaurantType;
    }

    public void setRestaurantType(String restaurantType) {
        this.restaurantType = restaurantType;
    }

    public Integer getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Integer restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public Integer getMenuCalories() {
        return menuCalories;
    }

    public void setMenuCalories(Integer menuCalories) {
        this.menuCalories = menuCalories;
    }

    public Double getMenuCarbohydrate() {
        return menuCarbohydrate;
    }

    public void setMenuCarbohydrate(Double menuCarbohydrate) {
        this.menuCarbohydrate = menuCarbohydrate;
    }

    public Double getMenuProtein() {
        return menuProtein;
    }

    public void setMenuProtein(Double menuProtein) {
        this.menuProtein = menuProtein;
    }

    public Double getMenuFat() {
        return menuFat;
    }

    public void setMenuFat(Double menuFat) {
        this.menuFat = menuFat;
    }

    public Integer getMenuPrice() {
        return menuPrice;
    }

    public void setMenuPrice(Integer menuPrice) {
        this.menuPrice = menuPrice;
    }

    public Integer getMenuType() {
        return menuType;
    }

    public void setMenuType(Integer menuType) {
        this.menuType = menuType;
    }

    public Double getMenuValue() {
        return menuValue;
    }

    public void setMenuValue(Double menuValue) {
        this.menuValue = menuValue;
    }
}
