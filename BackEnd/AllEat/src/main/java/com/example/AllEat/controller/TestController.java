package com.example.AllEat.controller;


import com.example.AllEat.dto.restaurants.RestaurantsDTO;
import com.example.AllEat.service.NotificationService;
import com.example.AllEat.service.UserService;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/AllEat/test")
public class TestController {

    private final NotificationService notificationService;

    public TestController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


//
//
//    // 토큰 조회
    @PostMapping("/tokens")
    public ResponseEntity<?> test() throws FirebaseMessagingException {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
