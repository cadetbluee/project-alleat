package com.example.AllEat.dto.favorite;

import com.example.AllEat.entity.FavoriteEntity;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteResponseDTO {

    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("menu_id")
    private Integer menuId;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("favorite_id")
    private Integer favoriteId;

    public FavoriteResponseDTO(UserEntity user, MenuEntity menu, FavoriteEntity favorite) {
        this.userId = user.getId();
        this.userName = user.getUserName();
        this.menuId = menu.getId();
        this.menuName = menu.getMenuName();
        this.favoriteId = favorite.getId();
    }
}
