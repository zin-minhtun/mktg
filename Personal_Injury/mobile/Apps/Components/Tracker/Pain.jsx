import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PainCard from "./PainCard";
import { useTheme } from "../../Contexts/ThemeContext";

export default function Pain() {
  const { theme } = useTheme();
  const [painCards, setPainCards] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setStartDate(date);
    setCurrentDate(date);
    hideDatePicker();
  };

  const navigateToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const navigateToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  const addPainCard = () => {
    setPainCards([
      ...painCards,
      {
        id: painCards.length,
        minimized: false,
      },
    ]);
  };

  const deletePainCard = (index) => {
    setPainCards(painCards.filter((card) => card.id !== index));
  };

  const toggleMinimize = (index) => {
    setPainCards(
      painCards.map((card) =>
        card.id === index ? { ...card, minimized: !card.minimized } : card
      )
    );
  };

  return (
    <ScrollView className=" flex-1 px-3" style={{ backgroundColor: theme.background }}>
      <View className=" flex-row items-center justify-center mt-4">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <Entypo name="chevron-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <Entypo className=" px-1" name="calendar" size={24} color={theme.textColor} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            display="default"
            maximumDate={startDate}
          />
        </TouchableOpacity>
        <Text className=" text-center text-[16px]" style={{ color: theme.textColor }}>
          {format(currentDate, "EEEE, MMMM do, yyyy, HH:mm")}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={addPainCard} className=" mt-4">
        <Text className=" p-3 bg-blue-400 rounded-xl text-center text-white">
          Add Pain Card
        </Text>
      </TouchableOpacity>

      {painCards.map((card) => (
        <View key={card.id} className="mt-2">
          <PainCard
            minimized={card.minimized}
            onDelete={() => deletePainCard(card.id)}
            onToggleMinimize={() => toggleMinimize(card.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
