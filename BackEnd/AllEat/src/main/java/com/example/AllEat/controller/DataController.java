package com.example.AllEat.controller;

import com.example.AllEat.service.MainDataService;
import com.example.AllEat.service.DetailDataService;
import com.example.AllEat.dto.menu.MainDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
public class DataController {

    @Autowired
    private MainDataService mainDataService;

    @Autowired
    private DetailDataService detailDataService;

    @GetMapping("/AllEat/get/main/{date}")
    public MainDataDTO getMainData(@PathVariable("date") String date, HttpServletRequest request) {
        // HttpServletRequest를 전달하여 사용자 식별
        return mainDataService.getDiaryByDate(date, request);
    }

    @GetMapping("/AllEat/get/detail/{diary_id}")
    public Map<String, Object> getDiaryDetails(@PathVariable("diary_id") Integer diaryId) {

        return detailDataService.getDiaryDetailsByDiaryId(diaryId);
    }
}
