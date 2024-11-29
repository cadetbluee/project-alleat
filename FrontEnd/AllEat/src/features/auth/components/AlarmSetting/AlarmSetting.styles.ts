// components/AlarmSetting.styles.ts
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarm: {
    backgroundColor: '#769BFF',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 15,
    marginVertical: 5,
    paddingVertical: 10,
  },
  alarmdisabled: {
    backgroundColor: 'lightgray',
    color: 'lightgray',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 15,
    marginVertical: 5,
    paddingVertical: 10,
  },
  alarmTime: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  alarmTimeColor: {color: 'lightgray'},
  alarmText: {color: 'white', fontFamily: 'Pretendard-SemiBold'},
});
