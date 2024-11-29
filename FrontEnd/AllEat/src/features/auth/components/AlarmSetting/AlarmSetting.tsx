// components/AlarmSetting.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
// import {ImageSourcePropType} from 'react-native';
import {styles} from './AlarmSetting.styles'; // 스타일을 위한 파일
import {icons} from '../../../../constants';
interface AlarmSettingProps {
  label: string;
  time: Date;
  onPress: () => void;
  isEnabled: boolean;
  icon: React.ElementType; // 이미지 아이콘 컴포넌트 타입
  onToggle: () => void;
}

const AlarmSetting: React.FC<AlarmSettingProps> = ({
  label,
  time,
  onPress,
  isEnabled,
  icon: Icon,
  onToggle,
}) => {
  return (
    <View style={styles.body}>
      <TouchableOpacity onPress={onToggle}>
        {isEnabled ? (
          <icons.minus width={24} height={24} />
        ) : (
          <icons.plus width={24} height={24} />
        )}
      </TouchableOpacity>
      <View style={[styles.alarm, !isEnabled && styles.alarmdisabled]}>
        <Icon width={40} height={40} />
        <Text style={styles.alarmText}>{label}</Text>
        <TouchableOpacity disabled={!isEnabled} onPress={onPress}>
          <View style={styles.alarmTime}>
            <Text style={!isEnabled && styles.alarmTimeColor}>
              {format(time, 'p', {locale: ko})}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlarmSetting;
