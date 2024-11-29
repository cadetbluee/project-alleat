package com.example.AllEat.service;

import com.example.AllEat.dto.auto.AutoResponseDTO;
import com.example.AllEat.entity.AutoEntity;
import com.example.AllEat.entity.MenuEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.AutoRepository;
import com.example.AllEat.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AutoService {

    private final AutoRepository autoRepository;
    private final MenuRepository menuRepository;

    public AutoEntity addUserAuto(UserEntity requestUser, Integer menuId){
        MenuEntity menu = menuRepository.findById(menuId).orElseThrow(()-> new RuntimeException("Menu not found"));
        if (menu != null) {
            AutoEntity auto = AutoEntity.builder()
                    .user(requestUser)
                    .menu(menu)
                    .amount(menu.getMenuPrice())
                    .build();

            autoRepository.save(auto);
            return auto;
        }
        return null;
    }

    public AutoResponseDTO convertDTO(AutoEntity autoEntity){
        AutoResponseDTO autoResponseDTO = new AutoResponseDTO();
        autoResponseDTO.FromEntity(autoEntity);
        return autoResponseDTO;
    }

    @Transactional
    public void deleteAuto(UserEntity requestUser, Integer menuId){
        AutoEntity autoEntity = autoRepository.findByUser_idAndId(requestUser.getId(), menuId);
        autoRepository.delete(autoEntity);
    }
}
