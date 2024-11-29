import React from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {images} from '../../../constants';
import {styles} from './IntroScreen.styles'; // 분리된 스타일을 임포트
import CustomButton from '../../../components/CustomButton';
type IntroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Intro'
>;
const IntroScreen: React.FC = () => {
  const navigation = useNavigation<IntroScreenNavigationProp>();

  return (
    <View style={styles.body}>
      <View style={styles.main}>
        <images.intro height={300} width={300} />
        <Text style={styles.title1}>All</Text>
        <Text style={styles.title2}>Eat!</Text>
        <Text style={styles.discription}>나의 식단 식비 관리, 올잇으로 한번에!</Text>
      </View>
      <CustomButton
        title="계속하기"
        handlePress={() => navigation.navigate('SignIn')}
        containerStyles="w-[80%] h-[60px]" // Tailwind 스타일 전달
        textStyles="text-white font-pbold" // Tailwind 스타일 전달
        isLoading={false} // 로딩 상태 설정
      />
    </View>
  );
};
export default IntroScreen;
