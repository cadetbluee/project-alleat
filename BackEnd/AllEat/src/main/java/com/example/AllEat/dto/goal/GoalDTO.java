package com.example.AllEat.dto.goal;

import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoalDTO {
    @JsonProperty("goal_weight")
    private double goalWeight;
    @JsonProperty("goal_cost")
    private Integer goalCost;
}
