// DailyMealReport.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {icons} from '../../../constants';
import {styles} from './DailyMealReport.styles';
import NutrientPieChart from '../../../components/NutrientPieChart/NutrientPieChart';

interface NutrientDetail {
  menuName: string;
  menuCarbohydrate?: number;
  menuProtein?: number;
  menuFat?: number;
}

interface DailyMealReportProps {
  goalKcal: number;
  totalCarbohydrate: number;
  totalProtein: number;
  totalFat: number;
  totalCalories: number;
  carbohydrates: NutrientDetail[];
  proteins: NutrientDetail[];
  fats: NutrientDetail[];
}

const DailyMealReport: React.FC<DailyMealReportProps> = ({
  goalKcal,
  totalCalories,
  totalCarbohydrate,
  totalProtein,
  totalFat,
  carbohydrates,
  proteins,
  fats,
}) => {
  const [carbVisible, setCarbVisible] = useState(false);
  const [proteinVisible, setProteinVisible] = useState(false);
  const [fatVisible, setFatVisible] = useState(false);

  // goalKcal 대비 섭취한 칼로리 비율 계산
  const caloriePercentage = (totalCalories / goalKcal) * 100;

  // 총 영양소 합계
  const totalNutrients = totalCarbohydrate + totalProtein + totalFat;

  // 각 영양소의 비율 계산
  const carbPercentage = (totalCarbohydrate / totalNutrients) * 100;
  const proteinPercentage = (totalProtein / totalNutrients) * 100;
  const fatPercentage = (totalFat / totalNutrients) * 100;

  return (
    <View style={styles.dailyMealReportContainer}>
      <Text style={styles.dailyMealReportTitle}>
        오늘 총 {totalCalories}kcal를 섭취했어요!
      </Text>
      <View style={styles.kcalBarContainer}>
        {totalCalories > goalKcal && (
          <icons.warning style={styles.warningIcon} width={26} height={26} />
        )}
        <View style={styles.kcalBarBox}>
          <View
            style={[
              styles.kcalBar,
              {
                width: `${caloriePercentage}%`,
                backgroundColor: '#AEC3FE',
              },
            ]}
          />
          <Text
            style={[
              styles.kcalTextOverlay,
              {color: totalCalories > goalKcal ? '#D60000' : '#000000'},
            ]}>
            {totalCalories} / {goalKcal} kcal
          </Text>
        </View>
      </View>
      <View style={styles.nutrientContainer}>
        <Text style={styles.nutrientTitle}>영양 정보</Text>
        <View style={styles.kcalGraphConatiner}>
          <NutrientPieChart
            carbPercentage={carbPercentage}
            proteinPercentage={proteinPercentage}
            fatPercentage={fatPercentage}
          />
          <View style={styles.kcalGrpahDetailContainer}>
            <View style={styles.kcalGraphDetailBox}>
              <icons.tan width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>
                탄수화물 {totalCarbohydrate.toFixed(0)}g
              </Text>
            </View>
            <View style={styles.kcalGraphDetailBox}>
              <icons.dan width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>
                단백질 {totalProtein.toFixed(0)}g
              </Text>
            </View>
            <View style={styles.kcalGraphDetailBox}>
              <icons.ji width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>
                지방 {totalFat.toFixed(0)}g
              </Text>
            </View>
          </View>
        </View>
        {/* 탄수화물 정보 */}
        <TouchableOpacity onPress={() => setCarbVisible(!carbVisible)}>
          <View style={styles.nutrientTitleContainer}>
            <icons.tan style={styles.nutrientIcon} width={18} height={18} />
            <Text style={styles.nutrientText}>탄수화물</Text>
            <Text style={styles.nutrientNum}>
              {totalCarbohydrate.toFixed(0)}g
            </Text>
            {carbVisible ? (
              <icons.arrowTop width={18} height={18} />
            ) : (
              <icons.arrowBottom width={18} height={18} />
            )}
          </View>
        </TouchableOpacity>
        {carbVisible && (
          <View style={styles.nutrientDetailContainer}>
            {carbohydrates.map((item, index) => (
              <View key={index} style={styles.nutrientDetailRow}>
                <Text style={styles.nutrienDetailText}>
                  {item.menuName} · {item.menuCarbohydrate.toFixed(0)}g
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 단백질 정보 */}
        <TouchableOpacity onPress={() => setProteinVisible(!proteinVisible)}>
          <View style={styles.nutrientTitleContainer}>
            <icons.dan style={styles.nutrientIcon} width={18} height={18} />
            <Text style={styles.nutrientText}>단백질</Text>
            <Text style={styles.nutrientNum}>{totalProtein.toFixed(0)}g</Text>
            {proteinVisible ? (
              <icons.arrowTop width={18} height={18} />
            ) : (
              <icons.arrowBottom width={18} height={18} />
            )}
          </View>
        </TouchableOpacity>
        {proteinVisible && (
          <View style={styles.nutrientDetailContainer}>
            {proteins.map((item, index) => (
              <View key={index} style={styles.nutrientDetailRow}>
                <Text style={styles.nutrienDetailText}>
                  {item.menuName} · {item.menuProtein.toFixed(0)}g
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 지방 정보 */}
        <TouchableOpacity onPress={() => setFatVisible(!fatVisible)}>
          <View style={styles.nutrientTitleContainer}>
            <icons.ji style={styles.nutrientIcon} width={18} height={18} />
            <Text style={styles.nutrientText}>지방</Text>
            <Text style={styles.nutrientNum}>{totalFat.toFixed(0)}g</Text>
            {fatVisible ? (
              <icons.arrowTop width={18} height={18} />
            ) : (
              <icons.arrowBottom width={18} height={18} />
            )}
          </View>
        </TouchableOpacity>
        {fatVisible && (
          <View style={styles.nutrientDetailContainer}>
            {fats.map((item, index) => (
              <View key={index} style={styles.nutrientDetailRow}>
                <Text style={styles.nutrienDetailText}>
                  {item.menuName} · {item.menuFat.toFixed(0)}g
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default DailyMealReport;
