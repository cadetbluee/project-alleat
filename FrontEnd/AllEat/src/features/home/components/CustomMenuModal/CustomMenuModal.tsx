import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {icons} from '../../../../constants';
import {styles} from './CustomMenuModal.styles';
import FormField from '../../../../components/FormField/FormField';
import CustomButton from '../../../../components/CustomButton';
import NutrientPieChart from '../../../../components/NutrientPieChart/NutrientPieChart';
import DropDownPicker from 'react-native-dropdown-picker';

interface CustomMenuModalProps {
  form: any;
  setForm: (value: any) => void;
  restaurantValue: string | null;
  restaurantItems: Array<{label: string; value: string}>;
  isRestaurantOpen: boolean;
  setIsRestaurantOpen: (open: boolean) => void;
  setRestaurantValue: (value: string | null) => void;
  carbPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  onClose: () => void;
  addMealToList: () => void;
  isHomeMade: boolean;
  toggleHomeMade: () => void;
}

const CustomMenuModal: React.FC<CustomMenuModalProps> = ({
  form,
  setForm,
  restaurantValue,
  restaurantItems,
  isRestaurantOpen,
  setIsRestaurantOpen,
  setRestaurantValue,
  carbPercentage,
  proteinPercentage,
  fatPercentage,
  onClose,
  addMealToList,
  isHomeMade,
  toggleHomeMade,
}) => {
  return (
    <View style={styles.modalContent}>
      <View style={styles.modalTitle}>
        <Text style={styles.modalTitleText}>메뉴 등록</Text>
        <TouchableOpacity style={styles.modalIcon} onPress={onClose}>
          <icons.exit height={24} width={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.menuFormContainer}>
        <FormField
          title="이름"
          value={form.menu_name}
          handleChangeText={text => setForm({...form, menu_name: text})}
          placeholder="메뉴 이름"
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>가게이름</Text>
          <DropDownPicker
            disabled={isHomeMade}
            open={isRestaurantOpen}
            value={restaurantValue}
            items={restaurantItems} // 드롭다운에 맞는 형식으로 변환된 아이템 리스트
            setOpen={setIsRestaurantOpen}
            setValue={setRestaurantValue}
            placeholder={isHomeMade ? '집밥' : '오늘 결제한 식당'}
            style={isHomeMade ? styles.pickerDisabled : styles.picker}
            textStyle={styles.pickerText}
            dropDownContainerStyle={styles.picker}
          />
        </View>
        <FormField
          title="가격"
          value={String(form.menu_price)}
          unit="원"
          handleChangeText={text =>
            setForm({...form, menu_price: Number(text)})
          }
          otherStyles={styles.field}
          placeholder="0"
          isNumeric={true}
          isDecimal={false}
          abled={!isHomeMade}
        />
        <View style={styles.homeMade}>
          <TouchableOpacity onPress={toggleHomeMade}>
            {!isHomeMade ? (
              <icons.emptyCheck width={24} height={24} />
            ) : (
              <icons.passwordCheck width={24} height={24} />
            )}
          </TouchableOpacity>
          <Text>집밥이에요!</Text>
        </View>
        <NutrientPieChart
          carbPercentage={carbPercentage}
          proteinPercentage={proteinPercentage}
          fatPercentage={fatPercentage}
        />
        <View style={styles.nutrientFormBox}>
          <View style={styles.nutrientFormCard}>
            <View style={styles.nutrientFormContainer}>
              <icons.dan width={20} height={20} />
              <Text style={styles.nutrientFormTitle}>단백질</Text>
            </View>
            <FormField
              value={String(Math.round(form.menu_protein))}
              unit="g"
              handleChangeText={text =>
                setForm({...form, menu_protein: Number(text)})
              }
              otherInputStyles={styles.nutrientForm}
              placeholder="0"
              isNumeric={true}
              isDecimal={false}
            />
          </View>
          <View style={styles.nutrientFormCard}>
            <View style={styles.nutrientFormContainer}>
              <icons.tan width={20} height={20} />
              <Text style={styles.nutrientFormTitle}>탄수화물</Text>
            </View>
            <FormField
              value={String(Math.round(form.menu_carbohydrate))}
              unit="g"
              handleChangeText={text =>
                setForm({...form, menu_carbohydrate: Number(text)})
              }
              otherInputStyles={styles.nutrientForm}
              placeholder="0"
              isNumeric={true}
              isDecimal={false}
            />
          </View>
          <View style={styles.nutrientFormCard}>
            <View style={styles.nutrientFormContainer}>
              <icons.ji width={20} height={20} />
              <Text style={styles.nutrientFormTitle}>지방</Text>
            </View>
            <FormField
              value={String(Math.round(form.menu_fat))}
              unit="g"
              handleChangeText={text =>
                setForm({...form, menu_fat: Number(text)})
              }
              otherInputStyles={styles.nutrientForm}
              placeholder="0"
              isNumeric={true}
              isDecimal={false}
            />
          </View>
        </View>
        <FormField
          title="칼로리"
          value={String(Math.round(form.menu_calories))}
          unit="kcal"
          handleChangeText={text =>
            setForm({...form, menu_calories: Number(text)})
          }
          placeholder="0"
          isNumeric={true}
          isDecimal={false}
        />
        <FormField
          title="용량"
          value={String(Math.round(form.menu_value))}
          unit="g"
          handleChangeText={text =>
            setForm({...form, menu_value: Number(text)})
          }
          placeholder="0"
          isNumeric={true}
          isDecimal={false}
        />
      </View>
      <CustomButton
        title="등록"
        handlePress={addMealToList}
        containerStyles="w-[100%] h-[50px] mt-3"
        textStyles="text-white font-psemibold "
      />
    </View>
  );
};

export default CustomMenuModal;
