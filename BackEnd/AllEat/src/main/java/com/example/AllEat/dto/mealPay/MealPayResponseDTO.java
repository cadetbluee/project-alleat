package com.example.AllEat.dto.mealPay;

import com.example.AllEat.entity.PayTransactionEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealPayResponseDTO {

    @JsonProperty("amount")
    private Integer amount;

    @JsonProperty("restaurants_name")
    private String restaurantsName;

    @JsonProperty("pay_transaction_id")
    private Integer payTransactionId;

}
