import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {icons} from '../../../constants';
import {styles} from './PaymoneyDetailScreen.styles'; // 분리된 스타일을 임포트
import api from '../../../utils/api';
import DateSection from '../../../components/DateSection/DateSection';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
type PaymoneyDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymoneyDetail'
>;
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

const PaymoneyDetailScreen: React.FC = () => {
  const navigation = useNavigation<PaymoneyDetailScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<{
    [date: string]: Transaction[];
  }>({});
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [isFetchingMore, setIsFetchingMore] = useState(false); // 추가 데이터를 로드하는 중인지 여부

  const fetchTransactionData = async (pageNumber: number) => {
    try {
      const today = new Date(); // 오늘 날짜
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (pageNumber - 1) * 7 - 6); // 현재 페이지 기준 시작 날짜 계산
      const formattedStartDate = startDate.toISOString().split('T')[0];

      const response = await api.get('/AllEat/paymoney/balance', {
        params: {
          startDate: formattedStartDate,
          period: 7,
        },
      });
      const rawTransactions = response.data.reverse(); // 데이터를 역순으로

      // 날짜별로 그룹화
      const grouped = groupByDate(rawTransactions);
      setTransactions(prevTransactions => ({
        ...prevTransactions,
        ...grouped,
      }));
      setLoading(false);
      setIsFetchingMore(false); // 추가 데이터 로딩 완료
    } catch (error) {
      let errorMessage = '데이터 가져오는 데에 실패했습니다.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error('데이터 가져오기 실패', errorMessage);
      setLoading(false);
      setIsFetchingMore(false); // 추가 데이터 로딩 실패 처리
    }
  };

  useEffect(() => {
    fetchTransactionData(page);
  }, [page]);

  // 날짜별로 데이터를 그룹화하는 함수
  const groupByDate = (transactionList: Transaction[]) => {
    return transactionList.reduce((grouped, transaction) => {
      const date = format(
        new Date(transaction.transaction_date),
        'yyyy. MM. dd EEEE',
        {
          locale: ko,
        },
      );
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
      return grouped;
    }, {} as {[date: string]: Transaction[]});
  };

  // 스크롤 끝에 도달할 때 호출되는 함수
  const fetchMoreTransactions = () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      setPage(prevPage => prevPage + 1); // 페이지 번호 증가
    }
  };

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.body}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>결제 내역</Text>
        <TouchableOpacity
          style={styles.topIcon}
          onPress={() => navigation.navigate('Paymoney')}>
          <icons.arrowBackLeft height={24} width={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(transactions).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime(),
        )} // 날짜 역순으로 정렬
        renderItem={({item: date}) => (
          <DateSection
            key={date}
            date={date}
            transactions={transactions[date]}
          />
        )}
        keyExtractor={date => date}
        onEndReached={fetchMoreTransactions} // 스크롤 끝에 도달했을 때 호출
        onEndReachedThreshold={0.5} // 50% 정도 스크롤하면 호출
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        } // 추가 데이터를 로딩 중일 때 표시
      />
    </View>
  );
};

export default PaymoneyDetailScreen;
