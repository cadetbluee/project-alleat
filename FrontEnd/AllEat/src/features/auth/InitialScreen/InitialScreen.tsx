import React from 'react';
import {ScrollView, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
// import {images} from '../../../constants';
import {styles} from './InitialScreen.styles'; // 분리된 스타일을 임포트
import CustomButton from '../../../components/CustomButton';
import FormField from '../../../components/FormField/FormField';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import AlarmSetting from '../components/AlarmSetting/AlarmSetting';
import GenderSelection from '../components/GenderSelection/GenderSelection';
import ActivityLevelSelection from '../components/ActivityLevelSelection/ActivityLevelSelection';
import api from '../../../utils/api';
import {AppDispatch} from '../../../redux/store';
import {fetchUserInfo} from '../../../redux/features/infoSlice';
import {RootState} from '../../../redux/store';
import messaging from '@react-native-firebase/messaging';

type InitialScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Initial'
>;

const InitialScreen: React.FC = () => {
  const navigation = useNavigation<InitialScreenNavigationProp>();

  const {isSocial} = useSelector((state: RootState) => state.auth);

  // const sendFcmTokenToServer = async (token: String) => {
  //   try {
  //     const response = await axios.put('https://your-spring-server.com/api/users/info', {
  //       token: token,
  //     });
  //     console.log('Token sent successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error sending token:', error);
  //   }
  // };

  const getExistingFcmToken = async () => {
    // Get the existing FCM token
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
      setFcmToken(token);
      // Send the token to your Spring server
      // sendFcmTokenToServer(token);
    } else {
      console.log('No token available');
    }
  };

  useEffect(() => {
    getExistingFcmToken();
  }, []);

  const [fcmToken, setFcmToken] = useState('');
  const [weight, setWeight] = useState({
    weight: '',
  });
  const [goal, setGoal] = useState({
    goal_weight: '',
    goal_cost: '',
  });
  const [form, setForm] = useState({
    user_name: '',
    user_age: '',
    user_height: '',
    user_gender: 0 as 0 | 1, // 0 또는 1만 허용
    activity_amount: 1 as 0 | 1 | 2, // 0, 1, 2만 허용
  });
  const [alarm, setAlarm] = useState({
    breakfast: new Date(new Date().setHours(8, 0, 0, 0)),
    lunch: new Date(new Date().setHours(12, 0, 0, 0)),
    dinner: new Date(new Date().setHours(18, 0, 0, 0)),
  });
  const [visiblePicker, setVisiblePicker] = useState<
    'breakfast' | 'lunch' | 'dinner' | null
  >(null);

  // const [isBreakfastEnabled, setIsBreakfastEnabled] = useState(false);
  // const [isLunchEnabled, setIsLunchEnabled] = useState(false);
  // const [isDinnerEnabled, setIsDinnerEnabled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const toggleAlarm = (type: 'breakfast' | 'lunch' | 'dinner') => {
  //   if (type === 'breakfast') {
  //     setIsBreakfastEnabled(!isBreakfastEnabled);
  //   } else if (type === 'lunch') {
  //     setIsLunchEnabled(!isLunchEnabled);
  //   } else if (type === 'dinner') {
  //     setIsDinnerEnabled(!isDinnerEnabled);
  //   }
  // };

  // const onPressTime = (time: 'breakfast' | 'lunch' | 'dinner') => {
  //   setVisiblePicker(time);
  // };

  const onConfirm = (selectedDate: Date) => {
    if (visiblePicker === 'breakfast') {
      setAlarm({...alarm, breakfast: selectedDate});
    } else if (visiblePicker === 'lunch') {
      setAlarm({...alarm, lunch: selectedDate});
    } else if (visiblePicker === 'dinner') {
      setAlarm({...alarm, dinner: selectedDate});
    }
    setVisiblePicker(null);
  };

  const onCancel = () => {
    setVisiblePicker(null);
  };
  const handleSubmit = async () => {
    // const alarmTime = {
    //   breakfast_alarm: isBreakfastEnabled
    //     ? alarm.breakfast.toLocaleTimeString('it-IT')
    //     : '',
    //   lunch_alarm: isLunchEnabled
    //     ? alarm.lunch.toLocaleTimeString('it-IT')
    //     : '',
    //   dinner_alarm: isDinnerEnabled
    //     ? alarm.dinner.toLocaleTimeString('it-IT')
    //     : '',
    // };

    const formData = new FormData();
    formData.append('data', {
      string: JSON.stringify({
        user_age: Number(form.user_age),
        user_gender: form.user_gender,
        user_height: parseFloat(form.user_height),
        activity_amount: form.activity_amount,
        user_name: form.user_name,
        social_login: isSocial,
        fcm_token: fcmToken,
      }),
      type: 'application/json',
    });
    console.log({
      user_age: Number(form.user_age),
      user_gender: form.user_gender,
      user_height: parseFloat(form.user_height),
      activity_amount: form.activity_amount,
      user_name: form.user_name,
    });
    console.log(formData);
    console.log(weight);
    console.log(goal);
    // console.log(alarmTime);
    //여기서 axios요청 보내기
    //goal은 /AllEat/users/goals(POST)
    //weight은 /AllEat/weight(POST)
    //submittedForm은 /AllEat/users/info(PUT)
    try {
      // goal에 대한 POST 요청

      const goalResponse = await api.post('/AllEat/users/goals', {
        goal_cost: Number(goal.goal_cost),
        goal_weight: parseFloat(goal.goal_weight),
      });
      console.log('Goal Response:', goalResponse.data);

      // submittedForm에 대한 PUT 요청
      const formResponse = await api.put('/AllEat/users/info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form Response:', formResponse.data);
      // weight에 대한 POST 요청
      const weightResponse = await api.post('/AllEat/weight', {
        weight: parseFloat(weight.weight),
      });
      console.log('Weight Response:', weightResponse.data);

      // // alarm에 대한 POST 요청
      // const alarmResponse = await api.post('/AllEat/alarm', alarmTime);
      // console.log('Weight Response:', alarmResponse.data);
      dispatch(fetchUserInfo());
      // 모든 요청이 성공하면 약관페이지로 이동
      navigation.navigate('Agreement');
    } catch (error) {
      console.error('Error occurred during form submission:', error);
      // 에러 처리 추가
    }
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <Text style={styles.title}>추가 정보를 입력해주세요!</Text>
        <FormField
          title="닉네임"
          value={form.user_name}
          handleChangeText={text => setForm({...form, user_name: text})}
          placeholder="키키"
        />
        <FormField
          title="나이"
          value={form.user_age}
          unit="세"
          handleChangeText={text => setForm({...form, user_age: text})}
          otherStyles={styles.field}
          placeholder="0"
          isNumeric={true}
          isDecimal={false}
        />
        <FormField
          title="키"
          value={form.user_height}
          unit="cm"
          handleChangeText={text => setForm({...form, user_height: text})}
          otherStyles={styles.field}
          placeholder="0.0"
          isNumeric={true}
          isDecimal={true}
        />
        <FormField
          title="현재 몸무게"
          value={weight.weight}
          unit="kg"
          handleChangeText={text => setWeight({weight: text})}
          otherStyles={styles.field}
          placeholder="00.0"
          isNumeric={true}
          isDecimal={true}
        />
        <FormField
          title="목표 몸무게"
          value={goal.goal_weight}
          unit="kg"
          handleChangeText={text => setGoal({...goal, goal_weight: text})}
          otherStyles={styles.field}
          placeholder="00.0"
          isNumeric={true}
          isDecimal={true}
        />
        <FormField
          title="이달의 목표 식비"
          value={goal.goal_cost}
          unit="원"
          handleChangeText={text => setGoal({...goal, goal_cost: text})}
          placeholder="0"
          isNumeric={true}
          isDecimal={false}
        />
        <GenderSelection
          selectedGender={form.user_gender}
          onSelect={user_gender => setForm({...form, user_gender})}
        />
        <ActivityLevelSelection
          selectedActiveRange={form.activity_amount}
          onSelect={activity_amount => setForm({...form, activity_amount})}
        />
        {/* <View style={styles.form}>
          <Text style={styles.formLabel}>알람을 언제 보낼까요?</Text>
          <AlarmSetting
            isEnabled={isBreakfastEnabled}
            onToggle={() => toggleAlarm('breakfast')}
            label="아침식사 기록 알림"
            time={alarm.breakfast}
            onPress={() => onPressTime('breakfast')}
            icon={images.breakfast}
          />
          <AlarmSetting
            isEnabled={isLunchEnabled}
            onToggle={() => toggleAlarm('lunch')}
            label="점심식사 기록 알림"
            time={alarm.lunch}
            onPress={() => onPressTime('lunch')}
            icon={images.lunch}
          />
          <AlarmSetting
            isEnabled={isDinnerEnabled}
            onToggle={() => toggleAlarm('dinner')}
            label="저녁식사 기록 알림"
            time={alarm.dinner}
            onPress={() => onPressTime('dinner')}
            icon={images.dinner}
          />
        </View> */}
        <CustomButton
          title="계속하기"
          // handlePress={handleSubmit}
          handlePress={handleSubmit}
          containerStyles="w-[100%] h-[60px]" // Tailwind 스타일 전달
          textStyles="text-white font-pbold" // Tailwind 스타일 전달
          isLoading={false} // 로딩 상태 설정
        />
        <DateTimePickerModal
          isVisible={visiblePicker !== null}
          onConfirm={onConfirm}
          onCancel={onCancel}
          mode="time"
          date={
            visiblePicker === 'breakfast'
              ? alarm.breakfast
              : visiblePicker === 'lunch'
              ? alarm.lunch
              : alarm.dinner
          }
        />
      </View>
    </ScrollView>
  );
};
export default InitialScreen;
