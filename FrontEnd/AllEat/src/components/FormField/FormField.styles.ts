import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 4,
  },
  password: {marginTop: 0},
  label: {
    fontSize: 14,
    color: '#3D3D3D', // 회색 텍스트 색상
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 3,
  },
  inputContainer: {
    width: '100%',
    height: 52, // h-16 in Tailwind
    paddingHorizontal: 16,
    backgroundColor: 'white', // 배경색
    borderRadius: 16, // rounded-2xl in Tailwind
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // 테두리 두께
    borderColor: 'lightgray', // 회색 테두리 색상
    marginBottom: 4,
  },
  inputContainerDisabled: {
    width: '100%',
    height: 52, // h-16 in Tailwind
    paddingHorizontal: 16,
    backgroundColor: 'lightgray', // 배경색
    borderRadius: 16, // rounded-2xl in Tailwind
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // 테두리 두께
    borderColor: 'lightgray', // 회색 테두리 색상
    marginBottom: 4,
  },
  unit: {
    fontFamily: 'Pretendard-SemiBold',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-Light',
    color: '#3d3d3d', // 기본 텍스트 색상
  },
});
