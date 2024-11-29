import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { format, addDays, subDays } from 'date-fns';
import { icons } from '../../../constants';
import { images } from '../../../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { styles } from './WeeklyReport.styles';
import AIReport from '../components/AIReport';
import api from '../../../utils/api';
import { FAST_API_URL } from '@env';
import WeeklyMealReport from './WeeklyMealReport';
import WeeklyFeeReport from './WeeklyFeeReport';

const WeeklyReport: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [reportData, setReportData] = useState<any>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const startDate = subDays(currentDate, 6);
  const formattedDate = `${format(startDate, 'yyyy. MM. dd')} - ${format(currentDate, 'yyyy. MM. dd')}`;
  const postDate = format(currentDate, 'yyyy-MM-dd');

  const goalKcal = useSelector((state: RootState) => state.info.goal_kcal);
  const goalFee = useSelector((state: RootState) => state.info.goal_cost);
  const weekGoalCost = goalFee ? (goalFee / 7).toFixed(0) : '0';
  const token = useSelector((state: RootState) => state.auth.token);

  // API 요청 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/AllEat/week-report', {
          day: postDate,
        });
        
        const data = response.data;
        setReportData(data); // 서버로부터 받은 데이터를 상태에 저장

        // FastAPI에 요청 보내기
        const aiResponse = await fetch(`${FAST_API_URL}/fast-api/report/week`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data), // 그대로 전달
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          setAiResponse(aiResult.response); // AI 응답 저장
        } else {
          console.error('AI 응답 오류:', aiResponse.statusText);
          setAiResponse('AI 응답을 가져오지 못했습니다.');
        }
      } catch (error) {
        // console.error('데이터 가져오기 오류:', error);
      }
    };
    fetchData();
  }, [currentDate]); // currentDate를 의존성 배열로 사용


  // 날짜 변경 핸들러
  const handlePreviousDate = () => setCurrentDate(prevDate => subDays(prevDate, 7));
  const handleNextDate = () => {
    const today = new Date(); // 오늘 날짜
    const nextDate = addDays(currentDate, 7); // 다음 주 날짜
  
  // 다음 주 날짜가 오늘 날짜 이후인지 확인
  if (nextDate <= today) {
    setCurrentDate(nextDate); // 다음 주 날짜가 오늘 날짜 이하면 변경
  }
};

  // 로딩 상태 관리
  useEffect(() => {
    setReportData(null);
  }, [currentDate]);

  // 이미지 변경 로직
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex(prevIndex => (prevIndex + 1) % 2);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const kikiImages = [images.kikiRunning1, images.kikiRunning2];

  return (
    <ScrollView style={styles.weeklyReportContainer}>
      <View style={styles.dateNavigatorContainer}>
        <TouchableOpacity onPress={handlePreviousDate}>
          <icons.arrowBackLeft height={27} width={27} />
        </TouchableOpacity>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableOpacity onPress={handleNextDate} disabled={addDays(currentDate, 7) > new Date()}>
          <icons.arrowBackRight height={27} width={27} />
        </TouchableOpacity>
      </View>

      {!reportData ? (
        // 로딩 애니메이션을 dateNavigatorContainer 아래에 표시
        <View style={styles.loadingContainer}>
          {React.createElement(kikiImages[imageIndex], { width: 200, height: 200 })}
          <Text style={styles.loadingText}>키키가 데이터를 가져오는 중이에요!</Text>
        </View>
      ) : (
        <>
          {/* AI 레포트 영역 */}
          <View style={styles.AIContainer}>
            <icons.mypage style={styles.AIIcon} width={30} height={30} />
            <Text style={styles.AITitleText}>AllEat! 주간 레포트</Text>
            {aiResponse ? (
              <AIReport title='AllEat! 주간 레포트' aiData={aiResponse} />
            ) : (
              <View style={styles.loadingContainer}>
                {React.createElement(kikiImages[imageIndex], { width: 200, height: 200 })}
                <Text style={styles.loadingText}>키키가 AI 레포트를 배달 중이에요</Text>
                <Text style={styles.loadingText}>조금만 기다려 주세요!</Text>
              </View>
            )}
          </View>

          <View style={styles.ReportContainer}>
            {/* 식단 레포트 영역 */}
            <WeeklyMealReport
              goalKcal={goalKcal}
              kcalAverage={reportData.kcal_average}
              proteinAvg={reportData.protein_avg}
              carbAvg={reportData.carb_avg}
              costAvg={reportData.cost_avg}
              fatAvg={reportData.fat_avg}
              proteinRanking={reportData.protein_ranking}
              kcalRanking={reportData.menu_kcal}
            />
          </View>

          {/* 식비 레포트 영역 */}
          <View style={styles.ReportContainer}>
            <WeeklyFeeReport
              goalFee={weekGoalCost}
              costAvg={reportData.cost_avg}
              costRanking={reportData.cost_ranking}
              costWhere={reportData.cost_where}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default WeeklyReport;
