import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import {
  useNavigation,
  RouteProp,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {icons} from '../../../constants';
import {images} from '../../../constants';
import {styles} from './HomeScreen.styles';
import {format, addDays, subDays} from 'date-fns'; // 날짜 형식을 위해 date-fns 사용
import CircularProgress from '../../../components/CircularProgress/CircularProgress';
// import RecordBox from '../../../components/RecordBox/RecordBox';
import RecordDetailModal from '../components/RecordDetailModal/RecordDetailModal';
import {formatDate} from '../../../utils/dateUtils'; // formatDate 유틸리티 함수 가져오기
import api from '../../../utils/api';
import {AppDispatch, RootState} from '../../../redux/store';
import {useDispatch, useSelector} from 'react-redux'; // Redux에서 액션을 디스패치하기 위한 훅
import {fetchUserInfo} from '../../../redux/features/infoSlice';
import FormModal from '../../../components/FormModal/FormModal';
import CalanderModal from '../components/CalanderModal/CalanderModel';
import RecordBox2 from '../../../components/RecordBox/RecordBox2';
import FormField from '../../../components/FormField/FormField';
import {AppState} from 'react-native';
import {setNotification} from '../../../redux/features/notificationSlice';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<HomeRouteProp>();
  const {Kcal = 0} = route.params || {};

  // 움직이는 키키 이미지
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [realIsUpdated, setRealIsUpdated] = useState(false); // 초기값으로 isUpdated 설정

  // 키키 말풍선
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const messages = [
    '쿠키가 되고 싶어...',
    '내가 쿠키가 될 수 있을까?',
    '나는 먼지가 아니야!',
    '내 이름은 키키! 나는 쿠키가 될 거야',
  ];

  const handlePress = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(randomMessage);
    setShowBubble(true);

    // 3초 후 말풍선을 사라지게 함
    setTimeout(() => {
      setShowBubble(false);
    }, 3000);
  };

  // useEffect(() => {
  //   console.log(isUpdated);
  //   setRealIsUpdated(isUpdated);
  // }, [isUpdated, realIsUpdated]);
  const kikiImages = [images.happyKiki1, images.happyKiki2, images.happyKiki3];

  // 캘린더 모달
  const [isCalanderModalVisible, setIsCalanderModalVisible] = useState(false);
  // 캘린더 모달의 날짜 선택 시 처리
  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    setIsCalanderModalVisible(false); // 모달을 닫음
  };

  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // 현재 날짜를 저장하는 상태
  const [currentDate, setCurrentDate] = useState(new Date());

  // 이전 날짜로 이동
  const handlePreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1)); // 하루를 뺌
  };

  // 다음 날짜로 이동
  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1)); // 하루를 더함
  };

  // 알림창 이동
  const handleAlertNavigate = () => {
    navigation.navigate('AlertScreen');
  };

  // REPORT 버튼 클릭 시 다른 페이지로 이동하는 함수
  const handleReportNavigate = () => {
    navigation.navigate('Report'); // 'ReportScreen'은 이동할 페이지의 이름입니다.
  };
  // 모달 가시성 및 선택된 기록 관리
  const [isRecordDetailVisible, setIsRecordDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<{
    id: number;
    title: string;
    kcal: string;
    price: string;
  } | null>(null);

  // 리덕스 스토어에서 사용자 정보 가져오기
  const {goal_cost, goal_kcal, weights, goal_weight} = useSelector(
    (state: RootState) => state.info,
  );
  // const {monthlyUsedAmount} = useSelector((state: RootState) => state.paymoney);

  // 기록된 데이터 상태
  const [dayData, setDayData] = useState<{
    day_kcal: number | null;
    day_carb: number | null;
    day_protein: number | null;
    day_fat: number | null;
    day_cost: number | null;
    day_diaries: Array<{
      diary_id: number;
      diary_time: string;
      diary_kcal: number;
      diary_cost: number;
    }>;
  } | null>(null);
  // 날짜가 변경될 때마다 API로 데이터 가져오기
  const DiaryIds = {
    BREAKFAST:
      dayData?.day_diaries.find(diary => diary.diary_time === 'BREAKFAST')
        ?.diary_id || null,
    LUNCH:
      dayData?.day_diaries.find(diary => diary.diary_time === 'LUNCH')
        ?.diary_id || null,
    DINNER:
      dayData?.day_diaries.find(diary => diary.diary_time === 'DINNER')
        ?.diary_id || null,
    SNACK:
      dayData?.day_diaries.find(diary => diary.diary_time === 'SNACK')
        ?.diary_id || null,
  };
  const handleRecordBoxPress = (isRecorded: boolean, title: string) => {
    if (isRecorded) {
      // 이미 기록된 경우 모달 표시
      const record = dayData?.day_diaries.find(
        diary => diary.diary_time === title.toUpperCase(),
      );
      setSelectedRecord({
        id: record ? record.diary_id : 0,
        title,
        kcal: record ? `${record.diary_kcal}kcal` : '0kcal',
        price: record ? `${record.diary_cost}₩` : '0₩',
      });
      setIsRecordDetailVisible(true);
    } else if (isRecordDetailVisible) {
      // 기록되지 않은 경우 DiaryCreate 페이지로 이동
      setIsRecordDetailVisible(false);
      navigation.navigate('DiaryCreate', {
        diaryId: DiaryIds,
        date: format(currentDate, 'yyyy-MM-dd'),
        meals: title,
      });
    } else {
      navigation.navigate('DiaryCreate', {
        diaryId: DiaryIds,
        date: format(currentDate, 'yyyy-MM-dd'),
        meals: title,
      });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // notification Modal관련 처리 함수
  const notification = useSelector((state: RootState) => state.notification);

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const clearNotify = {
    text: '',
    subText: '',
    app: '',
    bigText: '',
    title: '',
    titleBig: '',
  };
  const extractMenuName = (text: string) => {
    const singleMenuPattern =
      /주문하신\s(.*?)이\(가\) \d+분.*도착할 예정입니다/;
    const multipleMenuPattern =
      /주문하신\s(.*?) 외 \d+개이\(가\) \d+분.*도착할 예정입니다/;
    const restaurantNameMatch = text.match(/^(.*?)에서/);

    const singleMenuMatch = text.match(singleMenuPattern);
    const multipleMenuMatch = text.match(multipleMenuPattern);

    const restaurantName = restaurantNameMatch ? restaurantNameMatch[1] : '';

    if (multipleMenuMatch) {
      return {
        restaurant: restaurantName,
        menu: multipleMenuMatch[1] || '', // 메뉴 이름이 없으면 빈 문자열 반환
      };
    } else if (singleMenuMatch) {
      return {
        restaurant: restaurantName,
        menu: singleMenuMatch[1] || '', // 메뉴 이름이 없으면 빈 문자열 반환
      };
    } else {
      return null;
    }
  };

  const {menus} = useSelector((state: RootState) => state.menu);

  // Redux store에서 restaurant_id와 menu_id 검색
  const findDeliveryMenu = (restaurants_name: string, menu_name: string) => {
    // store.menu에서 restaurants_name과 menu_name을 이용해 해당 데이터 검색
    const delivery_menu = menus.find(
      (menu: any) =>
        menu.restaurants_name === restaurants_name &&
        menu.menu_name === menu_name,
    );

    if (!delivery_menu) {
      console.log('해당 메뉴를 찾을 수 없습니다.');
      return null;
    }

    // restaurant_id와 menu_id 반환
    return delivery_menu;
  };
  const [deliveryMenuId, setDeliveryMenuId] = useState(0);

  // notification이 빈값이면 modal을 안 띄우고 빈 값이 아니면 modal을 띄움
  useEffect(() => {
    const processNotification = async () => {
      console.log('notification', notification);
      if (notification.title === '') {
        setShowDeliveryModal(false);
      } else {
        const result = extractMenuName(notification.bigText || '');
        console.log(notification.bigText);
        console.log('result', result);
        if (result) {
          const {restaurant, menu} = result;
          console.log('Restaurant Name:', restaurant);
          console.log('Menu Name:', menu);

          const deliveryMenu = findDeliveryMenu(restaurant || '', menu || '');

          if (deliveryMenu) {
            console.log('Delivery Menu:', deliveryMenu);
            setDeliveryMenuId(deliveryMenu.menu_id);
            console.log(deliveryMenu);
            const deliveryPay = {
              amount: -59000,
              transaction_type: 1,
              restaurant_id: deliveryMenu.restaurants_id,
            };

            try {
              // 비동기 API 호출
              await api.put('/AllEat/paymoney', deliveryPay);
              // 메뉴가 있으면 모달을 띄움
              setShowDeliveryModal(true);
            } catch (error) {
              console.log('결제 요청 중 에러가 발생했습니다:', error);
              // 결제 실패 시 처리
              setShowDeliveryModal(false);
            }
          } else {
            setShowDeliveryModal(false);
          }
        } else {
          setShowDeliveryModal(false);
        }
      }
    };

    processNotification();
  }, [notification]);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      // 앱상태 확인용 함수 지금은 안쓰지만 혹시몰라 남겨둠
      if (AppState.currentState == 'active') {
        // 앱이 포그라운드로 돌아왔을 때 실행할 함수
        // 여기서 원하는 함수 실행
      } else if (AppState.currentState == 'background') {
        // setShowDeliveryModal(false);
        // dispatch(setNotification(clearNotify));
      }
    };
    // AppState 변경을 감지하는 리스너 등록
    const subscrition = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      subscrition.remove();
    };
  }, [AppState.currentState]);

  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = format(currentDate, 'yyyy-MM-dd'); // 날짜를 'yyyy-MM-dd' 형식으로 포맷
        const response = await api.get(`/AllEat/get/main/${formattedDate}`);
        setDayData(response.data); // 가져온 데이터를 상태에 저장
        console.log('오늘의 데이터 : ', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 데이터 가져오기
    fetchData();
    // setRealIsUpdated(false);

    // 일정 시간마다 이미지를 변경하는 인터벌 설정
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % kikiImages.length);
    }, 500); // 500ms마다 이미지 변경

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => {
      clearInterval(intervalId); // 인터벌 클리어
    };
  }, [currentDate, Kcal, kikiImages.length]); // 의존성 배열에 currentDate, isUpdated, kikiImages.length 추가

  const [lastNotification, setLastNotification] = useState<{
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
  } | null>(null); // 마지막 결제 알림을 저장할 상태
  const [notifications, setNotifications] = useState<
    {
      id: number;
      isChecked: boolean;
      title: string;
      transaction: {
        restaurantsName: string;
        restaurantsType: string;
      };
    }[]
  >([]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchNotificationData = async () => {
        try {
          const response = await api.get('/AllEat/notification');
          const responsenotifications = response.data || [];
          setNotifications(responsenotifications);
          // '결제 알림' 중에서 마지막 알림만 찾기
          const paymentNotifications = responsenotifications.filter(
            (notification: {title: string; isChecked: boolean}) =>
              notification.title === '결제 알림' &&
              notification.isChecked === false,
          );

          if (paymentNotifications.length > 0) {
            const lastPaymentNotification =
              paymentNotifications[paymentNotifications.length - 1];

            // transaction의 amount가 음수일 경우 양수로 변환
            if (lastPaymentNotification.transaction.amount < 0) {
              lastPaymentNotification.transaction.amount = Math.abs(
                lastPaymentNotification.transaction.amount,
              );
            }

            setLastNotification(lastPaymentNotification); // 마지막 결제 알림 저장
          } else {
            setLastNotification(null); // 더 이상 알림이 없으면 null로 설정
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };

      // 홈 화면이 다시 포커스될 때마다 알림 데이터를 가져옴
      fetchNotificationData();

      // cleanup 함수는 필요 없을 때 사용할 수 있습니다.
    }, []),
  );
  // `isChecked`가 false인 알림이 하나라도 있는지 확인
  const hasUncheckedNotifications = notifications.some(
    notification => !notification.isChecked,
  );
  const handleRecordMealPay = async () => {
    if (lastNotification && lastNotification.transaction) {
      const {amount, id} = lastNotification.transaction;
      console.log(`ID: ${id}`);
      console.log(`Amount: ${amount}`);

      try {
        // POST 요청 시도
        const postResponse = await api.post('/AllEat/record/meal-pay', {
          transaction_id: id,
          amount: amount,
        });
        console.log('POST 요청 성공:', postResponse.data);
      } catch (error) {
        console.error('POST 요청 실패:', error);
        try {
          // POST 실패 시 PUT 요청 시도
          const putResponse = await api.put('/AllEat/record/meal-pay', {
            transaction_id: id,
            amount: amount,
          });
          console.log('PUT 요청 성공:', putResponse.data);
        } catch (putError) {
          console.error('PUT 요청 실패:', putError);
        }
      }
      if (editMartAmount) {
        setEditMartAmount(false);
      }
      const response = await api.post('/AllEat/notification', {
        id: lastNotification.id,
      });
      console.log(response.data);
      setLastNotification(null);
    } else {
      console.log(
        'lastNotification이나 transaction 데이터가 존재하지 않습니다.',
      );
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsRecordDetailVisible(false);
    setSelectedRecord(null);
  };

  const totalNutrients =
    (dayData?.day_carb || 0) +
    (dayData?.day_protein || 0) +
    (dayData?.day_fat || 0);

  // 각 영양소의 비율 계산
  const carbRatio = totalNutrients
    ? (dayData?.day_carb || 0) / totalNutrients
    : 0;
  const proteinRatio = totalNutrients
    ? (dayData?.day_protein || 0) / totalNutrients
    : 0;
  const fatRatio = totalNutrients
    ? (dayData?.day_fat || 0) / totalNutrients
    : 0;

  // isToday 함수 추가
  const isToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // 체중 기록 관련
  const handleWeightChange = async (
    currentWeight: string,
    goalWeight: string,
  ) => {
    // goal에 대한 POST 요청

    console.log('Saving current weight:', currentWeight);
    console.log('Saving goal weight:', goalWeight);
    const goalResponse = await api.put('/AllEat/users/goals', {
      goal_weight: parseFloat(goalWeight),
      goal_cost: goal_cost,
    });
    console.log('Goal Response:', goalResponse.data);
    // weight에 대한 POST 요청
    if (weights && weights.length > 0 && isToday(weights[0].createdAt)) {
      // 오늘의 체중이 있으면 PUT 요청
      const weightResponse = await api.put('/AllEat/weight', {
        weight: parseFloat(currentWeight),
      });
      console.log('Weight (PUT) Response:', weightResponse.data);
    } else {
      // 오늘의 체중이 없거나 weights가 비었으면 POST 요청
      const weightResponse = await api.post('/AllEat/weight', {
        weight: parseFloat(currentWeight),
      });
      console.log('Weight (POST) Response:', weightResponse.data);
    }
    dispatch(fetchUserInfo());
    setWeightModalVisible(false); // 모달을 닫음
  };
  const [editMartAmount, setEditMartAmount] = useState(false);
  return (
    <View style={{flex: 1}}>
      {/* 고정된 상단 바 */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <icons.arrowBackLeft
            style={styles.arrowBackLeft}
            height={30}
            width={30}
          />
        </TouchableOpacity>

        {/* 캘린더 */}
        <TouchableOpacity
          style={styles.homeDate}
          onPress={() => setIsCalanderModalVisible(true)} // 캘린더 모달을 띄우는 onPress 이벤트 추가
        >
          <Text style={styles.day}>{formatDate(currentDate)}</Text>
          {isCalanderModalVisible ? (
            <icons.arrowDropDownTop
              style={styles.calanderBtn}
              height={15}
              width={15}
            />
          ) : (
            <icons.arrowDropDown
              style={styles.calanderBtn}
              height={15}
              width={15}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextDay}>
          <icons.arrowBackRight
            style={styles.arrowBackRight}
            height={30}
            width={30}
          />
        </TouchableOpacity>

        <icons.notifications
          onPress={handleAlertNavigate}
          style={styles.notificationIcon}
          height={20}
          width={20}
        />
        {hasUncheckedNotifications && (
          <icons.notiBadge style={styles.notiBadge} height={10} width={10} />
        )}
      </View>

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView style={styles.scrollContainer}>
        {/* notification Modal */}
        {showDeliveryModal && (
          <View style={styles.alarmWhiteBox}>
            <View style={styles.alarmTitleBox}>
              <icons.recordAlarm height={24} width={24} />
              <Text style={styles.titleBoxText}>
                배달 주문을 하셨군요! 식단으로 기록할까요?
              </Text>
            </View>
            {/* 기록할래요 버튼 */}
            <TouchableOpacity
              style={[styles.actionButton, styles.isRecord]}
              onPress={async () => {
                try {
                  // day_diaries 배열의 길이에 따라 title을 결정
                  let title = 'BREAKFAST'; // 기본값을 아침으로 설정
                  if (dayData?.day_diaries) {
                    const diariesLength = dayData.day_diaries.length;
                    switch (diariesLength) {
                      case 0:
                        title = 'BREAKFAST';
                        break;
                      case 1:
                        title = 'LUNCH'; // 점심
                        break;
                      case 2:
                        title = 'DINNER'; // 저녁
                        break;
                      case 3:
                      default:
                        title = 'SNACK'; // 간식
                        break;
                    }
                  }

                  // DiaryCreate 페이지로 이동하며, 결정된 title 값을 전달
                  navigation.navigate('DiaryCreate', {
                    diaryId: DiaryIds,
                    date: format(currentDate, 'yyyy-MM-dd'),
                    meals: title, // 결정된 title을 전달
                    menuId: deliveryMenuId,
                  });
                } catch (error) {
                  console.error('Notification 처리 중 오류:', error);
                }
              }}>
              <Text style={styles.actionText}>기록할래요!</Text>
            </TouchableOpacity>

            {/* 나중에 버튼 */}
            <TouchableOpacity
              style={[styles.actionButton, styles.later]}
              onPress={async () => {
                try {
                  setShowDeliveryModal(false);
                  dispatch(setNotification(clearNotify));
                } catch (error) {
                  console.error('Notification 처리 중 오류:', error);
                }
              }}>
              <Text style={styles.actionText}>나중에</Text>
            </TouchableOpacity>
          </View>
        )}

        {lastNotification &&
          (lastNotification.transaction.restaurant.restaurantsType ===
          'MART' ? (
            <View style={styles.alarmWhiteBox}>
              <View style={styles.alarmTitleBox}>
                <icons.recordAlarm height={24} width={24} />
                <Text style={styles.titleBoxText}>
                  마트/편의점에 다녀오셨네요! 식비로 기록할까요?
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, styles.isRecord]}
                onPress={() => handleRecordMealPay()}>
                <Text style={styles.actionText}>기록할래요!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.later]}
                onPress={() => {
                  setEditMartAmount(true);
                }}>
                <Text style={styles.actionText}>수정할래요</Text>
              </TouchableOpacity>
              {editMartAmount && (
                <View style={styles.alarmTitleBox}>
                  <FormField
                    value={String(lastNotification?.transaction?.amount || '')}
                    otherStyles={styles.editMartAmountForm}
                    isNumeric={true}
                    isDecimal={false}
                    unit="원"
                    handleChangeText={text =>
                      setLastNotification(prevState => {
                        console.log('text: ', text);
                        if (!prevState) {
                          // prevState가 null일 경우 기본값을 설정합니다.
                          return {
                            id: 0, // 적절한 초기 값으로 설정
                            body: '',
                            title: '',
                            isChecked: false,
                            transaction: {
                              id: 0,
                              amount: Number(text), // 초기 값을 설정한 후 입력된 값을 사용
                              record: false,
                              restaurant: {
                                id: 0,
                                restaurantsName: '',
                                restaurantsType: '',
                              },
                              mealpay: null,
                              transaction_type: 0,
                              transaction_date: '',
                            },
                          };
                        }

                        // prevState가 null이 아닐 경우, 기존 상태를 유지하면서 amount를 업데이트
                        return {
                          ...prevState,
                          transaction: {
                            ...prevState.transaction,
                            amount: Number(text), // amount만 업데이트
                          },
                        };
                      })
                    }
                  />
                  <TouchableOpacity onPress={handleRecordMealPay}>
                    <icons.editAmount height={36} width={36} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.alarmWhiteBox}>
              <View style={styles.alarmTitleBox}>
                <icons.recordAlarm height={24} width={24} />
                <Text style={styles.titleBoxText}>
                  결제내역이 있어요! 기록하시겠어요?
                </Text>
              </View>
              {/* 기록할래요 버튼 */}
              <TouchableOpacity
                style={[styles.actionButton, styles.isRecord]}
                onPress={async () => {
                  try {
                    await api.post('/AllEat/notification', {
                      id: lastNotification.id,
                    });
                    setLastNotification(null);
                    // day_diaries 배열의 길이에 따라 title을 결정
                    let title = 'BREAKFAST'; // 기본값을 아침으로 설정
                    if (dayData?.day_diaries) {
                      const diariesLength = dayData.day_diaries.length;
                      switch (diariesLength) {
                        case 0:
                          title = 'BREAKFAST';
                          break;
                        case 1:
                          title = 'LUNCH'; // 점심
                          break;
                        case 2:
                          title = 'DINNER'; // 저녁
                          break;
                        case 3:
                        default:
                          title = 'SNACK'; // 간식
                          break;
                      }
                    }

                    // DiaryCreate 페이지로 이동하며, 결정된 title 값을 전달
                    navigation.navigate('DiaryCreate', {
                      diaryId: DiaryIds,
                      date: format(currentDate, 'yyyy-MM-dd'),
                      meals: title, // 결정된 title을 전달
                    });
                  } catch (error) {
                    console.error('Notification 처리 중 오류:', error);
                  }
                }}>
                <Text style={styles.actionText}>기록할래요!</Text>
              </TouchableOpacity>

              {/* 나중에 버튼 */}
              <TouchableOpacity
                style={[styles.actionButton, styles.later]}
                onPress={async () => {
                  try {
                    await api.post('/AllEat/notification', {
                      id: lastNotification.id,
                    });
                    setLastNotification(null);
                  } catch (error) {
                    console.error('Notification 처리 중 오류:', error);
                  }
                }}>
                <Text style={styles.actionText}>나중에</Text>
              </TouchableOpacity>
            </View>
          ))}
        <View style={styles.mainbox}>
          <View style={styles.allText}>
            <icons.re_check
              style={styles.re_checkIcon}
              height={15}
              width={15}
            />
            <Text style={styles.eatpay}> 총 </Text>
            <Text style={styles.eatpayValue}>
              {dayData?.day_kcal ? `${dayData.day_kcal}kcal` : '0kcal'}
            </Text>
            <Text style={styles.eatpay}> 섭취, </Text>
            <Text style={styles.eatpayValue}>
              {dayData?.day_cost
                ? `${dayData.day_cost.toLocaleString()}원`
                : '0원'}
            </Text>
            <Text style={styles.eatpay}> 소비했어요!</Text>
          </View>

          <View style={styles.kikiBox}>
            <TouchableOpacity onPress={handlePress}>
              <View style={styles.charInfo}>
                <images.kikiShadow
                  style={styles.kikiShadow}
                  height={90}
                  width={90}
                />
                {dayData?.day_diaries.length === 0 ? (
                  // day_diaries가 빈 배열일 때
                  <images.kikiNoRecord
                    style={styles.kiki}
                    height={120}
                    width={120}
                  />
                ) : dayData?.day_kcal &&
                  goal_kcal &&
                  dayData.day_kcal > goal_kcal ? (
                  // day_kcal가 goal_kcal보다 클 때
                  <images.kikiOverCal
                    style={styles.kiki}
                    height={120}
                    width={120}
                  />
                ) : (
                  // 그 외의 경우 기본 kiki 이미지
                  React.createElement(kikiImages[currentImageIndex], {
                    width: 120,
                    height: 120,
                  })
                )}
                {showBubble && (
                  <View style={styles.bubble}>
                    <Text style={styles.bubbleText}>{bubbleText}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.nutrientInfo}>
              <View style={styles.allText}>
                <icons.tan style={styles.nutrientIcon} height={15} width={15} />
                <Text style={styles.nutrientText}>
                  탄수화물{' '}
                  <Text style={styles.nutrientCarb}>
                    {dayData?.day_carb ? `${dayData.day_carb}g` : '0g'}
                  </Text>
                </Text>
              </View>

              <View style={styles.allText}>
                <icons.dan style={styles.nutrientIcon} height={15} width={15} />
                <Text style={styles.nutrientText}>
                  단백질{' '}
                  <Text style={styles.nutrientCarb}>
                    {dayData?.day_protein ? `${dayData.day_protein}g` : '0g'}
                  </Text>
                </Text>
              </View>

              <View style={styles.allText}>
                <icons.ji style={styles.nutrientIcon} height={15} width={15} />
                <Text style={styles.nutrientText}>
                  지방{' '}
                  <Text style={styles.nutrientCarb}>
                    {dayData?.day_fat ? `${dayData.day_fat}g` : '0g'}
                  </Text>
                </Text>
              </View>

              <View style={styles.gaugeBox}>
                {/* 탄수화물 비율에 맞춘 바 */}
                <View
                  style={[
                    styles.gaugeSegment,
                    {
                      width: `${carbRatio * 100}%`, // 탄수화물 비율
                      backgroundColor: '#AEC3FE', // 탄수화물 색상
                      borderTopLeftRadius: 7,
                      borderBottomLeftRadius: 7,
                    },
                  ]}
                />
                {/* 단백질 비율에 맞춘 바 */}
                <View
                  style={[
                    styles.gaugeSegment,
                    {
                      width: `${proteinRatio * 100}%`, // 단백질 비율
                      backgroundColor: '#EEA9A9', // 단백질 색상
                    },
                  ]}
                />
                {/* 지방 비율에 맞춘 바 */}
                <View
                  style={[
                    styles.gaugeSegment,
                    {
                      width: `${fatRatio * 100}%`, // 지방 비율
                      backgroundColor: '#FFD2A4', // 지방 색상
                      borderTopRightRadius: 7,
                      borderBottomRightRadius: 7,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* 원형 그래프 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressWrapper}>
              <CircularProgress
                progress={
                  dayData?.day_cost && goal_cost
                    ? Math.min(
                        dayData.day_cost /
                          Math.round(
                            goal_cost /
                              new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth() + 1,
                                0,
                              ).getDate(),
                          ),
                        1,
                      )
                    : 0
                } // 비율을 1로 제한하여 그래프가 꽉 차게 보이도록 처리
                total={
                  goal_cost
                    ? Math.round(
                        goal_cost /
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1,
                            0,
                          ).getDate(),
                      )
                    : 0
                } // 총 금액
                current={dayData?.day_cost ? dayData.day_cost : 0} // 현재 소비한 금액
                progressColor="#769BFF"
                currentTextColor="#769BFF" // 첫 번째 그래프의 현재 텍스트 색상
                totalTextColor="black" // 첫 번째 그래프..의 총 텍스트 색상
                unit="₩" // 단위
              />
              <images.Subtract
                style={styles.overlayImage}
                height={130}
                width={130}
              />
            </View>
            <View style={styles.progressWrapper}>
              <CircularProgress
                progress={
                  dayData?.day_kcal && goal_kcal
                    ? Math.min(dayData.day_kcal / goal_kcal, 1)
                    : 0
                } // 비율을 1로 제한하여 그래프가 꽉 차게 보이도록 처리
                total={goal_kcal || 0} // 총 칼로리
                current={dayData?.day_kcal ? dayData.day_kcal : 0} // 현재 섭취한 칼로리
                progressColor="#84A4FB"
                currentTextColor="#84A4FB" // 두 번째 그래프의 현재 텍스트 색상
                totalTextColor="black" // 두 번째 그래프의 총 텍스트 색상
                unit="kcal" // 단위
              />
              <images.Subtract
                style={styles.overlayImage}
                height={130}
                width={130}
              />
            </View>
          </View>
        </View>

        <View style={styles.whiteBox}>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={handleReportNavigate}>
            <icons.arrowBackRight />
            <Text style={styles.reportBtnText}>REPORT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recordBox}>
          <RecordBox2
            title="아침"
            kcal={
              String(
                dayData?.day_diaries.find(
                  diary => diary.diary_time === 'BREAKFAST',
                )?.diary_kcal,
              ) || '0'
            }
            price={
              String(
                dayData?.day_diaries.find(
                  diary => diary.diary_time === 'BREAKFAST',
                )?.diary_cost,
              ) || '0'
            }
            isRecorded={
              !!dayData?.day_diaries.find(
                diary => diary.diary_time === 'BREAKFAST',
              )
            }
            onPress={() =>
              handleRecordBoxPress(
                !!dayData?.day_diaries.find(
                  diary => diary.diary_time === 'BREAKFAST',
                ),
                'BREAKFAST',
              )
            }
          />
          <RecordBox2
            title="점심"
            kcal={
              String(
                dayData?.day_diaries.find(diary => diary.diary_time === 'LUNCH')
                  ?.diary_kcal,
              ) || '0'
            }
            price={
              String(
                dayData?.day_diaries.find(diary => diary.diary_time === 'LUNCH')
                  ?.diary_cost,
              ) || '0'
            }
            isRecorded={
              !!dayData?.day_diaries.find(diary => diary.diary_time === 'LUNCH')
            }
            onPress={() =>
              handleRecordBoxPress(
                !!dayData?.day_diaries.find(
                  diary => diary.diary_time === 'LUNCH',
                ),
                'LUNCH',
              )
            }
          />
          <RecordBox2
            title="저녁"
            kcal={
              String(
                dayData?.day_diaries.find(
                  diary => diary.diary_time === 'DINNER',
                )?.diary_kcal,
              ) || '0'
            }
            price={
              String(
                dayData?.day_diaries.find(
                  diary => diary.diary_time === 'DINNER',
                )?.diary_cost,
              ) || '0'
            }
            isRecorded={
              !!dayData?.day_diaries.find(
                diary => diary.diary_time === 'DINNER',
              )
            }
            onPress={() =>
              handleRecordBoxPress(
                !!dayData?.day_diaries.find(
                  diary => diary.diary_time === 'DINNER',
                ),
                'DINNER',
              )
            }
          />
          <RecordBox2
            title="간식"
            kcal={
              String(
                dayData?.day_diaries.find(diary => diary.diary_time === 'SNACK')
                  ?.diary_kcal,
              ) || '0'
            }
            price={
              String(
                dayData?.day_diaries.find(diary => diary.diary_time === 'SNACK')
                  ?.diary_cost,
              ) || '0'
            }
            isRecorded={
              !!dayData?.day_diaries.find(diary => diary.diary_time === 'SNACK')
            }
            onPress={() =>
              handleRecordBoxPress(
                !!dayData?.day_diaries.find(
                  diary => diary.diary_time === 'SNACK',
                ),
                'SNACK',
              )
            }
          />
        </View>
        <View style={styles.weightBox}>
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <View style={styles.titleBox}>
                <TouchableOpacity
                  style={styles.boxIcon}
                  onPress={() => setWeightModalVisible(true)}>
                  <icons.settingsWhite height={20} width={20} />
                </TouchableOpacity>
                <icons.scale height={20} width={20} />
                <Text style={styles.boxText}>목표 체중 변경</Text>
              </View>
              <View style={styles.textBox}>
                <View style={styles.text}>
                  <Text style={styles.textTitle}>현재 체중</Text>
                  <Text style={styles.textDiscription}>
                    {weights && weights.length > 0 && weights[0].weight} kg
                  </Text>
                </View>
                <View style={styles.text}>
                  <Text style={styles.textTitle}>목표 체중</Text>
                  <Text style={styles.textDiscription}>{goal_weight} kg</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <FormModal
          visible={weightModalVisible}
          title="현재 체중 입력"
          initialValue={String(
            weights && weights.length > 0 && weights[0].weight,
          )}
          anotherTitle="목표 체중 입력"
          anotherInitialValue={String(goal_weight)}
          onClose={() => setWeightModalVisible(false)}
          onSave={handleWeightChange}
          isWeight={true}
          keyboardType="numeric"
        />
      </ScrollView>
      {/* RecordDetail 모달 */}
      {selectedRecord && (
        <Modal
          visible={isRecordDetailVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}>
          <Pressable style={styles.modalContainer} onPress={closeModal}>
            <RecordDetailModal
              id={selectedRecord.id}
              title={selectedRecord.title}
              date={formatDate(currentDate)}
              kcal={selectedRecord.kcal}
              price={selectedRecord.price}
              onClose={closeModal}
              onPress={() => handleRecordBoxPress(false, selectedRecord.title)}
            />
          </Pressable>
        </Modal>
      )}

      {/* CalanderModal */}
      <CalanderModal
        visible={isCalanderModalVisible}
        onClose={() => setIsCalanderModalVisible(false)} // 모달 닫기
        onSelectDate={handleSelectDate} // 날짜 선택 시 처리
      />
    </View>
  );
};

export default HomeScreen;
// export type RootState = ReturnType<typeof store.getState>;
