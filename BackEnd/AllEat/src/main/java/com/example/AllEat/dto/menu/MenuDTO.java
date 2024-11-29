package com.example.AllEat.dto.menu;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MenuDTO {

    private Integer id;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("menu_calories")
    private Integer menuCalories;

    @JsonProperty("menu_carbohydrate")
    private Double menuCarbohydrate;

    @JsonProperty("menu_protein")
    private Double menuProtein;

    @JsonProperty("menu_fat")
    private Double menuFat;

    @JsonProperty("menu_price")
    private Integer menuPrice;

    @JsonProperty("menu_type")
    private Integer menuType;

    @JsonProperty("menu_value")
    private Double menuValue;

    @JsonProperty("restaurants_id")
    private Integer restaurantsId;

    // 기본 생성자
    public MenuDTO() {}

    // 매개변수가 있는 생성자
    public MenuDTO(Integer id, String menuName, Integer menuCalories, Double menuCarbohydrate,
                   Double menuProtein, Double menuFat, Integer menuPrice, Integer menuType, Double menuValue, Integer restaurantsId) {
        this.id = id;
        this.menuName = menuName;
        this.menuCalories = menuCalories;
        this.menuCarbohydrate = menuCarbohydrate;
        this.menuProtein = menuProtein;
        this.menuFat = menuFat;
        this.menuPrice = menuPrice;
        this.menuType = menuType;
        this.menuValue = menuValue;
        this.restaurantsId = restaurantsId; // 추가된 부분
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Integer getRestaurantsId() {
        return restaurantsId;
    }

    public void setRestaurantsId(Integer restaurantsId) {
        this.restaurantsId = restaurantsId;
    }
}
