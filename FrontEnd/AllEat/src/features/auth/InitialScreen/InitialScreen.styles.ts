import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
    height: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Bold',
  },
  field: {
    width: '48%',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    width: '50%',
    alignItems: 'center',
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
