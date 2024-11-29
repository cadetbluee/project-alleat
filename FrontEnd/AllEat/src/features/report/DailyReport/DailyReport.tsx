import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { format, addDays, subDays } from 'date-fns';
import { styles } from './DailyReport.styles';
import { icons } from '../../../constants';
import { images } from '../../../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import AIReport from '../components/AIReport';
import api from '../../../utils/api';
import {FAST_API_URL} from '@env';
import DailyMealReport from './DailyMealReport';
import DailyFeeReport from './DailyFeeReport';

const DailyReport: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [reportData, setReportData] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const goalKcal = useSelector((state: RootState) => state.info.goal_kcal);
  const goalFee = useSelector((state: RootState) => state.info.goal_cost);
  const goalWeight = useSelector((state: RootState) => state.info.goal_weight);
  const recentWeight = useSelector((state: RootState) => state.info.weights);
  const firstWeight = recentWeight && recentWeight.length > 0 ? recentWeight[0].weight : null;
  

  const token = useSelector((state: RootState) => state.auth.token);

  const handlePreviousDate = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDate = () => {
    const today = new Date(); // 오늘 날짜
    const nextDate = addDays(currentDate, 1); // 다음 날짜
    
    // 다음 날짜가 오늘 날짜 이후인지 확인
    if (nextDate <= today) {
      setCurrentDate(nextDate); // 다음 날짜가 오늘 날짜 이하면 변경
    }
  };

  // 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/AllEat/day-report', {
          day: formattedDate,
        });
        const data = response.data;
        setReportData(data);

        const aiData = {
          food_details: data.food_details,
          goal_weight: goalWeight,
          goal_cost: goalFee,
          recent_weight: firstWeight,
        };

        const aiResponse = await fetch(`${FAST_API_URL}/fast-api/report/day`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(aiData),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          setAiResponse(aiResult.response);
        } else {
          console.error('AI 응답 오류:', aiResponse.statusText);
          setAiResponse('AI 응답을 가져오지 못했습니다.');
        }
      } catch (error) {
        // console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [currentDate, goalWeight, goalFee, firstWeight]);

  // 날짜 변경 시 reportData를 초기화
  useEffect(() => {
    setReportData(null);
  }, [currentDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex(prevIndex => (prevIndex + 1) % 2);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const kikiImages = [images.kikiRunning1, images.kikiRunning2];

  return (
    <ScrollView style={styles.dailyReportContainer}>
      <View style={styles.dateNavigatorContainer}>
        <TouchableOpacity onPress={handlePreviousDate}>
          <icons.arrowBackLeft height={27} width={27} />
        </TouchableOpacity>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableOpacity onPress={handleNextDate} disabled={currentDate >= new Date()}>
          <icons.arrowBackRight height={27} width={27} />
        </TouchableOpacity>
      </View>

      {!reportData ? (
        // 로딩 애니메이션을
        <View style={styles.loadingContainer}>
          {React.createElement(kikiImages[imageIndex], { width: 200, height: 200 })}
          <Text style={styles.lodingText}>아직 오늘의 식단을 기록하지 않았어요!</Text>
        </View>
      ) : (
        <>
          {/*AI 레포트 영역 */}
          <View style={styles.AIContainer}>
            <icons.mypage style={styles.AIIcon} width={30} height={30} />
            <Text style={styles.AITitleText}>AllEat! 오늘의 레포트</Text>
            {aiResponse ? (
              <AIReport title='AllEat! 오늘의 레포트' aiData={aiResponse} />
            ) : (
              <View style={styles.loadingContainer}>
                {React.createElement(kikiImages[imageIndex], { width: 200, height: 200 })}
                <Text style={styles.lodingText}>키키가 AI 레포트를 배달 중이에요</Text>
                <Text style={styles.lodingText}>조금만 기다려 주세요!</Text>
              </View>
            )}
          </View>

          <View style={styles.ReportContainer}>
            {/* 식단 레포트 영역 */}
            <DailyMealReport
              goalKcal={goalKcal}
              totalCalories={reportData.food_details.reduce((acc, item) => acc + item.menu_calories, 0)}
              totalCarbohydrate={reportData.food_details.reduce((acc, item) => acc + item.menu_carbohydrate, 0)}
              totalProtein={reportData.food_details.reduce((acc, item) => acc + item.menu_protein, 0)}
              totalFat={reportData.food_details.reduce((acc, item) => acc + item.menu_fat, 0)}
              carbohydrates={reportData.food_details.map(item => ({
                menuName: item.menu_name,
                menuCarbohydrate: item.menu_carbohydrate,
              }))}
              proteins={reportData.food_details.map(item => ({
                menuName: item.menu_name,
                menuProtein: item.menu_protein,
              }))}
              fats={reportData.food_details.map(item => ({
                menuName: item.menu_name,
                menuFat: item.menu_fat,
              }))}
            />
          </View>

          {/* 식비 레포트 영역 */}
          <View style={styles.ReportContainer}>
            <DailyFeeReport
              goalFee={goalFee}
              totalPrice={reportData.food_details.reduce((acc, item) => acc + item.menu_price, 0)}
              foodDetails={reportData.food_details}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default DailyReport;
