import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {icons} from '../../../../constants';
import {images} from '../../../../constants';
import {styles} from './AddMenuModal.styles';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {
  setSearchQuery,
  toggleFavorite,
} from '../../../../redux/features/menuSlice';
import FormField from '../../../../components/FormField/FormField';
import MenuCard from '../../../../components/MenuCard/MenuCard';
import {AppDispatch} from '../../../../redux/store';
import CameraModal from '../CameraModal/CameraModal';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  MediaType,
} from 'react-native-image-picker';
import {FAST_API_URL} from '@env';
import {Alert} from 'react-native';
interface AddMenuModalProps {
  onClose: () => void;
  onOpenCustomMenuModal: () => void;
  onAddMeal: (menu: any) => void; // 메뉴를 추가할 때, 해당 메뉴를 넘겨줌
  setForm: (menu: any) => void;
}
// 이미지 선택 옵션
const imagePickerOptions: CameraOptions = {
  mediaType: 'photo' as MediaType, // 'photo'를 MediaType으로 설정
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android', // Android에서 Base64 인코딩 포함
};
const AddMenuModal: React.FC<AddMenuModalProps> = ({
  onClose,
  onOpenCustomMenuModal,
  onAddMeal,
  setForm,
}) => {
  async function requestCameraPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '카메라 사용 권한',
            message: '앱에서 카메라를 사용하려면 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '허용',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('카메라 권한 허용됨');
        } else {
          console.log('카메라 권한 거부됨');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
  const dispatch = useDispatch<AppDispatch>(); // AppDispatch로 타입 설정

  const {menus, searchQuery, loading, error} = useSelector(
    (state: RootState) => state.menu,
  );
  const [visibleMenus, setVisibleMenus] = useState(20); // 처음에 20개만 보여줌
  const token = useSelector((state: RootState) => state.auth.token);
  const [toggleBookmark, setToggleBookmark] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 로딩 상태 추가
  const [imageIndex, setImageIndex] = useState(0);
  // 즐겨찾기(favorite)인 메뉴 필터링 (useMemo로 메모이제이션)
  const favoriteMenus = useMemo(() => {
    return menus.filter(menu => menu.favorite);
  }, [menus]);

  // 검색어에 따른 메뉴 필터링 (useMemo로 메모이제이션)
  const filteredMenus = useMemo(() => {
    if (searchQuery.trim().length < 2) {
      return []; // 검색어가 2자 미만일 때 빈 배열을 반환
    }
    return menus.filter(
      menu =>
        menu.menu_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.restaurants_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [menus, searchQuery]);

  // 스크롤 끝에 도달했을 때 더 많은 메뉴를 불러오는 함수
  const handleLoadMore = () => {
    setVisibleMenus(prevVisibleMenus => prevVisibleMenus + 20); // 20개씩 더 로드
  };

  // 필터링된 메뉴 중 현재 visibleMenus만큼만 보여줌
  const paginatedMenus = useMemo(() => {
    return filteredMenus.slice(0, visibleMenus);
  }, [filteredMenus, visibleMenus]);

  // 이미지 변경 로직
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex(prevIndex => (prevIndex + 1) % 2);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);
  // 검색어 변경 처리 함수
  const handleSearch = (text: string) => {
    dispatch(setSearchQuery(text)); // 검색어 업데이트
  };

  // 검색창 활성화 상태 관리
  const [isSearchBoxVisible, setSearchBoxVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false); // 카메라 모달 상태

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const handleMenuPress = (menu: any) => {
    onAddMeal(menu);
    Keyboard.dismiss(); // 메뉴 선택 후 키보드가 열려 있으면 닫음
    setSearchBoxVisible(false);
  };
  // 카메라 모달 관련 핸들러
  const handleOpenCameraModal = () => {
    requestCameraPermission();
    setCameraModalVisible(true); // 카메라 모달 열기
  };
  const handleLaunchCamera = async () => {
    launchCamera(imagePickerOptions, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorMessage) {
        console.log('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const {uri, fileName, type} = response.assets[0];

        const formData = new FormData();
        formData.append('file', {
          uri,
          name: fileName || 'photo.jpg',
          type: type || 'image/jpeg',
        });

        try {
          setIsUploading(true); // 로딩 상태 활성화
          const cameraResponse = await fetch(`${FAST_API_URL}/fast-api/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const jsonResponse = await cameraResponse.json();
          console.log('Server Response:', jsonResponse);

          setIsUploading(false); // 로딩 상태 비활성화

          if (!jsonResponse.foods || jsonResponse.foods.length === 0) {
            Alert.alert(
              '인식 실패',
              '음식이 인식되지 않았습니다. 다시 시도해주세요.',
              [{text: '확인'}],
            );
          } else {
            const totalData = calculateTotalNutrients(
              jsonResponse.foods,
              jsonResponse,
            );
            setForm({
              menu_name: totalData.menu_name || '',
              menu_calories: totalData.menu_calories || 0,
              menu_carbohydrate: totalData.menu_carbohydrate || 0,
              menu_protein: totalData.menu_protein || 0,
              menu_fat: totalData.menu_fat || 0,
              menu_price: totalData.menu_price || 0,
              menu_type: 1,
              menu_value: totalData.menu_weight || 0,
            });
            onOpenCustomMenuModal();
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setIsUploading(false); // 로딩 상태 비활성화
        }
      }
    });
  };

  const handleLaunchImageLibrary = async () => {
    launchImageLibrary(imagePickerOptions, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const {uri, fileName, type} = response.assets[0];

        const formData = new FormData();
        formData.append('file', {
          uri,
          name: fileName || 'photo.jpg',
          type: type || 'image/jpeg',
        });

        try {
          setIsUploading(true); // 로딩 상태 활성화
          const imageResponse = await fetch(`${FAST_API_URL}/fast-api/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const jsonResponse = await imageResponse.json();
          console.log('Server Response:', jsonResponse);

          setIsUploading(false); // 로딩 상태 비활성화

          if (!jsonResponse.foods || jsonResponse.foods.length === 0) {
            Alert.alert(
              '인식 실패',
              '음식이 인식되지 않았습니다. 다시 시도해주세요.',
              [{text: '확인'}],
            );
          } else {
            const totalData = calculateTotalNutrients(
              jsonResponse.foods,
              jsonResponse,
            );
            setForm({
              menu_name: totalData.menu_name || '',
              menu_calories: totalData.menu_calories || 0,
              menu_carbohydrate: totalData.menu_carbohydrate || 0,
              menu_protein: totalData.menu_protein || 0,
              menu_fat: totalData.menu_fat || 0,
              menu_price: totalData.menu_price || 0,
              menu_type: 1,
              menu_value: totalData.menu_weight || 0,
            });
            onOpenCustomMenuModal();
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setIsUploading(false); // 로딩 상태 비활성화
        }
      }
    });
  };

  // 음식 데이터를 합산하는 함수
  const calculateTotalNutrients = (foods: string[], data: any) => {
    let totalCalories = 0;
    let totalCarbohydrate = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let totalWeight = 0;

    foods.forEach(food => {
      const foodData = data[food];
      totalCalories += foodData.menu_calories;
      totalCarbohydrate += foodData.menu_carbohydrate;
      totalFat += foodData.menu_fat;
      totalProtein += foodData.menu_protein;
      totalWeight += foodData.menu_weight;
    });
    return {
      menu_name: foods.join(', '), // 모든 음식 이름을 결합
      menu_calories: totalCalories,
      menu_carbohydrate: totalCarbohydrate,
      menu_fat: totalFat,
      menu_protein: totalProtein,
      menu_weight: totalWeight,
      menu_price: 0, // 가격은 0으로 설정 (추가 가능)
    };
  };
  // 창을 닫을 때 searchQuery를 빈 값으로 초기화
  const handleClose = () => {
    dispatch(setSearchQuery('')); // searchQuery를 빈 값으로 설정
    onClose(); // 모달 닫기
  };
  // 이메일 형식인지 확인하는 함수
  const isEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };
  const kikiImages = [images.kikiRunning1, images.kikiRunning2];
  if (isUploading === true) {
    return (
      <View style={styles.modalContent}>
        {React.createElement(kikiImages[imageIndex], {width: 200, height: 200})}
        <Text style={styles.loadingText}>
          키키가 데이터를 가져오는 중이에요!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalTitle}>
        <Text style={styles.modalTitleText}>메뉴 추가</Text>
        <TouchableOpacity style={styles.modalIcon} onPress={handleClose}>
          <icons.exit height={24} width={24} />
        </TouchableOpacity>
      </View>
      <View>
        {/* 검색창에 handleSearch 함수 제대로 연결 */}
        <FormField
          value={searchQuery}
          handleChangeText={handleSearch} // 검색어 변경 시 호출
          placeholder="검색어 입력"
          onFocus={() => setSearchBoxVisible(true)} // 포커스 시 searchBox 표시
        />
        {isSearchBoxVisible && (
          <View style={styles.searchBox}>
            <ScrollView
              onScroll={({nativeEvent}) => {
                const isCloseToBottom =
                  nativeEvent.layoutMeasurement.height +
                    nativeEvent.contentOffset.y >=
                  nativeEvent.contentSize.height - 20;
                if (isCloseToBottom) {
                  handleLoadMore(); // 스크롤이 끝에 도달했을 때 더 많은 메뉴를 불러옴
                }
              }}
              scrollEventThrottle={400} // 스크롤 이벤트 속도 조절
            >
              {paginatedMenus.map(menu => (
                <MenuCard
                  key={menu.menu_id}
                  menu={menu.menu_name}
                  restaurantName={menu.restaurants_name}
                  isFavorate={menu.favorite}
                  kcal={menu.menu_calories}
                  price={menu.menu_price}
                  onAddMeal={() => handleMenuPress(menu)} // onAddMeal에 선택된 메뉴 전달
                  onToggleFavorite={() =>
                    dispatch(
                      toggleFavorite({
                        menuId: menu.menu_id,
                        favorite: menu.favorite,
                      }),
                    )
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <View style={styles.addMenu}>
        <TouchableOpacity
          style={styles.addMenuContainer}
          onPress={handleOpenCameraModal}>
          <Image source={images.addMenuCamera} style={styles.addMenuImage} />
          <Text style={styles.addMenuContainerText}>사진으로 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addMenuContainer}
          onPress={onOpenCustomMenuModal}>
          <Image source={images.addMenu} style={styles.addMenuImage} />
          <Text style={styles.addMenuContainerText}>직접 등록</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bookmarkContainer}>
        <View style={styles.bookmarkTitleContainer}>
          <Text style={styles.bookmarkTitle}>즐겨찾기</Text>
          {toggleBookmark ? (
            <TouchableOpacity onPress={() => setToggleBookmark(false)}>
              <icons.arrowBackTopWhite height={20} width={20} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setToggleBookmark(true)}>
              <icons.arrowBackBottomWhite height={20} width={20} />
            </TouchableOpacity>
          )}
        </View>
        {toggleBookmark && (
          <ScrollView>
            {favoriteMenus.map(favoriteItem => (
              <MenuCard
                key={favoriteItem.menu_id} // menu_id를 키로 사용
                isFavorate={favoriteItem.favorite} // favorite 상태
                menu={favoriteItem.menu_name} // 메뉴 이름
                kcal={favoriteItem.menu_calories} // 칼로리
                price={favoriteItem.menu_price} // 가격
                restaurantName={
                  isEmail(favoriteItem.restaurants_name)
                    ? '집밥'
                    : favoriteItem.restaurants_name
                }
                onToggleFavorite={() =>
                  dispatch(
                    toggleFavorite({
                      menuId: favoriteItem.menu_id,
                      favorite: favoriteItem.favorite,
                    }),
                  )
                } // 즐겨찾기 토글
                isFavoritePage={true}
                onAddMeal={() => handleMenuPress(favoriteItem)}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <CameraModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchImageLibrary={handleLaunchImageLibrary}
      />
    </View>
  );
};

export default AddMenuModal;
