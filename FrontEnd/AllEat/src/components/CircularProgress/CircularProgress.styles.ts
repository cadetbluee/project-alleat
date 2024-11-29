import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
  },
  currentText: {
    fontSize: 19,
    color: '#769BFF',
    fontFamily: 'Pretendard-SemiBold',
    zIndex: 1000,
  },
  totalText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Pretendard-Light',
    zIndex: 1000,
  },
});
