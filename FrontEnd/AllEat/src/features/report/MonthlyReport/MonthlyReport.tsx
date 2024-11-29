import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { icons } from '../../../constants';
import { images } from '../../../constants';
import { styles } from './MonthlyReport.styles';
import AIReport from '../components/AIReport';
import MonthlyMealReport from './MonthlyMealReport';
import MonthlyFeeReport from './MonthlyFeeReport';
import MonthlyWeightReport from './MonthlyWeightReport';
import { useDispatch, useSelector } from 'react-redux'; // Redux 관련 추가
import { RootState } from '../../../redux/store';
import { fetchMonthlyUsedAmount } from '../../../redux/features/paymoneySlice';
import { FAST_API_URL } from '@env';
import api from '../../../utils/api';


const MonthlyReport: React.FC = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [reportData, setReportData] = useState<any>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // YYYY. MM 형식으로 날짜 포맷 (UI에 표시되는 날짜)
  const formattedDate = format(currentDate, 'yyyy. MM');
  const postDate = format(currentDate, 'yyyy-MM'); // 기존 월간 레포트에 사용되는 포맷
  const paymoneyStartDate = format(currentDate, 'yyyy-MM-01');

  // Redux에서 상태 가져오기
  const goalKcal = useSelector((state: RootState) => state.info.goal_kcal);
  const goalFee = useSelector((state: RootState) => state.info.goal_cost);
  const monthGoalCost = goalFee ? (goalFee / 30).toFixed(0) : '0';
  const token = useSelector((state: RootState) => state.auth.token);
  const monthUsedAmount = useSelector((state: RootState) => state.paymoney.monthlyUsedAmount); // Redux에서 월별 사용 금액 가져오기
  const paymoneyCost = monthUsedAmount ?? 0; // 월별 사용 금액 기본값 설정

  // API 요청 useEffect
  useEffect(() => {
    console.log('MonthlyReport useEffect 실행됨');
    
    const fetchData = async () => {
      try {
        // 월간 레포트 데이터 가져오기
        const response = await api.post('/AllEat/month-report', {
          year_month: postDate,
        });
        const data = response.data;
        console.log('체중 추이', data.monthly_weight_records);
        setReportData(data);
        
        // FastAPI에 요청 보내기
        const aiResponse = await fetch(`${FAST_API_URL}/fast-api/report/month`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          setAiResponse(aiResult.response);
        } else {
          console.error('AI 응답 오류:', aiResponse.statusText);
          setAiResponse('AI 응답을 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    // Redux로 월별 사용 금액 요청
    dispatch(fetchMonthlyUsedAmount({ startDate: paymoneyStartDate, period: 30 }));

    fetchData();
  }, [currentDate]);

  // 날짜 변경 핸들러
  const handlePreviousDate = () => setCurrentDate(prevDate => subMonths(prevDate, 1));
  const handleNextDate = () => {
    const today = new Date(); // 오늘 날짜
    const nextDate = addMonths(currentDate, 1); // 다음 달 날짜
    
    // 다음 달 날짜가 오늘 날짜 이후인지 확인
    if (nextDate <= today) {
      setCurrentDate(nextDate); // 다음 달 날짜가 오늘 날짜 이하면 변경
    }
  };

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
    <ScrollView style={styles.monthlyReportContainer}>
      <View style={styles.dateNavigatorContainer}>
        <TouchableOpacity onPress={handlePreviousDate}>
          <icons.arrowBackLeft height={27} width={27} />
        </TouchableOpacity>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableOpacity onPress={handleNextDate} disabled={addMonths(currentDate, 1) > new Date()}>
          <icons.arrowBackRight height={27} width={27} />
        </TouchableOpacity>
      </View>

      {!reportData ? (
        <View style={styles.loadingContainer}>
          {React.createElement(kikiImages[imageIndex], { width: 200, height: 200 })}
          <Text style={styles.loadingText}>키키가 데이터를 가져오는 중이에요!</Text>
        </View>
      ) : (
        <>
          <View style={styles.AIContainer}>
            <icons.mypage style={styles.AIIcon} width={30} height={30} />
            <Text style={styles.AITitleText}>AllEat! 월간 레포트</Text>
            {aiResponse ? (
              <AIReport title='AllEat! 월간 레포트' aiData={aiResponse} />
            ) : (
              <View style={styles.loadingContainer}>
                {React.createElement(kikiImages[imageIndex], { width: 200, height: 200 })}
                <Text style={styles.loadingText}>키키가 AI 레포트를 배달 중이에요</Text>
                <Text style={styles.loadingText}>조금만 기다려 주세요!</Text>
              </View>
            )}
          </View>

          <View style={styles.ReportContainer}>
            <MonthlyWeightReport
              monthlyCostRecords={reportData.monthly_cost_records}
              monthlyWeightRecords={reportData.monthly_weight_records}
            />
          </View>
          <View style={styles.ReportContainer}>
            <MonthlyMealReport
              goalKcal={goalKcal}
              kcalAverage={reportData.average_calories || 0}
              kcalRanking={reportData.kcal_ranking || []}
            />
          </View>
          <View style={styles.ReportContainer}>
            <MonthlyFeeReport
              goalFee={monthGoalCost || 0}
              costAvg={reportData.cost_avg || 0}
              costRanking={reportData.cost_ranking}
              costWhere={reportData.restaurant_type_count}
              totalCost={reportData.total_cost}
              paymoneyCost={paymoneyCost} // Redux에서 가져온 월별 사용 금액 전달
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default MonthlyReport;
