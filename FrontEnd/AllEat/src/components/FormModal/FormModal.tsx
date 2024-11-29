import React, {useState} from 'react';
import {View, Modal} from 'react-native';
import CustomButton from '../CustomButton';
import {styles} from './FormModal.styles'; // 스타일 파일은 따로 분리
import FormField from '../FormField/FormField';
interface FormModalProps {
  visible: boolean;
  title: string;
  initialValue: string;
  isWeight?: boolean;
  anotherTitle?: string;
  anotherInitialValue?: string;
  onClose: () => void;
  onSave: (value: string, anotherValue: string) => void;
  keyboardType?: 'default' | 'numeric'; // 숫자 또는 기본 텍스트 입력
}

const FormModal: React.FC<FormModalProps> = ({
  visible,

  title,
  initialValue,

  anotherTitle = '',
  anotherInitialValue = '',
  isWeight = false,
  onClose,
  onSave,
  keyboardType = 'default',
}) => {
  const [value, setValue] = useState(initialValue);
  const [anotherValue, setAnotherValue] = useState(anotherInitialValue);
  const handleSave = () => {
    console.log('Saving values:', value, anotherValue);
    onSave(value, anotherValue); // 저장 버튼을 눌렀을 때 상위 컴포넌트로 값 전달
    // onClose(); // 모달 닫기
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FormField
            title={title}
            style={styles.input}
            value={value}
            handleChangeText={setValue}
            keyboardType={keyboardType}
            placeholder={isWeight ? '0.0' : '0'}
            unit={isWeight ? 'kg' : '원'}
            isDecimal={isWeight}
            isNumeric={true}
          />
          {anotherTitle && (
            <FormField
              title={anotherTitle}
              style={styles.input}
              value={anotherValue}
              handleChangeText={setAnotherValue}
              keyboardType={keyboardType}
              placeholder={isWeight ? '0.0' : '0'}
              unit={isWeight ? 'kg' : '원'}
              isDecimal={isWeight}
              isNumeric={true}
            />
          )}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="저장"
              handlePress={handleSave}
              containerStyles="w-[40%] h-[60px]"
              textStyles="text-white font-pbold"
            />
            <CustomButton
              title="취소"
              handlePress={onClose}
              containerStyles="w-[40%] h-[60px] bg-gray-300"
              textStyles="text-white font-pbold "
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FormModal;
