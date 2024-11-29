package com.example.AllEat.entity;

import com.example.AllEat.dto.alarm.AlarmDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Alarm")
public class AlarmEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    @Column(name = "breakfast_alarm", nullable = true)
    private LocalTime breakfastAlarm;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    @Column(name = "lunch_alarm", nullable = true)
    private LocalTime lunchAlarm;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    @Column(name = "dinner_alarm", nullable = true)
    private LocalTime dinnerAlarm;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public void updateAlarm(AlarmDTO alarm) {
        this.breakfastAlarm = alarm.getBreakfastAlarm();
        this.lunchAlarm = alarm.getLunchAlarm();
        this.dinnerAlarm = alarm.getDinnerAlarm();
    }
}
