import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  recordIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  recordIcon: {position: 'absolute', top: -21},
  mainRecordCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
    paddingBottom: 5,
    // borderBottomWidth: 1,
    // borderColor: 'white',
  },
  mainRecordMenu: {width: '40%'},
  mainRecordDetail: {alignItems: 'flex-end', width: '30%'},
  cardDescription: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
  },
  mainRecordPeople: {alignItems: 'center', width: '12%'},
  mainRecordPeopleButton: {alignItems: 'center', flexDirection: 'row'},
});
