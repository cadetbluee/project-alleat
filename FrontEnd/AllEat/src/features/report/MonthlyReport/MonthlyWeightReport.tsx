import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { styles } from './MonthlyWeightReport.styles';

interface weightRecords {
  date: string;
  weight: number;
}

interface MonthlyWeightReportProps {
  monthlyCostRecords: number[];
  monthlyWeightRecords: weightRecords[];
}

const MonthlyWeightReport: React.FC<MonthlyWeightReportProps> = ({ monthlyCostRecords, monthlyWeightRecords }) => {
  const width = 330; // 그래프의 너비
  const height = 150; // 그래프의 높이
  const padding = 30; // 여백
  const dataPoints = monthlyCostRecords.length;

  // x축 좌표 계산
  const xInterval = dataPoints > 1 ? (width - padding * 2) / (dataPoints - 1) : 0;

  // 식비 추이 그래프 그리기
  const maxCost = Math.max(...monthlyCostRecords);
  const minCost = Math.min(...monthlyCostRecords);
  const costYRange = maxCost - minCost || 1; // 0인 경우 1로 설정하여 NaN 방지

  const costPoints = monthlyCostRecords.map((cost, index) => {
    const x = padding + index * xInterval;
    const y = height - padding - ((cost - minCost) / costYRange) * (height - padding * 2);

    // NaN 방지
    if (isNaN(y)) {
      console.error(`Invalid y-coordinate for cost: ${cost}`);
      return '';
    }

    return `${x},${y}`;
  }).filter(point => point !== '').join(' ');

  const costGradientPath = `
    M ${padding}, ${height - padding} 
    L ${costPoints.split(' ').map(point => point).join(' L ')} 
    L ${width - padding}, ${height - padding} 
    Z`;

  // 체중 추이 그래프 그리기
  if (monthlyWeightRecords.length === 0) {
    return (
      <View style={styles.monthlyMealReportContainer}>
        <Text style={styles.monthlyMealReportTitle}>
          한 달 간의 변화 추이를 볼까요?
        </Text>
        <Text style={styles.noWeightDataMessage}>
          아직 체중을 기록하지 않으셨네요!
        </Text>
      </View>
    );
  }

  const weights = monthlyWeightRecords.map(record => record.weight);
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);
  const weightYRange = maxWeight - minWeight || 1; // 0인 경우 1로 설정하여 NaN 방지

  const weightPoints = monthlyWeightRecords.map(record => {
    const day = new Date(record.date).getDate();
    const x = padding + (day - 1) * xInterval;
    const y = height - padding - ((record.weight - minWeight) / weightYRange) * (height - padding * 2);

    // NaN 방지
    if (isNaN(y)) {
      console.error(`Invalid y-coordinate for weight: ${record.weight}`);
      return '';
    }

    return `${x},${y}`;
  }).filter(point => point !== '').join(' ');

  const weightGradientPath = `
    M ${padding}, ${height - padding} 
    L ${weightPoints.split(' ').map(point => point).join(' L ')} 
    L ${width - padding}, ${height - padding} 
    Z`;

  return (
    <View style={styles.monthlyMealReportContainer}>
      <Text style={styles.monthlyMealReportTitle}>
        한 달 간 어떤 변화가 있었을까요?
      </Text>

      {/* 식비 추이 그래프 */}
      <View style={styles.monthlyMealReportContainer}>
        <View style={styles.costGraphContainer}>
          <Text style={styles.costGraphTitle}>
            식비 추이
          </Text>
          <Text style={styles.costGraphText}>X축은 날짜, Y축은 식비를 나타내요</Text>
        </View>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#769BFF" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#D3DFFF" stopOpacity="0.4" />
            </LinearGradient>
          </Defs>
          
          {/* 그라데이션 배경 영역 */}
          <Path d={costGradientPath} fill="url(#costGrad)" />

          {/* 꺾은선 그래프 */}
          <Polyline points={costPoints} fill="none" />

          {/* x축 레이블 */}
          {[1, Math.ceil(dataPoints / 2), dataPoints].map((day, index) => {
            const x = padding + (day - 1) * xInterval;
            return (
              <SvgText key={`cost-x-label-${index}`} x={x} y={height - padding + 15} fontSize="10" fontFamily='Pretendard-Medium' textAnchor="middle" fill="black">
                {day}
              </SvgText>
            );
          })}

          {/* y축 레이블 */}
          {[minCost, (minCost + maxCost) / 2, maxCost].map((yValue, index) => {
            const y = height - padding - ((yValue - minCost) / costYRange) * (height - padding * 2);
            return (
              <React.Fragment key={`cost-y-label-${index}`}>
                <SvgText x={padding - 10} y={y} fontSize="10" fontFamily='Pretendard-Medium' textAnchor="end" fill="black">
                  {`${(yValue / 1000).toFixed(0)}K`}
                </SvgText>
                <Line x1={padding} y1={y} x2={width - padding} y2={y} stroke="black" strokeWidth="0.5" opacity="0.5" />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* 체중 추이 그래프 */}
      <View style={styles.monthlyMealReportContainer}>
        <View style={styles.costGraphContainer}>
          <Text style={styles.costGraphTitle}>
            체중 추이
          </Text>
          <Text style={styles.costGraphText}>X축은 날짜, Y축은 체중을 나타내요</Text>
        </View>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FF7F7F" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#FFD1D1" stopOpacity="0.4" />
            </LinearGradient>
          </Defs>

          {/* 그라데이션 배경 영역 */}
          <Path d={weightGradientPath} fill="url(#weightGrad)" />

          {/* 꺾은선 그래프 */}
          <Polyline points={weightPoints} fill="none" />

          {/* x축 레이블 */}
          {[1, Math.ceil(dataPoints / 2), dataPoints].map((day, index) => {
            const x = padding + (day - 1) * xInterval;
            return (
              <SvgText key={`weight-x-label-${index}`} x={x} y={height - padding + 15} fontSize="10" fontFamily='Pretendard-Medium' textAnchor="middle" fill="black">
                {day}
              </SvgText>
            );
          })}

          {/* y축 레이블 */}
          {[minWeight, (minWeight + maxWeight) / 2, maxWeight].map((yValue, index) => {
            const y = height - padding - ((yValue - minWeight) / weightYRange) * (height - padding * 2);
            return (
              <React.Fragment key={`weight-y-label-${index}`}>
                <SvgText x={padding - 10} y={y} fontSize="10" fontFamily='Pretendard-Medium' textAnchor="end" fill="black">
                  {yValue.toFixed(1)}
                </SvgText>
                <Line x1={padding} y1={y} x2={width - padding} y2={y} stroke="black" strokeWidth="0.5" opacity="0.5" />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

export default MonthlyWeightReport;
