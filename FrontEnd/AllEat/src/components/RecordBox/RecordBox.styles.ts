import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  shadowContainer: {

  },
  recordContainer: {
    // width: 150,
    height: 110,
    position: 'relative', // 텍스트와 아이콘을 배치할 수 있도록 설정
    marginBottom: 10,
    
  },
  overlay: {
    position: 'absolute',
    top: -45,
    left: 2,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  priceText: {
    position: 'absolute',
    top: 51,
    right: 6,
    color: '#3D3D3D',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#3D3D3D',
    marginTop: 40,
  },
  kcal: {
    fontSize: 14,
    color: '#828282',
    marginTop: 5,
    fontFamily: 'Pretendard-SemiBold',
  },
  iconWrapper: {
    position: 'absolute',
    top: 33,
    right: 10,
    // backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 5,
  },
});
