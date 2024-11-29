package com.example.AllEat.dto.menu;

import com.example.AllEat.entity.DailyDiaryEntity;
import com.example.AllEat.entity.DiaryEntity;
import com.example.AllEat.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyDiaryResponseDTO {

    @JsonProperty("daily_diary_id")
    private Integer dailyDiaryId;

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("daily_calories")
    private Integer dailyCalories;

    @JsonProperty("diary_list")
    private List<DiaryConvertDTO> diarys;

    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("email")
    private String email;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("profile_url")
    private String profileUrl;

    @JsonProperty("user_height")
    private Double userHeight;

    @JsonProperty("user_gender")
    private Integer userGender;

    @JsonProperty("user_age")
    private Integer userAge;

    @JsonProperty("activity_amount")
    private Integer activityAmount;

    public void fromEntity(DailyDiaryEntity dailyDiaryEntity, UserEntity userEntity) {
        this.dailyDiaryId = dailyDiaryEntity.getId();
        this.date = dailyDiaryEntity.getDate();
        this.dailyCalories = dailyDiaryEntity.getDailyCalories();
        this.diarys = new ArrayList<>();
        for (DiaryEntity diary : dailyDiaryEntity.getDiaryEntities()) {
            this.diarys.add(new DiaryConvertDTO(diary));
        }
        this.userId = userEntity.getId();
        this.email = userEntity.getEmail();
        this.userName = userEntity.getUserName();
        this.profileUrl = userEntity.getProfileUrl();
        this.userHeight = userEntity.getUserHeight();
        this.userGender = userEntity.getUserGender();
        this.userAge = userEntity.getUserAge();
        this.activityAmount = userEntity.getActivityAmount();
    }

    @Getter
    public static class DiaryConvertDTO{
        private Integer diaryId;
        private DiaryEntity.DiaryTime diaryTime;
        private Integer mealCalories;
        private Integer dailyPrice;

        public DiaryConvertDTO(DiaryEntity diary) {
            this.diaryId = diary.getId();
            this.diaryTime = diary.getDiaryTime();
            this.mealCalories = diary.getMealCalories();
            this.dailyPrice = diary.getDailyPrice();
        }
    }
}
