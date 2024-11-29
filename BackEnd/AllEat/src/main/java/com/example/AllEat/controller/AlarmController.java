package com.example.AllEat.controller;

import com.example.AllEat.dto.alarm.AlarmDTO;
import com.example.AllEat.entity.AlarmEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.service.AlarmService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/AllEat/alarm")
@RequiredArgsConstructor
public class AlarmController {

    private final AlarmService alarmService;
    private final UserService userService;


    @GetMapping
    public ResponseEntity<?> getAlarm(HttpServletRequest request){
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null){
            AlarmEntity findAlarm = alarmService.getAlarm(findUser.getId());
            AlarmDTO alarmDTO = alarmService.convertDTO(findAlarm);
            if(alarmDTO != null){
                return ResponseEntity.status(HttpStatus.OK).body(alarmDTO);
            }
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No Alarm Found");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addAlarm(@RequestBody AlarmDTO alarm, HttpServletRequest request){
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null){
            alarmService.addAlarm(alarm, findUser);
            return ResponseEntity.status(HttpStatus.OK).body(alarm);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAlarm(HttpServletRequest request){
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null){
            alarmService.deleteAlarm(findUser.getId());
            return ResponseEntity.status(HttpStatus.OK).body("Alarm deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping
    public ResponseEntity<?> updateAlarm(@RequestBody AlarmDTO alarm, HttpServletRequest request){
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null){
            alarmService.updateAlarm(alarm, findUser);
            return ResponseEntity.status(HttpStatus.OK).body("Alarm updated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
