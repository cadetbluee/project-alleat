// CalanderModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { icons } from '../../../../constants';
import { styles } from './CalanderModal.styles';

interface CalanderModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const CalanderModal: React.FC<CalanderModalProps> = ({ visible, onClose, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); 
  const [dates, setDates] = useState<Date[]>([]); 

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    setDates(allDays);
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
    onClose();
  };

  const monthTitle = format(currentMonth, 'yyyy년 MM월');
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onClose}>
        <View style={styles.shadowContainer} />
        
        <View style={styles.modalContainer}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitleText}>날짜를 선택해 주세요</Text> 
          </View>
          <View style={styles.modalBodyContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handlePreviousMonth} style={styles.arrowButton}>
                <icons.arrowBackLeft width={20} height={20}/>
              </TouchableOpacity>
              <Text style={styles.monthText}>{monthTitle}</Text>
              <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
                <icons.arrowBackRight width={20} height={20}/>
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysContainer}>
              {weekDays.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <ScrollView>
              <View style={styles.datesContainer}>
                {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, index) => (
                  <View key={`empty-${index}`} style={styles.dateItem} />
                ))}

              {dates.map(date => (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={styles.dateItem}
                  onPress={() => handleSelectDate(date)}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{format(date, 'd')}</Text>
                    {format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                      <icons.tan style={styles.todayIcon} height={30} width={30} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>  
    </Modal>
  );
};

export default CalanderModal;
