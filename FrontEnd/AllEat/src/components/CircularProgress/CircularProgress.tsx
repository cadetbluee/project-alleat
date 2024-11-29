import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {useSharedValue, useAnimatedProps, withTiming} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {styles} from './CircularProgress.styles';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1 사이의 값
  total: number; // 총 목표 값 (예: 16000원)
  current: number; // 현재 값 (예: 5800원)
  progressColor?: string; // 프로그레스 바 색상
  currentTextColor?: string; // 현재 텍스트 색상
  totalTextColor?: string; // 총 텍스트 색상
  unit?: string; // 단위 (₩, kcal 등)
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 130,
  strokeWidth = 10,
  progress = 0.36,
  total,
  current,
  progressColor = '#769BFF', // 기본 색상
  currentTextColor = '#769BFF', // 기본 현재 텍스트 색상
  totalTextColor = 'black', // 기본 총 텍스트 색상
  unit = '₩', // 기본 단위는 '₩'로 설정
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // 애니메이션을 위한 sharedValue
  const animatedProgress = useSharedValue(0); // 초기 값 0

  useEffect(() => {
    // 목표 progress 값까지 애니메이션을 실행
    animatedProgress.value = withTiming(progress, {duration: 1000});
  }, [progress]);

  // 애니메이션된 속성을 업데이트
  const animatedProps = useAnimatedProps(() => {
    const normalizedProgress = Math.min(animatedProgress.value, 1); // 애니메이션된 프로그레스 값
    const angle = normalizedProgress * 2 * Math.PI;

    const x = center + radius * Math.sin(angle);
    const y = center - radius * Math.cos(angle);

    const largeArcFlag = normalizedProgress > 0.5 ? 1 : 0;

    const pathData =
      normalizedProgress < 1
        ? `
        M ${center} ${center - radius}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}
        L ${center} ${center}
        Z
      `
        : `
        M ${center} ${center - radius}
        A ${radius} ${radius} 0 1 1 ${center} ${center + radius}
        A ${radius} ${radius} 0 1 1 ${center} ${center - radius}
        Z
      `;

    return {d: pathData};
  });

  return (
    <View style={styles.circleContainer}>
      <Svg width={size} height={size} style={styles.svgContainer}>
        {/* 안이 채워진 배경 원 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="#E0E0E0" // 채워진 배경 색
        />
        {/* 애니메이션이 적용된 진행된 부분 */}
        <AnimatedPath animatedProps={animatedProps} fill={progressColor} />
      </Svg>
      <Text style={[styles.currentText, {color: currentTextColor}]}>
        {current.toLocaleString()}
        {unit}
      </Text>
      <Text style={[styles.totalText, {color: totalTextColor}]}>
        /{total.toLocaleString()}
        {unit}
      </Text>
    </View>
  );
};

export default CircularProgress;
