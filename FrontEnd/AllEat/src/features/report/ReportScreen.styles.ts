import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    height: 60,
    paddingHorizontal: 5,
  },
  topText: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: -2,
    color: 'black',
    opacity: 0.5,
    paddingHorizontal: 12,
  },
  topSlash: {
    color: 'lightgrey'
  },
  selectedText: {
    opacity: 1,
    fontFamily: 'Pretendard-ExtraBold',
  },
  container: {
    height: '100%',
    backgroundColor: '#EAF0FF',
    paddingBottom: 200
    },
});
