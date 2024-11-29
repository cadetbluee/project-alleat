import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  transactionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  transactionDetails: {flexDirection: 'row'},
  transactionDetailTitle: {
    color: '#3d3d3d',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  transactionDetailText: {
    color: '#3d3d3d',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: 15,
  },
});
