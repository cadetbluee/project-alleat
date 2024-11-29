import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, Alert, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import FormField from '../../../components/FormField/FormField';
import CustomButton from '../../../components/CustomButton';
import {styles} from './SignUpScreen.styles';
import {RootStackParamList} from '../../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {icons} from '../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {signupUser} from '../../../redux/features/authSlice'; // loginUser 부분 제거
import {RootState} from '../../../redux/store';
import {AppDispatch} from '../../../redux/store';
import {AUTH_LOGIN_PASSWORD} from '@env';
import {fetchUserInfo} from '../../../redux/features/infoSlice'; // infoSlice에서 fetchUserInfo 가져오기
import {BACK_URL} from '@env';
import axios from 'axios';

import {loginUser} from '../../../redux/features/authSlice';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

const SignUp: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {loading, isAuthenticated} = useSelector(
    (state: RootState) => state.auth,
  ); // Redux 상태에서 로그인 여부 확인

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '', // 패스워드 확인용 필드
  });
  const [idToken, setIdToken] = useState<string | null>(null);

  // isAuthenticated 상태 변화 감지 후 초기 화면으로 이동
  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Initial');
    }
    GoogleSignin.configure({
      webClientId:
        '63668378347-461lhh603fihl1qri0ikdn759lbnvdub.apps.googleusercontent.com',
    });
  }, [isAuthenticated, navigation]);

  // 구글 로그인 가입 버튼
  const onPressGoogleBtn = async () => {
    try {
      // Google Play Services 체크
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Google 로그인

      const token = await GoogleSignin.getTokens();
      const idToken = token.idToken;

      const userInfoOfGoogle = await GoogleSignin.signIn();

      // db에서 이메일 찾아보기
      const email = {
        email: userInfoOfGoogle.data?.user.email,
      };
      const isNewResponse = await axios.post(
        `${BACK_URL}/AllEat/users/social-login`,
        email,
      );
      const isNew = isNewResponse.data.is_new;

      if (isNew) {
        // 새로운 계정이면 회원 가입 진행
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const res = await auth().signInWithCredential(googleCredential);

        if (res.user.email != null) {
          const signupData = {
            email: res.user.email,
            password: AUTH_LOGIN_PASSWORD,
            isSocial: true,
          };
          // console.log(loginData);
          await dispatch(signupUser(signupData));
        }
      } else {
        // 이미 있는 계정이면 로그인
        setIdToken(idToken);
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const res = await auth().signInWithCredential(googleCredential);
        if (res.user.email != null) {
          const loginData = {
            email: res.user.email,
            password: AUTH_LOGIN_PASSWORD,
            isSocial: true,
          };
          // console.log(loginData);
          await dispatch(loginUser(loginData));
          await dispatch(fetchUserInfo());
        }
      }
    } catch (error: any) {
      // 오류 처리
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    console.log(form);
    // 패스워드 확인 로직
    if (form.password !== form.confirmPassword) {
      Alert.alert('오류', '패스워드가 일치하지 않습니다.');
      return;
    }

    // 백엔드로 보낼 데이터 형식
    const signupData = {
      email: form.email,
      password: form.password,
      isSocial: false,
    };

    try {
      // 회원가입 및 로그인 액션 디스패치
      await dispatch(signupUser(signupData));
    } catch (error) {
      // error가 unknown 타입일 때 처리
      let errorMessage = '회원가입에 실패했습니다.';

      if (error instanceof Error) {
        errorMessage = error.message; // 에러가 Error 타입일 경우 message를 가져옴
      } else if (typeof error === 'string') {
        errorMessage = error; // 에러가 string일 경우
      }

      Alert.alert('회원가입 실패', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.realTitle}>올잇</Text>
        <Text style={styles.title}>과 함께 하시겠어요?</Text>
      </Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={onPressGoogleBtn}>
          <View style={styles.socialButtonGoogle}>
            <icons.socialGoogle
              style={styles.socialButton}
              width={24}
              height={24}
            />
            <Text style={styles.socialButtonText}>구글로 계속하기</Text>
          </View>
        </TouchableOpacity>
        {/* <View style={styles.socialButtonKakao}>
          <icons.socialKakao
            style={styles.socialButton}
            width={24}
            height={24}
          />
          <Text style={styles.socialButtonText}>카카오로 계속하기</Text>
        </View> */}
      </View>

      <View style={styles.orContainer}>
        <View style={styles.hairline} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.hairline} />
      </View>

      <View style={styles.formContainer}>
        <FormField
          title="이메일"
          value={form.email}
          handleChangeText={text => setForm({...form, email: text})}
          placeholder="이메일을 입력하세요"
        />
        <FormField
          title="패스워드"
          value={form.password}
          handleChangeText={text => setForm({...form, password: text})}
          placeholder="패스워드를 입력하세요"
          secureTextEntry
        />
        <FormField
          value={form.confirmPassword}
          handleChangeText={text => setForm({...form, confirmPassword: text})}
          placeholder="패스워드를 다시 입력하세요"
          secureTextEntry
          isEqual={
            form.confirmPassword !== '' &&
            form.password === form.confirmPassword
          }
        />
      </View>

      <CustomButton
        title="회원가입"
        containerStyles="w-[100%] h-[60px]" // Tailwind 스타일 전달
        textStyles="text-white font-pbold" // Tailwind 스타일 전달
        handlePress={handleSubmit}
        isLoading={loading} // 로딩 상태 연동
      />

      <View style={styles.loginTextContainer}>
        <Text style={styles.text}>이미 올잇 회원이신가요?</Text>
        <Pressable onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>로그인</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
