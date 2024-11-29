import axios from 'axios';
import {store} from '../redux/store'; // Redux 스토어 경로에 맞게 설정하세요
import {BACK_URL} from '@env';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: BACK_URL,
  timeout: 10000,
});

// Axios 요청 인터셉터: 요청 전에 헤더에 토큰 추가
api.interceptors.request.use(
  config => {
    // Redux 스토어에서 토큰 가져오기
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('token : ', token, config);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    // 응답 성공 처리
    return response;
  },
  error => {
    // 에러 처리 (예: 401 에러 처리 등)

    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, logging out...', error);
    }
    return Promise.reject(error);
  },
);
export default api;
