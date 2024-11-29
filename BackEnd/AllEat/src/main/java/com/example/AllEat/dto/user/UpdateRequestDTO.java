package com.example.AllEat.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequestDTO {

    @JsonProperty(value = "password1", required = false)
    private String password1;

    @JsonProperty(value = "password2", required = false)
    private String password2;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("user_height")
    private Double userHeight;

    @JsonProperty("user_gender")
    private Integer userGender;

    @JsonProperty("user_age")
    private Integer userAge;

    @JsonProperty("activity_amount")
    private Integer activityAmount;

    @JsonProperty("social_login")
    private String socialLogin;

    @JsonProperty("fcm_token")
    private String fcmToken;

}
