import React from 'react';
import {View, Pressable, Text} from 'react-native';
import {styles} from './Carousel.styles'; // styles를 별도 파일로 분리
import {images} from '../../constants';
interface IPage {
  item: {isQRcode?: boolean; isScanner?: boolean; setScannerOpen?: () => void}; // contents는 JSX 요소
  //   style: ViewStyle; // 스타일을 ViewStyle로 타입 지정
}

export default function Page({item}: IPage) {
  //   console.log(item.contents);
  return (
    <View style={[styles.pageItem]}>
      {item.isScanner && (
        <Pressable onPress={item.setScannerOpen}>
          <View style={styles.QRButton}>
            <Text style={styles.QRButtonText}>QR 스캔으로 결제하기</Text>
          </View>
        </Pressable>
      )}
      {item.isQRcode && <images.QRCode height={90} width={100} />}
    </View>
  );
}
