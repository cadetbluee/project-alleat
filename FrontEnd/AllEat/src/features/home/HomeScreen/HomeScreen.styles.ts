import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  topbar: {
    position: 'absolute', // 고정된 상단 바
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    height: 70, // 높이를 조정
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, // 좌우 패딩 조정
  },
  scrollContainer: {
    marginTop: 70, // 상단 바 크기만큼 마진 추가
    flex: 1,
  },
  notificationIcon: {
    position: 'absolute',
    flex: 1,
    height: '35.8%',
    width: '6.94%',
    top: '35%',
    right: '10.83%',
    bottom: '32.3%',
    left: '82.22%',
  },
  notiBadge: {
    position: 'absolute',
    height: '35.8%',
    width: '6.94%',
    top: '35%',
    right: '10.83%',
    bottom: '32.3%',
    left: '85.22%',
    zIndex: 1000,
  },
  arrowBackRight: {
    // position: 'absolute',
  },
  arrowBackLeft: {
    // position: 'absolute',
  },
  homeDate: {
    position: 'relative',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calanderBtn: {
    position: 'absolute',
    top: 8,
    left: 164,
  },
  day: {
    color: '#3D3D3D',
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
  },
  mainConatiner: {
    backgroundColor: 'whitesmoke',
  },
  mainbox: {
    flex: 1,
    width: '100%',
    height: 350,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    paddingBottom: 48,
  },
  allText: {
    flexDirection: 'row',
  },
  eatpay: {
    fontSize: 17,
    fontFamily: 'Pretendard-Light',
    marginTop: 10,
    color: '#3D3D3D',
  },
  eatpayValue: {
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
    color: '#769BFF',
    marginTop: 10,
  },
  re_checkIcon: {
    marginTop: 13,
  },
  kiki: {
    // position: 'absolute',
  },
  kikiShadow: {
    position: 'absolute',
    marginTop: 75,
    marginLeft: 18,
  },
  kikiBox: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%', // 전체 너비를 사용
    // marginLeft: 90, // 캐릭터 왼쪽 여백
    // marginRight: 180,
    marginTop: 30,
    // backgroundColor: 'pink',
  },
  charInfo: {
    // position: 'absolute',
    flexDirection: 'column',
    left: 0, // 왼쪽에 고정
    top: 0, // 필요한 경우 상단에 위치
    marginLeft: 30,
    position: 'relative', // 말풍선을 캐릭터 위에 배치하기 위해 relative 사용
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    bottom: 110, // 캐릭터 이미지 위에 위치하도록 조정
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    borderColor: '#ddd',
    opacity: 0.7,
    width: 165,
    zIndex: 2,
  },
  bubbleText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
  // 게이지 새로 추가
  nutrientInfo: {
    // position: 'absolute',
    flexDirection: 'column',
    right: 0,
    top: 0,
    marginRight: 30,
  },
  nutrientText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 8,
    color: '#3D3D3D',
  },
  nutrientCarb: {
    color: '#769BFF',
    fontFamily: 'Pretendard-Medium',
  },
  nutrientProtein: {
    color: '#4D7CFE',
    fontFamily: 'Pretendard-Medium',
  },
  nutrientFat: {
    color: '#A0BFFF',
    fontFamily: 'Pretendard-Medium',
  },
  gaugeBox: {
    flexDirection: 'row', // 가로로 배치
    height: 20, // 게이지 높이 설정
    width: 130,
    borderRadius: 7, // 전체 게이지 바의 둥근 모서리
    backgroundColor: '#EAF0FF', // 배경색 (남는 부분)
    overflow: 'hidden', // 둥근 모서리에서 넘치는 부분 숨김
  },
  gaugeSegment: {
    height: '100%', // 세그먼트가 전체 게이지 높이를 채우도록
  },
  nutrientIcon: {
    marginTop: 5,
    marginRight: 5,
  },
  // 원그래프
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // 원형 프로그레스 바를 나란히 배치
    marginTop: 65,
    width: '100%',
    // backgroundColor: 'black',
  },
  progressWrapper: {
    alignItems: 'center', // 프로그레스 바와 텍스트를 중앙에 배치
    justifyContent: 'center',
  },
  overlayImage: {
    position: 'absolute',
    width: 12, // 원형 그래프 크기와 맞춤
    height: 12,
    zIndex: 2, // 이미지가 원형 그래프 위
  },
  whiteBox: {
    backgroundColor: 'white',
    color: 'white',
    paddingTop: 10,
    // justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  reportBtn: {
    flexDirection: 'row',
    marginLeft: '3%',
    alignItems: 'center',
  },
  reportBtnText: {
    fontFamily: 'Pretendard-Bold',
    color: '#3D3D3D',
    fontSize: 19,
  },
  recordBox: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  leftRecord: {
    backgroundColor: 'white',
  },
  rightRecord: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  boxContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  box: {
    backgroundColor: '#F3F4F7',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000', // 그림자 색상
    shadowOffset: {
      width: 0,
      height: 2,
    }, // 그림자 위치 (x, y)
    shadowOpacity: 0.25, // 그림자 불투명도
    shadowRadius: 3.84, // 그림자 반경
    elevation: 1, // 안드로이드 그림자 높이
    marginHorizontal: 4,
  },
  boxText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#3D3D3D',
  },
  boxIcon: {position: 'absolute', right: 20},
  titleBox: {
    gap: 10,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    gap: 5,
    marginVertical: 10,
  },
  alarmWhiteBox: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 2,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  titleBoxText: {fontSize: 16, color: '#3d3d3d', fontFamily: 'Pretendard-Bold'},
  actionButton: {
    margin: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    borderRadius: 10,
  },
  isRecord: {backgroundColor: '#DB8989'},
  later: {backgroundColor: '#EBC5C5'},
  icon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Pretendard-Bold',
  },
  textBox: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  text: {flexDirection: 'row', width: '50%', gap: 5},
  textTitle: {color: '#3D3D3D', fontSize: 18, fontFamily: 'Pretendard-Regular'},
  textDiscription: {
    color: '#3D3D3D',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
  },
  weightBox: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    paddingBottom: 100,
  },
  editMartAmountForm: {width: '88%'},
});
