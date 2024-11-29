import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pickerContainer: {marginTop: 4, width: '44%'},
  pickerLabel: {
    fontSize: 14,
    color: '#3D3D3D', // 회색 텍스트 색상
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 3,
  },
  picker: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  pickerDisabled: {
    backgroundColor: 'lightgray',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  pickerText: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#3d3d3d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  modalContent: {
    width: '94%',
    paddingVertical: 16,
    paddingBottom: 28,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    // gap: 5,
    display: 'flex',
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  modalTitle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitleText: {
    fontSize: 18,

    color: '#3d3d3d',
    fontFamily: 'Pretendard-Bold',
  },
  modalIcon: {},
  addMenu: {flexDirection: 'row'},
  addMenuContainer: {
    backgroundColor: '#EAF0FF',
    width: '44%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addMenuImage: {width: 100, height: 100},
  addMenuContainerText: {
    fontSize: 16,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Bold',
  },
  field: {width: '48%'},
  menuFormContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  homeMade: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  nutrientFormBox: {width: '44%'},
  nutrientForm: {height: 36, marginBottom: 3, fontSize: 14, paddingBottom: 5},
  nutrientFormTitle: {
    fontSize: 14,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Bold',
  },
  nutrientFormContainer: {flexDirection: 'row', gap: 5},
  nutrientFormCard: {gap: 3},
});
