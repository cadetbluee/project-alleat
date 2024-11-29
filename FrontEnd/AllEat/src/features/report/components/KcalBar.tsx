import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {icons} from '../../../constants';

// AIReport 컴포넌트의 props 타입 정의
interface KcalBarProps {
  goalKcal: number;
  kcal: number;
}

const KcalBar: React.FC<KcalBarProps> = ({goalKcal, kcal}) => {
  return (
    <View style={styles.KcalBarContainer}>{/* 칼로리 가로그래프 영역 */}</View>
  );
};

const styles = StyleSheet.create({
  KcalBarContainer: {},
});

export default KcalBar;
