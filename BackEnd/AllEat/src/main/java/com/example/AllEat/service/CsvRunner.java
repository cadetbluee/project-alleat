//package com.example.AllEat.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//// CommandLineRunner 클래스를 사용하여 애플리케이션 시작 시 서비스 호출
//@Component
//@RequiredArgsConstructor
//public class CsvRunner implements CommandLineRunner {
//
//    private final CsvToDatabaseService csvToDatabaseService;
//
//    @Override
//    public void run(String... args) {
//        // 1. 경로 설정
//        String combinedCsvPath = "crawled_data.csv";
//        String foodInfoPath = "foodinfo.csv";
//
//        // 2. CSV 파일을 데이터베이스에 저장
//        csvToDatabaseService.saveCsvToDatabase(combinedCsvPath, foodInfoPath);
//    }
//}
