import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api'; // axios 인스턴스 가져오기

// 메뉴 데이터를 가져오는 비동기 액션
export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/AllEat/record/menus');
      // console.log(response.data);
      return response.data; // 성공 시 메뉴 데이터를 반환
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || '메뉴 데이터 불러오기 실패',
      );
    }
  },
);
export const toggleFavorite = createAsyncThunk(
  'menu/toggleFavorite',
  async (
    {menuId, favorite}: {menuId: number; favorite: boolean},
    {dispatch},
  ) => {
    try {
      if (favorite) {
        await api.delete(`/AllEat/record/favorites/${menuId}`);
      } else {
        await api.post(`/AllEat/record/favorites/${menuId}`);
      }

      // 즐겨찾기 상태가 변경되었으므로 리덕스 상태를 업데이트
      dispatch(setFavorite({menuId, favorite: !favorite}));
    } catch (error: any) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  },
);

// 메뉴 상태 인터페이스 정의
interface Menu {
  menu_id: number;
  menu_name: string;
  menu_price: number;
  menu_calories: number;
  menu_carbohydrate: number;
  menu_protein: number;
  menu_fat: number;
  menu_type: number;
  menu_value: number;
  favorite: boolean;
  restaurants_name: string;
  restaurants_type: string;
  restaurants_id: number;
}

// MenuState 타입 정의
interface MenuState {
  menus: Menu[]; // 메뉴 배열
  searchQuery: string; // 검색어 상태
  loading: boolean; // 로딩 상태
  error: string | null; // 에러 상태
}

// 초기 상태 정의
const initialState: MenuState = {
  menus: [],
  searchQuery: '', // 초기 검색어는 빈 문자열
  loading: false,
  error: null,
};

// 메뉴 슬라이스 생성
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload; // 검색어 업데이트
    },
    setFavorite(
      state,
      action: PayloadAction<{menuId: number; favorite: boolean}>,
    ) {
      const {menuId, favorite} = action.payload;
      const menu = state.menus.find(favmenu => favmenu.menu_id === menuId);
      if (menu) {
        menu.favorite = favorite;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMenus.pending, state => {
        state.loading = true; // 로딩 시작
        state.error = null; // 에러 초기화
      })
      .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<Menu[]>) => {
        state.loading = false; // 로딩 종료
        state.menus = action.payload; // 메뉴 데이터 저장
        // console.log('저장되었나요?', state.menus);
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false; // 로딩 종료
        state.error = action.payload as string; // 에러 메시지 저장
      });
  },
});

// 검색어 설정 액션 및 리듀서 export
export const {setSearchQuery, setFavorite} = menuSlice.actions;

export default menuSlice.reducer;
