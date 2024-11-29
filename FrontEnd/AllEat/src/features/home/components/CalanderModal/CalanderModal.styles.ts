import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    position: 'absolute',
    top: 70, 
    backgroundColor: 'white',
    width: '100%',
    maxHeight: '80%',
    alignItems: 'center',
    padding: 10,
    zIndex: 1, // modalContainer의 zIndex 값을 높여 다른 요소 위에 위치
  },
  shadowContainer: {
    position: 'absolute',
    top: 170, // modalContainer의 top 값과 동일하게 설정
    width: '100%',
    height: 240, // 그림자가 보일 높이 설정
    shadowColor: '#000', // 그림자 색상
    shadowOffset: {
      width: 0,
      height: 5, // 그림자를 아래쪽으로 집중
    },
    shadowOpacity: 0.25, // 그림자 불투명도
    shadowRadius: 3.84, // 그림자 반경
    elevation: 8, // 안드로이드 그림자 높이
    backgroundColor: 'black', // 그림자만 나타나도록 배경을 투명하게 설정
    zIndex: 0, // shadowContainer의 zIndex 값을 modalContainer보다 낮게 설정
  },
  modalTitleContainer: {
    alignSelf: 'flex-start',
    paddingStart: 20,
    paddingBottom: 10,
  },
  modalTitleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: 'black',
    letterSpacing: -1
  },
  modalBodyContainer: {
    width: '93%',
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: '#F3F4F7'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  arrowText: {
    fontSize: 18,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: 'black'
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    marginTop: 5,
  },
  weekDayText: {
    fontFamily: 'Pretendard-Medium',
    color: 'black',
    fontSize: 13,
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dateItem: {
    width: '14.2%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  dateText: {
    fontFamily: 'Pretendard-Light',
    color: 'black',
    fontSize: 13,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF7F7F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row', // dateText와 todayIcon을 가로로 배치
    alignItems: 'center', // 수직 정렬
    position: 'relative',
    justifyContent: 'center',
  },
  todayIcon: {
    position: 'absolute',
    zIndex: -1
  },
  
})