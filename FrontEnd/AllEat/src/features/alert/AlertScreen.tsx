import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {icons} from '../../constants';
import {styles} from './AlertScreen.styles';
import api from '../../utils/api';
import FormField from '../../components/FormField/FormField'; // FormField 컴포넌트 추가

type AlertScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AlertScreen'
>;

interface Notification {
  id: number;
  body: string;
  title: string;
  isChecked: boolean;
  transaction: {
    id: number;
    amount: number;
    record: boolean;
    restaurant: {
      id: number;
      restaurantsName: string;
      restaurantsType: string;
    };
    mealpay: any;
    transaction_type: number;
    transaction_date: string;
  };
}

const AlertScreen: React.FC = () => {
  const navigation = useNavigation<AlertScreenNavigationProp>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null); // 선택된 알림
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 가시성
  const [editAmount, setEditAmount] = useState<string>(''); // 수정된 금액

  // 알림 데이터를 가져오는 함수
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/AllEat/notification');

      // transaction의 amount가 음수일 경우 양수로 변환
      const updatedNotifications = response.data.map(
        (notification: Notification) => {
          if (notification.transaction.amount < 0) {
            notification.transaction.amount = Math.abs(
              notification.transaction.amount,
            );
          }
          return notification;
        },
      );

      setNotifications(updatedNotifications.reverse()); // 알림 데이터를 상태에 저장
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // 알림을 읽음 처리하는 함수
  const markAllAsRead = async () => {
    try {
      await api.post('/AllEat/notification/all');
      console.log('모든 알림을 읽음 처리 완료');
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // 알림 데이터를 먼저 가져온 후, 알림을 읽음 처리
  useEffect(() => {
    const initialize = async () => {
      await fetchNotifications(); // 알림 데이터를 먼저 가져옴
      markAllAsRead(); // 알림을 읽음 처리
    };

    initialize(); // 초기화 함수 호출
  }, []);

  // '몇 시간 전', '몇 일 전'을 계산하는 함수
  const getTimeDifference = (dateString: string) => {
    const notificationDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000,
    ); // 초 단위 차이

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const diffInDays = Math.floor(diffInSeconds / 86400);
      return `${diffInDays}일 전`;
    } else {
      const diffInWeeks = Math.floor(diffInSeconds / 604800);
      return `${diffInWeeks}주 전`;
    }
  };

  // 식비 기록 처리 함수
  const handleRecordMealPay = async () => {
    if (selectedNotification && selectedNotification.transaction) {
      const {amount, id} = selectedNotification.transaction;
      console.log(`ID: ${id}`);
      console.log(`Amount: ${amount}`);

      try {
        // isChecked가 false인 경우에만 POST 요청을 보냄
        if (!selectedNotification.isChecked) {
          const postResponse = await api.post('/AllEat/record/meal-pay', {
            transaction_id: id,
            amount: amount,
          });
          console.log('POST 요청 성공:', postResponse.data);

          try {
            const response = await api.post('/AllEat/notification', {
              id: selectedNotification.id,
            });
            console.log(response.data);
          } catch (notificationError) {
            console.error('Notification POST 실패:', notificationError);
          }
        }
      } catch (error) {
        console.error('POST 요청 실패:', error);
      } finally {
        // POST 요청 성공 여부와 상관없이 모달을 닫음
        setIsModalVisible(false);
        fetchNotifications();
      }
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>나의 알림</Text>
        <TouchableOpacity
          style={styles.topIcon}
          onPress={() => navigation.navigate('Home', {})}>
          <icons.arrowBackLeft height={24} width={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.bodyContainer}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => {
                if (
                  notification.transaction.restaurant.restaurantsType === 'MART'
                ) {
                  setSelectedNotification(notification);
                  setIsModalVisible(true); // 'MART' 타입 알림에 대해 모달 표시
                }
              }}
              style={styles.alertContainer}>
              {notification.isChecked ? (
                <icons.mypage width={20} height={20} />
              ) : (
                <icons.notificationUnChecked width={20} height={20} />
              )}
              <View style={styles.alertTextConatiner}>
                {/* 알림 내용 */}
                <Text
                  style={
                    notification.isChecked
                      ? styles.alertTextChecked
                      : styles.alertText
                  }>
                  {notification.body}
                </Text>

                {/* 알림 시간 */}
                <Text style={styles.alertTimeText}>
                  {getTimeDifference(notification.transaction.transaction_date)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noNotificationText}>알림이 없습니다.</Text>
        )}
      </ScrollView>

      {/* 식비 기록 모달 */}
      {selectedNotification && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}>
          <Pressable
            style={styles.background}
            onPress={() => setIsModalVisible(false)}>
            <View style={styles.alarmWhiteBox}>
              <View style={styles.alarmTitleBox}>
                <icons.recordAlarm height={24} width={24} />
                <Text style={styles.titleBoxText}>식비로 기록할까요?</Text>
              </View>

              {/* 기록할래요 버튼 */}
              <TouchableOpacity
                style={[styles.actionButton, styles.isRecord]}
                onPress={handleRecordMealPay}>
                <Text style={styles.actionText}>기록할래요!</Text>
              </TouchableOpacity>

              {/* 수정할래요 버튼 */}
              <TouchableOpacity
                style={[styles.actionButton, styles.later]}
                onPress={() =>
                  setEditAmount(
                    String(selectedNotification?.transaction?.amount),
                  )
                }>
                <Text style={styles.actionText}>수정할래요</Text>
              </TouchableOpacity>

              {/* 금액 수정 입력 필드 */}
              {editAmount !== '' && (
                <View style={styles.alarmTitleBox}>
                  <FormField
                    value={editAmount}
                    otherStyles={styles.editMartAmountForm}
                    isNumeric={true}
                    isDecimal={false}
                    unit="원"
                    handleChangeText={text => setEditAmount(text)}
                  />
                  <TouchableOpacity onPress={handleRecordMealPay}>
                    <icons.editAmount height={36} width={36} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default AlertScreen;
