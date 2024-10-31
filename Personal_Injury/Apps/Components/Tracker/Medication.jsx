import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { addDays, subDays } from "date-fns";
import { format } from "date-fns-tz";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUserData } from "../../Contexts/UserContext";
import MedicationCard from "./MedicationCard";
import { API_URL } from "@env";
import axios from "axios";

export default function Medication() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [medCards, setMedCards] = useState([]);
  const { gUser } = useUserData();

  // for fetching records of current date
  useEffect(() => {
    const userId = gUser._id;
    console.log("Medication Stored UserId: ", userId);

    const currentDateRecords = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/meds/records/${userId}`,
          {
            params: {
              date: format(currentDate, "yyyy-MM-dd"),
            },
          }
        );
        console.log("Current Date Records:", response.data); // for debugging - to remove

        setMedCards(
          response.data.map((card, idx) => ({
            ...card,
            idx,
            minimized: true,
            isLoaded: true,
          }))
        );
      } catch (error) {
        console.error("Error fetching medication records: ", error);
      }
    };

    currentDateRecords();
  }, [currentDate]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setCurrentDate(date);
    hideDatePicker();
  };

  const navigateToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const navigateToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  const addMedicationCard = () => {
    setMedCards([
      ...medCards,
      {
        idx: medCards.length,
        minimized: false,
        medicationName: "Med Name",
        selectedCategory: "",
        selectedMedication: "",
        dosage: "",
        unit: null,
        frequency: null,
        timeOfDayOnce: null,
        timeOfDayManyTimes: null,
        intervalTime: "",
        startDate: new Date(),
        expirationDate: new Date(),
        instructions: null,
        notes: "",
      },
    ]);
  };

  const deleteMedicationCard = (index) => {
    setMedCards(medCards.filter((card) => card.idx !== index));
  };

  const toggleMinimize = (index) => {
    setMedCards(
      medCards.map((card) =>
        card.idx === index ? { ...card, minimized: !card.minimized } : card
      )
    );
  };

  const handleSave = (updatedCard) => {
    setMedCards((prevCards) => {
      const existingIndex = prevCards.findIndex(
        (card) => card._id === updatedCard._id
      );
      if (existingIndex >= 0) {
        // Update existing card
        const updatedCards = [...prevCards];
        updatedCards[existingIndex] = updatedCard;
        return updatedCards;
      } else {
        // Add new card
        return [...prevCards, updatedCard];
      }
    });
  };

  return (
    <ScrollView className="bg-white flex-1 px-3">
      <View className=" flex-row items-center justify-center my-8">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <Entypo className=" px-1" name="calendar" size={24} color="black" />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            display="default"
            maximumDate={currentDate}
          />
        </TouchableOpacity>
        <Text className=" text-center text-[16px]">
          {/* {format(currentDate, "EEEE, MMMM do, yyyy", { timeZone: "UTC" })} */}
          {format(currentDate, "EEEE, MMMM do, yyyy, HH:mm")}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View className="  mt-4">
        <Text className=" text-lg font-bold mt-2">Select/Add Medication:</Text>

        <TouchableOpacity
          onPress={addMedicationCard}
          className="p-3 bg-blue-400 rounded-xl "
        >
          <View className=" flex-row gap-2 justify-center">
            <AntDesign name="pluscircleo" size={24} color="black" />
            <Text className=" text-[16px]">Add Medication</Text>
          </View>
        </TouchableOpacity>
      </View>
      {medCards.map((card) => (
        <View key={card.idx} className="mt-2">
          <MedicationCard
            minimized={card.minimized}
            onDelete={() => deleteMedicationCard(card.idx)}
            onToggleMinimize={() => toggleMinimize(card.idx)}
            medication={card}
            onSave={handleSave}
          />
        </View>
      ))}
    </ScrollView>
  );
}
