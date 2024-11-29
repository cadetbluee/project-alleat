package com.example.AllEat.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "diary_mapping")
public class DiaryMappingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "person_count")
    private Integer personCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    @JsonBackReference // 자식 측에 해당하는 어노테이션
    private DiaryEntity diary;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    @JsonBackReference // 자식 측에 해당하는 어노테이션
    private MenuEntity menu;

}
