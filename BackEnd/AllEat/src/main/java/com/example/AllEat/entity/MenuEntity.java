package com.example.AllEat.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "menu")
public class MenuEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "restaurants_id", nullable = false)
    @JsonIgnore  // 순환 참조 방지
    private RestaurantsEntity restaurants;

    @Column(name = "menu_name", nullable = false)
    private String menuName;

    @Column(name = "menu_price", nullable = false)
    private Integer menuPrice;

    @Column(name = "menu_calories")
    private Integer menuCalories;

    @Column(name = "menu_carbohydrate", nullable = true)
    private Double menuCarbohydrate;  // 탄수화물 (g)

    @Column(name = "menu_protein", nullable = true)
    private Double menuProtein;  // 단백질 (g)

    @Column(name = "menu_fat", nullable = true)
    private Double menuFat;  // 지방 (g)

    @Column(name = "menu_type", nullable = false)
    private Integer menuType;  // 0 = COUNT, 1 = GRAM, 2 = ML

    @Column(name = "menu_value", nullable = false)
    private double menuValue;

    // 즐겨찾기와 1:1 관계 추가할 예정
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FavoriteEntity> favorite;

    @OneToMany(mappedBy = "menu", orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DiaryMappingEntity> diaryMappings;

    @OneToOne(mappedBy = "menu", orphanRemoval = true)
    private AutoEntity auto;

    // 레스토랑 이름과 타입을 가져오기 위한 메서드
    public String getRestaurantsName() {
        return this.restaurants != null ? this.restaurants.getRestaurantsName() : null;
    }

    public String getRestaurantsType() {
        return this.restaurants != null ? this.restaurants.getRestaurantsType().getType() : null;
    }
}
