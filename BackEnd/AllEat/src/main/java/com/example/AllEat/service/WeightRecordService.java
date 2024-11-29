package com.example.AllEat.service;


import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.entity.WeightEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.UserRepository;
import com.example.AllEat.repository.WeightRepository;
import com.example.AllEat.dto.weight.WeightDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;


@Service
public class WeightRecordService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeightRepository weightRepository;

    @Autowired
    private UserService userService;

    private final JwtUtil jwtUtil;

    public WeightRecordService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    public WeightEntity recordWeight(WeightDTO weightDTO, HttpServletRequest request) {
        UserEntity user = userService.findByRequest(request);

        WeightEntity weightEntity = new WeightEntity();
        weightEntity.setWeight(weightDTO.getWeight());
        weightEntity.setUser(user);

        return weightRepository.save(weightEntity);
    }

    public void modifyWeight(WeightDTO weightDTO, HttpServletRequest request) {
        UserEntity user = userService.findByRequest(request);

        WeightEntity weightEntity = weightRepository.findTodayWeightsByUser(user);
        weightEntity.setWeight(weightDTO.getWeight());

        weightRepository.save(weightEntity);

    }



}
