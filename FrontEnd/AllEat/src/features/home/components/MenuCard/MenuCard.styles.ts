import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  restaurantMenu: {
    backgroundColor: '#769BFF',
    flexDirection: 'row',
    height: 56,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  restaurantMenuTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    width: '45%',
  },
  restaurantMenuDetail: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
});
