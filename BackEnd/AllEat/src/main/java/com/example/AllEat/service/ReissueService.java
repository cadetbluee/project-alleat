package com.example.AllEat.service;

import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReissueService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public Map<String, Object> updateRefreshEntity(String refreshToken) {

        String email = jwtUtil.getEmail(refreshToken);
        String role = jwtUtil.getRole(refreshToken);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", email, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", email, role, 86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        userRepository.deleteByRefreshToken(refreshToken);
        updateRefreshEntity(email, newRefresh, 86400000L);

        Map<String, Object> map = new HashMap<>();
        map.put("refresh", newRefresh);
        map.put("access", newAccess);
        return map;
    }

    @Transactional
    public void updateRefreshEntity(String email, String refresh, Long expiredMs) {

        Timestamp expirationDate = new Timestamp(System.currentTimeMillis() + expiredMs);

        // 이메일로 사용자 조회
        UserEntity existingUserEntity = userRepository.findByEmail(email);

        existingUserEntity.updateRefreshToken(refresh, expirationDate);
        userRepository.save(existingUserEntity);
    }
}

