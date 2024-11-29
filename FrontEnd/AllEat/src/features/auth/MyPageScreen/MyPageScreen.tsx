import React, {useState, useMemo} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
// import {images} from '../../../constants';
import {icons} from '../../../constants';
import {styles} from './MyPageScreen.styles'; // 분리된 스타일을 임포트
import CustomButton from '../../../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux'; // Redux에서 액션을 디스패치하기 위한 훅
import {logout} from '../../../redux/features/authSlice'; // 로그아웃 액션 임포트
import {AppDispatch, RootState} from '../../../redux/store';
import UserInfo from '../components/UserInfo/UserInfo';
import api from '../../../utils/api';
import {fetchUserInfo} from '../../../redux/features/infoSlice';
import FormModal from '../../../components/FormModal/FormModal';
// import AlarmModal from '../components/AlarmModal/AlarmModal';
import MenuCard from '../../../components/MenuCard/MenuCard';
import {toggleFavorite} from '../../../redux/features/menuSlice';
type MyPageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MyPage'
>;
const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};
const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<MyPageScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [costModalVisible, setCostModalVisible] = useState(false);
  // const [alarmModalVisible, setAlarmModalVisible] = useState(false);

  // 리덕스 스토어에서 사용자 정보 가져오기
  const {
    email,
    user_name,
    user_gender,
    user_age,
    weights,
    goal_weight,
    goal_cost,
    // breakfast_alarm,
    // lunch_alarm,
    // dinner_alarm,
  } = useSelector((state: RootState) => state.info);
  const {menus} = useSelector((state: RootState) => state.menu);
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
  // const parseTimeStringToDate = (
  //   timeString: string | null,
  // ): Date | undefined => {
  //   if (!timeString) return undefined;

  //   const [hours, minutes, seconds] = timeString.split(':').map(Number);

  //   const date = new Date();
  //   date.setHours(hours);
  //   date.setMinutes(minutes);
  //   date.setSeconds(seconds || 0); // seconds가 없을 경우 0으로 설정

  //   return date;
  // };
  const handleCostChange = async (goalCost: string) => {
    // goal에 대한 POST 요청

    const goalResponse = await api.put('/AllEat/users/goals', {
      goal_weight: goal_weight,
      goal_cost: goalCost,
    });
    console.log('Goal Response:', goalResponse.data);

    dispatch(fetchUserInfo());
    setCostModalVisible(false); // 모달을 닫음
  };
  // const handleAlarmSave = async (newAlarms: {
  //   breakfast: String;
  //   lunch: String;
  //   dinner: String;
  // }) => {
  //   const formattedTimes = {
  //     breakfast_alarm: newAlarms.breakfast,
  //     lunch_alarm: newAlarms.lunch,
  //     dinner_alarm: newAlarms.dinner,
  //   };

  //   try {
  //     await api.put('/AllEat/alarm', formattedTimes);
  //     console.log('Alarm Response:', formattedTimes);
  //     dispatch(fetchUserInfo());
  //     setAlarmModalVisible(false); // 모달 닫기
  //   } catch (error) {
  //     console.error('알람 설정 중 오류 발생:', error);
  //   }
  // };
  const handleLogout = () => {
    // 로그아웃 액션 디스패치
    dispatch(logout());
    navigation.navigate('Intro');
  };
  const [toggleBookmark, setToggleBookmark] = useState(false);
  // 리덕스에서 favorite이 true인 메뉴만 필터링해서 가져오기
  const favoriteMenus = useMemo(() => {
    return menus.filter(menu => menu.favorite);
  }, [menus]);

  // 즐겨찾기 토글 함수 (리덕스 액션 사용)
  const handleToggleFavorite = (menuId: number, favorite: boolean) => {
    dispatch(toggleFavorite({menuId, favorite}));
  };
  // 이메일 형식인지 확인하는 함수
  const isEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };
  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.myPageBody}>
          <View style={styles.myPageTitle}>
            <Text style={styles.myPageTitleText}>마이 페이지</Text>
            <TouchableOpacity
              style={styles.myPageTitleIcon}
              onPress={() => navigation.navigate('MyPageUpdate')}>
              <icons.settings height={24} width={24} />
            </TouchableOpacity>
          </View>
          <UserInfo
            nickname={user_name}
            email={email}
            age={Number(user_age)}
            gender={user_gender === 0 ? '♀' : '♂'}
          />
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
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <View style={styles.titleBox}>
                <TouchableOpacity
                  style={styles.boxIcon}
                  onPress={() => setCostModalVisible(true)}>
                  <icons.settingsWhite height={20} width={20} />
                </TouchableOpacity>
                <icons.wallet height={20} width={20} />
                <Text style={styles.boxText}>목표 식비 변경</Text>
              </View>
              <View style={styles.textBox}>
                <View style={styles.text}>
                  <Text style={styles.textTitle}>목표 식비</Text>
                  <Text style={styles.textDiscription}>₩{goal_cost}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* <View style={styles.boxContainer}>
            <View style={styles.box}>
              <View style={styles.titleBox}>
                <TouchableOpacity
                  style={styles.boxIcon}
                  onPress={() => setAlarmModalVisible(true)}>
                  <icons.settingsWhite height={20} width={20} />
                </TouchableOpacity>
                <icons.clock height={20} width={20} />
                <Text style={styles.boxText}>알람 시간 변경</Text>
              </View>
              <View style={styles.alarmBox}>
                {!breakfast_alarm && !lunch_alarm && !dinner_alarm && (
                  <Text style={styles.noAlarm}>
                    설정한 시간에 맞춰 알림을 보내드려요!
                  </Text>
                )}
                {breakfast_alarm && (
                  <View style={styles.alarm}>
                    <images.breakfast height={24} width={24} />
                    <Text style={styles.textDiscription}>
                      {breakfast_alarm.split('', 5)}
                    </Text>
                  </View>
                )}
                {lunch_alarm && (
                  <View style={styles.alarm}>
                    <images.lunch height={24} width={24} />
                    <Text style={styles.textDiscription}>
                      {lunch_alarm.split('', 5)}
                    </Text>
                  </View>
                )}
                {dinner_alarm && (
                  <View style={styles.alarm}>
                    <images.dinner height={24} width={24} />
                    <Text style={styles.textDiscription}>
                      {dinner_alarm.split('', 5)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View> */}
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
          <FormModal
            visible={costModalVisible}
            title="목표 식비 입력"
            initialValue={String(goal_cost)}
            onClose={() => setCostModalVisible(false)}
            onSave={handleCostChange}
            isWeight={false}
            keyboardType="numeric"
          />
          {/* <AlarmModal
            visible={alarmModalVisible}
            initialAlarms={{
              ...(breakfast_alarm
                ? {breakfast: parseTimeStringToDate(breakfast_alarm)}
                : {}),
              ...(lunch_alarm
                ? {lunch: parseTimeStringToDate(lunch_alarm)}
                : {}),
              ...(dinner_alarm
                ? {dinner: parseTimeStringToDate(dinner_alarm)}
                : {}),
            }}
            onClose={() => setAlarmModalVisible(false)}
            onSave={handleAlarmSave}
          /> */}
          <View style={styles.bookmarkContainer}>
            <View style={styles.bookmarkTitleContainer}>
              <Text style={styles.bookmarkTitle}>즐겨찾기</Text>
              {toggleBookmark ? (
                <TouchableOpacity onPress={() => setToggleBookmark(false)}>
                  <icons.arrowBackTopWhite height={16} width={16} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setToggleBookmark(true)}>
                  <icons.arrowBackBottomWhite height={16} width={16} />
                </TouchableOpacity>
              )}
            </View>
            {toggleBookmark && (
              <ScrollView>
                {favoriteMenus.map(favoriteItem => (
                  <MenuCard
                    key={favoriteItem.menu_id} // menu_id를 키로 사용
                    isFavorate={favoriteItem.favorite} // favorite 상태
                    menu={favoriteItem.menu_name} // 메뉴 이름
                    restaurantName={
                      isEmail(favoriteItem.restaurants_name)
                        ? '집밥'
                        : favoriteItem.restaurants_name
                    }
                    kcal={favoriteItem.menu_calories} // 칼로리
                    price={favoriteItem.menu_price} // 가격
                    onToggleFavorite={() =>
                      handleToggleFavorite(
                        favoriteItem.menu_id,
                        favoriteItem.favorite,
                      )
                    } // 즐겨찾기 토글
                    isFavoritePage={true}
                  />
                ))}
              </ScrollView>
            )}
          </View>
          {/* <CustomButton
            title="로그아웃"
            handlePress={handleLogout}
            containerStyles="w-[40%] h-[60px] ml-3" // Tailwind 스타일 전달
            textStyles="text-white font-pbold" // Tailwind 스타일 전달
            isLoading={false} // 로딩 상태 설정
          /> */}
          <View style={styles.logout}>
            <TouchableOpacity onPress={handleLogout}>
              <Text>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default MyPageScreen;
