import React from 'react';
import { View, Text } from 'react-native';
import { images } from '../../../../constants'; // 이미지 경로 확인
import { styles } from './UserInfo.styles'; // UserInfo 전용 스타일 파일

interface UserInfoProps {
  nickname: string;
  email: string;
  age: number;
  gender: string; // 성별은 "♂" 또는 "♀"로 받을 수 있음
}

const UserInfo: React.FC<UserInfoProps> = ({ nickname, email, age, gender }) => {
  return (
    <View style={styles.userInfoContainer}>
      <Text style={styles.nickname}>{nickname}</Text>
      <Text style={styles.email}>{email}</Text>
      <images.mypageKiki height={120} width={120} />
      <View style={styles.ageAndGender}>
        <Text style={styles.age}>{age}세·</Text>
        <Text style={styles.gender}>{gender}</Text>
      </View>
    </View>
  );
};

export default UserInfo;
