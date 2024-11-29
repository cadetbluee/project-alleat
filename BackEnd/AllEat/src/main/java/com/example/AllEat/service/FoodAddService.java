package com.example.AllEat.service;
import java.io.*;
import java.util.Arrays;
import java.util.HashSet;

import com.example.AllEat.entity.FoodInfoEntity;
import com.example.AllEat.repository.FoodInfoRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.stereotype.Service;

@Service
public class FoodAddService {
    private final FoodInfoRepository foodInfoRepository;

    public FoodAddService(FoodInfoRepository foodInfoRepository) {
        this.foodInfoRepository = foodInfoRepository;
    }

    public void addFood(){
        String csvFile = "foodinfo.csv";
        String[] initialValues = {
                "쌀밥", "떡만둣국", "어묵국", "시래기된장국",
                "동그랑땡", "어묵볶음", "떡볶이", "김말이튀김",
                "청포묵무침", "시금치나물", "배추김치", "단무지"
        };
        HashSet<String> menus = new HashSet<>(Arrays.asList(initialValues));

        try (CSVReader reader = new CSVReader(new FileReader(csvFile))) {
            String[] line;

            menus.add("쌀밥");

            while ((line = reader.readNext()) != null) {
                if (! menus.contains(line[0])) {
                    continue;
                }

                    FoodInfoEntity newFood = new FoodInfoEntity();
                    newFood.setMenuName(line[0]);
                    newFood.setMenuCalories(Double.parseDouble(line[2]));
                    newFood.setMenuWeight(Double.parseDouble(line[1]));
                    newFood.setMenuCarbohydrate(Double.parseDouble(line[3]));
                    newFood.setMenuProtein(Double.parseDouble(line[6]));
                    newFood.setMenuFat(Double.parseDouble(line[5]));

                FoodInfoEntity savedFood = foodInfoRepository.save(newFood);

                for (String value : line) {
                    System.out.print(value + " ");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();

        } catch (CsvValidationException e) {
            System.err.println("CSV 유효성 검사 중 오류 발생: " + e.getMessage());
        }
    }
}
