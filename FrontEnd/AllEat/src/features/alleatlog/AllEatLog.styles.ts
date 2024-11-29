import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {paddingBottom: 100, backgroundColor: 'white'},
  topbar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  day: {
    fontSize: 18,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-SemiBold',
  },
  arrowBackLeft: {
    marginRight: 20,
  },
  arrowBackRight: {
    marginLeft: 20,
  },
  scrollView: {
    // paddingHorizontal: 20,
    marginBottom: 100,
    minHeight: 500,
  },
  allText: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 20,
  },
  textBlack: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 10,
  },
  textBlue: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#769BFF',
    marginTop: 10,
  },
});
