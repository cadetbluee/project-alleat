package com.example.AllEat.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "diary")
public class DiaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    private DiaryTime diaryTime;
    
    @Column(name = "meal_calories")
    private Integer mealCalories;

    public enum DiaryTime {
        BREAKFAST,
        LUNCH,
        DINNER,
        SNACK
    }

    @OneToMany(mappedBy = "diary",orphanRemoval = true, fetch = FetchType.LAZY)
//    @JsonManagedReference
    @JsonBackReference
    @Builder.Default
    private List<DiaryMappingEntity> diaryMapping = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "daily_diary_id")
//    @JsonManagedReference
    @JsonBackReference
    private DailyDiaryEntity dailyDiary;

    @Column(name = "daily_price")
    private Integer dailyPrice;


    public void updateDetails(Integer calories, Integer price) {

        this.mealCalories = calories;
        this.dailyPrice = price;
    }

//    @OneToMany(mappedBy = "diary", orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<MealPayEntity> mealpay;

//    public void updateMapping(DiaryMappingEntity diaryMapping) {
//        this.diaryMapping.add(diaryMapping);
//    }
}
