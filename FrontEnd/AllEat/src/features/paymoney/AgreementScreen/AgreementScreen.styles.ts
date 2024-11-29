import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 채우도록 설정
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#769BFF',
    fontFamily: 'Pretendard-Bold',
  },
  agreementBox: {
    flex: 1, // 스크롤뷰가 남은 공간을 차지하도록 설정
    padding: 10,
    backgroundColor: '#F3F4F7',
    borderRadius: 8,
    // borderWidth: 1,
  },
  text: {
    fontSize: 15,
    padding: 10,
    color: '#333',
    lineHeight: 25,
    fontFamily: 'Pretendard-Light',
  },
  bottomContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-end',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    fontSize: 18,
  },
  checkboxText: {
    color: 'black',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
});
