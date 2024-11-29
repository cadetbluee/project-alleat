package com.example.AllEat.dto.favorite;

import com.example.AllEat.dto.menu.MenuDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
public class FavoriteDTO {

    @JsonProperty("favorite_id")
    private Integer favoriteId;
    @JsonProperty("menu")
    private MenuDTO menu;  // 즐겨찾기된 메뉴 정보

    // 기본 생성자
    public FavoriteDTO() {}

    // 매개변수가 있는 생성자
    public FavoriteDTO(Integer favoriteId, MenuDTO menu) {
        this.favoriteId = favoriteId;
        this.menu = menu;
    }

    // Getters and Setters
    public Integer getFavoriteId() {
        return favoriteId;
    }

    public void setFavoriteId(Integer favoriteId) {
        this.favoriteId = favoriteId;
    }

    public MenuDTO getMenu() {
        return menu;
    }

    public void setMenu(MenuDTO menu) {
        this.menu = menu;
    }
}
