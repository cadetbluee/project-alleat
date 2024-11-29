package com.example.AllEat.controller;

import com.example.AllEat.dto.menu.MenuCreateDTO;
import com.example.AllEat.dto.notification.NotificationBodyDTO;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.NotificationEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.NotificationRepository;
import com.example.AllEat.service.NotificationService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/AllEat/notification")
@RequiredArgsConstructor
public class NotificationController {
    @Autowired
    private final NotificationService notificationService;

    @Autowired
    private final NotificationRepository notificationRepository;

    @Autowired
    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<?> checkOneNotification(@RequestBody NotificationBodyDTO notificationBodyDTO) {
        try{
            NotificationEntity notificationEntity = notificationRepository.findById(notificationBodyDTO.getId()).orElse(null);
            notificationService.setNotificationChecked(notificationEntity);

            return new ResponseEntity<>("Successfully checked", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/all")
    public ResponseEntity<?> checkAllNotification(HttpServletRequest request) {
        try{
            UserEntity user = userService.findByRequest(request);
            notificationService.setAllNotificationChecked(user);

            return new ResponseEntity<>("Successfully checked", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getNotification(HttpServletRequest request) {
        try{
            UserEntity user = userService.findByRequest(request);
            List<NotificationEntity> notificationEntityList = notificationService.getAllNotifications(user);
            return new ResponseEntity<>(notificationEntityList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
