package com.example.AllEat.dto.log;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogPayResponseDTO {
    private String date;              // 트랜잭션 날짜

    @JsonProperty("restaurants_name")
    private String restaurantsName;    // 레스토랑 이름

    @JsonProperty("restaurants_type")
    private String restaurantsType;    // 레스토랑 타입 (레스토랑, 마트, 배달, 집밥 등)

    private Integer amount;            // 거래 금액
}
