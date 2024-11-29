package com.example.AllEat.controller;

import com.example.AllEat.dto.favorite.FavoriteDTO;
import com.example.AllEat.dto.favorite.FavoriteResponseDTO;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.UserRepository;
import com.example.AllEat.service.FavoriteService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/AllEat/record/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;

    // 즐겨찾기 추가
    @PostMapping("/{menuId}")
    public ResponseEntity<?> addFavorite(@PathVariable(name = "menuId") Integer menuId, HttpServletRequest request) {
        UserEntity findUser = userService.findByRequest(request);
        if (findUser != null) {
            FavoriteResponseDTO favorite = favoriteService.addFavorite(findUser, menuId);
            return ResponseEntity.status(HttpStatus.CREATED).body(favorite);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 즐겨찾기 해제 (favorite_id로 삭제)
    @DeleteMapping("/{menuId}")
    public ResponseEntity<?> removeFavorite(@PathVariable(name = "menuId") Integer menuId, HttpServletRequest request) {
        UserEntity findUser = userService.findByRequest(request);
        if (findUser != null) {
            favoriteService.deleteFavorite(findUser, menuId);
            return ResponseEntity.status(HttpStatus.OK).body("Favorite deleted successfully");
        }
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 유저 즐겨찾기 목록 조회
    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getFavorites(HttpServletRequest request) {
        List<FavoriteDTO> favoriteMenus = favoriteService.getUserFavorites(request);
        return new ResponseEntity<>(favoriteMenus, HttpStatus.OK);
    }
}
