package com.example.AllEat.controller;
import com.example.AllEat.dto.diary.DiaryResponseDTO;
import com.example.AllEat.dto.menu.*;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.UserRepository;
import com.example.AllEat.service.DailyDiaryService;
import com.example.AllEat.service.FoodAddService;
import com.example.AllEat.service.MenuService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/AllEat/record")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final UserService userService;
    private final DailyDiaryService dailyDiaryServie;
    private final FoodAddService foodAddService;
    private final UserRepository userRepository;

    // 메뉴와 레스토랑 추가
    @PostMapping("/add-menu")
    public ResponseEntity<MenuEntity> addMenuWithRestaurant(@RequestBody MenuCreateDTO menuCreateDTO) {
        MenuEntity createdMenu = menuService.addMenuWithRestaurantCheck(
                menuCreateDTO.getRestaurantName(),
                menuCreateDTO.getRestaurantType(),
                menuCreateDTO
        );
        return new ResponseEntity<>(createdMenu, HttpStatus.CREATED);
    }

    // 특정 메뉴 조회
    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuEntity> getMenuById(@PathVariable Integer id) {
        MenuEntity menu = menuService.getMenuById(id);
        return new ResponseEntity<>(menu, HttpStatus.OK);
    }

    // 모든 메뉴 조회
    @GetMapping("/menus")
    public ResponseEntity<?> getAllMenus(HttpServletRequest request) {
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null) {
            List<MenuResponseDTO> menus = menuService.getAllMenus(findUser);
            return ResponseEntity.status(HttpStatus.OK).body(menus);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    // 특정 레스토랑의 메뉴 조회
    @GetMapping("/restaurant/{restaurantId}/menus")
    public ResponseEntity<List<MenuEntity>> getMenusByRestaurantId(@PathVariable Integer restaurantId) {
        List<MenuEntity> menus = menuService.getMenusByRestaurantId(restaurantId);
        return new ResponseEntity<>(menus, HttpStatus.OK);
    }

    // 메뉴 수정
    @PutMapping("/update-menu/{id}")
    public ResponseEntity<MenuEntity> updateMenu(@PathVariable Integer id, @RequestBody MenuCreateDTO menuCreateDTO, HttpServletRequest request) {
        MenuEntity updatedMenu = menuService.updateMenu(id, menuCreateDTO, request);
        return new ResponseEntity<>(updatedMenu, HttpStatus.OK);
    }

    // 메뉴 삭제
    @DeleteMapping("/delete-menu/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Integer id, HttpServletRequest request) {
        menuService.deleteMenu(id, request);  // HttpServletRequest 추가
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/menu-auto/{date}")
    public ResponseEntity<?> getPossibleList(HttpServletRequest request, @PathVariable(name = "date", required = true) LocalDate date) {
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null) {
            List<MenuPossibleDTO> menuList = menuService.getUserPossibleMenu(findUser,date);
            return ResponseEntity.status(HttpStatus.OK).body(menuList);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/menu")
    public ResponseEntity<?> addMenu(@RequestBody AddMenuRequestDTO addMenuRequests, HttpServletRequest request) {
        DailyDiaryResponseDTO getDailyDiary = dailyDiaryServie.getDailyDiary(request, addMenuRequests);
        return ResponseEntity.status(HttpStatus.OK).body(getDailyDiary);
    }

    @PutMapping("/menu")
    public ResponseEntity<?> updateMenu(@RequestBody UpdateMenuRequestDTO updateMenuRequests, HttpServletRequest request) {
        DiaryResponseDTO modifiedDiary = dailyDiaryServie.modifyDailyDiary(request, updateMenuRequests);
        return ResponseEntity.status(HttpStatus.OK).body(modifiedDiary);

    }

    @PostMapping("/add-cal")
    public ResponseEntity<?> addFoodInfo(HttpServletRequest request){
        foodAddService.addFood();
        return ResponseEntity.status(HttpStatus.CREATED).body("successfully added");
    }

    @DeleteMapping("/menu/{diaryId}")
    public ResponseEntity<?> deleteDiary(HttpServletRequest request, @PathVariable(name = "diaryId") Integer diaryId){
        UserEntity findUser = userService.findByRequest(request);
        if(findUser != null) {
            menuService.deleteDiary(diaryId);
            return ResponseEntity.status(HttpStatus.OK).body("successfully deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}