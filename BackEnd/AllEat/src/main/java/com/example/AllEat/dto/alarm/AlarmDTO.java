package com.example.AllEat.dto.alarm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalTime;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlarmDTO {

    @JsonProperty("breakfast_alarm")
    private LocalTime breakfastAlarm;

    @JsonProperty("lunch_alarm")
    private LocalTime lunchAlarm;

    @JsonProperty("dinner_alarm")
    private LocalTime dinnerAlarm;
}
