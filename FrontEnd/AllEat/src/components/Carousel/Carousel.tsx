import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {styles} from './Carousel.styles';
import Page from './Page';

interface ICarousel {
  gap: number;
  offset: number;
  pages: any[];
  pageWidth: number;
}

export default function Carousel({pages, pageWidth, gap}: ICarousel) {
  const [page, setPage] = useState(0);
  //   console.log('page : ', page);
  // 각 페이지를 렌더링하는 함수
  function renderItem({item}: any) {
    return <Page item={item} />;
  }

  // 스크롤 이벤트에 따라 페이지 변경
  const onScroll = (e: any) => {
    // console.log(e.nativeEvent.contentOffset.x);
    // console.log(pageWidth + gap);
    // console.log(e.nativeEvent.contentOffset.x / (pageWidth + gap));
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + gap), // 페이지 간격을 고려한 계산
    );
    setPage(newPage); // 현재 페이지 업데이트
  };

  return (
    <View style={styles.container}>
      <FlatList
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={styles.contentContainer}
        data={pages}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item: any, index) => `page__${index}`} // 고유한 key 설정
        onScroll={onScroll} // 스크롤 시 페이지 계산
        pagingEnabled={false} // 스냅 기능을 직접 구현하므로 false
        renderItem={renderItem} // 페이지 렌더링
        snapToInterval={pageWidth + gap} // 페이지 간격에 맞춰 스냅
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.indicatorWrapper}>
        {Array.from({length: pages.length}, (_, i) => (
          <View
            key={`indicator_${i}`}
            style={[
              styles.indicator, // 기본 스타일
              i === page && styles.focusedIndicator, // 현재 페이지인 경우 강조 스타일
            ]}
          />
        ))}
      </View>
    </View>
  );
}
