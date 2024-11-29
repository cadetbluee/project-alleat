package com.example.AllEat.service;


import com.example.AllEat.dto.paytransaction.PayTransactionDTO;
import com.example.AllEat.entity.PayTransactionEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.PayTransactionRepository;
import com.example.AllEat.repository.RestaurantsRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Service
public class PayTransactionService {

    @Autowired
    private PayTransactionRepository paytransactionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantsRepository restaurantsRepository;

    public PayTransactionEntity payTransactionCreate(PayTransactionDTO payTransactionDTO, HttpServletRequest request) {
        PayTransactionEntity payTransactionEntity = new PayTransactionEntity();
        UserEntity user = userService.findByRequest(request);

        RestaurantsEntity restaurant = restaurantsRepository.findById(payTransactionDTO.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid restaurant ID"));
        payTransactionEntity.setRestaurant(restaurant);

        payTransactionEntity.setUser(user);
        payTransactionEntity.setTransactionType(payTransactionDTO.getTransactionType());
        payTransactionEntity.setAmount(payTransactionDTO.getAmount());

        // transaction_date 설정
        if (payTransactionDTO.getTransactionDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime localDateTime = LocalDateTime.parse(payTransactionDTO.getTransactionDate(), formatter);
            payTransactionEntity.setTransactionDate(Timestamp.valueOf(localDateTime));
        } else {
            payTransactionEntity.setTransactionDate(new Timestamp(System.currentTimeMillis()));  // 현재 시간으로 설정
        }

        if (payTransactionDTO.getTransactionType() == 0) {
            payTransactionEntity.setRecord(true);
        } else {
            payTransactionEntity.setRecord(false);
        }

        return paytransactionRepository.save(payTransactionEntity);
    }
}
