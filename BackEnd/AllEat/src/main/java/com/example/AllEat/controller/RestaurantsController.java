package com.example.AllEat.controller;

import com.example.AllEat.dto.restaurants.RestaurantsCreateDTO;
import com.example.AllEat.dto.restaurants.RestaurantsDTO;
import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.service.RestaurantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/AllEat/record")
public class RestaurantsController {

    private final RestaurantsService restaurantsService;

    @Autowired
    public RestaurantsController(RestaurantsService restaurantsService) {
        this.restaurantsService = restaurantsService;
    }

    // 레스토랑 리스트 조회
    @GetMapping("/store")
    public ResponseEntity<List<RestaurantsDTO>> getAllStores() {
        List<RestaurantsDTO> restaurants = restaurantsService.getAllRestaurants();
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    // 레스토랑 생성
    @PostMapping("/add-store")
    public ResponseEntity<RestaurantsEntity> addStore(@RequestBody RestaurantsCreateDTO restaurantsCreateDTO, HttpServletRequest request) {
        RestaurantsEntity createdRestaurant = restaurantsService.createRestaurant(restaurantsCreateDTO, request);
        return new ResponseEntity<>(createdRestaurant, HttpStatus.CREATED);
    }

    // 레스토랑 삭제
    @DeleteMapping("/delete-store/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Integer id, HttpServletRequest request) {
        restaurantsService.deleteRestaurant(id, request);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
