// components/MenuCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {icons} from '../../constants';
import {styles} from './MenuCard.styles';

type MenuCardProps = {
  isFavorate: boolean;
  menu: string;
  kcal: number;
  price: number;
  onToggleFavorite: () => void;
  onAddMeal?: () => void;
  isFavoritePage?: boolean;
  restaurantName?: string;
};

const MenuCard: React.FC<MenuCardProps> = ({
  isFavorate,
  menu,
  kcal,
  price,
  onToggleFavorite,
  onAddMeal,
  isFavoritePage = false,
  restaurantName,
}) => {
  return (
    <View style={styles.restaurantMenu}>
      <TouchableOpacity style={styles.icons} onPress={onToggleFavorite}>
        {isFavorate ? (
          <icons.bookmark height={24} width={24} />
        ) : (
          <icons.bookmarkDisabled height={24} width={24} />
        )}
      </TouchableOpacity>
      <View style={styles.restaurantMenuBox}>
        <Text style={styles.restaurantMenuTitle}>{menu.trim()}</Text>
          <View style={styles.menuInfoContainer}>
            <View style={styles.menuNameBox}>
            {restaurantName && (
              <Text style={styles.restaurantName}>{restaurantName}</Text>
            )}
            </View>
          <View style={styles.menuInfoBox}>
            <Text style={styles.restaurantName}>
              {kcal?.toLocaleString() || 0}kcal
            </Text>
            <Text style={styles.restaurantName}>
              {price.toLocaleString()}원
            </Text>
          </View>
        </View>
      </View>
      {onAddMeal && (
        <TouchableOpacity style={styles.icons} onPress={onAddMeal}>
          <icons.plusWhite height={20} width={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MenuCard;
