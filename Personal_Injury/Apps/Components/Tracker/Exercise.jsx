import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../Contexts/UserContext";
import { Picker } from "@react-native-picker/picker";
import Note from "../Memo/Note";

export default function Exercise() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [intensity, setIntensity] = useState("low");
  const [exercise, setExercise] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [notes, setNotes] = useState('');

  const { gUser } = useUserData();
  const userId = gUser._id;

  const exerciseOptions = {
    low: ["Walking", "Stretching", "Tai Chi"],
    moderate: ["Speed Walking", "Pilates", "Yoga", "Aerobics"],
    high: ["Running", "Cycling", "Swimming", "Strength Training", "Sports"],
  };

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

  const validateInputs = () => {
    if (!exercise) {
      Alert.alert("Error", "Please select an exercise.");
      return false;
    }

    if (hours === "" && minutes === "") {
      Alert.alert("Error", "Please provide the duration in hours or minutes.");
      return false;
    }

    if (
      hours !== "" &&
      (isNaN(hours) || parseInt(hours) < 0 || parseInt(hours) > 24)
    ) {
      Alert.alert("Error", "Please enter a valid number of hours (0-24).");
      return false;
    }

    if (
      minutes !== "" &&
      (isNaN(minutes) || parseInt(minutes) < 0 || parseInt(minutes) >= 60)
    ) {
      Alert.alert("Error", "Please enter a valid number of minutes (0-59).");
      return false;
    }

    const totalMinutes = parseInt(hours || "0") * 60 + parseInt(minutes || "0");
    if (totalMinutes <= 0) {
      Alert.alert("Error", "Total duration must be greater than 0 minutes.");
      return false;
    }

    return true;
  };

  const handleLogEntry = async () => {
    if (!validateInputs()) {
      return;
    }

    const totalMinutes = parseInt(hours || "0") * 60 + parseInt(minutes || "0");

    const logEntry = {
      userId: userId,
      date: format(currentDate, "yyyy-MM-dd"),
      intensity: intensity,
      exercise: exercise,
      duration: totalMinutes,
      notes: notes,
    };

    console.log("Exercise log:", logEntry);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/exercises`,
        logEntry
      );
      console.log("Log entry saved successfully:", response.data);

      // Clear form fields after successful save
      setCurrentDate(new Date());
      setStartDate(new Date());
      setIntensity("low");
      setExercise("");
      setHours("");
      setMinutes("");
      setNotes("");
    } catch (error) {
      console.error(
        "Error saving log entry:",
        error.response?.data ?? error.message
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-3">
      <View className="flex-row items-center justify-center mt-8">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <Entypo className="px-1" name="calendar" size={24} color="black" />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            display="default"
            maximumDate={startDate}
          />
        </TouchableOpacity>
        <Text className="text-center text-[16px]">
          {format(currentDate, "EEEE, MMMM do, yyyy, HH:mm")}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text className="text-center text-xl mt-4 mb-6">Track Your Exercise</Text>

      <View className="mt-4">
        <Text className="text-lg">Select Intensity:</Text>
        <View className="border border-black rounded overflow-hidden mt-1 mb-4">
          <Picker
            selectedValue={intensity}
            style={{ height: 50, width: "100%" }}
            onValueChange={(itemValue) => setIntensity(itemValue)}
          >
            <Picker.Item label="Low Intensity" value="low" />
            <Picker.Item label="Moderate Intensity" value="moderate" />
            <Picker.Item label="High Intensity" value="high" />
          </Picker>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-lg">Select Exercise:</Text>
        <View className="border border-black rounded overflow-hidden mt-1 mb-4">
          <Picker
            selectedValue={exercise}
            style={{ height: 50, width: "100%" }}
            onValueChange={(itemValue) => setExercise(itemValue)}
          >
            {exerciseOptions[intensity].map((exerciseOption) => (
              <Picker.Item
                key={exerciseOption}
                label={exerciseOption}
                value={exerciseOption}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View className="mt-4 flex flex-row space-x-2">
        <View className="flex-1">
          <Text className="text-lg">Hours:</Text>
          <TextInput
            className="border border-black p-2 my-1 rounded"
            placeholder="Enter hours"
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Text className="text-lg">Minutes:</Text>
          <TextInput
            className="border border-black p-2 my-1 rounded"
            placeholder="Enter minutes"
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Notes */}
      <View className="mt-4">
        <Text className="text-lg">Notes:</Text>
        <TextInput
          className="border border-black p-2 my-1 rounded"
          placeholder="Write any notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      {/* <Note notes={notes} setNotes={setNotes} /> */}
      {/* End Of Notes */}

      <TouchableOpacity
        className="mt-4 mb-8 bg-blue-500 p-3 rounded-xl"
        onPress={handleLogEntry}
      >
        <Text className="text-center text-white">Save Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
