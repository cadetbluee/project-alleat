import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const ReportNavigator: React.FC = () => {

  return (
    <View>
      <TouchableOpacity style={styles.topContainer}>
        <Text style={styles.topText}>일간</Text>
        <Text style={styles.topSlash}>|</Text>
        <Text style={styles.topText}>주간</Text>
        <Text style={styles.topSlash}>|</Text>
        <Text style={styles.topText}>월간</Text>
      </TouchableOpacity>
      <ScrollView>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    height: 60,
    paddingHorizontal: 5,
  },
  topText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -2,
    color: '#3d3d3d',
    paddingHorizontal: 12,
  },
  topSlash: {
    color: 'lightgrey'
  }
});


export default ReportNavigator;