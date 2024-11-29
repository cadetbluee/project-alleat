package com.example.AllEat.dto.user;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailCheckDTO {
    @JsonProperty("is_new")
    private boolean isNew;

}
