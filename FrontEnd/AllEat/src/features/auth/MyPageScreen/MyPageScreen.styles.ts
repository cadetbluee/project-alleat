import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    paddingBottom: 150,
    height: '100%',
  },
  myPageBody: {backgroundColor: 'white', height: '100%', display: 'flex'},
  myPageTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 60,
  },
  myPageTitleText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#3d3d3d',
  },
  myPageTitleIcon: {position: 'absolute', right: 30},
  myPageInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EAF0FF',
    padding: 24,
  },
  nickname: {fontSize: 24, fontFamily: 'Pretendard-Bold', color: '#3d3d3d'},
  email: {fontSize: 16, fontFamily: 'Pretendard-Light', color: '#3d3d3d'},
  ageAndGender: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
  age: {fontSize: 16, fontFamily: 'Pretendard-Bold', color: '#3d3d3d'},
  gender: {
    lineHeight: 29,
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#3d3d3d',
  },
  boxContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  box: {
    backgroundColor: '#769BFF',
    borderRadius: 10,
    padding: 5,
  },
  boxText: {color: 'white', fontSize: 18, fontFamily: 'Pretendard-Regular'},
  boxIcon: {position: 'absolute', right: 20},
  titleBox: {
    gap: 10,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBox: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  alarmBox: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
  },
  noAlarm: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'left',
  },
  text: {flexDirection: 'row', width: '50%', gap: 5},
  alarm: {flexDirection: 'row', width: '33%', gap: 5},
  textTitle: {color: 'white', fontSize: 18, fontFamily: 'Pretendard-Regular'},
  textDiscription: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
