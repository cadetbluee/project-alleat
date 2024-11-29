// components/GenderSelection/GenderSelection.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {icons} from '../../../../constants';
import {styles} from './GenderSelection.styles';

interface GenderSelectionProps {
  selectedGender: 0 | 1;
  onSelect: (gender: 0 | 1) => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
  selectedGender,
  onSelect,
}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.formLabel}>성별</Text>
      <TouchableOpacity style={styles.icon} onPress={() => onSelect(0)}>
        {selectedGender === 0 ? (
          <icons.woman width={80} height={80} />
        ) : (
          <icons.womanDisabled width={80} height={80} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => onSelect(1)}>
        {selectedGender === 1 ? (
          <icons.man width={70} height={70} />
        ) : (
          <icons.manDisabled width={70} height={70} />
        )}
      </TouchableOpacity>
      <Text>여성</Text>
      <Text>남성</Text>
    </View>
  );
};

export default GenderSelection;
