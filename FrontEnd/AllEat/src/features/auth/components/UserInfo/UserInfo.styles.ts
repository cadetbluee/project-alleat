import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EAF0FF',
    padding: 24,
  },
  nickname: {fontSize: 24, fontFamily: 'Pretendard-Bold', color: '#3d3d3d'},
  email: {
    fontSize: 16,
    fontFamily: 'Pretendard-Light',
    color: '#3d3d3d',
    marginBottom: 5,
  },
  ageAndGender: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
  age: {fontSize: 16, fontFamily: 'Pretendard-Bold', color: '#3d3d3d'},
  gender: {
    lineHeight: 29,
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#3d3d3d',
  },
});
