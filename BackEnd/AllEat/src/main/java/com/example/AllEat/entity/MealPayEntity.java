package com.example.AllEat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "meal_pay")
public class MealPayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "amount")
    private Integer amount;

    @OneToOne
    @JoinColumn(name = "pay_transaction_id")
    @JsonIgnore
    private PayTransactionEntity payTransaction;

//    @ManyToOne
//    @JoinColumn(name = "diary_id")
//    private DiaryEntity diary;

    public void updateAmount(Integer amount) {
        this.amount = amount;
    }

}
