package com.example.AllEat.service;

import com.example.AllEat.dto.diary.DiaryResponseDTO;
import com.example.AllEat.dto.menu.MenuRequestDTO;
import com.example.AllEat.dto.menu.DailyDiaryResponseDTO;
import com.example.AllEat.dto.menu.AddMenuRequestDTO;
import com.example.AllEat.dto.menu.UpdateMenuRequestDTO;
import com.example.AllEat.entity.*;
import com.example.AllEat.service.UserService;
import com.example.AllEat.repository.DailyDiaryRepository;
import com.example.AllEat.repository.DiaryMappingRepository;
import com.example.AllEat.repository.DiaryRepository;
import com.example.AllEat.repository.MenuRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyDiaryService {

    private final DailyDiaryRepository dailyDiaryRepository;
    private final UserService userService;
    private final MenuRepository menuRepository;
    private final DiaryRepository diaryRepository;
    private final DiaryMappingRepository diaryMappingRepository;

    public DailyDiaryResponseDTO getDailyDiary(HttpServletRequest request, AddMenuRequestDTO requestMenuDTO) {
        UserEntity findUser = userService.findByRequest(request);
        if (findUser != null) {
            DailyDiaryEntity findDailyDiary = dailyDiaryRepository.findByUser_idAndDate(findUser.getId(), requestMenuDTO.getDate());
            Integer mealCalories = 0;
            if (findDailyDiary == null) {
                DailyDiaryEntity dailyDiary = DailyDiaryEntity.builder()
                        .date(requestMenuDTO.getDate())
                        .dailyCalories(mealCalories)
                        .user(findUser)
                        .build();
                dailyDiaryRepository.save(dailyDiary);
                return updateDailyDiary(dailyDiary, requestMenuDTO, mealCalories, findUser);
            }
            return updateDailyDiary(findDailyDiary, requestMenuDTO, mealCalories, findUser);

        }
        return null;
    }

    public DailyDiaryResponseDTO updateDailyDiary(DailyDiaryEntity requestDailyDiary, AddMenuRequestDTO requestMenuDTO, Integer mealCalories, UserEntity requestUser) {
        DiaryEntity findDiary = diaryRepository.findByDailyDiary_idAndDiaryTime(requestDailyDiary.getId(), requestMenuDTO.getDiaryTime());
        Integer dailyPrice = 0;
        Boolean isHaveDiary = true;
        DiaryEntity useDiary = new DiaryEntity();
        if (findDiary == null) {
            isHaveDiary = false;
            System.out.println("없어요");
            DiaryEntity diary = DiaryEntity.builder()
                    .diaryTime(requestMenuDTO.getDiaryTime())
                    .mealCalories(mealCalories)
                    .dailyDiary(requestDailyDiary)
                    .dailyPrice(dailyPrice)
                    .build();
            diaryRepository.save(diary);
            useDiary = diary;
            System.out.println("방금 생성한 diary : " + diary.getId());
        }
        if (isHaveDiary) {
            useDiary = findDiary;
        }

        for (MenuRequestDTO menuIdRequest : requestMenuDTO.getMenus()) {
            MenuEntity findMenu = menuRepository.findById(menuIdRequest.getMenuId()).orElseThrow(() -> new IllegalArgumentException("menu not found"));
            mealCalories += findMenu.getMenuCalories();
            dailyPrice += findMenu.getMenuPrice();
            System.out.println("mapping 생성 중인 diary : " + useDiary.getId());
            DiaryMappingEntity diaryMappingEntity = DiaryMappingEntity.builder()
                    .diary(useDiary)
                    .menu(findMenu)
                    .personCount(menuIdRequest.getPersonCount())
                    .build();

            diaryMappingRepository.save(diaryMappingEntity);
        }
        useDiary.updateDetails(mealCalories, dailyPrice);
        diaryRepository.save(useDiary);

        requestDailyDiary.update(mealCalories, useDiary);
        dailyDiaryRepository.save(requestDailyDiary);


        System.out.println("오류 터지기 전");
        System.out.println("diary : " + requestDailyDiary.getDiaryEntities().get(0).getId());
        System.out.println("오류 터진 후");

        DailyDiaryResponseDTO dailyDiaryResponse = new DailyDiaryResponseDTO();
        dailyDiaryResponse.fromEntity(requestDailyDiary, requestUser);

        return dailyDiaryResponse;
    }

//        public DiaryResponseDTO modifyDailyDiary(HttpServletRequest request, UpdateMenuRequestDTO requestMenu) {
//            UserEntity findUser = userService.findByRequest(request);
//            if (findUser != null) {
//                DiaryEntity findDiary = diaryRepository.findById(requestMenu.getDiaryId()).orElseThrow(() -> new IllegalArgumentException("diary not found"));
//                if (findDiary != null) {
//                    List<DiaryMappingEntity> diaryMappingList = diaryMappingRepository.findByDiary_id(findDiary.getId());
//                    if (diaryMappingList != null) {
//                        Boolean existDiaryMapping[] = new Boolean[diaryMappingList.size()];
//                        Boolean newDiaryMapping[] = new Boolean[requestMenu.getMenus().size()];
//
//                        Arrays.fill(existDiaryMapping, false);
//                        Arrays.fill(newDiaryMapping, false);
//
//                        int existIndex = 0;
//                        for (DiaryMappingEntity diaryMapping : diaryMappingList) {
//                            int newIndex = 0;
//                            for (MenuRequestDTO menuRequest : requestMenu.getMenus()) {
//                                if (diaryMapping.getMenu().getId() == menuRequest.getMenuId()) {
//                                    if (diaryMapping.getPersonCount() == menuRequest.getPersonCount()) {
//                                        existDiaryMapping[existIndex] = true;
//                                        newDiaryMapping[newIndex] = true;
//                                        System.out.println("같으면 유지");
//                                    } else {
//                                        if (newDiaryMapping[newIndex]) {continue;}
//                                            DiaryMappingEntity newMapping = DiaryMappingEntity.builder()
//                                                    .diary(findDiary)
//                                                    .personCount(menuRequest.getPersonCount())
//                                                    .menu(diaryMapping.getMenu())
//                                                    .build();
//                                            diaryMappingRepository.save(newMapping);
//
//                                            existDiaryMapping[existIndex] = true;
//                                            newDiaryMapping[newIndex] = true;
//                                            System.out.println("이름만 같고 사람 명 수는 달라요" + diaryMapping.getMenu().getId());
//
//                                    }
//                                }
//                                newIndex++;
//                            }
//                            existIndex++;
//                        }
//                        for (int i = 0; i < existDiaryMapping.length; i++) {
//                            if (!existDiaryMapping[i]) {
//                                System.out.println("설마 여기서 삭제 됨 ?");
//                                diaryMappingRepository.delete(diaryMappingList.get(i));
//                            }
//                        }
//
//                        for (int i = 0; i < newDiaryMapping.length; i++) {
//                            if (!newDiaryMapping[i]) {
//                                MenuEntity findMenu = menuRepository.findById(requestMenu.getMenus().get(i).getMenuId()).orElseThrow(() -> new IllegalArgumentException("menu not found"));
//                                DiaryMappingEntity newMapping = DiaryMappingEntity.builder()
//                                        .menu(findMenu)
//                                        .diary(findDiary)
//                                        .personCount(requestMenu.getMenus().get(i).getPersonCount())
//                                        .build();
//
//                                diaryMappingRepository.save(newMapping);
//                                System.out.println("완젼 새로운 메뉴 추가요 : " + findMenu.getId());
//                            }
//                        }
//                        List<DiaryMappingEntity> finalDiaryMappingList = diaryMappingRepository.findByDiary_id(findDiary.getId());
//                        DiaryResponseDTO diaryResponse = new DiaryResponseDTO();
//                        diaryResponse.fromEntity(findDiary, finalDiaryMappingList);
//                        return diaryResponse;
//                    }
//                    return null;
//                }
//                return null;
//            }
//            return null;
//        }

    public DiaryResponseDTO modifyDailyDiary(HttpServletRequest request, UpdateMenuRequestDTO requestMenu) {
        UserEntity findUser = userService.findByRequest(request);
        if (findUser != null) {
            DiaryEntity findDiary = diaryRepository.findById(requestMenu.getDiaryId()).orElseThrow(() -> new IllegalArgumentException("diary not found"));
            if (findDiary != null) {
                List<DiaryMappingEntity> findDiaryMapping = diaryMappingRepository.findByDiary_Id(findDiary.getId());
                for (DiaryMappingEntity diaryMapping : findDiaryMapping) {
                    diaryMappingRepository.delete(diaryMapping);
                }
                for (MenuRequestDTO menuRequestDTO : requestMenu.getMenus()) {
                    MenuEntity findMenu = menuRepository.findById(menuRequestDTO.getMenuId()).orElse(null);
                    DiaryMappingEntity newMapping = DiaryMappingEntity.builder()
                            .diary(findDiary)
                            .menu(findMenu)
                            .personCount(menuRequestDTO.getPersonCount())
                            .build();

                    diaryMappingRepository.save(newMapping);
                }
                List<DiaryMappingEntity> finalDiaryMappingList = diaryMappingRepository.findByDiary_Id(findDiary.getId());
                DiaryResponseDTO diaryResponse = new DiaryResponseDTO();
                diaryResponse.fromEntity(findDiary, finalDiaryMappingList);
                return diaryResponse;
            }
            return null;
        }
        return null;
    }
}