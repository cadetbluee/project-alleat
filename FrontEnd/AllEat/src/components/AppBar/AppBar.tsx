import React, {useState, useRef} from 'react';
import {Text, View, Pressable, Animated, Dimensions} from 'react-native';
import {styles} from './AppBar.styles'; // 스타일 파일 임포트
import {icons} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation'; // RootStackParamList를 가져옵니다

type AppBarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AppBar: React.FC = () => {
  const navigation = useNavigation<AppBarNavigationProp>();

  // 화면 너비를 사용하여 아이콘의 위치를 계산
  const {width: screenWidth} = Dimensions.get('window');
  const iconWidth = screenWidth / 4; // 아이콘 하나의 너비 (4개 아이콘 기준)

  // 원형 모양을 애니메이션하기 위한 X 위치
  const animatedValue = useRef(new Animated.Value(0)).current;

  // 각 아이콘에 독립적인 애니메이션 상태를 생성
  const [homeScale] = useState(new Animated.Value(1));
  const [payScale] = useState(new Animated.Value(1));
  const [logScale] = useState(new Animated.Value(1));
  const [mypageScale] = useState(new Animated.Value(1));

  // 현재 선택된 아이콘 상태 관리
  const [selectedIcon, setSelectedIcon] = useState<string>('Home');

  // 아이콘을 클릭할 때 크기를 줄이는 함수
  const handlePressIn = (scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: 0.9, // 축소 비율
      useNativeDriver: true,
    }).start();
  };

  // 클릭 후 원래 크기로 복원하고 원형 이동 애니메이션 적용
  const handlePressOut = (
    scaleValue: Animated.Value,
    icon: string,
    index: number,
  ) => {
    Animated.spring(scaleValue, {
      toValue: 1.3, // 원래 크기로 복원
      useNativeDriver: true,
    }).start();
    setSelectedIcon(icon); // 선택된 아이콘 상태 업데이트

    // 원형을 클릭된 아이콘 위치로 이동
    Animated.spring(animatedValue, {
      toValue: index * iconWidth, // 클릭된 아이콘의 위치로 이동
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      {/* appBar */}
      <View style={styles.appBarContainer}>
        {/* 그림자용 원 */}
        <Animated.View
          style={[
            styles.shadowCircle,
            {
              transform: [{translateX: animatedValue}], // 원형의 X 위치 애니메이션
            },
          ]}
        />
        {/* 원형 애니메이션 영역을 appBar 밖에 위치시킴 */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{translateX: animatedValue}], // 원형의 X 위치 애니메이션
            },
          ]}
        />
        {/* appBar 안의 아이콘들 */}
        <View style={styles.appBar}>
          {/* 홈 아이콘 */}
          <Pressable
            style={styles.icon}
            onPressIn={() => handlePressIn(homeScale)}
            onPressOut={() => handlePressOut(homeScale, 'Home', 0)} // 0번 위치
            onPress={() => navigation.navigate('Home', {})}>
            <Animated.View
              style={[{transform: [{scale: homeScale}]}, styles.icon]}>
              {/* 선택 여부에 따라 아이콘 변경 */}
              {selectedIcon === 'Home' ? (
                <icons.home height={30} width={30} />
              ) : (
                <icons.homeDisabled height={30} width={30} />
              )}
            </Animated.View>
            <Text style={styles.text}>홈</Text>
          </Pressable>

          {/* 페이머니 아이콘 */}
          <Pressable
            style={styles.icon}
            onPressIn={() => handlePressIn(payScale)}
            onPressOut={() => handlePressOut(payScale, 'Paymoney', 1)} // 1번 위치
            onPress={() => navigation.navigate('Paymoney')}>
            <Animated.View style={{transform: [{scale: payScale}]}}>
              {selectedIcon === 'Paymoney' ? (
                <icons.pay height={30} width={30} />
              ) : (
                <icons.payDisabled height={30} width={30} />
              )}
            </Animated.View>
            <Text style={styles.text}>페이머니</Text>
          </Pressable>

          {/* 로그 아이콘 */}
          <Pressable
            style={styles.icon}
            onPressIn={() => handlePressIn(logScale)}
            onPressOut={() => handlePressOut(logScale, 'AllEatLog', 2)} // 2번 위치
            onPress={() => navigation.navigate('AllEatLog')}>
            <Animated.View style={{transform: [{scale: logScale}]}}>
              {selectedIcon === 'AllEatLog' ? (
                <icons.log height={30} width={30} />
              ) : (
                <icons.logDisabled height={30} width={30} />
              )}
            </Animated.View>
            <Text style={styles.text}>로그</Text>
          </Pressable>

          {/* 마이페이지 아이콘 */}
          <Pressable
            style={styles.icon}
            onPressIn={() => handlePressIn(mypageScale)}
            onPressOut={() => handlePressOut(mypageScale, 'MyPage', 3)} // 3번 위치
            onPress={() => navigation.navigate('MyPage')}>
            <Animated.View style={{transform: [{scale: mypageScale}]}}>
              {selectedIcon === 'MyPage' ? (
                <icons.mypage height={30} width={30} />
              ) : (
                <icons.mypageDisabled height={30} width={30} />
              )}
            </Animated.View>
            <Text style={styles.text}>마이 페이지</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AppBar;
