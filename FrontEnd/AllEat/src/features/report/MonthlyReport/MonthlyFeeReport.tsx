// DailyFeeReport.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { icons } from '../../../constants';
import { styles } from './MonthlyFeeReport.styles';
import NutrientPieChart from '../../../components/NutrientPieChart/NutrientPieChart';
import LinkButton from '../../../components/linkButton';

interface menuDetails {
  cost: number;
  carbohydrates: number;
  proteins: number;
  calories: number;
  fats: number;
  restaurantType: string;
  menu_name: string;
}

interface costWhere {
  RESTAURANTS: number;
  HOME: number;
  DELIVERY: number;
}

interface MonthlyFeeReportProps {
  goalFee: number;
  costAvg: number;
  costRanking: menuDetails[];
  costWhere: costWhere;
  totalCost: number;
  paymoneyCost: number;
}


const MonthlyFeeReport: React.FC<MonthlyFeeReportProps> = ({ goalFee, costAvg, costRanking, costWhere, paymoneyCost, totalCost}) => {
  const [isExpanded, setIsExpanded] = useState(false); // 메뉴 표시 여부

  // goalFee 대비 소비 금액 비율 계산
  const feePercentage = (costAvg / goalFee) * 100;
  const payPercentage = ( totalCost/ paymoneyCost) * 100;

  // 각 타입의 count 값 가져오기 (없으면 0)
  const restaurantCount = costWhere.RESTAURANTS || 0;
  const homeCount = costWhere.HOME || 0;
  const deliveryCount = costWhere.DELIVERY || 0;

  // 총 count 계산
  const totalCount = restaurantCount + homeCount + deliveryCount;



  // 각 타입의 퍼센트 계산 (totalCount가 0일 때 대비)
  const restaurantPercentage = totalCount > 0 ? (restaurantCount / totalCount) * 100 : 0;
  const homePercentage = totalCount > 0 ? (homeCount / totalCount) * 100 : 0;
  const deliveryPercentage = totalCount > 0 ? (deliveryCount / totalCount) * 100 : 0;
  
  return (
    <View style={styles.dailyFeeReportContainer}>
      <Text style={styles.dailyFeeReportTitle}>
        한 달 평균 {costAvg.toFixed(0)}원을 소비했어요!
      </Text>
      <View style={styles.feeBarContainer}>
        {costAvg > goalFee && (
          <icons.warning style={styles.warningIcon} width={26} height={26}/>
        )}
        <View style={styles.feeBarGraph}>
          <View style={[
            styles.feeBar, 
            {
              width: `${feePercentage}%`,
              backgroundColor:'#AEC3FE',
            },
          ]}/>
          <Text 
            style={[
              styles.feeTextOverlay, 
              { color: costAvg > goalFee ? '#D60000' : '#000000' } // goalFee를 초과하면 텍스트 색상 변경
            ]}
          >
            {costAvg.toFixed(0)} / {goalFee} ₩
          </Text>
        </View>
      </View>
      <View style={styles.feeContainer}>
        <Text style={styles.feeTitle}>
          식비 정보
        </Text>
        <View style={styles.feeDetailContainer}>
          {(isExpanded ? costRanking.filter(item => item.cost > 0) : costRanking.filter(item => item.cost > 0).slice(0, 3)).map((item, index) => (
              <View key={index}>
                  <View style={styles.feeTitleContainer}>
                      <icons.passwordCheck style={styles.feeIcon} width={18} height={18}/>
                      <Text style={styles.feeMenuText}>{item.menu_name}</Text>
                      <Text style={styles.feePriceText}>₩{item.cost.toLocaleString()}</Text>
                  </View>
              </View>
          ))}
          <View style={styles.iconConatiner}>
              {costRanking.filter(item => item.cost > 0).length > 3 && (
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
      <View style={styles.feeContainer}>
        <Text style={styles.feeTitle}>
          한 달 동안 식비를 어디에 사용했을까요?
        </Text>
        <View style={styles.kcalGraphContainer}>
        <NutrientPieChart
          carbPercentage={homePercentage}        // 집밥 비율
          proteinPercentage={restaurantPercentage} // 외식 비율
          fatPercentage={deliveryPercentage}      // 배달 비율
        />
          <View style={styles.kcalGrpahDetailContainer}>
            <View style={styles.kcalGraphDetailBox}>
              <icons.tan width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>집밥 {homeCount}회</Text>
            </View>
            <View style={styles.kcalGraphDetailBox}>
              <icons.dan width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>외식 {restaurantCount}회</Text>
            </View>            
            <View style={styles.kcalGraphDetailBox}>
              <icons.ji width={18} height={18} />
              <Text style={styles.kcalGraphDetailText}>배달 {deliveryCount}회</Text>
            </View>
          </View>
        </View>
        <Text style={styles.feeTitle}>
          결제 비용 대비 이만큼을 식비로 사용했어요!
        </Text>
        <View style={styles.feeBarContainer}>
        {totalCost > paymoneyCost && (
          <icons.warning style={styles.warningIcon} width={26} height={26}/>
        )}
        <View style={styles.feeBarGraph}>
          <View style={[
            styles.feeBar, 
            {
              width: `${payPercentage}%`,
              backgroundColor:'#AEC3FE',
            },
          ]}/>
          <Text 
            style={[
              styles.feeTextOverlay, 
              { color: totalCost > paymoneyCost ? '#D60000' : '#000000' } // goalFee를 초과하면 텍스트 색상 변경
            ]}
          >
            {totalCost} / {paymoneyCost} ₩
          </Text>
        </View>
      </View>
        <View style={styles.linkButtonContainer}>
          <LinkButton text="식비 내역" targetScreen="PaymoneyDetail" />
        </View>
      </View>
    </View>
  );
};

export default MonthlyFeeReport;
