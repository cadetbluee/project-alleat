import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {icons} from '../../constants';
import {styles} from './FormField.styles'; // 스타일 파일 임포트

interface FormFieldProps extends TextInputProps {
  title?: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  unit?: string;
  otherStyles?: StyleProp<ViewStyle>; // Optional Tailwind-style classes
  otherInputStyles?: StyleProp<ViewStyle>; // Optional Tailwind-style classes
  isNumeric?: boolean; // 숫자 입력 필드 여부
  isDecimal?: boolean; // 소수점 입력 허용 여부
  isEqual?: boolean;
  abled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  unit,
  value,
  placeholder,
  handleChangeText,
  otherStyles, // 추가된 스타일
  otherInputStyles,
  isNumeric = false, // 숫자 입력 필드 여부를 기본값 false로 설정
  isDecimal = false, // 소수점 입력 허용 여부를 기본값 false로 설정
  isEqual = false,
  abled = true,
  ...props
}) => {
  const handleTextChange = (text: string) => {
    let newText = text;

    // 숫자 입력 필드인 경우
    if (isNumeric) {
      // 소수점 허용 여부에 따라 정규식 변경
      const regex = isDecimal ? /^\d*\.?\d{0,1}$/ : /^[0-9]*$/;

      // 입력값이 정규식과 일치하지 않으면 무시
      if (!regex.test(text)) {
        return; // 유효하지 않은 값은 무시
      }
    }

    // 유효한 값인 경우에만 handleChangeText 호출
    handleChangeText(newText);
  };

  return (
    <View style={[styles.container, !title && styles.password, otherStyles]}>
      {title && <Text style={styles.label}>{title}</Text>}
      <View
        style={[
          abled ? styles.inputContainer : styles.inputContainerDisabled,
          otherInputStyles,
        ]}>
        <TextInput
          style={[styles.textInput, otherInputStyles]}
          value={abled ? value : isNumeric ? '0' : '집밥'}
          placeholder={placeholder}
          placeholderTextColor="lightgray"
          onChangeText={handleTextChange}
          keyboardType={isNumeric ? 'numeric' : 'default'} // 숫자 입력을 위한 keyboardType 설정
          secureTextEntry={title === 'Password'}
          editable={abled}
          selectTextOnFocus={abled}
          {...props}
        />

        {!title && isEqual && <icons.passwordCheck width={30} height={30} />}
        {unit && (
          <Text style={styles.unit}>{unit}</Text> // 단위 텍스트 추가
        )}
      </View>
    </View>
  );
};

export default FormField;
