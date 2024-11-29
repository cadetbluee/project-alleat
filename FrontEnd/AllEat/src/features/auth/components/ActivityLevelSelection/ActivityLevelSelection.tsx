// components/ActivityLevelSelection/ActivityLevelSelection.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {images} from '../../../../constants';
import {styles} from './ActivityLevelSelection.styles';

interface ActivityLevelSelectionProps {
  selectedActiveRange: 1 | 0 | 2;
  onSelect: (range: 1 | 0 | 2) => void;
}

const ActivityLevelSelection: React.FC<ActivityLevelSelectionProps> = ({
  selectedActiveRange,
  onSelect,
}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.formLabel}>활동량</Text>
      <TouchableOpacity style={styles.image} onPress={() => onSelect(0)}>
        {selectedActiveRange === 0 ? (
          <images.notActive width={80} height={80} />
        ) : (
          <images.notActiveDisabled width={80} height={80} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.image} onPress={() => onSelect(1)}>
        {selectedActiveRange === 1 ? (
          <images.normalActive width={80} height={80} />
        ) : (
          <images.normalActiveDisabled width={80} height={80} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.image} onPress={() => onSelect(2)}>
        {selectedActiveRange === 2 ? (
          <images.veryActive width={90} height={90} />
        ) : (
          <images.veryActiveDisabled width={90} height={90} />
        )}
      </TouchableOpacity>
      <Text>적음</Text>
      <Text>보통</Text>
      <Text>많음</Text>
    </View>
  );
};

export default ActivityLevelSelection;
