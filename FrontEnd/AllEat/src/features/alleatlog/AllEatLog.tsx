import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {icons} from '../../constants';
import {styles} from './AllEatLog.styles';
import {format, addMonths, subMonths} from 'date-fns';
import api from '../../utils/api';
import DateSection from '../../components/DateSection/DateSection'; // DateSection을 가져옴
import {ko} from 'date-fns/locale'; // 한국어 로케일 가져오기

interface Menu {
  menu_name: string;
  restaurant_name: string;
  menu_kcal: number;
  menu_cost: number;
}

interface Diary {
  diary_kcal: number;
  diary_cost: number;
  diary_time: string;
  menus: Menu[];
}

interface DayLog {
  date: string;
  diaries: Diary[];
}
interface PayLog {
  date: string;
  restaurants_name: string;
  amount: number;
}

const AllEatLog: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [logData, setLogData] = useState<DayLog[]>([]);

  // 날짜 기반 API 데이터를 가져오는 함수 (date 파라미터를 사용)
  const fetchLogData = async (date: string) => {
    setLoading(true);
    try {
      // 두 개의 API 호출 (mealpay와 paylog)
      const [mealPayResponse, payLogResponse] = await Promise.all([
        api.get('/AllEat/mealpay', {params: {date}}),
        api.get(`/AllEat/paylog?date=${date}`),
      ]);

      const mealPayData = mealPayResponse.data || [];
      const payLogData = payLogResponse.data || [];

      // 로그 데이터 저장하기
      const updatedLogData = [...mealPayData];
      console.log(payLogResponse.data, date);

      // payLogData를 MART로 변환해서 해당 날짜에 추가
      payLogData.forEach((payLog: PayLog) => {
        const {restaurants_name, amount} = payLog;
        const paydate = payLog.date.substring(0, 10);
        console.log(paydate);

        // 해당 날짜의 로그를 찾음
        const existingDayLog = updatedLogData.find(log => log.date === paydate);

        const martMenu = {
          menu_name: '마트 장보기',
          restaurant_name: restaurants_name,
          menu_kcal: 0,
          menu_cost: Math.abs(amount),
        };

        const martDiary = {
          diary_kcal: 0, // 마트에서 섭취한 칼로리가 없으므로 0
          diary_cost: Math.abs(amount),
          diary_time: 'MART',
          menus: [martMenu],
        };

        if (existingDayLog) {
          // 해당 날짜가 이미 존재하면 MART 항목을 찾음
          const existingMartDiary = existingDayLog.diaries.find(
            diary => diary.diary_time === 'MART',
          );

          if (existingMartDiary) {
            // MART 항목이 이미 존재하면 그 안에 새로운 메뉴 추가
            existingMartDiary.menus.push(martMenu);
            existingMartDiary.diary_cost += Math.abs(amount); // 기존 비용에 추가된 금액 더하기
          } else {
            // MART 항목이 없으면 새로 추가
            existingDayLog.diaries.push(martDiary);
          }
        } else {
          // 해당 날짜가 없으면 새로운 날짜 추가
          updatedLogData.push({
            date: paydate,
            diaries: [martDiary],
          });
        }
      });

      setLogData(updatedLogData); // 업데이트된 로그 데이터 저장
      setLoading(false);
    } catch (error) {
      console.error('데이터 가져오기 실패', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const formattedDate = format(currentDate, 'yyyy-MM');
    fetchLogData(formattedDate);
  }, [currentDate]);

  // 이전 달로 이동하는 함수
  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  // 다음 달로 이동하는 함수
  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.body}>
      {/* 고정된 상단 바 */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <icons.arrowBackLeft
            style={styles.arrowBackLeft}
            height={30}
            width={30}
          />
        </TouchableOpacity>

        <Text style={styles.day}>{format(currentDate, 'M월')}</Text>

        <TouchableOpacity onPress={handleNextMonth}>
          <icons.arrowBackRight
            style={styles.arrowBackRight}
            height={30}
            width={30}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.allText}>
        <Text style={styles.textBlack}>나의 </Text>
        <Text style={styles.textBlue}>식단/식비 </Text>
        <Text style={styles.textBlack}>기록을 확인해 볼까요?</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {logData.map(dayLog => (
          <DateSection
            key={dayLog?.date}
            date={format(new Date(dayLog?.date), 'yyyy.MM.dd EEEE', {
              locale: ko, // 올바른 로케일 사용
            })}
            diaries={dayLog?.diaries}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AllEatLog;
