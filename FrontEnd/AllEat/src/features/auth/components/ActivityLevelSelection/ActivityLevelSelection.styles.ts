import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  form: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  formLabel: {
    fontSize: 16,
    color: '#3D3D3D', // 회색 텍스트 색상
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 10,
    width: '100%',
  },
  image: {width: '33%', alignItems: 'center'},
});
