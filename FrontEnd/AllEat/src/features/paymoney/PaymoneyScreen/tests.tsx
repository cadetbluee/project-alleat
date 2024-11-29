import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { images } from '../../../constants';
import { styles } from './PaymoneyScreen.styles';
import LinkButton from '../../../components/linkButton';
import InoutModal from './components/InoutModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { chargePaymoney, transferPaymoney, fetchPaymoneyBalance } from '../../../redux/features/paymoneySlice';

type PaymoneyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Paymoney'
>;

const PaymoneyScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [placeholderText, setPlaceholderText] = useState<string>(''); 
  const [guideText, setGuideText] = useState<string>(''); 
  const [transactionType, setTransactionType] = useState<number>(0); // 거래 타입 저장 (충전 또는 송금)
  
  // Redux state에서 balance와 loading, error 가져오기
  const { balance, loading, error } = useSelector((state: RootState) => state.paymoney);

  useEffect(() => {
    // 화면이 처음 렌더링될 때 잔액을 가져옴
    dispatch(fetchPaymoneyBalance());
  }, [dispatch]);

  const handleConfirm = async (amount: number) => {
    try {
      if (transactionType === 0) {
        // 충전 요청
        await dispatch(chargePaymoney(amount)).unwrap(); 
        Alert.alert('충전 성공', `충전이 완료되었습니다. 현재 잔액: ${balance}원`);
      } else {
        // 송금 요청
        await dispatch(transferPaymoney(amount)).unwrap();
        Alert.alert('송금 성공', `송금이 완료되었습니다. 현재 잔액: ${balance}원`);
      }
    } catch (error) {
      console.error('요청 실패:', error);
      Alert.alert('요청 실패', '요청 처리 중 오류가 발생했습니다.');
    }
    setModalVisible(false);
  };

  const openRechargeModal = () => {
    setTransactionType(0); // transaction_type을 0(충전)으로 설정
    setPlaceholderText('충전 금액을 입력해 주세요');
    setGuideText('얼마를 충전할까요?');
    setModalVisible(true);
  };

  const openTransferModal = () => {
    setTransactionType(1); // transaction_type을 1(송금)으로 설정
    setPlaceholderText('송금 금액을 입력해 주세요');
    setGuideText('얼마를 송금할까요?');
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.bodyContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <LinearGradient style={[styles.gradientBackground]} locations={[0,1]} colors={['#769bff','#b7caff']} useAngle={true} angle={257.3}>
      <View style={styles.bodyContainer}>
        <Text style={styles.payTitle}>AllEat Pay</Text>
        <Text style={styles.amountText}>{balance.toLocaleString()}원</Text> {/* 잔액 표시 */}
        
        {error && <Text style={{ color: 'red' }}>에러: {error}</Text>}
        
        <View style={styles.useAmountBox}>
          <Text style={styles.usedAmonutText}>사용 금액 : 171,711원</Text>
        </View>
        
        <View style={styles.inoutContainer}>
          {/* 충전 박스 */}
          <Pressable style={styles.inBox} onPress={openRechargeModal}>
            <Text style={styles.inoutText}>충전</Text>
          </Pressable>
          {/* 송금 박스 */}
          <Pressable style={styles.outBox} onPress={openTransferModal}>
            <Text style={styles.inoutText}>송금</Text>
          </Pressable>
        </View>
        
        <View style={styles.QRcodeContainer}>
          <images.QRCode height={90} width={90} />
        </View>
        
        <View style={styles.payCardContainer}>
          <View style={styles.greyCookieWrapper}>
            <images.greyCookie height={100} width={100} />
          </View>
          <View style={styles.payCardWrapper}>
            <images.payCardWhite height={160} />
          </View>
        </View>
        
        <View style={styles.linkButtonContainer}>
          <LinkButton text="결제 내역 확인하기" targetScreen="Home" />
        </View>

        {/* InoutModal 추가 */}
        <InoutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirm} // 입력된 금액을 handleConfirm으로 전달
          placeholderText={placeholderText}
          guideText={guideText}
        />
      </View>
    </LinearGradient>
  );
};

export default PaymoneyScreen;
