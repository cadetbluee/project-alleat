import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingRight: 290,
    paddingLeft: 16,
  },
  indicator: {
    marginHorizontal: 4,
    backgroundColor: '#93AAE7',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  focusedIndicator: {
    backgroundColor: '#626B86',
  },
  indicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  pageItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: '101%',
    // backgroundColor: 'black',
  },
  pageNum: {
    fontSize: 16,
    color: '#000', // 기본 텍스트 색상
  },
  QRButton: {
    backgroundColor: '#F3F4F7',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  QRButtonText: {
    color: '#769BFF',
    fontSize: 16,
    letterSpacing: -1,
    fontFamily: 'Pretendard-SemiBold',
  },
});
