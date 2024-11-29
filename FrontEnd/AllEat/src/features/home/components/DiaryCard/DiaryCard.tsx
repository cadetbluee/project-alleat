// components/DiaryCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {icons} from '../../../../constants';
import {styles} from './DiaryCard.styles';

type DiaryCardProps = {
  restaurant: string;
  menu: string;
  price: number; // 인원 수에 따른 가격 계산
  kcal: number; // 인원 수에 따른 칼로리 계산
  people: number;
  onIncreasePeople?: () => void;
  onDecreasePeople?: () => void;
  onDelete?: () => void;
  isEdit?: boolean;
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DiaryCard: React.FC<DiaryCardProps> = ({
  restaurant,
  menu,
  price,
  kcal,
  people,
  onIncreasePeople,
  onDecreasePeople,
  onDelete,
  isEdit = true,
}) => {
  const pricePerPerson = price / people; // 인원 수에 따라 가격을 나눔
  const kcalPerPerson = kcal / people; // 인원 수에 따라 칼로리를 나눔
  const displayedRestaurant = emailRegex.test(restaurant) ? '집밥' : restaurant;
  return (
    <View style={styles.mainRecordCard}>
      {isEdit && (
        <View style={styles.mainRecordPeople}>
          <TouchableOpacity onPress={onDelete}>
            <icons.minusWhite height={20} width={20} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.mainRecordMenu}>
        <Text style={styles.cardDescription}>{displayedRestaurant}</Text>
        <Text style={styles.cardTitle}>{menu}</Text>
      </View>
      <View style={styles.mainRecordDetail}>
        <Text style={styles.cardDescription}>
          {pricePerPerson.toFixed(0).toLocaleString()}원
        </Text>
        <Text style={styles.cardTitle}>
          {kcalPerPerson.toFixed(0).toLocaleString()}kcal
        </Text>
      </View>
      {isEdit && (
        <View style={styles.mainRecordPeople}>
          <Text style={styles.cardDescription}>인원</Text>
          <View style={styles.mainRecordPeopleButton}>
            <TouchableOpacity onPress={onDecreasePeople}>
              <icons.arrowBackLeftWhite height={20} width={20} />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{people}</Text>
            <TouchableOpacity onPress={onIncreasePeople}>
              <icons.arrowBackRightWhite height={20} width={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default DiaryCard;
