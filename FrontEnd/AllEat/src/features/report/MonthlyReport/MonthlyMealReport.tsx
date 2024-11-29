// DailyMealReport.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { icons } from '../../../constants';
import { styles } from './MonthlyMealReport.styles';
import NutrientPieChart from '../../../components/NutrientPieChart/NutrientPieChart';

interface NutrientDetail {
  menu_name: string;
  carbohydrates?: number;
  proteins?: number;
  fats?: number;
  calories?: number;
  cost?: number;
  restaurantType: string;
}

interface MonthlyMealReportProps {
  goalKcal: number;
  kcalAverage: number;
  kcalRanking: NutrientDetail[];
}

const MonthlyMealReport: React.FC<MonthlyMealReportProps> = ({ goalKcal, kcalAverage, proteinAvg, carbAvg, fatAvg, proteinRanking, kcalRanking }) => {
  const [carbVisible, setCarbVisible] = useState(false);
  const [proteinVisible, setProteinVisible] = useState(false);
  const [fatVisible, setFatVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 메뉴 표시 여부
  
  // goalKcal 대비 섭취한 칼로리 비율 계산
  const caloriePercentage = (kcalAverage / goalKcal) * 100;



  return (
    <View style={styles.monthlyMealReportContainer}>
      <Text style={styles.monthlyMealReportTitle}>
        한 달 평균 {kcalAverage.toFixed(0)}kcal를 섭취했어요!
      </Text>
      <View style={styles.kcalBarContainer}>
        {kcalAverage > goalKcal && (
            <icons.warning style={styles.warningIcon} width={26} height={26}/>
          )}
        <View style={styles.kcalBarBox}>
          <View style={[
            styles.kcalBar, 
            {
              width: `${caloriePercentage}%`,
              backgroundColor:'#AEC3FE',
            },
          ]}/>
          <Text
            style={[styles.kcalTextOverlay,
            { color: kcalAverage > goalKcal ? '#D60000' : '#000000' }]}
          >{kcalAverage.toFixed(0)} / {goalKcal} kcal</Text>
        </View>         
      </View>
      <View style={styles.nutrientContainer}>
        <Text style={styles.nutrientTitle}>
          칼로리 정보
        </Text>
        <View style={styles.feeDetailContainer}>
          {(isExpanded ? kcalRanking : kcalRanking.slice(0, 3)).map((item, index) => (
            <View key={index}>
              <View style={styles.mealTitleContainer}>
                <icons.passwordCheck style={styles.mealIcon} width={18} height={18}/>
                <Text style={styles.feeMenuText}>{item.menu_name}</Text>
                <Text style={styles.feePriceText}>{item.calories}kcal</Text>
              </View>
              
            </View>
          ))}
            <View style={styles.iconConatiner}>
            {kcalRanking.length > 3 && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <icons.arrowTop width={18} height={18} />
                ) : (
                  <icons.arrowBottom width={18} height={18} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonthlyMealReport;
