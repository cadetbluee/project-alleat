import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './RecordBox.styles';
import {images, icons} from '../../constants';

type RecordBoxProps = {
  title: string; // 예: '아침'
  kcal: string; // 예: '330.2kcal'
  price: string; // 예: '5000₩'
  onPress: () => void;
  isRecorded: boolean;
};

const RecordBox: React.FC<RecordBoxProps> = ({
  title,
  kcal,
  price = 0,
  onPress,
  isRecorded,
}) => {
  return (
    <View style={styles.recordContainer}>
      {isRecorded ? (
        <TouchableOpacity onPress={onPress}>
          <images.recordBox height={120} width={165} />
          <View style={styles.overlay}>
            <Text style={styles.priceText}>{price.toLocaleString()}₩</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.kcal}>{kcal.toLocaleString()}kcal</Text>
          </View>

          <View style={styles.iconWrapper}>
            <icons.checkWhite height={24} width={24} />
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          <images.recordBox height={120} width={165} />
          <View style={styles.overlay}>
            <Text style={styles.priceText}>{0}₩</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.kcal}>{}</Text>
          </View>

          <TouchableOpacity style={styles.iconWrapper} onPress={onPress}>
            <icons.plusWhite height={24} width={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RecordBox;
