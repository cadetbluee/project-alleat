package com.example.AllEat.dto.restaurants;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RestaurantsCreateDTO {

    @JsonProperty("restaurants_name")
    private String restaurantsName;  // 레스토랑 이름
    @JsonProperty("restaurants_type")
    private String restaurantsType;  // 레스토랑 타입

    // 기본 생성자
    public RestaurantsCreateDTO() {}

    // 매개변수가 있는 생성자
    public RestaurantsCreateDTO(String restaurantsName, String restaurantsType) {
        this.restaurantsName = restaurantsName;
        this.restaurantsType = restaurantsType;
    }

    // Getters and Setters
    public String getRestaurantsName() {
        return restaurantsName;
    }

    public void setRestaurantsName(String restaurantsName) {
        this.restaurantsName = restaurantsName;
    }

    public String getRestaurantsType() {
        return restaurantsType;
    }

    public void setRestaurantsType(String restaurantsType) {
        this.restaurantsType = restaurantsType;
    }
}
