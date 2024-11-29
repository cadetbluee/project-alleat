package com.example.AllEat.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserJoinDTO {
    @NotBlank(message = "Email is mandatory")

    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;

}
