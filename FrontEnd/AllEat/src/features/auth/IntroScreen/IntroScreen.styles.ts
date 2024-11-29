import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  main: {
    height: '66%',
    position: 'relative',
  },
  discription: {
    color: '#3D3D3D',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.5,
    // paddingLeft: 5
  },
  title1: {
    fontFamily: 'BagelFatOne-Regular',
    color: 'white',
    position: 'absolute',
    fontSize: 100,
    textShadowColor: '#476ed4',
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowRadius: 20,
    paddingTop: 20,
  },
  title2: {
    fontFamily: 'BagelFatOne-Regular',
    color: 'white',
    position: 'absolute',
    fontSize: 100,
    textShadowColor: '#476ed4',
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowRadius: 20,
    paddingLeft: 40,
    paddingTop: 120,
  },
});
