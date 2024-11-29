import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  dailyReportContainer: {
    padding: '4%',
  },
  dateNavigatorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  date: {
    color: 'black',
    fontFamily: 'Pretendard-Bold',
    fontSize: 19
  },
  ReportContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 15
  },
  mealContainer: {

  },
  costContainer: {

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AIContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    position: 'relative',
    padding: 20,
  },
  AIIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  AITitleText: {
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 17,
    color: 'black',
  },
  lodingText: {
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
    color: 'black',
  }
});
