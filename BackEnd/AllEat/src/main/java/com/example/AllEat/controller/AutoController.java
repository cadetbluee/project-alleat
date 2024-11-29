package com.example.AllEat.controller;

import com.example.AllEat.dto.auto.AutoResponseDTO;
import com.example.AllEat.entity.AutoEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.service.AutoService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/AllEat/record")
@RequiredArgsConstructor
public class AutoController {

    private final AutoService autoService;
    private final UserService userService;

    @PostMapping("/auto/{menuId}")
    public ResponseEntity<?> addAuto(HttpServletRequest request, @PathVariable(required = true) Integer menuId) {
        try {
            UserEntity findUser = userService.findByRequest(request);
            if (findUser != null) {
                AutoEntity autoEntity = autoService.addUserAuto(findUser, menuId);
                AutoResponseDTO autoResponse = autoService.convertDTO(autoEntity);
                return ResponseEntity.status(HttpStatus.OK).body(autoResponse);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/auto/{menuId}")
    public ResponseEntity<?> deleteAuto(HttpServletRequest request, @PathVariable(required = true) Integer menuId) {
        try {
            UserEntity findUser = userService.findByRequest(request);
            if (findUser != null) {
                autoService.deleteAuto(findUser, menuId);
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
