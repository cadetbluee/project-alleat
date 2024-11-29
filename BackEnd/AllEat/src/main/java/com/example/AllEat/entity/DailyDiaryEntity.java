package com.example.AllEat.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "daily_diary")
public class DailyDiaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "daily_calories")
    private Integer dailyCalories;

    @OneToMany(mappedBy = "dailyDiary", orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
//    @JsonBackReference
    @Builder.Default
    private List<DiaryEntity> diaryEntities = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public void update(Integer calories, DiaryEntity diary) {
        this.dailyCalories = calories;
        this.diaryEntities.add(diary);
    }
}
