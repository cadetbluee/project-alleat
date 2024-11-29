package com.example.AllEat.service;

import com.example.AllEat.entity.NotificationEntity;
import com.example.AllEat.entity.PayTransactionEntity;
import com.example.AllEat.entity.RestaurantsEntity;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.NotificationRepository;
import com.google.firebase.messaging.*;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
@Service
public class NotificationService {

    private final UserService userService; // 모든 사용자 목록을 가져오는 서비스
    private final NotificationRepository notificationRepository;

    public NotificationService(UserService userService, NotificationRepository notificationRepository) {
        this.userService = userService;
        this.notificationRepository = notificationRepository;
    }

    // 매일 오전 9시에 스케줄된 작업 실행
    @Scheduled(cron = "0 0 10  * * *")
    public void sendDailyNotificationsMorning() throws FirebaseMessagingException {

        List<String> userTokens = userService.getAllUserTokens(); // 모든 사용자 FCM 토큰 목록
        MulticastMessage message = MulticastMessage.builder()
                .setNotification(Notification.builder()
                        .setTitle("좋은 아침이에요!")
                        .setBody("오늘 아침은 무엇을 드셨나요?")
                        .build())
                .addAllTokens(userTokens)
                .build();

        BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
        System.out.println(response.getSuccessCount() + " messages were sent successfully");

    }

    @Scheduled(cron = "0 0 14  * * *")
    public void sendDailyNotificationsLunch() throws FirebaseMessagingException {

        List<String> userTokens = userService.getAllUserTokens(); // 모든 사용자 FCM 토큰 목록
        MulticastMessage message = MulticastMessage.builder()
                .setNotification(Notification.builder()
                        .setTitle("좋은 점심이에요!")
                        .setBody("오늘 점심은 무엇을 드셨나요?")
                        .build())
                .addAllTokens(userTokens)
                .build();

        BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
        System.out.println(response.getSuccessCount() + " messages were sent successfully");

    }

    @Scheduled(cron = "0 0 20  * * *")
    public void sendDailyNotificationsDinner() throws FirebaseMessagingException {

        List<String> userTokens = userService.getAllUserTokens(); // 모든 사용자 FCM 토큰 목록
        MulticastMessage message = MulticastMessage.builder()
                .setNotification(Notification.builder()
                        .setTitle("좋은 저녁침이에요!")
                        .setBody("오늘 저녁은 무엇을 드셨나요?")
                        .build())
                .addAllTokens(userTokens)
                .build();

        BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
        System.out.println(response.getSuccessCount() + " messages were sent successfully");

    }


    // 결제 알림 전송 메서드
    public String sendNotification(UserEntity user, PayTransactionEntity payTransaction) throws FirebaseMessagingException {

        Message message;
        Integer balance = payTransaction.getAmount();
        RestaurantsEntity restaurant = payTransaction.getRestaurant();
        String restaurantName = restaurant.getRestaurantsName();
        Integer restaurantId = restaurant.getId();

        String title;
        String body;

        if (balance > 0){
            title="충전 알림";
            body="AllEat pay에 "+balance+"원이 충전되었습니다.";
        } else if (balance < 0 && restaurantId != 1){
            title="결제 알림";
            body=restaurantName+"에서 "+-balance+"원이 결제되었습니다.";
        } else{
            title="송금 알림";
            body="본인 계좌로 "+-balance+"원이 송금되었습니다.";
        }

        message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setToken(user.getFcmToken())
                .build();

        NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setBody(body);
        notificationEntity.setTitle(title);
        notificationEntity.setIsChecked(false);
        notificationEntity.setUser(user);
        notificationEntity.setTransaction(payTransaction);

        notificationRepository.save(notificationEntity);

        String response = FirebaseMessaging.getInstance().send(message);
        return "Successfully sent message: " + response;
    }

    // 해당하는 유저의 확인 안한 notification 전부 받아오기
    public List<NotificationEntity> getAllNotifications(UserEntity user) {

        return notificationRepository.findAllByUserEntity(user);

    }

    // 모든 알림 읽음처리
    public void setAllNotificationChecked(UserEntity user){
        List<NotificationEntity> notifications = notificationRepository.findAllByUserEntity(user);
        for (NotificationEntity notification : notifications) {
            notification.setIsChecked(true);
            notificationRepository.save(notification);
        }
    }

    // 특정 알림 읽음처리
    public void setNotificationChecked(NotificationEntity notification){
        notification.setIsChecked(true);
        notificationRepository.save(notification);

    }
}