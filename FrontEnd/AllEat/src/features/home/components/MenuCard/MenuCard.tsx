// components/MenuCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {icons} from '../../../../constants';
import {styles} from './MenuCard.styles';

type MenuCardProps = {
  isFavorate: boolean;
  menu: string;
  kcal: number;
  price: number;
  onToggleFavorite: () => void;
  onAddMeal: () => void;
};

const MenuCard: React.FC<MenuCardProps> = ({
  isFavorate,
  menu,
  kcal,
  price,
  onToggleFavorite,
  onAddMeal,
}) => {
  return (
    <View style={styles.restaurantMenu}>
      <TouchableOpacity onPress={onToggleFavorite}>
        {isFavorate ? (
          <icons.bookmark height={24} width={24} />
        ) : (
          <icons.bookmarkDisabled height={24} width={24} />
        )}
      </TouchableOpacity>
      <Text style={styles.restaurantMenuTitle}>{menu}</Text>
      <Text style={styles.restaurantMenuDetail}>
        {kcal}kcal · {price}원
      </Text>
      <TouchableOpacity onPress={onAddMeal}>
        <icons.plusWhite height={20} width={20} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuCard;
