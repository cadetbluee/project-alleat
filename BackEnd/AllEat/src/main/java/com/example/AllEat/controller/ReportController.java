package com.example.AllEat.controller;

import com.example.AllEat.service.WeekReportService;
import com.example.AllEat.service.MonthReportService;
import com.example.AllEat.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/AllEat")
public class ReportController {

    private final ReportService reportService;
    private final WeekReportService weekReportService;
    private final MonthReportService monthReportService;

    @Autowired
    public ReportController(ReportService reportService, WeekReportService weekReportService, MonthReportService monthReportService) {
        this.reportService = reportService;
        this.weekReportService = weekReportService;
        this.monthReportService = monthReportService;
    }

    @Value("${fast.api.url}")
    private String fastApiUrl;

    @PostMapping("/day-report")
    public ResponseEntity<?> getDayReport(
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request) {

        String day = requestBody.get("day");
        if (day == null || day.isEmpty()) {
            return ResponseEntity.badRequest().body("The 'day' parameter is missing or empty.");
        }

        // 데이터 수집 및 반환
        List<Map<String, Object>> dailyFoodInfo = reportService.handleDayReportRequest(day, request);

        return ResponseEntity.ok(Map.of("food_details", dailyFoodInfo));
    }

    @PostMapping("/week-report")
    public ResponseEntity<?> getWeekReport(
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request) {

        String day = requestBody.get("day");
        if (day == null || day.isEmpty()) {
            return ResponseEntity.badRequest().body("The 'day' parameter is missing or empty.");
        }

        // 데이터 수집 및 반환
        Map<String, Object> weeklyReportData = weekReportService.collectWeekReport(day, request);
        return ResponseEntity.ok(weeklyReportData);
    }


    @PostMapping("/month-report")
    public ResponseEntity<?> getMonthReport(
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request) {

        String yearMonth = requestBody.get("year_month");
        if (yearMonth == null || yearMonth.isEmpty()) {
            return ResponseEntity.badRequest().body("The 'year_month' parameter is missing or empty.");
        }

        Map<String, Object> collectedData = monthReportService.collectMonthReport(yearMonth, request);
        Map<String, Object> finalReport = monthReportService.prepareFrontendResponse(collectedData);

        return ResponseEntity.ok(finalReport);
    }
}