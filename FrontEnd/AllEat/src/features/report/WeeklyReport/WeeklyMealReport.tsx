// DailyMealReport.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { icons } from '../../../constants';
import { styles } from './WeeklyMealReport.styles';
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

interface WeeklyMealReportProps {
  goalKcal: number;
  kcalAverage: number;
  proteinAvg: number;
  carbAvg: number;
  fatAvg: number;
  costAvg: number;
  proteinRanking: NutrientDetail[];
  kcalRanking: NutrientDetail[];
}

const WeeklyMealReport: React.FC<WeeklyMealReportProps> = ({ goalKcal, kcalAverage, proteinAvg, carbAvg, fatAvg, proteinRanking, kcalRanking }) => {
  const [carbVisible, setCarbVisible] = useState(false);
  const [proteinVisible, setProteinVisible] = useState(false);
  const [fatVisible, setFatVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 메뉴 표시 여부
  
  // goalKcal 대비 섭취한 칼로리 비율 계산
  const caloriePercentage = (kcalAverage / goalKcal) * 100;

  // 각 영양소의 비율 계산
  const totalNutrients = carbAvg + proteinAvg + fatAvg;
  const carbPercentage = (carbAvg / totalNutrients) * 100;
  const proteinPercentage = (proteinAvg / totalNutrients) * 100;
  const fatPercentage = (fatAvg / totalNutrients) * 100;


  return (
    <View style={styles.weeklyMealReportContainer}>
      <Text style={styles.weeklyMealReportTitle}>
        한 주 평균 {kcalAverage.toFixed(0)}kcal를 섭취했어요!
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
      <View style={styles.nutrientContainer}>
        <Text style={styles.nutrientTitle}>
          영양 정보
        </Text>
        <View style={styles.kcalGraphConatiner}>
          <NutrientPieChart
            carbPercentage={carbPercentage}
            proteinPercentage={proteinPercentage}
            fatPercentage={fatPercentage}
          />
          <View style={styles.kcalGrpahDetailContainer}>
            <View style={styles.kcalGraphDetailBox}>
              <icons.tan width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>탄수화물 {carbAvg.toFixed(0)}g</Text>
            </View>
            <View style={styles.kcalGraphDetailBox}>
              <icons.dan width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>단백질 {proteinAvg.toFixed(0)}g</Text>
            </View>            
            <View style={styles.kcalGraphDetailBox}>
              <icons.ji width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>지방 {fatAvg.toFixed(0)}g</Text>
            </View>
          </View>
        </View>
        {/* 탄수화물 정보 */}
        <TouchableOpacity onPress={() => setCarbVisible(!carbVisible)}>
          <View style={styles.nutrientTitleContainer}>
            <icons.tan style={styles.nutrientIcon} width={18} height={18}/>
            <Text style={styles.nutrientText}>탄수화물</Text>
            <Text style={styles.nutrientNum}>{carbAvg.toFixed(0)}g</Text>
            {carbVisible ? 
              <icons.arrowTop width={18} height={18}/> : 
              <icons.arrowBottom width={18} height={18}/>
            }
          </View>
        </TouchableOpacity>
        {carbVisible && (
          <View style={styles.nutrientDetailContainer}>
            {proteinRanking.map((item, index) => (
              <View key={index} style={styles.nutrientDetailRow}>
                <Text style={styles.nutrienDetailText}>{item.menu_name} · {item.carbohydrates.toFixed(0)}g</Text>
              </View>
            ))}
          </View>
        )}

        {/* 단백질 정보 */}
        <TouchableOpacity onPress={() => setProteinVisible(!proteinVisible)}>
          <View style={styles.nutrientTitleContainer}>
            <icons.dan style={styles.nutrientIcon} width={18} height={18}/>
            <Text style={styles.nutrientText}>단백질</Text>
            <Text style={styles.nutrientNum}>{proteinAvg.toFixed(0)}g</Text>
            {proteinVisible ? 
              <icons.arrowTop width={18} height={18}/> : 
              <icons.arrowBottom width={18} height={18}/>
            }
          </View>
        </TouchableOpacity>
        {proteinVisible && (
          <View style={styles.nutrientDetailContainer}>
            {proteinRanking.map((item, index) => (
              <View key={index} style={styles.nutrientDetailRow}>
                <Text style={styles.nutrienDetailText}>{item.menu_name} · {item.proteins.toFixed(0)}g</Text>
              </View>
            ))}
          </View>
        )}

        {/* 지방 정보 */}
        <TouchableOpacity onPress={() => setFatVisible(!fatVisible)}>
          <View style={styles.nutrientTitleContainer}>
            <icons.ji style={styles.nutrientIcon} width={18} height={18}/>
            <Text style={styles.nutrientText}>지방</Text>
            <Text style={styles.nutrientNum}>{fatAvg.toFixed(0)}g</Text>
            {fatVisible ? 
              <icons.arrowTop width={18} height={18}/> : 
              <icons.arrowBottom width={18} height={18}/>
            }
          </View>
        </TouchableOpacity>
        {fatVisible && (
          <View style={styles.nutrientDetailContainer}>
            {proteinRanking.map((item, index) => (
              <View key={index} style={styles.nutrientDetailRow}>
                <Text style={styles.nutrienDetailText}>{item.menu_name} · {item.fats.toFixed(0)}g</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default WeeklyMealReport;
