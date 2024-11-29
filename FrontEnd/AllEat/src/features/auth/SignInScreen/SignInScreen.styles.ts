import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Bold',
  },
  socialContainer: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    position: 'absolute',
    left: 30,
  },
  socialButtonGoogle: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1, // 테두리 두께
    borderColor: 'lightgray', // 회색 테두리 색상
  },
  socialButtonKakao: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  orText: {
    fontSize: 16,
    color: '#d4d4d4',
    textAlign: 'center',
  },
  hairline: {
    backgroundColor: '#d4d4d4',
    height: 2,
    width: '40%',
  },
  orContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  signupTextContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#769bff',
    marginLeft: 5,
    fontFamily: 'Pretendard-Bold',
  },
  text: {
    fontSize: 16,
    color: '#3d3d3d',
    fontFamily: 'Pretendard-Regular',
  },
});
