// src/types/navigationTypes.ts
interface DiaryIds {
  BREAKFAST: number | null;
  LUNCH: number | null;
  DINNER: number | null;
  SNACK: number | null;
}
export type RootStackParamList = {
  Home: {Kcal?: number};
  DiaryCreate: {
    date: string;
    meals: string;
    diaryId: DiaryIds;
    menuId?: number;
  };
  SignIn: undefined;
  SignUp: undefined;
  Intro: undefined;
  Initial: undefined;
  MyPage: undefined;
  MyPageUpdate: undefined;
  Agreement: undefined;
  Paymoney: undefined;
  Report: undefined;
  PaymoneyDetail: undefined;
  AllEatLog: undefined;
  AlertScreen: undefined;
  // 다른 화면도 추가할 수 있습니다.
};
