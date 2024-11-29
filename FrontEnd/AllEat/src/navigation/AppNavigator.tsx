import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../features/splash/splashScreen';
import IntroScreen from '../features/auth/IntroScreen/IntroScreen';
import MyPageScreen from '../features/auth/MyPageScreen/MyPageScreen';
import MyPageUpdateScreen from '../features/auth/MyPageUpdateScreen/MyPageUpdateScreen';
import InitialScreen from '../features/auth/InitialScreen/InitialScreen';
import SignIn from '../features/auth/SignInScreen/SignInScreen';
import SignUp from '../features/auth/SignUpScreen/SignUpScreen';
import HomeScreen from '../features/home/HomeScreen/HomeScreen';
import Agreement from '../features/paymoney/AgreementScreen/AgreementScreen';
import Paymoney from '../features/paymoney/PaymoneyScreen/PaymoneyScreen';
import PaymoneyDetail from '../features/paymoney/PaymoneyScreen/PaymoneyDetailScreen';
import Report from '../features/report/ReportScreen';
import PaymoneyDetail from '../features/paymoney/PaymoneyScreen/PaymoneyDetailScreen';
import Report from '../features/report/ReportScreen';
import AppBar from '../components/AppBar/AppBar';
import {useNavigationState} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store'; // Redux 스토어 타입
import DiaryCreateScreen from '../features/home/DiaryCreateScreen/DiaryCreateScreen';
import AllEatLog from '../features/alleatlog/AllEatLog';
import AlertScreen from '../features/alert/AlertScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const navigationState = useNavigationState(state => state);

  // 현재 네비게이션 상태에 따른 AppBar 표시 여부
  const currentRouteName = navigationState
    ? navigationState.routes[navigationState.index].name
    : null;

  // AppBar를 숨길 스크린 목록
  const hiddenScreens = [
    'Intro',
    'SignUp',
    'SignIn',
    'SplashScreen',
    'Initial',
    'Agreement',
  ];

  // AppBar를 표시할지 여부 결정
  const shouldShowAppBar =
    currentRouteName && !hiddenScreens.includes(currentRouteName);

  // Redux에서 인증 상태 확인
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [showSplash, setShowSplash] = useState(true);

  // SplashScreen을 2.2초 동안 보여주고 나서 인증 상태에 따라 화면 전환
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200); // SplashScreen을 2.2초 동안 보여줌
    return () => clearTimeout(timer);
  }, []);

  // SplashScreen이 끝난 후 인증 여부에 따라 Home 또는 Intro로 이동
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Intro'}>
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DiaryCreate"
          component={DiaryCreateScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DiaryCreate"
          component={DiaryCreateScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Initial"
          component={InitialScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Agreement"
          component={Agreement}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Paymoney"
          component={Paymoney}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymoneyDetail"
          component={PaymoneyDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPageUpdate"
          component={MyPageUpdateScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Report"
          component={Report}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AllEatLog"
          component={AllEatLog}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AlertScreen"
          component={AlertScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>

      {/* 필요한 경우에만 AppBar를 렌더링 */}
      {shouldShowAppBar && <AppBar />}
    </>
  );
};

export default AppNavigator;
