package com.example.AllEat.service;

import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.dto.restaurants.RestaurantsCreateDTO;
import com.example.AllEat.dto.restaurants.RestaurantsDTO;
import com.example.AllEat.dto.menu.MenuDTO;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.RestaurantsRepository;
import com.example.AllEat.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantsRepository restaurantsRepository;

    private final JwtUtil jwtUtil;

    @Autowired
    public RestaurantsService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // JWT 토큰을 이용해 사용자 식별
    public UserEntity findUserByRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);  // "Bearer " 부분 제거
        String email = jwtUtil.getEmail(token);
        return userRepository.findByEmail(email);
    }

    // 레스토랑 생성
    public RestaurantsEntity createRestaurant(RestaurantsCreateDTO restaurantsCreateDTO, HttpServletRequest request) {
        UserEntity user = findUserByRequest(request);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        RestaurantsEntity restaurantsEntity = new RestaurantsEntity();
        restaurantsEntity.setRestaurantsName(restaurantsCreateDTO.getRestaurantsName());
        restaurantsEntity.setRestaurantsType(RestaurantsEntity.RestaurantsType.valueOf(restaurantsCreateDTO.getRestaurantsType()));

        return restaurantsRepository.save(restaurantsEntity);
    }

    // 레스토랑 삭제
    public void deleteRestaurant(Integer id, HttpServletRequest request) {
        UserEntity user = findUserByRequest(request);  // 유저 인증
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        RestaurantsEntity restaurant = restaurantsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        restaurantsRepository.delete(restaurant);
    }

    // 전체 레스토랑 리스트 조회
    public List<RestaurantsDTO> getAllRestaurants() {
        return restaurantsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // restaurant_name으로 레스토랑을 검색하거나 없으면 새로 생성하는 메서드
    public RestaurantsEntity findOrCreateRestaurant(String restaurantName, String restaurantType) {
        Optional<RestaurantsEntity> optionalRestaurant = restaurantsRepository.findByRestaurantsName(restaurantName);

        // 레스토랑이 존재하면 반환, 존재하지 않으면 새로 생성
        return optionalRestaurant.orElseGet(() -> {
            RestaurantsEntity newRestaurant = new RestaurantsEntity();
            newRestaurant.setRestaurantsName(restaurantName);
            newRestaurant.setRestaurantsType(RestaurantsEntity.RestaurantsType.valueOf(restaurantType));
            return restaurantsRepository.save(newRestaurant);
        });
    }

    // 특정 레스토랑 조회 by ID
    public RestaurantsEntity findRestaurantById(Integer restaurantId) {
        return restaurantsRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    // Entity를 DTO로 변환
    private RestaurantsDTO convertToDTO(RestaurantsEntity restaurant) {
        List<MenuDTO> menuDTOs = restaurant.getMenuList() != null
                ? restaurant.getMenuList().stream()
                .map(menu -> new MenuDTO(
                        menu.getId(),
                        menu.getMenuName(),
                        menu.getMenuCalories(),
                        menu.getMenuCarbohydrate(),
                        menu.getMenuProtein(),
                        menu.getMenuFat(),
                        menu.getMenuPrice(),
                        menu.getMenuType(),
                        menu.getMenuValue(),
                        menu.getRestaurants().getId()
                )).collect(Collectors.toList())
                : Collections.emptyList();  // menuList가 null일 경우 빈 리스트 반환

        return new RestaurantsDTO(
                restaurant.getId(),
                restaurant.getRestaurantsName(),
                restaurant.getRestaurantsType().name(),
                menuDTOs
        );
    }
}
