import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  restaurantMenu: {
    backgroundColor: '#F3F4F7',
    flexDirection: 'row',
    // height: 56,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  // favorite: {
  //   backgroundColor: '#B7CAFF',
  //   flexDirection: 'row',
  //   height: 56,
  //   // padding: 10,
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   marginBottom: 10,
  // },
  restaurantMenuBox: {width: '80%'},
  restaurantMenuTitle: {
    color: '#3d3d3d',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  menuInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    // paddingLeft: 3,
    // paddingRight: 0,
    justifyContent: 'space-between'
  },
  menuNameBox: {
    justifyContent: 'center',
  },
  menuInfoBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  restaurantName: {
    color: '#3d3d3d',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    paddingRight: 5,
  },
  restaurantMenuDetail: {
    color: '#3d3d3d',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    // width: '50%',
    textAlign: 'right',
    // paddingRight: 8,
  },
  icons: {width: '12%'},
});
