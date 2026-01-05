import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import { useTheme } from '../../../Contexts/ThemeContext';
import WeekDayItem from '../WeekDay/WeekDayItem';

const WeekNavigation = ({ 
  selectedDate, 
  setSelectedDate, 
  onDateChanged 
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme.background === '#00192F';

  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    updateWeekDates(0);
  }, []);

  useEffect(() => {
    if (selectedDate && weekDates.length > 0 && !weekDates.includes(selectedDate)) {
      const selectedDayjs = dayjs(selectedDate);
      const currentWeekStart = dayjs().add(currentWeekOffset, 'week').startOf('isoWeek');
      const weekDiff = Math.round(selectedDayjs.diff(currentWeekStart, 'week', true));
      if (weekDiff !== 0) updateWeekDates(currentWeekOffset + weekDiff);
    }
  }, [selectedDate]);

  const updateWeekDates = (offset) => {
    const today = dayjs().add(offset, 'week');
    const startOfWeek = today.startOf('isoWeek');
    const dates = [];
    for (let i = 0; i < 7; i++) dates.push(startOfWeek.add(i, 'day').format('YYYY-MM-DD'));
    setWeekDates(dates);
    setCurrentWeekOffset(offset);
  };

  return (
    <View>
      <View className="mx-5 mb-2">
        <Text className="font-raleway text-sm" style={{ color: theme.darkGrey }}>
          {dayjs(selectedDate).format('MMM DD, YYYY')}
        </Text>
        <Text className="font-ralewayBold text-2xl" style={{ color: theme.textColor }}>
          {currentWeekOffset === 0 && dayjs().format('YYYY-MM-DD') === selectedDate
            ? 'Today'
            : dayjs(selectedDate).format('dddd')}
        </Text>
      </View>

      {/* Week days row */}
      <FlatList
        data={weekDates}
        horizontal
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <WeekDayItem
            item={item}
            selectedDate={selectedDate}
            setSelectedDate={(date) => {
              setSelectedDate(date);
              if (onDateChanged) onDateChanged(date);
            }}
          />
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-2" />}
      />

      {/* Calendar modal remains available for future selection if needed */}
      <Modal
        animationType="slide"
        transparent
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="w-4/5 p-4 rounded-lg" style={{ backgroundColor: theme.background }}>
            <Text className="text-lg font-bold mb-4" style={{ color: theme.textColor }}>
              Select Week
            </Text>
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offset) => {
              const weekStart = dayjs().add(offset, 'week').startOf('isoWeek');
              const weekEnd = dayjs().add(offset, 'week').endOf('isoWeek');
              const isCurrentWeek = offset === currentWeekOffset;
              return (
                <TouchableOpacity
                  key={offset}
                  onPress={() => {
                    const currentDayOfWeek = dayjs(selectedDate).day();
                    const dayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
                    const newWeekStart = dayjs().add(offset, 'week').startOf('isoWeek');
                    const newDates = [];
                    for (let i = 0; i < 7; i++) newDates.push(newWeekStart.add(i, 'day').format('YYYY-MM-DD'));
                    setWeekDates(newDates);
                    setCurrentWeekOffset(offset);
                    const newSelectedDate = newDates[dayIndex];
                    setSelectedDate(newSelectedDate);
                    if (onDateChanged) onDateChanged(newSelectedDate);
                    setCalendarVisible(false);
                  }}
                  className="py-3 px-2 border-b"
                  style={{
                    borderBottomColor: theme.borderColor,
                    backgroundColor: isCurrentWeek ? (isDarkMode ? theme.textFieldBG : '#E6F7FB') : 'transparent',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>
                    {weekStart.format('MMM DD')} - {weekEnd.format('MMM DD, YYYY')}
                    {offset === 0 ? ' (Current Week)' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setCalendarVisible(false)} className="p-3 rounded-lg" style={{ backgroundColor: theme.primaryLighBlue }}>
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WeekNavigation;
