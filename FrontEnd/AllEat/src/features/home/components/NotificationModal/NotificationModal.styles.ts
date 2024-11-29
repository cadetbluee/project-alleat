import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  notifyModalBox:{
    
  },
  background: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contentBox:{
    padding:5,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  titleBoxText: {fontSize: 16, color: '#3d3d3d', fontFamily: 'Pretendard-Bold'},
  actionButton: {
    margin: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    borderRadius: 10,
  },
  camera: {backgroundColor: '#769BFF'},
  gallery: {backgroundColor: '#B7CAFF'},
  icon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Pretendard-Bold',
  },
});
