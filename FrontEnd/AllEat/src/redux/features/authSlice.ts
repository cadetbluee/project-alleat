import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACK_URL} from '@env';
import {store} from '../store';

// 회원가입 및 로그인 시 필요한 데이터 타입 정의
interface AuthData {
  email: string;
  password: string;
  isSocial: boolean;
}

// 인증 상태를 관리하는 상태의 구조 정의
interface AuthState {
  isAuthenticated: boolean; // 사용자 인증 여부
  loading: boolean; // API 요청 진행 중 여부
  error: string | null; // 오류 메시지
  token: string | null; // 인증 토큰 (초기값은 null)
  isSocial: boolean;
}

// 초기 상태
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  isSocial: false,
};

// 비동기 회원가입 액션 생성
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (signupData: AuthData, {rejectWithValue}) => {
    try {
      // 회원가입 API 요청
      console.log('회원가입 요청 : ', signupData);
      await axios.post(`${BACK_URL}/AllEat/users/join`, signupData);

      console.log('회원가입 성공!');

      // 회원가입 성공 후 로그인 요청
      const loginResponse = await axios.post(`${BACK_URL}/login`, {
        email: signupData.email,
        password: signupData.password,
      });

      console.log('로그인도 성공!');
      const token = loginResponse.headers.authorization.split(' ')[1]; // Bearer 토큰 형식에서 'Bearer '를 제외한 실제 토큰만 추출
      if (token) {
        // 만약 토큰이 있으면 로그인 상태 유지
        store.dispatch({ type: 'auth/rehydrate', payload: token });
      }

      const addStoreResponse = await axios.post(
        `${BACK_URL}/AllEat/record/add-store`,
        {
          restaurants_name: signupData.email, // useremail을 restaurants_name으로
          restaurants_type: 'HOME',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 로그인에서 얻은 JWT 토큰을 헤더에 추가
          },
        },
      );

      console.log('가게 추가 성공!', addStoreResponse.status);

      // 헤더에서 JWT 토큰 추출
      return {token, isSocial: signupData.isSocial}; // 토큰 반환
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '회원가입 실패');
    }
  },
);

// 비동기 로그인 액션 생성 (소셜 로그인 부분 제거)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: AuthData, {rejectWithValue}) => {
    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('로그인 정보가 부족합니다.');
      }

      // 일반 로그인 요청
      const response = await axios.post(`${BACK_URL}/login`, {
        email: loginData.email,
        password: loginData.password,
      });

      console.log('로그인 성공!');
      const token = response.headers.authorization.split(' ')[1]; // 토큰 추출
      return {token, isSocial: loginData.isSocial}; // 토큰 반환
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || '로그인 실패');
    }
  },
);

// 인증 상태 관리를 위한 Slice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null; // 로그아웃 시 토큰 제거
    },
  },
  extraReducers: builder => {
    // 회원가입 관련 액션 처리
    builder
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<{token: string; isSocial: boolean}>) => {
          state.isAuthenticated = true;
          state.loading = false;
          state.token = action.payload.token; // 토큰 저장
          state.isSocial = action.payload.isSocial;
        },
      );
    // .addCase(signupUser.rejected, (state, action: PayloadAction<string>) => {
    //   state.error = action.payload;
    //   state.loading = false;
    // });

    // 로그인 관련 액션 처리
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{token: string; isSocial: boolean}>) => {
          state.isAuthenticated = true;
          state.loading = false;
          state.token = action.payload.token; // 토큰 저장
          state.isSocial = action.payload.isSocial;
        },
      );
    // .addCase(loginUser.rejected, (state, action: PayloadAction<string>) => {
    //   state.error = action.payload;
    //   state.loading = false;
    // });
  },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
