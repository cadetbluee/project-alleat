package com.example.AllEat.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.YearMonth;

@Entity
@Getter
@Setter
@Table(name = "monthly_meal_pay")
public class MonthlyMealPayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "date", nullable = false)
    private YearMonth date; // YearMonth 타입으로 날짜 저장

}
