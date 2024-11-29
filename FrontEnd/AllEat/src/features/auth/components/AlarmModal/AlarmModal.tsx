import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import AlarmSetting from '../AlarmSetting/AlarmSetting';
import {styles} from './AlarmModal.styles'; // 스타일 파일은 따로 분리
import {images} from '../../../../constants';
import {icons} from '../../../../constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface NotificationData {
  title: string | null;
  body: string | null;
}

interface AlarmModalProps {
  visible: boolean;
  initialAlarms: {
    breakfast?: Date;
    lunch?: Date;
    dinner?: Date;
  };
  onClose: () => void;
  onSave: (newAlarms: {
    breakfast: string;
    lunch: string;
    dinner: string;
  }) => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({

  
  visible,
  initialAlarms = {
    breakfast: new Date(new Date().setHours(8, 0, 0, 0)),
    lunch: new Date(new Date().setHours(12, 0, 0, 0)),
    dinner: new Date(new Date().setHours(18, 0, 0, 0)),
  },
  onClose,
  onSave,
}) => {
  const [alarms, setAlarms] = useState({
    breakfast:
      initialAlarms.breakfast || new Date(new Date().setHours(8, 0, 0, 0)),
    lunch: initialAlarms.lunch || new Date(new Date().setHours(12, 0, 0, 0)),
    dinner: initialAlarms.dinner || new Date(new Date().setHours(18, 0, 0, 0)),
  });

  const [isBreakfastEnabled, setIsBreakfastEnabled] = useState(
    !!initialAlarms.breakfast,
  );
  const [isLunchEnabled, setIsLunchEnabled] = useState(!!initialAlarms.lunch);
  const [isDinnerEnabled, setIsDinnerEnabled] = useState(
    !!initialAlarms.dinner,
  );

  const [pickerVisible, setPickerVisible] = useState<
    null | 'breakfast' | 'lunch' | 'dinner'
  >(null);

  const toggleAlarm = (type: 'breakfast' | 'lunch' | 'dinner') => {
    if (type === 'breakfast') {
      setIsBreakfastEnabled(!isBreakfastEnabled);
    } else if (type === 'lunch') {
      setIsLunchEnabled(!isLunchEnabled);
    } else if (type === 'dinner') {
      setIsDinnerEnabled(!isDinnerEnabled);
    }
  };

  const showTimePicker = (type: 'breakfast' | 'lunch' | 'dinner') => {
    setPickerVisible(type);
  };

  const hideTimePicker = () => {
    setPickerVisible(null);
  };

  const handleTimeChange = (selectedDate: Date) => {
    if (pickerVisible) {
      setAlarms(prevAlarms => ({
        ...prevAlarms,
        [pickerVisible]: selectedDate,
      }));
    }
    hideTimePicker();
  };

  const handleSave = () => {
    // 각 알람의 상태에 따라 시간 또는 빈 문자열 설정
    const savedAlarms = {
      breakfast: isBreakfastEnabled
        ? alarms.breakfast.toLocaleTimeString('it-IT')
        : '',
      lunch: isLunchEnabled ? alarms.lunch.toLocaleTimeString('it-IT') : '',
      dinner: isDinnerEnabled ? alarms.dinner.toLocaleTimeString('it-IT') : '',
    };

    onSave(savedAlarms); // 상위 컴포넌트로 선택한 알람 값 전달
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalTitle}>
            <Text style={styles.modalTitleText}>알람 시간 설정</Text>
            <TouchableOpacity style={styles.modalIcon} onPress={onClose}>
              <icons.exit height={24} width={24} />
            </TouchableOpacity>
          </View>
          <AlarmSetting
            isEnabled={isBreakfastEnabled}
            onToggle={() => toggleAlarm('breakfast')}
            label="아침식사 알림"
            time={alarms.breakfast}
            onPress={() => showTimePicker('breakfast')}
            icon={images.breakfast}
          />

          <AlarmSetting
            isEnabled={isLunchEnabled}
            onToggle={() => toggleAlarm('lunch')}
            label="점심식사 알림"
            time={alarms.lunch}
            onPress={() => showTimePicker('lunch')}
            icon={images.lunch}
          />

          <AlarmSetting
            isEnabled={isDinnerEnabled}
            onToggle={() => toggleAlarm('dinner')}
            label="저녁식사 알림"
            time={alarms.dinner}
            onPress={() => showTimePicker('dinner')}
            icon={images.dinner}
          />

          <DateTimePickerModal
            isVisible={pickerVisible !== null}
            mode="time"
            onConfirm={handleTimeChange}
            onCancel={hideTimePicker}
            date={
              pickerVisible === 'breakfast'
                ? alarms.breakfast
                : pickerVisible === 'lunch'
                ? alarms.lunch
                : alarms.dinner
            }
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title="저장"
              handlePress={handleSave}
              containerStyles="w-[100%] h-[50px] mt-5"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlarmModal;
