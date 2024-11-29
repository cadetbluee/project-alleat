package com.example.AllEat.dto.user;

import com.example.AllEat.entity.AlarmEntity;
import com.example.AllEat.entity.GoalEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.entity.WeightEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserResponseDTO {

    @JsonProperty("email")
    private String email;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("social_login")
    private String socialLogin;

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

    @JsonProperty("weights")
    private List<WeightEntity> weights;

    @JsonProperty("alarms")
    private AlarmConvertDTO alarms;

    @JsonProperty("goals")
    private GoalConvertDTO goals;

    public void fromEntity(UserEntity userEntity) {
        this.email = userEntity.getEmail();
        this.userName = userEntity.getUserName();
        this.socialLogin = userEntity.getSocialLogin();
        this.profileUrl = userEntity.getProfileUrl();
        this.userHeight = userEntity.getUserHeight();
        this.userGender = userEntity.getUserGender();
        this.userAge = userEntity.getUserAge();
        this.activityAmount = userEntity.getActivityAmount();
        this.weights = userEntity.getWeights();
        this.goals = new GoalConvertDTO(userEntity.getGoals());
        this.alarms = new AlarmConvertDTO(userEntity.getAlarm());
    }

    @Getter
    public static class GoalConvertDTO {
        private double goalWeight;
        private Integer goalCost;
        private Integer goalKcal;
        private Timestamp createdAt;

        public GoalConvertDTO(GoalEntity goalEntity) {
            this.goalWeight = (goalEntity != null && goalEntity.getGoalWeight() != 0) ? goalEntity.getGoalWeight() : 0;
            this.goalCost = (goalEntity != null && goalEntity.getGoalCost() != null) ? goalEntity.getGoalCost() : null;
            this.goalKcal = (goalEntity!= null && goalEntity.getGoalKcal() != null) ? goalEntity.getGoalKcal() : null;
            this.createdAt = (goalEntity != null && goalEntity.getCreatedAt() != null) ? goalEntity.getCreatedAt() : null;
        }
    }

    @Getter
    public static class AlarmConvertDTO{
        private LocalTime breakfastAlarm;
        private LocalTime lunchAlarm;
        private LocalTime dinnerAlarm;

        public AlarmConvertDTO(AlarmEntity alarmEntity) {
            this.breakfastAlarm = (alarmEntity != null && alarmEntity.getBreakfastAlarm() != null) ? alarmEntity.getBreakfastAlarm() : null;
            this.lunchAlarm = (alarmEntity != null &&  alarmEntity.getLunchAlarm() != null) ? alarmEntity.getLunchAlarm() : null;
            this.dinnerAlarm = (alarmEntity != null &&  alarmEntity.getDinnerAlarm() != null) ? alarmEntity.getDinnerAlarm() : null;
        }
    }
}
