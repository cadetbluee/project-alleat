// paymoneySlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api'; // Axios 인스턴스 임포트
import {RootState} from '../store';
import {RootState} from '../store';

// 페이머니 상태 타입 정의
interface PaymoneyState {
  loading: boolean;
  error: string | null;
  balance: number; // 잔액
  monthlyUsedAmount: number | null; // 월별 사용 금액
  monthlyUsedAmount: number | null; // 월별 사용 금액
  success: boolean;
  accountCreated: boolean; // 계좌 개설 여부
}

// 초기 상태 정의
const initialState: PaymoneyState = {
  loading: false,
  error: null,
  balance: 0, // 잔액 초기화
  monthlyUsedAmount: null, // 사용 금액 초기화
  success: false,
  accountCreated: false, // 계좌 개설 여부 확인
};

// 페이머니 계좌 개설 액션 생성
export const createPaymoneyAccount = createAsyncThunk(
  'paymoney/createAccount',
  async (_, {rejectWithValue}) => {
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.post('/AllEat/paymoney', {}); // 계좌 개설 요청
      return response.data; // 필요한 경우 응답 데이터 반환
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '페이머니 계좌 개설 실패',
      );
      return rejectWithValue(
        error.response?.data?.message || '페이머니 계좌 개설 실패',
      );
    }
  },
);

// 페이머니 잔액 조회 액션 생성
export const fetchPaymoneyBalance = createAsyncThunk(
  'paymoney/fetchBalance',
  async (_, {rejectWithValue}) => {
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/AllEat/paymoney'); // 잔액 조회 요청
      return response.data.balance; // 응답 데이터 중 잔액 반환
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '잔액 조회 실패');
    }
  },
  },
);

// 월별 사용 금액 조회 액션 생성
export const fetchMonthlyUsedAmount = createAsyncThunk(
  'paymoney/fetchMonthlyUsedAmount',
  async (
    {startDate, period}: {startDate: string; period: number},
    {rejectWithValue},
  ) => {
    try {
      const response = await api.get(
        `/AllEat/paymoney/amount_only?startDate=${startDate}&period=${period}`,
      );
      console.log('사용 금액 확인', response.data.balance);
      return Math.abs(response.data.balance); // 해당 월 사용 금액 반환
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '월별 사용 금액 조회 실패',
      );
    }
  },
);

// 페이머니 충전 액션 생성
export const chargePaymoney = createAsyncThunk(
  'paymoney/charge',
  async (amount: number, {rejectWithValue}) => {
  async (amount: number, {rejectWithValue}) => {
    try {
      const response = await api.put('/AllEat/paymoney', {
        amount,
        transaction_type: 0, // 충전
        restaurant_id: 1, // 고정 ID
      });
      return response.data.balance; // 반환된 잔액
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '충전 실패');
    }
  },
  },
);

// 페이머니 송금 액션 생성
export const transferPaymoney = createAsyncThunk(
  'paymoney/transfer',
  async (
    {amount, restaurant_id}: {amount: number; restaurant_id: number},
    {getState, rejectWithValue},
  ) => {
  async (
    {amount, restaurant_id}: {amount: number; restaurant_id: number},
    {getState, rejectWithValue},
  ) => {
    try {
      const state = getState() as RootState;
      const currentBalance = state.paymoney.balance;

      // 잔액이 부족한 경우 에러 처리
      if (amount > currentBalance) {
        return rejectWithValue('잔액이 부족합니다.');
      }

      const response = await api.put('/AllEat/paymoney', {
        amount: -amount, // 음수값으로 송금
        transaction_type: 1, // 송금
        restaurant_id,
      });

      return {balance: response.data.balance}; // 반환된 잔액
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '송금 실패');
    }
  },
  },
);

// paymoney 상태 관리를 위한 Slice 생성
const paymoneySlice = createSlice({
  name: 'paymoney',
  initialState,
  reducers: {},
  extraReducers: builder => {
  extraReducers: builder => {
    // 계좌 개설
    builder
      .addCase(createPaymoneyAccount.pending, state => {
      .addCase(createPaymoneyAccount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymoneyAccount.fulfilled, state => {
      .addCase(createPaymoneyAccount.fulfilled, state => {
        state.loading = false;
        state.accountCreated = true; // 계좌 개설 성공 시 설정
      })
      .addCase(createPaymoneyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 잔액 조회
    builder
      .addCase(fetchPaymoneyBalance.pending, state => {
      .addCase(fetchPaymoneyBalance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaymoneyBalance.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.balance = action.payload;
        },
      )
      .addCase(
        fetchPaymoneyBalance.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.balance = action.payload;
        },
      )
      .addCase(fetchPaymoneyBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 충전
    builder
      .addCase(chargePaymoney.pending, state => {
      .addCase(chargePaymoney.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        chargePaymoney.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.balance = action.payload; // 업데이트된 잔액으로 변경
        },
      )
      .addCase(chargePaymoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 송금
    builder
      .addCase(transferPaymoney.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        transferPaymoney.fulfilled,
        (state, action: PayloadAction<{balance: number}>) => {
          state.loading = false;
          state.balance = action.payload.balance; // 업데이트된 잔액으로 변경
        },
      )
      .addCase(transferPaymoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 월별 사용 금액 조회
    builder
      .addCase(fetchMonthlyUsedAmount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMonthlyUsedAmount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.monthlyUsedAmount = action.payload; // 해당 월 사용 금액으로 업데이트
        },
      )
      .addCase(fetchMonthlyUsedAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      .addCase(transferPaymoney.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        transferPaymoney.fulfilled,
        (state, action: PayloadAction<{balance: number}>) => {
          state.loading = false;
          state.balance = action.payload.balance; // 업데이트된 잔액으로 변경
        },
      )
      .addCase(transferPaymoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 월별 사용 금액 조회
    builder
      .addCase(fetchMonthlyUsedAmount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMonthlyUsedAmount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.monthlyUsedAmount = action.payload; // 해당 월 사용 금액으로 업데이트
        },
      )
      .addCase(fetchMonthlyUsedAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymoneySlice.reducer;
