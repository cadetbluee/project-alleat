import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {icons} from '../../constants';

type RecordBox2Props = {
  title: string; // 예: '아침'
  kcal: string; // 예: '330.2kcal'
  price: string; // 예: '5000₩'
  onPress: () => void;
  isRecorded: boolean;
};

const RecordBox2: React.FC<RecordBox2Props> = ({
  title,
  kcal,
  price = 0,
  onPress,
  isRecorded,
}) => {
  return (
    <View style={styles.recordContainer}>
      {isRecorded ? (
        <Pressable onPress={onPress}>
          <View style={styles.recordBox}>
            <View style={styles.recordPriceBox}>
              <Text style={styles.priceText}>{price.toLocaleString()}₩</Text>
            </View>
            <View style={styles.overlay}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.kcal}>{kcal.toLocaleString()}kcal</Text>
            </View>

            <View style={styles.iconWrapper}>
              <icons.checkWhite height={24} width={24} />
            </View>
          </View>
        </Pressable>
      ) : (
        <View>
          <View style={styles.recordBox}>
            <View style={styles.recordPriceBox}>
              <Text style={styles.priceText}>0₩</Text>
            </View>
            <View style={styles.overlay}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.kcal}>{}</Text>
            </View>

            <TouchableOpacity style={styles.iconWrapper} onPress={onPress}>
              <icons.plusWhite height={24} width={24} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recordContainer: {
    height: 110,
    position: 'relative',
    marginBottom: 8,
    marginTop: 5,
  },
  recordBox: {
    marginTop: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#F3F4F7',
    height: 90,
    width: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    position: 'relative', // 부모 요소의 기준으로 absolute 자식 요소 배치
    zIndex: 1, // 기본 값으로 설정 (zIndex 값을 낮게 설정)
  },
  recordPriceBox: {
    height: 21,
    width: 65,
    backgroundColor: '#B7CAFF',
    position: 'absolute',
    right: 0, // 오른쪽 여백 추가
    top: -21, // 상단 여백 추가
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center', // 텍스트 수평 중앙 정렬
    alignItems: 'center', // 텍스트 수직 중앙 정렬
    zIndex: 2, // recordBox보다 더 높은 값으로 설정
  },
  overlay: {
    position: 'absolute',
    top: -45,
    left: 2,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  priceText: {
    color: '#3D3D3D',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#3D3D3D',
    marginTop: 40,
  },
  kcal: {
    fontSize: 14,
    color: '#828282',
    marginTop: 5,
    fontFamily: 'Pretendard-SemiBold',
  },
  iconWrapper: {
    position: 'absolute',
    top: 15,
    right: 10,
    borderRadius: 20,
    padding: 5,
  },
});

export default RecordBox2;
