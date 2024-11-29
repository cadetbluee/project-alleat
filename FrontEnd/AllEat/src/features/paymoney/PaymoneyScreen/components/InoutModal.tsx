import React, {useState} from 'react';
import {View, Text, Modal, TextInput, Pressable, StyleSheet} from 'react-native';

interface InoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void; // 충전 금액을 전달할 함수
  placeholderText: string; // 모달창의 안내 텍스트
  guideText: string; // placeholder 텍스트
}

const InoutModal: React.FC<InoutModalProps> = ({visible, onClose, onConfirm, placeholderText, guideText}) => {
  const [amount, setAmount] = useState<string>(''); // 충전 금액

  const handleConfirm = () => {
    const numericValue = parseInt(amount, 10);
    if (!isNaN(numericValue)) {
      onConfirm(numericValue); // 부모 컴포넌트로 금액 전달
      setAmount(''); // 초기화
      onClose(); // 모달 닫기
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{placeholderText}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={guideText}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.wonSymbol}>₩</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonConfirm]}
              onPress={handleConfirm}
            >
              <Text style={styles.textStyle}>확인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalText: {
    marginBottom: 15,
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#000000',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    paddingRight: 25, // TextInput 안쪽에 여유 공간 확보
    fontFamily: 'Pretendard-Light',
    color: '#000000'
  },
  wonSymbol: {
    position: 'absolute',
    right: 10, // TextInput 내부 오른쪽에 위치하도록 설정
    top: 15, // 세로 중앙 정렬
    fontSize: 16,
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '5%'
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 48,
    paddingVertical: 15,
  },
  buttonClose: {
    backgroundColor: '#ccc',
  },
  buttonConfirm: {
    backgroundColor: '#769bff',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },
});

export default InoutModal;
