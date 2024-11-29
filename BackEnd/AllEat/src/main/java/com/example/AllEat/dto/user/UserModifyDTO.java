package com.example.AllEat.dto.user;
import lombok.Data;

@Data
public class UserModifyDTO {
    private String password;
    private String name;
    private int userAge;
    private int alarmTime;

}
