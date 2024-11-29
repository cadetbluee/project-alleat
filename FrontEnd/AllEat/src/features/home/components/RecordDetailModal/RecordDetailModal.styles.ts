import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    width: '88%',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 20,

    color: '#3d3d3d',
    fontFamily: 'Pretendard-SemiBold',
  },
  modalBody: {width: '88%', marginBottom: 10},
  tandanjiContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 8,
    width: '88%',
    justifyContent: 'space-between',
  },
  tandanjiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tandanjiTitle: {
    fontSize: 12,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-SemiBold',
  },
  tandanjiInfo: {
    fontSize: 10,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Regular',
  },
  modalKcalPrice: {
    fontSize: 20,
    color: '#93AAE7',
    fontFamily: 'Pretendard-Bold',
  },
  modalList: {
    width: '100%',
    backgroundColor: '#93AAE7',
    alignItems: 'center',
    paddingTop: 10,
    gap: 10,

    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
  },
  // modalMenuList: {minHeight: 210},
});
