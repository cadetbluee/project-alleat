import React from 'react';
import {View, Text} from 'react-native';
import {icons} from '../../constants';
import {styles} from './DateSection.styles';
import TransactionItem from '../TransactionItem/TransactionItem'; // 아래에서 정의할 TransactionItem 컴포넌트

interface Transaction {
  id: number;
  amount: number;
  record: boolean;
  restaurant: {
    id: number;
    restaurantsName: string;
    restaurantsType: string;
  };
  mealpay: any;
  transaction_type: number;
  transaction_date: string;
}
interface Menu {
  menu_name: string;
  restaurant_name: string;
  menu_kcal: number;
  menu_cost: number;
}

interface Diary {
  diary_cost: number;
  diary_kcal: number;
  diary_time: string;
  menus: Menu[]; // Menu 객체 배열로 정의
}
interface DateSectionProps {
  date: string;
  transactions?: Transaction[];
  diaries?: Diary[];
}
const timeTranslations: {
  [key: string]: {label: string; icon: React.FC<any>};
} = {
  BREAKFAST: {label: '아침', icon: icons.logMorning},
  LUNCH: {label: '점심', icon: icons.logLunch},
  DINNER: {label: '저녁', icon: icons.logDinner},
  SNACK: {label: '간식', icon: icons.logSnack},
  MART: {label: '장보기', icon: icons.logMart},
};
// 이메일 형식인지 확인하는 함수
const isEmail = (text: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

const DateSection: React.FC<DateSectionProps> = ({
  date,
  transactions,
  diaries,
}) => {
  return (
    <View style={styles.dateSection}>
      <icons.logIcon width={24} height={24} style={styles.dateIcon} />
      <Text style={styles.dateText}>{date}</Text>
      {transactions?.map(transaction => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
      {diaries?.map((diary, diaryIndex) => {
        const IconComponent = timeTranslations[diary.diary_time].icon; // 아이콘 컴포넌트를 변수에 할당

        return (
          <View
            style={styles.diaryContainer}
            key={`${diary.diary_time}-${diaryIndex}`}>
            <View style={styles.diaryTitleContainer}>
              <IconComponent width={24} height={24} />
              <Text style={styles.diaryTitle}>
                {timeTranslations[diary.diary_time].label}
              </Text>
              {diary.diary_time !== 'MART' && (
                <Text style={styles.diaryTitle}>
                  {diary.diary_kcal}kcal · ₩{diary.diary_cost.toLocaleString()}
                </Text>
              )}
              {diary.diary_time === 'MART' && (
                <Text style={styles.diaryTitle}>
                  ₩{diary.diary_cost.toLocaleString()}
                </Text>
              )}
            </View>
            {diary.diary_time !== 'MART' &&
              diary.menus.map((menu, menuIndex) => (
                <View
                  style={styles.menuContainer}
                  key={`${menu.menu_name}-${menuIndex}`}>
                  <Text style={styles.menuTitle}>{menu.menu_name}</Text>
                  <Text style={styles.menuRestaurant}>
                    {isEmail(menu.restaurant_name)
                      ? '집밥'
                      : menu.restaurant_name}
                  </Text>
                  <Text style={styles.menuDetail}>
                    ㅡ {menu.menu_kcal}kcal · ₩{menu.menu_cost.toLocaleString()}
                  </Text>
                </View>
              ))}
            {diary.diary_time === 'MART' &&
              diary.menus.map((menu, menuIndex) => (
                <View
                  style={styles.menuContainer}
                  key={`${menu.menu_name}-${menuIndex}`}>
                  <Text style={styles.menuTitle}>{menu.restaurant_name}</Text>

                  <Text style={styles.menuDetail}>
                    ₩{menu.menu_cost.toLocaleString()}
                  </Text>
                </View>
              ))}
          </View>
        );
      })}
    </View>
  );
};

export default DateSection;
