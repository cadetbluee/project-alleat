import React, {useEffect, useState} from 'react';
import {Text, View, Pressable, Alert, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';
import {
  chargePaymoney,
  transferPaymoney,
  fetchPaymoneyBalance,
  fetchMonthlyUsedAmount,
} from '../../../redux/features/paymoneySlice';
import {format, getDaysInMonth} from 'date-fns'; // date-fns 임포트
import {icons} from '../../../constants';
import InoutModal from './components/InoutModal';
import {styles} from './PaymoneyScreen.styles';
import LinkButton from '../../../components/linkButton';
import {images} from '../../../constants';
import {RootStackParamList} from '../../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NotificationModal from '../../home/components/NotificationModal/NotificationModal';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Carousel from '../../../components/Carousel/Carousel';
import api from '../../../utils/api';
const {MyFirebaseMessagingService} = NativeModules;
const eventEmitter = new NativeEventEmitter(MyFirebaseMessagingService);
type PaymoneyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Paymoney'
>;

const PaymoneyScreen: React.FC = () => {
  const navigation = useNavigation<PaymoneyScreenNavigationProp>();
  const [visible, setVisible] = useState(false);
  const [isPlus, setIsPlus] = useState(true);
  const [body, setBody] = useState('');
  const [isAllEat, setIsAlleat] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [placeholderText, setPlaceholderText] = useState<string>('');
  const [guideText, setGuideText] = useState<string>('');
  const [transactionType, setTransactionType] = useState<number>(0); // 거래 타입 저장 (충전 또는 송금)

  // Redux state에서 balance와 loading, error, monthlyUsedAmount 가져오기
  const {balance, loading, error, monthlyUsedAmount} = useSelector(
    (state: RootState) => state.paymoney,
  );

  // 현재 월의 사용 금액과 잔액을 가져오는 함수
  const fetchCurrentMonthUsedAmount = async () => {
    const today = new Date();
    const startDate = format(
      new Date(today.getFullYear(), today.getMonth(), 1),
      'yyyy-MM-dd',
    );
    const period = getDaysInMonth(today);
    await dispatch(fetchMonthlyUsedAmount({startDate, period}));

    // 사용 금액을 조회한 후 잔액을 다시 가져오기
    dispatch(fetchPaymoneyBalance());
  };

  useEffect(() => {
    // 화면이 처음 렌더링될 때 잔액과 현재 월의 사용 금액을 가져옴
    dispatch(fetchPaymoneyBalance());
    fetchCurrentMonthUsedAmount();
  }, [dispatch]);

  useEffect(() => {
    const subscription = eventEmitter.addListener(
      'onNotificationReceived',
      data => {
        console.log(data);
        if (data.title == '결제 알림') {
          setIsPlus(false);
        } else if (data.title == '송금 알림') {
          setIsPlus(false);
          setIsAlleat(true);
        } else {
          setIsPlus(true);
        }
        setBody(data.body);
        setVisible(true);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [visible]);

  const handleConfirm = async (amount: number) => {
    try {
      if (transactionType === 0) {
        await dispatch(chargePaymoney(amount)).unwrap();
        // Alert.alert('충전 성공', `충전이 완료되었습니다.`);
      } else {
        await dispatch(transferPaymoney({amount, restaurant_id: 1})).unwrap();
        // Alert.alert('송금 성공', `송금이 완료되었습니다.`);
      }
      // 잔액 및 사용 금액 업데이트
      fetchCurrentMonthUsedAmount();
    } catch (error) {
      console.error('요청 실패:', error);
      Alert.alert('요청 실패', error as string);
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

  const record = () => {
    navigation.replace('PaymoneyDetail');
  };
  const [scannerOpened, setScannerOpened] = useState(false);
  // QR 코드 읽은 후 실행되는 함수
  const onSuccess = async e => {
    console.log('QR code scanned', e.data);
    const qrData = JSON.parse(e.data);

    try {
      // QR 데이터 서버로 PUT 요청 보내기
      const requestData = {
        restaurant_id: qrData.restaurant_id,
        transaction_type: qrData.transaction_type,
        amount: qrData.amount,
        ...(qrData.transaction_date && {
          transaction_date: qrData.transaction_date,
        }), // transaction_date가 존재할 때만 추가
      };

      const response = await api.put('/AllEat/paymoney', requestData);

      if (response.status === 200) {
        const result = response.data;
        console.log('결제 성공:', result);
        // Alert.alert('결제 성공', '결제가 완료되었습니다.');
      } else {
        console.error('결제 실패:', response.data);
        Alert.alert(
          '결제 실패',
          response.data.message || '오류가 발생했습니다.',
        );
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      Alert.alert('결제 오류', '네트워크 오류가 발생했습니다.');
    }

    setScannerOpened(false); // QR 스캐너 닫기
  };

  const carouselItems = [
    {
      isScanner: true,
      setScannerOpen: () => setScannerOpened(true),
    },
    {
      isQRcode: true,
    },
  ];
  const {width: screenWidth} = Dimensions.get('window'); // 화면 크기
  return (
    <LinearGradient
      style={[styles.gradientBackground]}
      locations={[0, 1]}
      colors={['#769bff', '#b7caff']}
      useAngle={true}
      angle={257.3}>
      <NotificationModal
        isPlus={isPlus}
        body={body}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        isAllEat={isAllEat}
      />
      <View style={styles.bodyContainer}>
        <Text style={styles.payTitle}>AllEat Pay</Text>
        <Text style={styles.amountText}>
          {(balance ?? 0).toLocaleString()}원
        </Text>

        {error && <Text style={{color: 'red'}}>에러: {error}</Text>}

        <Pressable
          style={styles.useAmountBox}
          onPress={fetchCurrentMonthUsedAmount}>
          <Text style={styles.usedAmonutText}>
            사용 금액 : {monthlyUsedAmount?.toLocaleString() ?? 0}
          </Text>
          <icons.sync height={20} width={20} />
        </Pressable>

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
        <Carousel
          gap={16}
          offset={36}
          pages={carouselItems}
          pageWidth={screenWidth}
        />
        <View style={styles.payCardContainer}>
          <View style={styles.greyCookieWrapper}>
            <images.greyCookie height={100} width={100} />
          </View>
          <View style={styles.payCardWrapper}>
            <images.payCardWhite height={160} />
          </View>
        </View>

        <View style={styles.linkButtonContainer}>
          <LinkButton text="결제 내역 확인하기" targetScreen="PaymoneyDetail" />
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
      {scannerOpened && (
        <View style={styles.QRCodeScanner}>
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.auto}
            topContent={<Text>QR 코드를 스캔하세요</Text>}
            bottomContent={<Text>QR 코드를 카메라에 맞춰주세요</Text>}
            showMarker={true}
            customMarker={<View style={styles.QRmarker} />}
            reactivate={true} // 스캔 후 다시 스캔 가능하게 설정
            reactivateTimeout={5000} // 5초 후에 다시 스캔 가능
            vibrate={false}
          />
        </View>
      )}
    </LinearGradient>
  );
};

export default PaymoneyScreen;
