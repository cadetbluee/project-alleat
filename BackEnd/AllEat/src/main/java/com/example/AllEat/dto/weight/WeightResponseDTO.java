package com.example.AllEat.dto.weight;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class WeightResponseDTO {
    private Integer id;
    private Timestamp createdAt;
    private double weight;

    public WeightResponseDTO(Integer id, Timestamp createdAt, double weight) {
        this.id = id;
        this.createdAt = createdAt;
        this.weight = weight;
    }
}
