// utils/dateUtils.ts

import {format, parseISO} from 'date-fns';

export const formatDate = (date: Date): string => {
  const today = new Date();
  if (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return '오늘'; // 오늘이면 "오늘"로 표시
  } else if (
    today.getDate() - 1 === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return '어제';
  } else if (
    today.getDate() + 1 === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return '내일';
  }
  return format(date, 'MM/dd'); // 그 외에는 날짜를 yyyy/MM/dd 형식으로 표시
};

export const formatDateString = (dateString: string): string => {
  const today = new Date();
  const targetDate = parseISO(dateString); // 'yyyy-MM-dd' 형식의 문자열을 Date 객체로 변환

  // 날짜 비교
  if (
    today.getDate() === targetDate.getDate() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getFullYear() === targetDate.getFullYear()
  ) {
    return '오늘'; // 오늘
  } else if (
    today.getDate() - 1 === targetDate.getDate() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getFullYear() === targetDate.getFullYear()
  ) {
    return '어제'; // 어제
  } else if (
    today.getDate() + 1 === targetDate.getDate() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getFullYear() === targetDate.getFullYear()
  ) {
    return '내일'; // 내일
  }

  // 오늘, 어제, 내일이 아닐 경우 원래의 yyyy-MM-dd 형식 유지
  return format(dateString, 'MM/dd');
};
