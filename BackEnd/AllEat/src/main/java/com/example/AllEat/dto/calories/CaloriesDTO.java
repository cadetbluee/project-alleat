package com.example.AllEat.dto.calories;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class CaloriesDTO {

    private LocalDate date;
    private int calories;
}
