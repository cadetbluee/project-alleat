package com.example.AllEat.dto.user;

import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String role;
    private String name;
    private int userAge;
    private Double userHeight;
    @Deprecated
    private String username;
    private String email;
    private int userGender;
}
