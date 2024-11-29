package com.example.AllEat.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "food_info")
public class FoodInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "menu_name", nullable = false)
    private String menuName;

    @Column(name = "menu_weight", nullable = false)
    private Double menuWeight;

    @Column(name = "menu_calories", nullable = false)
    private Double menuCalories;

    @Column(name = "menu_carbohydrate", nullable = true)
    private Double menuCarbohydrate;  // 탄수화물 (g)

    @Column(name = "menu_protein", nullable = true)
    private Double menuProtein;  // 단백질 (g)

    @Column(name = "menu_fat", nullable = true)
    private Double menuFat;  // 지방 (g)

}
