package com.example.AllEat.dto.restaurants;

import com.example.AllEat.dto.menu.MenuDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RestaurantsDTO {

    private Integer id;  // 레스토랑 ID

    @JsonProperty("restaurants_name")
    private String restaurantsName;  // 레스토랑 이름

    @JsonProperty("restaurants_type")
    private String restaurantsType;  // 레스토랑 타입

    @JsonProperty("menu")
    private List<MenuDTO> menu;  // 메뉴 리스트

    // 기본 생성자
    public RestaurantsDTO() {}

    // 매개변수가 있는 생성자
    public RestaurantsDTO(Integer id, String restaurantsName, String restaurantsType, List<MenuDTO> menu) {
        this.id = id;
        this.restaurantsName = restaurantsName;
        this.restaurantsType = restaurantsType;
        this.menu = menu;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public List<MenuDTO> getMenu() {
        return menu;
    }

    public void setMenu(List<MenuDTO> menu) {
        this.menu = menu;
    }
}
