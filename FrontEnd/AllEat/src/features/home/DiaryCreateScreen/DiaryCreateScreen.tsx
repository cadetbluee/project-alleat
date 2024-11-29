import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {icons} from '../../../constants';
import {formatDateString} from '../../../utils/dateUtils';
import {styles} from './DiaryCreateScreen.styles';
import CustomButton from '../../../components/CustomButton';
import DiaryCard from '../components/DiaryCard/DiaryCard';
import MenuCard from '../../../components/MenuCard/MenuCard';
import api from '../../../utils/api';
import CustomMenuModal from '../components/CustomMenuModal/CustomMenuModal';
import AddMenuModal from '../components/AddMenuModal/AddMenuModal';
import {RootState} from '../../../redux/store';
import {AppDispatch} from '../../../redux/store';
import {fetchMenus} from '../../../redux/features/menuSlice';
type DiaryCreateScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DiaryCreate'
>;
type DiaryCreateRouteProp = RouteProp<RootStackParamList, 'DiaryCreate'>;

type Meal = {
  menu_id: number;
  restaurants_name: string;
  menu_name: string;
  menu_price: number;
  menu_calories: number;
  person_count: number;
  pay_transaction_id: number;
};
interface DiaryIds {
  BREAKFAST: number | null;
  LUNCH: number | null;
  DINNER: number | null;
  SNACK: number | null;
}

const mealTimes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']; // 가능한 식사 시간 배열

const DiaryCreateScreen: React.FC = () => {
  const navigation = useNavigation<DiaryCreateScreenNavigationProp>();
  const route = useRoute<DiaryCreateRouteProp>();
  const {date, meals: initialMealTime, diaryId, menuId} = route.params; // 처음 전달된 meal 값을 저장
  const [isModalVisible, setModalVisible] = useState(false); // 모달 상태
  const [modalType, setModalType] = useState('main'); // 기본 모달 상태
  const [meals, setMeals] = useState(initialMealTime); // meals를 상태로 관리
  const {menus} = useSelector((state: RootState) => state.menu);
  const delivery_menu = menus.find((menu: any) => menu.menu_id === menuId);
  // delivery_menu가 있을 때 mealList에 추가
  useEffect(() => {
    // restaurants에서 delivery_menu의 restaurants_id와 같은 restaurant_id를 찾음
    const matchedRestaurant = restaurants.find(
      (restaurant: any) =>
        restaurant.restaurants_id === delivery_menu.restaurants_id,
    );

    // 찾은 레스토랑의 pay_transaction_id 추출
    const payTransactionId = matchedRestaurant
      ? matchedRestaurant.pay_transaction_id
      : 0;

    if (menuId && delivery_menu) {
      const initialMeal: Meal = {
        menu_id: delivery_menu.menu_id,
        restaurants_name: delivery_menu.restaurants_name,
        menu_name: delivery_menu.menu_name,
        menu_price: delivery_menu.menu_price,
        menu_calories: delivery_menu.menu_calories,
        person_count: 1, // 초기 인원 설정
        pay_transaction_id: payTransactionId,
      };

      setMealList([initialMeal]); // mealList를 초기화하고 delivery_menu 추가
    }
  }, [menuId, delivery_menu]); // menuId와 delivery_menu가 변경될 때마다 실행

  type MealType = keyof DiaryIds;
  // meals 값이 변경될 때 호출되는 함수
  const goToPreviousMealTime = () => {
    const currentIndex = mealTimes.indexOf(meals);
    const previousIndex =
      (currentIndex - 1 + mealTimes.length) % mealTimes.length;
    setMeals(mealTimes[previousIndex]); // 이전 식사 시간 설정
  };
  const dispatch = useDispatch<AppDispatch>();
  const goToNextMealTime = () => {
    const currentIndex = mealTimes.indexOf(meals);
    const nextIndex = (currentIndex + 1) % mealTimes.length;
    setMeals(mealTimes[nextIndex]); // 다음 식사 시간 설정
  };

  // 모달 열기 및 닫기
  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalType('main'); // 모달 닫힐 때 기본 모달로 전환
    setModalVisible(false);
  };
  const [form, setForm] = useState({
    restaurant_name: '',
    restaurant_type: '',
    pay_transaction_id: 0,
    menu_name: '',
    menu_calories: 0,
    menu_carbohydrate: 0,
    menu_protein: 0,
    menu_fat: 0,
    menu_type: 0,
    menu_price: 0,
    menu_value: 0,
  });

  // 탄단지 비율
  const [carbPercentage, setCardPercentage] = useState(33.33);
  const [proteinPercentage, setProteinPercentage] = useState(33.33);
  const [fatPercentage, setFatPercentage] = useState(33.33);

  // form의 탄수화물, 단백질, 지방이 변경될 때 totalNutrients 값 업데이트
  useEffect(() => {
    const newTotalNutrients =
      form.menu_carbohydrate + form.menu_protein + form.menu_fat;

    // 초기 값이 모두 0일 때는 비율을 1/3씩으로 설정
    if (newTotalNutrients === 0) {
      setCardPercentage(33.33);
      setProteinPercentage(33.33);
      setFatPercentage(33.33);
    } else {
      // setTotalNutrients(newTotalNutrients);
      setCardPercentage(
        Math.round((form.menu_carbohydrate / newTotalNutrients) * 100),
      );
      setProteinPercentage(
        Math.round((form.menu_protein / newTotalNutrients) * 100),
      );
      setFatPercentage(Math.round((form.menu_fat / newTotalNutrients) * 100));
    }
  }, [form.menu_carbohydrate, form.menu_protein, form.menu_fat]);
  const [mealList, setMealList] = useState<Meal[]>([]);
  const mealKey = meals as MealType;
  useEffect(() => {
    if (diaryId && diaryId[mealKey]) {
      const fetchData = async () => {
        try {
          const response = await api.get(
            `/AllEat/get/detail/${diaryId[mealKey]}`,
          );
          const {menus} = response.data;
          console.log('menus : ', menus);
          setMealList(
            menus.map((menu: any) => ({
              menu_id: menu.menu_id,
              restaurants_name: menu.restaurants_name,
              pay_transaction_id: 0,
              menu_name: menu.menu_name,
              menu_price: menu.menu_price,
              menu_calories: menu.menu_calories,
              person_count: menu.person_count,
            })),
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    } else {
      setMealList([]);
    }
  }, [diaryId, meals, mealKey]); // diaryId와 meals가 변경될 때마다 useEffect 실행
  const email = useSelector((state: RootState) => state.info.email); // 리덕스 스토어에서 email 가져오기
  const addMealToList = async () => {
    try {
      // 탄단지 값 반올림
      const roundedCarbohydrate = Math.round(form.menu_carbohydrate);
      const roundedProtein = Math.round(form.menu_protein);
      const roundedFat = Math.round(form.menu_fat);

      // 전체 영양소 값 계산 (탄단지 총합)
      // const total = roundedCarbohydrate + roundedProtein + roundedFat;

      // 메뉴 데이터 구성
      const requestData = {
        restaurant_name: restaurantValue || email, // 식당 이름 없으면 email로 설정 (집밥인 경우)
        restaurant_type: restaurantValue ? 'RESTAURANTS' : 'HOME', // 식당이 있으면 restaurant, 없으면 HOME
        menu_name: form.menu_name,
        menu_calories: Math.round(form.menu_calories), // 칼로리 반올림
        menu_carbohydrate: roundedCarbohydrate, // 탄수화물 반올림
        menu_protein: roundedProtein, // 단백질 반올림
        menu_fat: roundedFat, // 지방 반올림
        menu_price: form.menu_price,
        menu_type: form.menu_type,
        menu_value: form.menu_value, // 영양소 총합 값
      };

      console.log('메뉴 추가 요청 데이터:', requestData);

      // 메뉴 추가 API 요청 보내기
      const response = await api.post('/AllEat/record/add-menu', requestData);

      console.log('메뉴 추가 성공:', response.data);

      // 성공 후, 로컬 상태 업데이트 (mealList에 추가)
      setMealList(prevMealList => [
        ...prevMealList,
        {
          menu_id: response.data.id,
          restaurants_name: restaurantValue || '집밥', // 식당 이름 없으면 기본값으로 '집밥'
          menu_name: form.menu_name,
          menu_price: form.menu_price,
          menu_calories: form.menu_calories,
          person_count: 1,
          pay_transaction_id:
            restaurants.find(res => res.restaurants_name === restaurantValue)
              ?.pay_transaction_id || 0, // 해당 식당의 pay_transaction_id를 찾음,
        },
      ]);

      // 모달 닫기
      closeModal();
    } catch (error) {
      console.error('메뉴 추가 실패:', error);
    }
  };
  // 모달 내용 변경 (직접 등록)
  const openCustomMenuModal = () => setModalType('custom');
  const [isHomeMade, setIsHomeMade] = useState(false);

  const [restaurantIndex, setRestaurantIndex] = useState(0);

  const [restaurants, setRestaurants] = useState<
    {
      restaurants_id: number;
      restaurants_name: string;
      pay_transaction_id: number;
      menus: {
        menuId: number;
        menuName: string;
        price: number;
        menuCalories: number;
        favorite: boolean;
        pay_transaction_id: number;
      }[];
    }[]
  >([]);

  // 페이지가 로드될 때 API 요청 보내기
  useEffect(() => {
    const fetchRestaurantsData = async () => {
      try {
        const response = await api.get(`/AllEat/record/menu-auto/${date}`); // API 요청
        setRestaurants(response.data); // API 응답을 그대로 restaurants 상태에 저장
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching restaurants data:', error);
      }
    };

    fetchRestaurantsData(); // 컴포넌트 마운트 시 API 호출
    // dispatch(fetchMenus());
  }, [date, dispatch]);

  const titleMapping: {[key: string]: string} = {
    BREAKFAST: '아침',
    LUNCH: '점심',
    DINNER: '저녁',
    SNACK: '간식',
  };

  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>(false);
  const [restaurantValue, setRestaurantValue] = useState<string | null>(null); // 선택된 식당 값
  // 레스토랑을 DropDownPicker에 맞는 {label, value} 형식으로 변환
  const restaurantItems = restaurants.map(restaurant => ({
    label: restaurant.restaurants_name,
    value: restaurant.restaurants_name,
  }));

  // 인원 증가 함수
  const increasePeople = (id: number) => {
    setMealList(prevMealList =>
      prevMealList.map(meal =>
        meal.menu_id === id
          ? {...meal, person_count: meal.person_count + 1}
          : meal,
      ),
    );
  };

  // 인원 감소 함수
  const decreasePeople = (id: number) => {
    setMealList(prevMealList =>
      prevMealList.map(meal =>
        meal.menu_id === id && meal.person_count > 1
          ? {...meal, person_count: meal.person_count - 1}
          : meal,
      ),
    );
  };

  // 메뉴 삭제 함수
  const deleteMeal = (id: number) => {
    setMealList(prevMealList =>
      prevMealList.filter(meal => meal.menu_id !== id),
    );
  };

  // 식당 순회: 이전
  const goToPreviousRestaurant = () => {
    setRestaurantIndex(prevIndex =>
      prevIndex === 0 ? restaurants.length - 1 : prevIndex - 1,
    );
  };

  // 식당 순회: 다음
  const goToNextRestaurant = () => {
    setRestaurantIndex(prevIndex =>
      prevIndex === restaurants.length - 1 ? 0 : prevIndex + 1,
    );
  };
  const toggleFavorite = async (menuId: number, favorite: boolean) => {
    try {
      // API 요청
      if (favorite) {
        await api.delete(`/AllEat/record/favorites/${menuId}`);
      } else {
        await api.post(`/AllEat/record/favorites/${menuId}`);
      }

      // 상태 업데이트: menuId로 해당 메뉴를 찾아 즐겨찾기 상태를 토글
      const updatedRestaurants = restaurants.map(restaurant => {
        // 메뉴 목록에서 해당 메뉴 ID를 찾아서 즐겨찾기 상태 변경
        const updatedMenus = restaurant.menus.map(menu => {
          if (menu.menuId === menuId) {
            return {
              ...menu,
              favorite: !menu.favorite, // favorite 상태를 토글
            };
          }
          return menu;
        });

        return {
          ...restaurant,
          menus: updatedMenus, // 메뉴 업데이트
        };
      });

      setRestaurants(updatedRestaurants); // 레스토랑 상태 업데이트
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      // 필요시 추가적인 에러 처리 로직 추가
    }
  };
  const toggleHomeMade = () => {
    setIsHomeMade(!isHomeMade);
  };
  const translatedTitle = titleMapping[meals] || meals;
  // 메뉴 추가 함수
  const addMeal = (menuIdx: number) => {
    const selectedMenu = restaurants[restaurantIndex].menus.find(
      menu => menu.menuId === menuIdx,
    );
    setMealList(prevMealList => [
      ...prevMealList,
      {
        menu_id: selectedMenu.menuId,
        restaurants_name: restaurants[restaurantIndex].restaurants_name,
        menu_name: selectedMenu.menuName,
        menu_price: selectedMenu.price,
        menu_calories: selectedMenu.menuCalories,
        person_count: 1,
        pay_transaction_id:
          restaurants[restaurantIndex].pay_transaction_id || 0,
      },
    ]);
  };
  const handleAddDiary = async () => {
    try {
      let response;
      let diaryData;
      // POST or PUT 요청 분기
      console.log('diaryData : ', diaryData);
      if (diaryId[mealKey]) {
        // 요청할 데이터 생성
        diaryData = {
          diary_id: diaryId[mealKey],
          menus: mealList.map(meal => ({
            menu_id: meal.menu_id,
            person_count: meal.person_count, // 해당 메뉴의 인원 수
          })),
        };
        console.log('diaryData : ', diaryData);
        if (diaryData.menus.length === 0) {
          response = await api.delete(`AllEat/record/menu/${diaryId[mealKey]}`);
        } else {
          response = await api.put('/AllEat/record/menu', diaryData);
        }
      } else {
        // 요청할 데이터 생성
        diaryData = {
          date: date, // 화면에 전달된 날짜 사용
          diary_time: meals.toUpperCase(), // BREAKFAST, LUNCH, DINNER 등으로 변환
          menus: mealList.map(meal => ({
            menu_id: meal.menu_id,
            person_count: meal.person_count, // 해당 메뉴의 인원 수
          })),
        };
        console.log('diaryData : ', diaryData);
        response = await api.post('/AllEat/record/menu', diaryData);
      }
      console.log('다이어리 추가 성공:', response.data);
      // 성공 시 홈 화면으로 돌아가기 전에 mealList에 대해 post 요청
      await Promise.all(
        mealList.map(async meal => {
          if (meal.pay_transaction_id !== 0) {
            const paymentData = {
              transaction_id: meal.pay_transaction_id,
              amount: meal.menu_price,
            };

            try {
              // POST 요청
              await api.post('/AllEat/record/meal-pay', paymentData);
              console.log(
                `Payment success for transaction: ${meal.pay_transaction_id}`,
              );
            } catch (error) {
              console.error(
                `Error in POST request for transaction: ${meal.pay_transaction_id}`,
                error,
              );

              // POST 실패 시 PUT 요청
              try {
                await api.put('/AllEat/record/meal-pay', paymentData);
                console.log(
                  `Payment updated with PUT for transaction: ${meal.pay_transaction_id}`,
                );
              } catch (putError) {
                console.error(
                  `Error in PUT request for transaction: ${meal.pay_transaction_id}`,
                  putError,
                );
              }
            }
          }
        }),
      );

      // 성공 시 홈 화면으로 돌아가기

      navigation.navigate('Home', {
        Kcal: mealList.reduce((acc, curr) => {
          return acc + curr.menu_calories;
        }, 0),
      });
    } catch (error) {
      console.error('다이어리 추가 실패:', error);
    }
  };
  return (
    <View style={styles.diaryBody}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={goToPreviousMealTime}>
          <icons.arrowBackLeft height={30} width={30} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {formatDateString(date)} {translatedTitle}
        </Text>

        <TouchableOpacity onPress={goToNextMealTime}>
          <icons.arrowBackRight height={30} width={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <Text style={styles.mainTitle}>
          {formatDateString(date)} {translatedTitle}으로 먹은 음식을
          기록해보세요!
        </Text>
        <View style={styles.mainRecord}>
          <ScrollView>
            {mealList.map(meal => (
              <DiaryCard
                key={meal.menu_id}
                restaurant={meal.restaurants_name}
                menu={meal.menu_name}
                price={meal.menu_price}
                kcal={meal.menu_calories}
                people={meal.person_count}
                onIncreasePeople={() => increasePeople(meal.menu_id)}
                onDecreasePeople={() => decreasePeople(meal.menu_id)}
                onDelete={() => deleteMeal(meal.menu_id)}
              />
            ))}
            {mealList.length === 0 && (
              <Text style={styles.cardDescription}>
                밑의 +버튼으로 메뉴를 추가해주세요
              </Text>
            )}
          </ScrollView>
        </View>
        <View style={styles.recordIconContainer}>
          <icons.addMenu style={styles.recordIcon} height={74} width={74} />
          <TouchableOpacity
            style={styles.recordIconContainer}
            onPress={openModal}>
            <icons.plusWhiteReverse height={20} width={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.restaurant}>
        <View style={styles.restaurantTitle}>
          {restaurants[restaurantIndex] && (
            <TouchableOpacity onPress={goToPreviousRestaurant}>
              <icons.arrowBackLeft height={24} width={24} />
            </TouchableOpacity>
          )}
          <Text style={styles.restaurantTitleText}>
            {' '}
            {restaurants[restaurantIndex]?.restaurants_name}
          </Text>
          {restaurants[restaurantIndex] && (
            <TouchableOpacity onPress={goToNextRestaurant}>
              <icons.arrowBackRight height={24} width={24} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.restaurantMenuContainer}>
          <ScrollView>
            {restaurants[restaurantIndex]?.menus.map(menu => (
              <MenuCard
                key={menu.menuId}
                isFavorate={menu.favorite}
                menu={menu.menuName}
                kcal={menu.menuCalories}
                price={menu.price}
                onToggleFavorite={() =>
                  toggleFavorite(menu.menuId, menu.favorite)
                }
                onAddMeal={() => addMeal(menu.menuId)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>식비</Text>
          <Text style={styles.buttonCost}>
            {Math.round(
              mealList.reduce(
                (sum, meal) => sum + meal.menu_price / meal.person_count,
                0,
              ),
            )}
            원
          </Text>
        </View>
        <CustomButton
          title="등록"
          handlePress={handleAddDiary}
          containerStyles="w-[24%] h-[50px] bg-primary"
          textStyles="text-white font-pbold "
        />
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          {modalType === 'main' ? (
            <AddMenuModal
              onClose={closeModal}
              onAddMeal={menu =>
                setMealList(prevMealList => [
                  ...prevMealList,
                  {
                    menu_id: menu.menu_id,
                    restaurants_name: menu.restaurants_name,
                    menu_name: menu.menu_name,
                    menu_price: menu.menu_price,
                    menu_calories: menu.menu_calories,
                    person_count: 1,
                    pay_transaction_id: menu.pay_transaction_id || 0,
                  },
                ])
              }
              onOpenCustomMenuModal={openCustomMenuModal}
              setForm={menu => setForm(menu)}
            />
          ) : (
            <CustomMenuModal
              form={form}
              setForm={setForm}
              restaurantValue={restaurantValue}
              restaurantItems={restaurantItems}
              isRestaurantOpen={isRestaurantOpen}
              setIsRestaurantOpen={setIsRestaurantOpen}
              setRestaurantValue={setRestaurantValue}
              carbPercentage={carbPercentage}
              proteinPercentage={proteinPercentage}
              fatPercentage={fatPercentage}
              onClose={closeModal}
              addMealToList={addMealToList}
              isHomeMade={isHomeMade}
              toggleHomeMade={toggleHomeMade}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default DiaryCreateScreen;
