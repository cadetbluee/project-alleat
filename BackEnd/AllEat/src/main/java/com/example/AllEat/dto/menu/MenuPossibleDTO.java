package com.example.AllEat.dto.menu;

import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuPossibleDTO {

    @JsonProperty("restaurants_id")
    private Integer restaurantsId;

    @JsonProperty("restaurants_name")
    private String restaurantsName;

    private List<MenuConvertDTO> menus;

    @JsonProperty("pay_transaction_id")
    private Integer payTransactionId;

    public MenuPossibleDTO(RestaurantsEntity restaurants, HashMap<Boolean,List<MenuEntity>> menuList, Integer payTransactionId) {
        this.restaurantsId = restaurants.getId();
        this.restaurantsName = restaurants.getRestaurantsName();
        this.menus = new ArrayList<>();
        for(MenuEntity menu : menuList.get(true)){
            this.menus.add(new MenuConvertDTO(menu, true));
        }
        for(MenuEntity menu : menuList.get(false)){
            this.menus.add(new MenuConvertDTO(menu, false));
        }

        this.payTransactionId = payTransactionId;
    }

    @Getter
    private static class MenuConvertDTO {
        private Integer menuId;
        private String menuName;
        private Integer price;
        private Integer menuType;
        private Integer menuCalories;
        private boolean favorite;

        public MenuConvertDTO(MenuEntity menu, boolean favorite) {
            this.menuId = menu.getId();
            this.menuName = menu.getMenuName();
            this.price = menu.getMenuPrice();
            this.menuType = menu.getMenuType();
            this.menuCalories = menu.getMenuCalories();
            this.favorite = favorite;
        }
    }
}
