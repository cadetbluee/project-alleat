// NutrientPieChart.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { images } from '../../constants'; // 이미지 경로를 제대로 설정해 주세요.

interface NutrientPieChartProps {
  carbPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  size?: number;
}

const NutrientPieChart: React.FC<NutrientPieChartProps> = ({
  carbPercentage,
  proteinPercentage,
  fatPercentage,
  size = 160,
}) => {
  const radius = size / 2;
  const center = size / 2;
  
  // 각 영양소의 각도 계산
  const totalPercentage = carbPercentage + proteinPercentage + fatPercentage;

  // 단일 요소가 100%를 차지하는 경우 처리
  const carbAngle = totalPercentage > 0 ? (carbPercentage / totalPercentage) * 360 : 0;
  const proteinAngle = totalPercentage > 0 ? (proteinPercentage / totalPercentage) * 360 : 0;
  const fatAngle = totalPercentage > 0 ? (fatPercentage / totalPercentage) * 360 : 0;

  // 한 요소가 100%인 경우 처리
  let startAngle = 0;
  const angles = [];

  if (carbPercentage === 100) {
    angles.push({ startAngle: 0, endAngle: 360, color: '#AEC3FE', label: '탄수화물', percentage: carbPercentage.toFixed(1) });
  } else if (proteinPercentage === 100) {
    angles.push({ startAngle: 0, endAngle: 360, color: '#EEA9A9', label: '단백질', percentage: proteinPercentage.toFixed(1) });
  } else if (fatPercentage === 100) {
    angles.push({ startAngle: 0, endAngle: 360, color: '#FFD2A4', label: '지방', percentage: fatPercentage.toFixed(1) });
  } else {
    // 일반적인 경우
    angles.push({ startAngle: startAngle, endAngle: startAngle += carbAngle, color: '#AEC3FE', label: '탄수화물', percentage: carbPercentage.toFixed(1) });
    angles.push({ startAngle: startAngle, endAngle: startAngle += proteinAngle, color: '#EEA9A9', label: '단백질', percentage: proteinPercentage.toFixed(1) });
    angles.push({ startAngle: startAngle, endAngle: startAngle += fatAngle, color: '#FFD2A4', label: '지방', percentage: fatPercentage.toFixed(1) });
  }

  // 각 영역의 Path를 생성하는 함수
  const createPieSlicePath = (startAngle: number, endAngle: number) => {
    // startAngle과 endAngle이 같은 경우 전체를 채우도록 설정
    if (endAngle - startAngle === 0 || endAngle - startAngle >= 360) {
      endAngle = 359.99; // SVG의 특성상 360도가 아닌 359.99도로 설정
    }
  
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    
    return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };
  

  // 각도를 좌표로 변환하는 함수
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // 파이 조각 중심에 텍스트 위치를 계산하는 함수
  const calculateTextPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    return polarToCartesian(center, center, radius * 0.6, midAngle); // 0.6을 곱하여 파이의 내부에 위치하도록 조정
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Pie Chart 영역 */}
      <Svg style={styles.kcalPieChart} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 각 영양소 영역 그리기 */}
        {angles.map((slice, index) => (
          <React.Fragment key={index}>
            <Path d={createPieSlicePath(slice.startAngle, slice.endAngle)} fill={slice.color} />
            <SvgText
              x={calculateTextPosition(slice.startAngle, slice.endAngle).x}
              y={calculateTextPosition(slice.startAngle, slice.endAngle).y}
              fill="#000"
              fontFamily='Pretendard-Regular'
              fontSize="13"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {`${slice.percentage}%`}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>

      {/* 그래프 위에 이미지를 위치시키기 */}
      <images.excludeWhite
        width={size * 1.1} height={size * 1.1}
        style={[styles.excludeWhite]}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  kcalPieChart: {
    position: 'relative',
  },
  excludeWhite: {
    position: 'absolute',
  },
});

export default NutrientPieChart;
