import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'relative', // 부모 컨테이너를 상대적으로 배치하여 zIndex가 작동하도록 설정
  },
  text: {
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
  icon: {
    width: '25%',
    display: 'flex',
    alignItems: 'center',
    zIndex: 3, // 아이콘이 모든 요소 위에 있도록 조정
  },
  appBarContainer: {
    position: 'relative', // 그림자 원, 흰색 원, 아이콘이 모두 포함된 컨테이너
    zIndex: 2, // appBarContainer가 다른 요소들보다 뒤에 배치됨
  },
  appBar: {
    zIndex: 2, // appBar를 아이콘들 위에 배치
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 15,
    paddingTop: 10,
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 100, // 완전한 원형으로 만들기
    bottom: -11,
    left: -4,
    zIndex: 1, // 원형이 그림자 원보다 위, 아이콘들보다는 아래에 위치
  },
  shadowCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 100, // 완전한 원형으로 만들기
    bottom: -10,
    left: -4,
    zIndex: 0, // 그림자용 원은 제일 뒤에 위치
    elevation: 10, // 안드로이드에서 그림자 효과를 위한 elevation
  },
});
