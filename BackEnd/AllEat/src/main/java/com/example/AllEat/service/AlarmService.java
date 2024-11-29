package com.example.AllEat.service;

import com.example.AllEat.dto.alarm.AlarmDTO;
import com.example.AllEat.entity.AlarmEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.AlarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmRepository alarmRepository;

    public AlarmEntity getAlarm(Integer userId){
        AlarmEntity findAlarm = alarmRepository.findByUser_id(userId);
        if(findAlarm == null){
            return null;
        }
        return findAlarm;
    }

    public AlarmEntity addAlarm(AlarmDTO alarm, UserEntity findUser){
        AlarmEntity alarmEntity = AlarmEntity.builder()
                .breakfastAlarm(alarm.getBreakfastAlarm())
                .lunchAlarm(alarm.getLunchAlarm())
                .dinnerAlarm(alarm.getDinnerAlarm())
                .user(findUser)
                .build();

        alarmRepository.save(alarmEntity);
        return alarmEntity;
    }

    public void deleteAlarm(Integer userId){
        alarmRepository.deleteByUser_id(userId);
    }

    public void updateAlarm(AlarmDTO alarm, UserEntity findUser){
        AlarmEntity alarmEntity = alarmRepository.findByUser_id(findUser.getId());
        if(alarmEntity != null){
            alarmEntity.updateAlarm(alarm);
            alarmRepository.save(alarmEntity);
        }
    }

    public AlarmDTO convertDTO(AlarmEntity alarmEntity){
        if(alarmEntity == null){
            return null;
        }
        AlarmDTO alarmDTO = AlarmDTO.builder()
                .breakfastAlarm(alarmEntity.getBreakfastAlarm())
                .lunchAlarm(alarmEntity.getLunchAlarm())
                .dinnerAlarm(alarmEntity.getDinnerAlarm())
                .build();
        return alarmDTO;
    }
}
