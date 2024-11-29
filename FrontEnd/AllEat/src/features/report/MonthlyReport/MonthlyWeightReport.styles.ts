import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  monthlyMealReportContainer: {
    borderRadius: 8,
  },
  monthlyMealReportTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 19,
    color: 'black',
  },
  costGraphContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  costGraphTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 17,
    color: 'black',
  },
  costGraphText: {
    fontFamily: 'Pretendard-Light',
    fontSize: 12,
    color: 'black',
    letterSpacing: -0.7,
    marginLeft: 10
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

  nutrientTitle: {
    marginTop: 20,
    fontFamily: 'Pretendard-Bold',
    fontSize: 17,
    color: 'black',
  },
  feeDetailContainer: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    paddingTop: 10,
    marginTop: 10,
    backgroundColor: '#F3F4F7',
  },
  mealTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  mealIcon: {
    marginRight: 10
  },
  feeMenuText: {
    marginRight: 5,
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: 'black',
  },
  feePriceText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Light',
    color: 'black',
  },
  iconConatiner: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noWeightDataMessage: {
    
  }
});