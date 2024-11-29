package com.example.AllEat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "restaurants")
public class RestaurantsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "restaurants_name", nullable = false)
    private String restaurantsName;

    @Enumerated(EnumType.STRING)
    @Column(name = "restaurants_type", nullable = false)
    private RestaurantsType restaurantsType;

    // MenuEntity와 1대N 관계 설정
    @OneToMany(mappedBy = "restaurants", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MenuEntity> menuList;

    // RestaurantsType을 내부 static enum으로 정의
    public enum RestaurantsType {
        RESTAURANTS("restaurants"),
        MART("mart"),
        HOME("home"),
        DELIVERY("delivery");

        private final String type;

        RestaurantsType(String type) {
            this.type = type;
        }

        public String getType() {
            return type;
        }
    }
}
