import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { createPaymoneyAccount } from '../../../redux/features/paymoneySlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { icons } from '../../../constants';
import { styles } from './AgreementScreen.styles';
import CustomButton from '../../../components/CustomButton';

type AgreementScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Agreement'
>;

const AgreementScreen: React.FC = () => {
  const navigation = useNavigation<AgreementScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  console.log("토큰 확인", token)
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgree = () => {
    setIsAgreed(!isAgreed);
  };

  const handleContinue = async () => {
    if (isAgreed) {
      if (token) {
        // Authorization 헤더에 토큰을 넣어 POST 요청 실행
        try {
          await dispatch(createPaymoneyAccount(token));
          navigation.navigate('Home'); // 성공 시 Home으로 이동
        } catch (error) {
          Alert.alert('페이머니 요청 실패', error?.message || '알 수 없는 오류 발생');
        }
      } else {
        Alert.alert('토큰 없음', '유효한 토큰이 없습니다. 다시 로그인하세요.');
      }
    } else {
      Alert.alert('이용약관에 동의해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>페이머니 서비스 이용약관</Text>

      <View style={styles.agreementBox}>
        <ScrollView>
        <Text style={styles.text}>
          제 1 조 (목적) 본 약관은 AllEat(이하 "회사")가 제공하는 페이머니 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.{"\n\n"}
          제 2 조 (정의){"\n"}
          "페이머니"란 이용자가 AllEat 서비스 내에서 식비 관리를 위해 사용하는 가상의 계좌 및 결제 수단을 의미합니다.{"\n"}
          "이용자"란 AllEat 서비스에 회원가입하고, 본 약관에 동의한 후 페이머니 계좌를 개설한 자를 의미합니다.{"\n"}
          "충전"이란 이용자가 자신의 페이머니 계좌에 자금을 입금하는 행위를 의미합니다.{"\n"}
          "송금"이란 이용자가 자신의 페이머니 계좌에서 다른 이용자에게 자금을 이체하는 행위를 의미합니다.{"\n\n"}
          
          제 3 조 (약관의 효력 및 변경){"\n"}
          본 약관은 이용자가 회원가입 시 동의함으로써 효력이 발생합니다.{"\n"}
          회사는 관련 법령을 위배하지 않는 범위 내에서 약관을 개정할 수 있으며, 개정된 약관은 서비스 내에 공지함으로써 효력이 발생합니다.{"\n"}
          이용자는 변경된 약관에 동의하지 않을 경우, 회원 탈퇴 및 페이머니 계좌 해지를 요청할 수 있습니다.{"\n\n"}
          
          제 4 조 (페이머니 계좌 개설){"\n"}
          이용자는 AllEat 서비스 회원가입 시 본 약관에 동의한 후 페이머니 계좌를 개설할 수 있습니다.{"\n"}
          계좌 개설 시 제공한 정보는 정확하고 사실이어야 하며, 잘못된 정보로 인한 불이익은 이용자 본인이 책임집니다.{"\n\n"}
          
          제 5 조 (페이머니 충전 및 송금){"\n"}
          이용자는 회사가 정한 방법을 통해 자신의 페이머니 계좌에 자금을 충전할 수 있습니다.{"\n"}
          충전된 자금은 AllEat 서비스 내에서 식비 결제 및 관련 서비스 이용에만 사용할 수 있습니다.{"\n"}
          이용자는 자신의 페이머니 계좌에서 다른 이용자에게 자금을 송금할 수 있으며, 이때 송금 내역은 AllEat 서비스 내에서 확인할 수 있습니다.{"\n\n"}
          
          제 6 조 (페이머니 사용 제한){"\n"}
          페이머니는 오로지 AllEat 서비스 내에서 식비 관련 결제에만 사용할 수 있으며, 다른 용도로 사용할 수 없습니다.{"\n"}
          이용자는 페이머니 계좌를 타인에게 양도하거나, 담보로 제공할 수 없습니다.{"\n\n"}
          
          제 7 조 (환불 및 계좌 해지){"\n"}
          충전된 페이머니 잔액에 대한 환불은 회사가 정한 절차에 따라 신청할 수 있으며, 일정 수수료가 부과될 수 있습니다.{"\n"}
          이용자가 회원 탈퇴를 신청하거나 페이머니 계좌 해지를 요청할 경우, 잔액은 환불 절차를 거쳐 반환됩니다.{"\n\n"}
          
          제 8 조 (이용자의 의무){"\n"}
          이용자는 서비스 이용 시 법령과 본 약관, 회사의 정책을 준수해야 합니다.{"\n"}
          이용자는 자신의 계정 및 페이머니 계좌 정보를 안전하게 관리해야 하며, 제3자에게 공유해서는 안 됩니다.{"\n\n"}
          
          제 9 조 (회사의 의무){"\n"}
          회사는 관련 법령과 본 약관에 따라 서비스를 성실히 제공할 의무가 있습니다.{"\n"}
          회사는 이용자의 개인정보를 보호하며, 관련 법령에 따라 적절한 보안 조치를 취합니다.{"\n\n"}
          
          제 10 조 (면책 조항){"\n"}
          회사는 천재지변, 전쟁, 기타 불가항력적인 사유로 인하여 서비스를 제공할 수 없는 경우, 이에 대한 책임을 지지 않습니다.{"\n"}
          이용자의 고의 또는 과실로 인해 발생한 손해에 대해서는 회사가 책임지지 않습니다.{"\n\n"}
          
          제 11 조 (분쟁 해결) 본 약관과 관련하여 발생한 분쟁은 회사의 본사 소재지 관할 법원에서 해결합니다.{"\n\n"}
        </Text>

        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        {/* 동의 버튼 */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={handleAgree} style={styles.checkbox}>
            {isAgreed ? 
            <icons.passwordCheck width={25} height={25} />
            :
            <icons.emptyCheck width={25} height={25} />
            }
          </TouchableOpacity>
          <Text style={styles.checkboxText}>이용약관에 동의합니다</Text>
        </View>

        {/* 계속하기 버튼 */}
        <CustomButton
          title="계속하기"
          handlePress={handleContinue}
          containerStyles="w-[100%] h-[60px]" // Tailwind 스타일 전달
          textStyles="text-white font-pbold" // Tailwind 스타일 전달
          isLoading={false} // 로딩 상태 설정
        />
      </View>
    </SafeAreaView>
  );
};

export default AgreementScreen;
