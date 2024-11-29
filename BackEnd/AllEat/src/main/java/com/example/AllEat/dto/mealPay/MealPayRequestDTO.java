package com.example.AllEat.dto.mealPay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealPayRequestDTO {

    @JsonProperty("transaction_id")
    private Integer transactionId;

    @JsonProperty("amount")
    private Integer amount;
}
