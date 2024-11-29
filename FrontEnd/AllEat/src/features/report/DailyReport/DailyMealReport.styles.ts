import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  dailyMealReportContainer: {
    borderRadius: 8,
  },
  dailyMealReportTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 19,
    color: 'black',
  },
  kcalGraphConatiner: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  kcalGrpahDetailContainer: {
    paddingVertical: 40,
    justifyContent: 'space-between'
  },
  kcalGraphDetailBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  kcalGraphDetailText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    paddingLeft: 5,
    color: 'black'
  },
  kcalBarContainer: {
    position: 'relative'
  },
  warningIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 10
  },
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 14,
    marginVertical: 2,
  },
  kcalBarBox: {
    width: '100%',
    height: 25,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative', // 부모 요소에 상대적 위치
  },
  kcalBar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kcalTextOverlay: {
    position: 'absolute', // 텍스트를 절대 위치로
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 25, // 그래프 바 높이와 동일하게 설정하여 수직 중앙 정렬
  },
  nutrientContainer: {

  },
  nutrientTitle: {
    marginTop: 20,
    fontFamily: 'Pretendard-Bold',
    fontSize: 17,
    color: 'black',
  },
  nutrientGraphContainer: {
    marginTop: 10,
    height: 100,
    backgroundColor: 'lightgrey',
  },
  nutrientInfoContainer: {
    marginTop: 10,
  },
  nutrientBox: {

  },
  nutrientTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  nutrientIcon: {
    marginRight: 10
  },
  nutrientText: {
    marginRight: 5,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: 'black'
  },
  nutrientNum: {
    marginRight: 10,
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
    color: 'black'
  },
  nutrientDetailContainer: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    paddingTop: 10,
    marginTop: 10,
    backgroundColor: '#F3F4F7',
  },
  nutrientDetailRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  nutrienDetailText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Light',
    color: 'black',
    marginBottom: 2,
  },
});