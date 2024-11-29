package com.example.AllEat.service;

import com.example.AllEat.dto.favorite.FavoriteDTO;
import com.example.AllEat.dto.favorite.FavoriteResponseDTO;
import com.example.AllEat.dto.menu.MenuDTO;
import com.example.AllEat.entity.FavoriteEntity;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.FavoriteRepository;
import com.example.AllEat.repository.MenuRepository;
import com.example.AllEat.repository.RestaurantsRepository;
import com.example.AllEat.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private RestaurantsRepository restaurantsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // 즐겨찾기 추가
    public FavoriteResponseDTO addFavorite(UserEntity requestUser, Integer menuId) {
        MenuEntity findMenu = menuRepository.findById(menuId).orElseThrow(()-> new IllegalArgumentException("Menu not found"));
        FavoriteEntity favorite = FavoriteEntity.builder()
                .menu(findMenu)
                .user(requestUser)
                .build();

        favoriteRepository.save(favorite);
        FavoriteResponseDTO favoriteResponse = new FavoriteResponseDTO(requestUser, findMenu, favorite);
        return favoriteResponse;
    }
    @Transactional
    public void deleteFavorite(UserEntity requestUser, Integer menuId) {
        System.out.println("userId : " + requestUser.getId());
        System.out.println("menuId : " + menuId);
        FavoriteEntity findFavorite = favoriteRepository.findByUserIdAndMenuId(requestUser.getId(), menuId);
        System.out.println(findFavorite);

        if (findFavorite != null) {
            favoriteRepository.delete(findFavorite);
        }
    }

    // 해당 유저의 즐겨찾기 조회
    public List<FavoriteDTO> getUserFavorites(HttpServletRequest request) {
        UserEntity user = getUserFromRequest(request);
        return favoriteRepository.findByUser(user).stream()
                .map(this::convertToFavoriteDTO)
                .collect(Collectors.toList());
    }

    // HttpServletRequest로부터 유저를 얻는 메서드
    private UserEntity getUserFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.getEmail(token);
        return userRepository.findByEmail(email);
    }

    // FavoriteEntity를 FavoriteDTO로 변환하는 메서드
    private FavoriteDTO convertToFavoriteDTO(FavoriteEntity favorite) {
        MenuEntity menu = favorite.getMenu();
        MenuDTO menuDTO = new MenuDTO(
                menu.getId(),
                menu.getMenuName(),
                menu.getMenuCalories(),
                menu.getMenuCarbohydrate(),
                menu.getMenuProtein(),
                menu.getMenuFat(),
                menu.getMenuPrice(),
                menu.getMenuType(),
                menu.getMenuValue(),
                menu.getRestaurants().getId()  // 추가된 restaurantsId
        );

        return new FavoriteDTO(favorite.getId(), menuDTO);
    }
}
