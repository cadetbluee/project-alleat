import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {icons} from '../../../constants';

// AIReport 컴포넌트의 props 타입 정의
interface AIReportProps {
  title: string;
  aiData: string;
}

const AIReport: React.FC<AIReportProps> = ({title, aiData}) => {
  return (
    <View>
      <Text style={styles.AIText}>{aiData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  AIText: {
    paddingTop: 10,
    textAlign: 'center',
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
    color: 'black',
  },
});

export default AIReport;
