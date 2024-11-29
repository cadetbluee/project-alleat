import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  gradientBackground: {
    paddingHorizontal: 0,
    height: '100%',
    alignItems: 'center',
  },
  bodyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  payTitle: {
    fontSize: 37,
    letterSpacing: -1,
    fontFamily: 'Pretendard-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  amountText: {
    fontSize: 25,
    fontFamily: 'Pretendard-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginTop: '5%',
  },
  useAmountBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(71, 110, 212, 0.21)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    alignSelf: 'center',
    marginTop: '5%',
  },
  usedAmonutText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingRight: 7,
  },
  inoutContainer: {
    marginTop: '7%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inBox: {
    borderRadius: 9,
    backgroundColor: 'rgba(71, 110, 212, 0.21)',
    paddingHorizontal: 55,
    paddingVertical: 7,
    alignSelf: 'center',
    marginHorizontal: 3,
  },
  outBox: {
    borderRadius: 9,
    backgroundColor: 'rgba(71, 110, 212, 0.21)',
    paddingHorizontal: 55,
    paddingVertical: 7,
    alignSelf: 'center',
    marginHorizontal: 3,
  },
  inoutText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  QRcodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
    flexDirection: 'row',
  },
  QRcode: {width: '100%'},
  payCardContainer: {
    alignItems: 'center',
    marginTop: '10%',
    position: 'relative',
  },
  greyCookieWrapper: {
    position: 'absolute',
    zIndex: 1,
    right: 50,
    top: 70,
  },
  payCardWrapper: {
    position: 'absolute',
    zIndex: 2,
    paddingLeft: 12,
  },
  linkButtonContainer: {
    marginTop: 180, // payCard 밑에 충분한 공간을 확보
    alignItems: 'center', // 중앙 정렬
  },
  QRmarker: {
    borderColor: '#769BFF',
    borderWidth: 2,
    width: 250, // 마커의 가로 길이
    height: 250,
    borderRadius: 10,
  },
  QRCodeScanner: {
    height: '100%',
    position: 'absolute',
    zIndex: 5,
    backgroundColor: 'white',
  },
  QRButton: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
});
