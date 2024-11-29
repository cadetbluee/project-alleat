package com.example.AllEat.controller;


import com.example.AllEat.dto.paymoney.PaymoneyDTO;
import com.example.AllEat.dto.paytransaction.PayTransactionDTO;
import com.example.AllEat.dto.weight.WeightDTO;
import com.example.AllEat.dto.weight.WeightResponseDTO;
import com.example.AllEat.entity.PayTransactionEntity;
import com.example.AllEat.entity.PaymoneyEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.PayTransactionRepository;
import com.example.AllEat.repository.PaymoneyRepository;
import com.example.AllEat.repository.RestaurantsRepository;
import com.example.AllEat.service.NotificationService;
import com.example.AllEat.service.PayTransactionService;
import com.example.AllEat.service.PaymoneyService;
import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/AllEat/paymoney")
public class PaymoneyController {
    @Autowired
    private PaymoneyService paymoneyService;

    @Autowired
    private PayTransactionService payTransactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymoneyRepository paymoneyRepository;
    @Autowired
    private PayTransactionRepository payTransactionRepository;

    @Autowired
    private RestaurantsRepository restaurantsRepository;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("")
    public ResponseEntity<?> createPaymoney(HttpServletRequest request) {
        try{
            paymoneyService.createPaymoney(request);
            return ResponseEntity.ok("Successfully Created");
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());

        }
    }

    @GetMapping("")
    public ResponseEntity<?> getBalance(HttpServletRequest request) {
        try{
            UserEntity user = userService.findByRequest(request);
            PaymoneyEntity paymoney = paymoneyRepository.findByUser(user);

            return ResponseEntity.ok(paymoney);
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());

        }
    }

    @PutMapping("")
    public ResponseEntity<?> payTransactionCreate(HttpServletRequest request, @RequestBody PayTransactionDTO payTransactionDTO) {
        try{
            RestaurantsEntity restaurant = restaurantsRepository.findById(payTransactionDTO.getRestaurantId()).orElse(null);

            paymoneyService.modifyPaymoneyBalance(payTransactionDTO.getAmount(),request);
            PayTransactionEntity payTransaction = payTransactionService.payTransactionCreate(payTransactionDTO, request);

            UserEntity user = userService.findByRequest(request);
            String response = notificationService.sendNotification(user, payTransaction);
            System.out.println(response);

            return ResponseEntity.ok(payTransaction);

        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getTransactions(HttpServletRequest request,
                                             @RequestParam(required = false) String startDate,
                                             @RequestParam(required = false) Integer period) {
        try{
            UserEntity user = userService.findByRequest(request);
            List<PayTransactionEntity> payTransactionEntities;
            if (startDate != null && period != null) {
                Date start = Date.valueOf(startDate);
                Date end = Date.valueOf(LocalDate.of(1900+start.getYear(), start.getMonth()+1, start.getDate()).plusDays(period));

                payTransactionEntities = payTransactionRepository.findByUserEntityAndDateRange(user, start, end);
            } else {
                payTransactionEntities = payTransactionRepository.findByUser(user);
            }
            return ResponseEntity.ok(payTransactionEntities);

        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());
        }

    }

    @GetMapping("/not-record")
    public ResponseEntity<?> getTransactionNotRecord(HttpServletRequest request) {
        try{
            UserEntity user = userService.findByRequest(request);
            List<PayTransactionEntity> payTransactionEntities;
            payTransactionEntities = payTransactionRepository.findTodayTransactionByUser(user);
            return ResponseEntity.ok(payTransactionEntities);

        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());
        }

    }

    @GetMapping("/amount_only")
    public ResponseEntity<?> getAmount(HttpServletRequest request,
                                             @RequestParam(required = false) String startDate,
                                             @RequestParam(required = false) Integer period) {
        try{
            UserEntity user = userService.findByRequest(request);
            Integer payAmount;

            if (startDate != null && period != null) {
                Date start = Date.valueOf(startDate);
                Date end = Date.valueOf(LocalDate.of(1900+start.getYear(), start.getMonth()+1, start.getDate()).plusDays(period));

                payAmount = payTransactionRepository.findByUserEntityAndDateAndRestId(user, start, end);

            } else {
                payAmount = payTransactionRepository.findByUserEntityAndRestId(user);
            }

            PaymoneyDTO paymoneyDTO = new PaymoneyDTO();
            paymoneyDTO.setBalance(payAmount);
            return ResponseEntity.ok(paymoneyDTO);

        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(e.getMessage());
        }

    }
}
