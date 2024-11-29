import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api';

interface InfoState {
  email: string;
  email: string;
  user_name: string;
  user_age: string;
  user_height: string;
  user_gender: 0 | 1;
  activity_amount: 0 | 1 | 2;
  weights: Array<{id: number; createdAt: string; weight: number}> | null;
  goal_weight: number | null; // goalWeight
  goal_cost: number | null; // goalCost
  goal_kcal: number | null;
  breakfast_alarm: string | null; // 아침 알람
  lunch_alarm: string | null; // 점심 알람
  dinner_alarm: string | null; // 저녁 알람
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: InfoState = {
  email: '',
  email: '',
  user_name: '',
  user_age: '',
  user_height: '',
  user_gender: 0,
  activity_amount: 1,
  weights: null, // weight 초기값
  goal_weight: null, // goalWeight 초기값
  goal_cost: null, // goalCost 초기값
  goal_kcal: null,
  breakfast_alarm: null, // 아침 알람 초기값
  lunch_alarm: null, // 점심 알람 초기값
  dinner_alarm: null, // 저녁 알람 초기값
  status: 'idle',
  error: null,
};

// 유저 정보를 서버에서 GET으로 가져오는 비동기 액션
export const fetchUserInfo = createAsyncThunk(
  'info/fetchUserInfo',
  async () => {
  async () => {
    try {
      const response = await api.get('/AllEat/users/info');
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
      return error.response.data;
    }
  },
);

const calculateGoalKcal = (
  user_gender: 0 | 1,
  user_weight: number,
  user_height: number,
  user_age: number,
  activity_amount: 0 | 1 | 2,
  goal_weight: number,
) => {
  // BMR 계산 (0: 여성, 1: 남성)
  let BMR = 0;
  if (user_gender === 1) {
    // 남성 BMR 계산
    BMR = 66.5 + 13.75 * user_weight + 5.003 * user_height - 6.75 * user_age;
  } else {
    // 여성 BMR 계산
    BMR = 655.1 + 9.563 * user_weight + 1.85 * user_height - 4.676 * user_age;
  }

  // 활동량에 따른 BMR 계산
  let activityMultiplier = 1.2; // 기본값
  if (activity_amount === 1) {
    activityMultiplier = 1.375;
  } else if (activity_amount === 2) {
    activityMultiplier = 1.55;
  }

  BMR *= activityMultiplier;

  // 목표 체중에 따른 추가 조정
  if (goal_weight < user_weight) {
    BMR *= 0.9; // 체중 감량 목표
  } else if (goal_weight > user_weight) {
    BMR *= 1.1; // 체중 증가 목표
  }

  return Math.round(BMR); // 결과는 반올림
};

const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    // 유저 정보를 동기적으로 설정할 때 사용
    setInfo(state, action: PayloadAction<Omit<InfoState, 'status' | 'error'>>) {
      return {...state, ...action.payload};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserInfo.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        const {
          email,
          user_name,
          user_age,
          user_height,
          user_gender,
          activity_amount,
          weights,
          goals,
          alarms,
        } = action.payload;

        // 첫 번째 weight만 가져옴
        const storedWeights =
          weights && weights.length > 0 ? weights.reverse() : null;
        console.log(storedWeights);
        // goals에서 goal_weight와 goal_cost 추출
        const goal_weight = goals?.goalWeight || null;
        const goal_cost = goals?.goalCost || null;
        let goal_kcal = null;
        if (storedWeights && storedWeights.length > 0 && goal_weight) {
          const weight = storedWeights[0].weight; // 첫 번째 weight를 사용하여 계산
          goal_kcal = calculateGoalKcal(
            user_gender,
            weight,
            user_height,
            user_age,
            activity_amount,
            goal_weight,
          );
        }
        // alarms에서 각 알람 시간을 추출
        const breakfast_alarm = alarms?.breakfastAlarm || null;
        const lunch_alarm = alarms?.lunchAlarm || null;
        const dinner_alarm = alarms?.dinnerAlarm || null;

        // 상태 업데이트
        return {
          ...state,
          email,
          user_name,
          user_age: String(user_age), // string으로 변환
          user_height: String(user_height), // string으로 변환
          user_gender,
          activity_amount,
          weights: storedWeights, // weights 배열 저장
          goal_weight,
          goal_cost,
          goal_kcal,
          breakfast_alarm,
          lunch_alarm,
          dinner_alarm,
          status: 'succeeded',
        };
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {setInfo} = infoSlice.actions;

export default infoSlice.reducer;
