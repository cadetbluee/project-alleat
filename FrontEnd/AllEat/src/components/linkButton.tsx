import * as React from "react";
import {StyleSheet, Text, View, Pressable} from "react-native";
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {images} from '../constants';
import {RootStackParamList} from '../types/navigation';

// LinkButton 컴포넌트의 props 타입 정의
interface LinkButtonProps {
  text: string;
  targetScreen: keyof RootStackParamList; // 이동할 스크린 이름
}

const LinkButton: React.FC<LinkButtonProps> = ({text, targetScreen}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 버튼을 클릭했을 때 해당 페이지로 이동
  const handlePress = () => {
    navigation.navigate(targetScreen);
  };

  return (
    <Pressable style={styles.linkButton} onPress={handlePress}>
      <Text style={styles.text}>{text}</Text>
      <images.rightArrow width={30} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linkButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 320,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(243, 244, 247, 0.94)',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: -1.4,
    color: '#769bff',
  },
});

export default LinkButton;
