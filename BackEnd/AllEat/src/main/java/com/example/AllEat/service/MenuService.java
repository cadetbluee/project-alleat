package com.example.AllEat.service;

import com.example.AllEat.dto.menu.MenuCreateDTO;
import com.example.AllEat.dto.menu.MenuPossibleDTO;
import com.example.AllEat.dto.menu.MenuResponseDTO;
import com.example.AllEat.entity.*;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.*;
import com.example.AllEat.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {


    private final RestaurantsService restaurantsService;
    private final MenuRepository menuRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RestaurantsRepository restaurantsRepository;
    private final UserService userService;
    private final PayTransactionRepository payTransactionRepository;
    private final FavoriteRepository favoriteRepository;
    private final DiaryRepository diaryRepository;

    // JWT 토큰을 이용해 사용자 식별
    public UserEntity findUserByRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);  // "Bearer " 제거
        String email = jwtUtil.getEmail(token);
        return userRepository.findByEmail(email);
    }

    // 레스토랑이 없으면 생성하고, 메뉴 추가
    public MenuEntity addMenuWithRestaurantCheck(String restaurantName, String restaurantType, MenuCreateDTO menuCreateDTO) {
        // restaurant_name으로 레스토랑 검색 또는 생성
        RestaurantsEntity restaurant = restaurantsService.findOrCreateRestaurant(restaurantName, restaurantType);

        // MenuEntity 생성 및 레스토랑과 연결
        MenuEntity menuEntity = new MenuEntity();
        menuEntity.setRestaurants(restaurant);
        menuEntity.setMenuName(menuCreateDTO.getMenuName());
        menuEntity.setMenuCalories(menuCreateDTO.getMenuCalories());
        menuEntity.setMenuCarbohydrate(menuCreateDTO.getMenuCarbohydrate());
        menuEntity.setMenuProtein(menuCreateDTO.getMenuProtein());
        menuEntity.setMenuFat(menuCreateDTO.getMenuFat());
        menuEntity.setMenuPrice(menuCreateDTO.getMenuPrice());
        menuEntity.setMenuType(menuCreateDTO.getMenuType());
        menuEntity.setMenuValue(menuCreateDTO.getMenuValue());

        // 메뉴 저장
        return menuRepository.save(menuEntity);
    }

    // 메뉴 생성
    public MenuEntity createMenu(MenuCreateDTO menuCreateDTO, HttpServletRequest request) {
        // restaurant_id로 가게 정보 가져오기
        System.out.println("id : " + menuCreateDTO.getRestaurantId());
        RestaurantsEntity restaurant = restaurantsRepository.findById(menuCreateDTO.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        UserEntity userEntity = findUserByRequest(request);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }

        // restaurant_name으로 레스토랑 검색 또는 생성
        RestaurantsEntity findRestaurant = restaurantsService.findOrCreateRestaurant(
                menuCreateDTO.getRestaurantName(), menuCreateDTO.getRestaurantType());

        // MenuEntity 생성 및 가게 연결
        MenuEntity menuEntity = new MenuEntity();
        menuEntity.setRestaurants(findRestaurant);
        menuEntity.setMenuName(menuCreateDTO.getMenuName());
        menuEntity.setMenuCalories(menuCreateDTO.getMenuCalories());
        menuEntity.setMenuCarbohydrate(menuCreateDTO.getMenuCarbohydrate());
        menuEntity.setMenuProtein(menuCreateDTO.getMenuProtein());
        menuEntity.setMenuFat(menuCreateDTO.getMenuFat());
        menuEntity.setMenuPrice(menuCreateDTO.getMenuPrice());
        menuEntity.setMenuValue(menuCreateDTO.getMenuValue());
        menuEntity.setMenuType(menuCreateDTO.getMenuType());

        // 메뉴 저장
        return menuRepository.save(menuEntity);
    }

    // 메뉴 수정
    public MenuEntity updateMenu(Integer id, MenuCreateDTO menuCreateDTO, HttpServletRequest request) {
        UserEntity userEntity = findUserByRequest(request);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }

        MenuEntity menu = getMenuById(id);  // 메뉴 찾기

        menu.setMenuName(menuCreateDTO.getMenuName());
        menu.setMenuCalories(menuCreateDTO.getMenuCalories());
        menu.setMenuCarbohydrate(menuCreateDTO.getMenuCarbohydrate());
        menu.setMenuProtein(menuCreateDTO.getMenuProtein());
        menu.setMenuFat(menuCreateDTO.getMenuFat());
        menu.setMenuPrice(menuCreateDTO.getMenuPrice());
        menu.setMenuValue(menuCreateDTO.getMenuValue());
        menu.setMenuType(menuCreateDTO.getMenuType());

        return menuRepository.save(menu);
    }

    // 메뉴 삭제
    public void deleteMenu(Integer id, HttpServletRequest request) {
        UserEntity userEntity = findUserByRequest(request);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }

        MenuEntity menu = getMenuById(id);
        menuRepository.delete(menu);
    }

    // 특정 메뉴 조회
    public MenuEntity getMenuById(Integer id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found"));
    }

    // 모든 메뉴 조회
    public List<MenuResponseDTO> getAllMenus(UserEntity requestUser) {
        List<MenuEntity> findMenus = menuRepository.findAll();
        List<MenuResponseDTO> menuResponseDTOList = new ArrayList<>();

        for (MenuEntity menuEntity : findMenus) {
            FavoriteEntity findFavorite = favoriteRepository.findByUserIdAndMenuId(requestUser.getId(), menuEntity.getId());
            boolean isFavorite = findFavorite != null;

            // 새로운 restaurantId와 restaurantType 정보를 추가하여 MenuResponseDTO 생성
            MenuResponseDTO menuResponseDTO = MenuResponseDTO.builder()
                    .restaurantName(menuEntity.getRestaurants().getRestaurantsName())
                    .restaurantId(menuEntity.getRestaurants().getId().toString())  // restaurantId 추가
                    .restaurantType(menuEntity.getRestaurants().getRestaurantsType().toString())  // restaurantType 추가
                    .menuId(menuEntity.getId())
                    .menuName(menuEntity.getMenuName())
                    .menuPrice(menuEntity.getMenuPrice())
                    .menuCalories(menuEntity.getMenuCalories())
                    .menuCarbohydrate(menuEntity.getMenuCarbohydrate())
                    .menuProtein(menuEntity.getMenuProtein())
                    .menuFat(menuEntity.getMenuFat())
                    .menuType(menuEntity.getMenuType())
                    .menuValue(menuEntity.getMenuValue())
                    .favorite(isFavorite)
                    .build();

            menuResponseDTOList.add(menuResponseDTO);
        }
        return menuResponseDTOList;
    }

    // 특정 레스토랑의 메뉴 조회
    public List<MenuEntity> getMenusByRestaurantId(Integer restaurantId) {
        RestaurantsEntity restaurant = restaurantsService.findRestaurantById(restaurantId);
        return menuRepository.findByRestaurants(restaurant);
    }
//
//    public List<MenuEntity> getMenusByRestaurantIdAndBalance(Integer restaurantId, Integer balance) {
//        List<MenuEntity> findMenu = menuRepository.findByRestaurants_IdAndMenuPrice(restaurantId, balance);
//        return findMenu;
//    }

    public List<MenuPossibleDTO> getUserPossibleMenu(UserEntity requestUser,LocalDate date) {
        List<PayTransactionEntity> findPayTransaction = payTransactionRepository.findByUser_idAndTransactionDate(requestUser.getId(), date);
        List<MenuPossibleDTO> possibleMenu = new ArrayList<>();
        for (PayTransactionEntity payTransactionEntity : findPayTransaction) {
            RestaurantsEntity findRestaurants = restaurantsRepository.findById(payTransactionEntity.getRestaurant().getId()).orElseThrow(()-> new IllegalArgumentException("restaurant not found"));
            if(findRestaurants.getId() == 1) {
                continue;
            }
            if(findRestaurants.getRestaurantsType() == RestaurantsEntity.RestaurantsType.MART){
                continue;
            }
            List<MenuEntity> findMenus = menuRepository.findByRestaurants_idAndMenuPriceLessThanEqualOrderByMenuPriceDesc(findRestaurants.getId(), Math.abs(payTransactionEntity.getAmount()));

            List<MenuEntity> favoriteMenus = new ArrayList<>();
            List<MenuEntity> nonFavoriteMenus = new ArrayList<>();

            for (MenuEntity menuEntity : findMenus) {
                FavoriteEntity findFavorite = favoriteRepository.findByUserIdAndMenuId(requestUser.getId(), menuEntity.getId());
                if (findFavorite != null) {
                    favoriteMenus.add(menuEntity);
                }
                else {
                    nonFavoriteMenus.add(menuEntity);
                }
            }

            // Step 3: 즐겨찾기 메뉴 + 일반 메뉴 순서로 병합
            HashMap<Boolean,List<MenuEntity>> finalMenuList = new HashMap<>();

            finalMenuList.put(true, favoriteMenus);  // 즐겨찾기 메뉴 먼저 추가
            finalMenuList.put(false, nonFavoriteMenus);

            MenuPossibleDTO menuPossibleDTO = new MenuPossibleDTO(findRestaurants, finalMenuList, payTransactionEntity.getId());
            possibleMenu.add(menuPossibleDTO);

        }
        return possibleMenu;
    }
    public void deleteDiary(Integer diaryId){
        DiaryEntity findDiary = diaryRepository.findById(diaryId).orElseThrow(()-> new IllegalArgumentException("diary not found"));
        diaryRepository.delete(findDiary);
    }
}
