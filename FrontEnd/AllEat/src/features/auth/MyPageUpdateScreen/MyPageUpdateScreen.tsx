import React, {useEffect} from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {icons} from '../../../constants';
import {styles} from './MyPageUpdate.styles'; // 분리된 스타일을 임포트
import CustomButton from '../../../components/CustomButton';
import FormField from '../../../components/FormField/FormField';
import {useState} from 'react';
import GenderSelection from '../components/GenderSelection/GenderSelection';
import ActivityLevelSelection from '../components/ActivityLevelSelection/ActivityLevelSelection';
import api from '../../../utils/api';
import UserInfo from '../components/UserInfo/UserInfo';
import {AppDispatch} from '../../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserInfo} from '../../../redux/features/infoSlice';
import {RootState} from '../../../redux/store';
import messaging from '@react-native-firebase/messaging';

type MyPageUpdateScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MyPageUpdate'
>;
const MyPageUpdateScreen: React.FC = () => {
  const getExistingFcmToken = async () => {
    // Get the existing FCM token
    const token = await messaging().getToken();
    console.log('token', token);
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
  const navigation = useNavigation<MyPageUpdateScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const info = useSelector((state: RootState) => state.info);
  const [form, setForm] = useState({
    user_name: info.user_name,
    user_age: info.user_age,
    user_height: info.user_height,
    user_gender: info.user_gender as 0 | 1, // 0 또는 1만 허용
    activity_amount: info.activity_amount as 0 | 1 | 2, // 0, 1, 2만 허용
    password1: '',
    password2: '',
    fcm_token: fcmToken,
  });
  const handleSubmit = async () => {
    const formData = new FormData();

    // Define the type to allow optional password fields
    type UserData = {
      user_age: number;
      user_gender: 0 | 1;
      user_height: number;
      activity_amount: 0 | 1 | 2;
      user_name: string;
      fcm_token: string;
      password1?: string; // Optional field
      password2?: string; // Optional field
    };

    // Construct the basic form data
    const userData: UserData = {
      user_age: Number(form.user_age),
      user_gender: form.user_gender,
      user_height: parseFloat(form.user_height),
      activity_amount: form.activity_amount,
      user_name: form.user_name,
      fcm_token: fcmToken,
    };

    // Conditionally add password fields if they are not empty
    if (form.password1 !== '' && form.password2 !== '') {
      userData.password1 = form.password1;
      userData.password2 = form.password2;
    }

    formData.append('data', {
      string: JSON.stringify(userData),
      type: 'application/json',
    });

    // formData.append('data', blob);
    console.log(formData);
    //여기서 axios요청 보내기
    //goal은 /AllEat/users/goals(POST)
    //weight은 /AllEat/weight(POST)
    //submittedForm은 /AllEat/users/info(PUT)
    try {
      // submittedForm에 대한 PUT 요청
      const formResponse = await api.put('/AllEat/users/info', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      console.log('Form Response:', formResponse.data);
      await dispatch(fetchUserInfo());

      // 모든 요청이 성공하면 홈으로 이동
      navigation.navigate('MyPage');
    } catch (error) {
      console.error('Error occurred during form submission:', error);
      // 에러 처리 추가
    }
  };

  return (
    <ScrollView>
      <View style={styles.myPageTitle}>
        <Text style={styles.myPageTitleText}>회원정보 수정</Text>
        <TouchableOpacity
          style={styles.myPageTitleIcon}
          onPress={() => navigation.navigate('MyPage')}>
          <icons.arrowBackLeft height={24} width={24} />
        </TouchableOpacity>
      </View>
      <UserInfo
        nickname={form.user_name}
        email={info.email}
        age={Number(form.user_age)}
        gender={form.user_gender === 0 ? '♀' : '♂'}
      />
      <View style={styles.body}>
        <FormField
          title="닉네임"
          value={form.user_name}
          handleChangeText={text => setForm({...form, user_name: text})}
          placeholder="키키"
        />
        <FormField
          title="비밀번호"
          value={form.password1}
          handleChangeText={text => setForm({...form, password1: text})}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
        />
        <FormField
          value={form.password2}
          handleChangeText={text => setForm({...form, password2: text})}
          placeholder="비밀번호를 다시 입력하세요"
          isEqual={form.password2 !== '' && form.password1 === form.password2}
          secureTextEntry
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

        <GenderSelection
          selectedGender={form.user_gender}
          onSelect={user_gender => setForm({...form, user_gender})}
        />
        <ActivityLevelSelection
          selectedActiveRange={form.activity_amount}
          onSelect={activity_amount => setForm({...form, activity_amount})}
        />
        <CustomButton
          title="수정하기"
          handlePress={handleSubmit}
          containerStyles="w-[100%] h-[60px] mt-3" // Tailwind 스타일 전달
          textStyles="text-white font-pbold" // Tailwind 스타일 전달
          isLoading={false} // 로딩 상태 설정
        />
      </View>
    </ScrollView>
  );
};
export default MyPageUpdateScreen;
