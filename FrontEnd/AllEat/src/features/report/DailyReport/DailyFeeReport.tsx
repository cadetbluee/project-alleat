// DailyFeeReport.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { icons } from '../../../constants';
import { styles } from './DailyFeeReport.styles';

// foodDetails 타입을 snake_case로 변경
interface FoodDetails {
  menu_price: number;
  menu_carbohydrate: number;
  menu_protein: number;
  menu_calories: number;
  menu_fat: number;
  restaurant_name: string;
  restaurant_type: string;
  menu_name: string;
}

interface DailyFeeReportProps {
  goalFee: number;
  totalPrice: number;
  foodDetails: FoodDetails[];
}

const DailyFeeReport: React.FC<DailyFeeReportProps> = ({ goalFee, totalPrice, foodDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 메뉴 표시 여부

  // goalFee 대비 소비 금액 비율 계산
  const feePercentage = (totalPrice / goalFee) * 100;
  // console.log('정보 확인', foodDetails)

  return (
    <View style={styles.dailyFeeReportContainer}>
      <Text style={styles.dailyFeeReportTitle}>
        하루 식비 {totalPrice.toLocaleString()}원을 소비했어요!
      </Text>
      <View style={styles.feeBarContainer}>
        {totalPrice > goalFee && (
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
              { color: totalPrice > goalFee ? '#D60000' : '#000000' } // goalFee를 초과하면 텍스트 색상 변경
            ]}
          >
            {totalPrice.toLocaleString()} / {goalFee.toLocaleString()} ₩
          </Text>
        </View>
      </View>
      <View style={styles.feeContainer}>
        <Text style={styles.feeTitle}>
          식비 정보
        </Text>
        <View>
  {(isExpanded ? foodDetails.filter(item => item.menu_price > 0) : foodDetails.filter(item => item.menu_price > 0).slice(0, 3))
    .map((item, index) => (
      <View key={index}>
        <View style={styles.feeTitleContainer}>
          <icons.passwordCheck style={styles.feeIcon} width={18} height={18}/>
          <Text style={styles.feeMenuText}>{item.menu_name}</Text>
          <Text style={styles.feePriceText}>₩{item.menu_price.toLocaleString()}</Text>
        </View>
        <View style={styles.feeDetailContainer}>
          <Text style={styles.feeDetailText}>{item.restaurant_name}</Text>
        </View>
      </View>
    ))}
  
  <View style={styles.iconConatiner}>
    {foodDetails.filter(item => item.menu_price > 0).length > 3 && (
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

export default DailyFeeReport;
