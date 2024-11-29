import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  dateSection: {
    borderLeftWidth: 3,
    borderColor: '#769BFF',
    marginLeft: 30,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  dateIcon: {position: 'absolute', left: -13},
  dateText: {
    color: '#769BFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
  diaryContainer: {marginVertical: 3},
  diaryTitleContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  diaryTitle: {
    color: 'gray',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  menuTitle: {color: '#3d3d3d', fontSize: 17, fontFamily: 'Pretendard-Bold'},
  menuRestaurant: {
    color: '#3d3d3d',
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
  },
  menuDetail: {
    color: 'gray',
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    paddingBottom: 5,
  },
});
