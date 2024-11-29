package com.example.AllEat.controller;

import com.example.AllEat.dto.log.LogResponseDTO;
import com.example.AllEat.dto.log.LogPayResponseDTO;
import com.example.AllEat.service.LogService;
import com.example.AllEat.service.LogPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/AllEat")
public class LogController {

    @Autowired
    private LogService logService;
    @Autowired
    private LogPayService logPayService;

    @GetMapping("/mealpay")
    public ResponseEntity<List<LogResponseDTO>> getMealPayLogs(
            @RequestParam("date") String date,
            HttpServletRequest request) {

        // 해당 월의 데이터를 반환
        List<LogResponseDTO> logs = logService.getMealPayLogsByMonth(date, request);

        return ResponseEntity.ok(logs);
    }

    @GetMapping("/paylog")
    public ResponseEntity<List<LogPayResponseDTO>> getPayMoneyLogs(
            @RequestParam("date") String date,
            HttpServletRequest request) {

        // 해당 월의 데이터를 반환
        List<LogPayResponseDTO> logs = logPayService.getMealPayLogsByMonth(date, request);

        return ResponseEntity.ok(logs);
    }

}
