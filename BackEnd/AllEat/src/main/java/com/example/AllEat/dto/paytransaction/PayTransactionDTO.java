package com.example.AllEat.dto.paytransaction;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PayTransactionDTO {
    private Integer amount;

    @JsonProperty("transaction_type")
    private Integer transactionType;

    @JsonProperty("restaurant_id")
    private Integer restaurantId;

    @JsonProperty("transaction_date")
    private String transactionDate;
}
