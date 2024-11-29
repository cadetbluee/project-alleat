package com.example.AllEat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "day_report")
public class DayReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "day_report_id")
    private Integer dayReportId; // PK 값

    @Column(name = "report_day", nullable = false)
    private LocalDate reportDay; // 날짜 (YYYY-MM-DD)

    @Column(name = "gpt_response", columnDefinition = "TEXT")
    private String gptResponse; // 총평

    // UserEntity와의 다대일 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // 외래 키 설정
    private UserEntity user;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt; // 생성 날짜
}
