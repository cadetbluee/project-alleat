package com.example.AllEat.service;

import com.example.AllEat.dto.mealPay.MealPayAmountDTO;
import com.example.AllEat.dto.mealPay.MealPayRequestDTO;
import com.example.AllEat.entity.*;
import com.example.AllEat.repository.DiaryRepository;
import com.example.AllEat.repository.MealPayRepository;
import com.example.AllEat.repository.MonthlyMealPayRepository;
import com.example.AllEat.repository.PayTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MealPayService {

    private final MealPayRepository mealPayRepository;
    private final PayTransactionRepository payTransactionRepository;
    private final DiaryRepository diaryRepository;
    private final MonthlyMealPayRepository monthlyMealPayRepository;

    public MealPayEntity getMealPayResult(MealPayRequestDTO mealPayRequest, UserEntity user){
        PayTransactionEntity findPayTransaction = payTransactionRepository.findById(mealPayRequest.getTransactionId()).orElseThrow(()-> new IllegalArgumentException("거래 내역을 찾을 수 없습니다. "));

        // monthly mealpay 업데이트
        YearMonth payTransactionMonth = YearMonth.from(findPayTransaction.getTransactionDate().toLocalDateTime().toLocalDate());
        List<MonthlyMealPayEntity> findMonths = monthlyMealPayRepository.findByUserAndDate(user, payTransactionMonth);

        if (findMonths.size()>0){
            MonthlyMealPayEntity findMonth = findMonths.get(0);
            findMonth.setAmount(findMonth.getAmount() + mealPayRequest.getAmount());
            monthlyMealPayRepository.save(findMonth);

        }else{
            MonthlyMealPayEntity monthlyMealPayEntity = new MonthlyMealPayEntity();
            monthlyMealPayEntity.setUser(user);
            monthlyMealPayEntity.setAmount(mealPayRequest.getAmount());
            monthlyMealPayEntity.setDate(payTransactionMonth);
            monthlyMealPayRepository.save(monthlyMealPayEntity);

        }

        findPayTransaction.setRecord(true);
        MealPayEntity mealPay = MealPayEntity.builder()
                .payTransaction(findPayTransaction)
                .amount(mealPayRequest.getAmount())
                .build();

        mealPayRepository.save(mealPay);
        return mealPay;


    }

    // put method를 처리
    public MealPayEntity updateMealPayResult(MealPayRequestDTO mealPayRequest, UserEntity user){
        PayTransactionEntity findPayTransaction = payTransactionRepository.findById(mealPayRequest.getTransactionId()).orElseThrow(()-> new IllegalArgumentException("거래 내역을 찾을 수 없습니다. "));
        MealPayEntity findMealPay = mealPayRepository.findByPayTransaction_id(findPayTransaction.getId());

        YearMonth payTransactionMonth = YearMonth.from(findPayTransaction.getTransactionDate().toLocalDateTime().toLocalDate());
        List<MonthlyMealPayEntity> findMonths = monthlyMealPayRepository.findByUserAndDate(user, payTransactionMonth);

        MonthlyMealPayEntity findMonth = findMonths.get(0);
        findMonth.setAmount(findMonth.getAmount() -findMealPay.getAmount() + mealPayRequest.getAmount());
        monthlyMealPayRepository.save(findMonth);

        findMealPay.updateAmount(mealPayRequest.getAmount());
        mealPayRepository.save(findMealPay);

        return findMealPay;

    }

}
