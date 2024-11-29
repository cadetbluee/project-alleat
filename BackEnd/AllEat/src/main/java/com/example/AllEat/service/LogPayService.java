package com.example.AllEat.service;

import com.example.AllEat.dto.log.LogPayResponseDTO;
import com.example.AllEat.entity.PayTransactionEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.LogPayRepository;
import com.example.AllEat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogPayService {

    @Autowired
    private LogPayRepository logPayRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public List<LogPayResponseDTO> getMealPayLogsByMonth(String yearMonth, HttpServletRequest request) {
        // JWT 토큰을 통해 사용자 식별
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.getEmail(token);
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // 특정 월에 대한 트랜잭션을 가져옴
        List<PayTransactionEntity> transactions = logPayRepository.findTransactionsByUserAndMonth(user, yearMonth);

        // "restaurantsType"이 "mart"인 데이터만 필터링하여 LogPayResponseDTO로 변환
        return transactions.stream()
                .filter(transaction -> "mart".equals(transaction.getRestaurant().getRestaurantsType().getType()))  // 레스토랑 타입이 mart인 경우만 필터링
                .map(transaction -> {
                    LogPayResponseDTO response = new LogPayResponseDTO();
                    response.setDate(transaction.getTransactionDate().toString());
                    response.setRestaurantsName(transaction.getRestaurant().getRestaurantsName()); // 레스토랑 이름
                    response.setRestaurantsType(transaction.getRestaurant().getRestaurantsType().getType()); // 레스토랑 타입

                    // PayTransactionEntity의 amount 필드에서 금액을 가져옴
                    response.setAmount(transaction.getMealpay().getAmount());  // 결제 금액
                    return response;
                })
                .collect(Collectors.toList());
    }
}
