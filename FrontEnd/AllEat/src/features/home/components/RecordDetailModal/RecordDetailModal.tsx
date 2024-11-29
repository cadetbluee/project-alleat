// RecordDetail.tsx
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './RecordDetailModal.styles'; // 스타일 파일
import {icons} from '../../../../constants';
import CustomButton from '../../../../components/CustomButton';
import api from '../../../../utils/api';
import DiaryCard from '../DiaryCard/DiaryCard';
interface RecordDetailProps {
  id: number;
  date: string;
  title: string;
  kcal: string;
  price: string;
  onClose: () => void;
  onPress: () => void;
}
const titleMapping: {[key: string]: string} = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  SNACK: '간식',
};

const RecordDetailModal: React.FC<RecordDetailProps> = ({
  id,
  title,
  date,
  kcal,
  price,
  onClose,
  onPress,
}) => {
  const [mealList, setMealList] = useState<
    Array<{
      restaurant: string;
      menu: string;
      price: number;
      kcal: number;
      people: number;
    }>
  >([]);
  const [diaryData, setDiaryData] = useState({
    diary_protein: 0,
    diary_carb: 0,
    diary_fat: 0,
    diary_kcal: 0,
  });

  // API 요청으로 id를 이용해 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/AllEat/get/detail/${id}`);
        const {menus, diary_protein, diary_carb, diary_fat, diary_kcal} =
          response.data;

        // 메뉴 데이터와 다이어리 데이터 설정
        setMealList(
          menus.map((menu: any) => ({
            restaurant: menu.restaurants_name,
            menu: menu.menu_name,
            price: menu.menu_price,
            kcal: menu.menu_calories,
            people: menu.person_count,
          })),
        );
        setDiaryData({
          diary_protein,
          diary_carb,
          diary_fat,
          diary_kcal,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);
  // title을 한글로 변환
  const translatedTitle = titleMapping[title] || title; // 매핑된 값이 없으면 원래 값을 사용

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {date} {translatedTitle}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <icons.exit height={24} width={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.modalBody}>
        <Text style={styles.modalKcalPrice}>
          {kcal.toLocaleString()}·{price.toLocaleString()}
        </Text>
      </View>
      <View style={styles.tandanjiContainer}>
        <View style={styles.tandanjiBox}>
          <icons.tan height={20} width={20} />
          <Text style={styles.tandanjiTitle}>탄수화물</Text>
          <Text style={styles.tandanjiInfo}>{diaryData.diary_carb}g</Text>
        </View>
        <View style={styles.tandanjiBox}>
          <icons.dan height={20} width={20} />
          <Text style={styles.tandanjiTitle}>단백질</Text>
          <Text style={styles.tandanjiInfo}>{diaryData.diary_protein}g</Text>
        </View>
        <View style={styles.tandanjiBox}>
          <icons.ji height={20} width={20} />
          <Text style={styles.tandanjiTitle}>지방</Text>
          <Text style={styles.tandanjiInfo}>{diaryData.diary_fat}g</Text>
        </View>
      </View>
      <View style={styles.modalList}>
        {mealList.map((meal, index) => (
          <DiaryCard
            key={index}
            restaurant={meal.restaurant}
            menu={meal.menu}
            price={meal.price}
            kcal={meal.kcal}
            people={meal.people}
            isEdit={false}
          />
        ))}
        <CustomButton
          title="수정하기"
          handlePress={onPress}
          containerStyles="w-[88%] h-[60px]  mb-5 bg-white" // Tailwind 스타일 전달
          textStyles="text-secondary font-pbold" // Tailwind 스타일 전달
          isLoading={false} // 로딩 상태 설정
        />
      </View>
    </View>
  );
};

export default RecordDetailModal;
