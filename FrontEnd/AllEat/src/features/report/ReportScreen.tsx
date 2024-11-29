import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import DailyReport from './DailyReport/DailyReport';
import WeeklyReport from './WeeklyReport/WeeklyReport';
import MonthlyReport from './MonthlyReport/MonthlyReport';
import { styles } from './ReportScreen.styles';

const ReportScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'monthly'>('daily'); 
  
  useEffect(() => {
    console.log(`현재 선택된 탭: ${selectedTab}`);
  }, [selectedTab]);

  return (
    <View>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('daily')}>
          <Text style={[styles.topText, selectedTab === 'daily' && styles.selectedText]}>
            일간
          </Text>
        </TouchableOpacity>
        <Text style={styles.topSlash}>|</Text>
        <TouchableOpacity onPress={() => setSelectedTab('weekly')}>
          <Text style={[styles.topText, selectedTab === 'weekly' && styles.selectedText]}>
            주간
          </Text>
        </TouchableOpacity>
        <Text style={styles.topSlash}>|</Text>
        <TouchableOpacity onPress={() => setSelectedTab('monthly')}>
          <Text style={[styles.topText, selectedTab === 'monthly' && styles.selectedText]}>
            월간
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.container}>
        <ScrollView>
          {selectedTab === 'daily' && <DailyReport />}
          {selectedTab === 'weekly' && <WeeklyReport />}
          {selectedTab === 'monthly' && <MonthlyReport />}
        </ScrollView>
      </View>
    </View>
  );
};

export default ReportScreen;
