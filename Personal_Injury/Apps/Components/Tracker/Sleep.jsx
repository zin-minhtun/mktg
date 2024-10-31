import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Entypo,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../Contexts/UserContext";
import ToggleSwitch from "../Switch/ToggleSwitch";
import { Checkbox } from "react-native-paper";
import Note from "../Memo/Note";

/*******Notes*******/
// FIXME: Slider for manual sleep hours input with 15 minutes increments
// FIXME: Able to display total hours in the database
// TODO: Validation where sleep cannot exceed 24h or cannot be negative
// TODO: Able to save the total hours from sleep timer
// TODO: Able to sync smartphones and watches for more detailed data
// FIXME: Factors are nulled when log is saved

// Preset mood data
const moodIcons = [
  {
    component: MaterialCommunityIcons,
    name: "emoticon-angry-outline",
    mood: "Awful",
    value: 1,
  },
  {
    component: Entypo,
    name: "emoji-sad",
    mood: "Poor",
    value: 2,
  },
  {
    component: MaterialCommunityIcons,
    name: "emoticon-neutral-outline",
    mood: "Ok",
    value: 3,
  },
  {
    component: Feather,
    name: "smile",
    mood: "Good",
    value: 4,
  },
  {
    component: Entypo,
    name: "emoji-happy",
    mood: "Great",
    value: 5,
  },
];

// Preset factor data
const factorIcons = {
  Stress: {
    icon: <FontAwesome5 name="tired" size={24} color="black" />,
    factor: "Stress",
  },
  Caffeine: {
    icon: <MaterialCommunityIcons name="coffee" size={24} color="black" />,
    factor: "Caffeine",
  },
  Noise: {
    icon: <Entypo name="sound" size={24} color="black" />,
    factor: "Noise",
  },
  Exercise: {
    icon: <MaterialCommunityIcons name="run" size={24} color="black" />,
    factor: "Exercise",
  },
  Alcohol: {
    icon: <FontAwesome name="glass" size={24} color="black" />,
    factor: "Alcohol",
  },
  "Late meal": {
    icon: <MaterialCommunityIcons name="food" size={24} color="black" />,
    factor: "Late meal",
  },
  "Screen time": {
    icon: <Entypo name="tv" size={24} color="black" />,
    factor: "Screen time",
  },
  "Room temperature": {
    icon: <Feather name="thermometer" size={24} color="black" />,
    factor: "Room temperature",
  },
  "Bed comfort": {
    icon: <MaterialCommunityIcons name="bed" size={24} color="black" />,
    factor: "Bed comfort",
  },
  "Partner disturbance": {
    icon: (
      <MaterialCommunityIcons name="account-heart" size={24} color="black" />
    ),
    factor: "Partner disturbance",
  },
  "Kids disturbance": {
    icon: <MaterialCommunityIcons name="baby" size={24} color="black" />,
    factor: "Kids disturbance",
  },
  "Pet disturbance": {
    icon: <MaterialCommunityIcons name="dog" size={24} color="black" />,
    factor: "Pet disturbance",
  },
  Pain: {
    icon: (
      <MaterialCommunityIcons name="alert-circle" size={24} color="black" />
    ),
    factor: "Pain",
  },
  Medication: {
    icon: <MaterialCommunityIcons name="pill" size={24} color="black" />,
    factor: "Medication",
  },
  Travel: {
    icon: <MaterialCommunityIcons name="airplane" size={24} color="black" />,
    factor: "Travel",
  },
  Work: {
    icon: <MaterialCommunityIcons name="briefcase" size={24} color="black" />,
    factor: "Work",
  },
  Anxiety: {
    icon: (
      <MaterialCommunityIcons
        name="emoticon-sad-outline"
        size={24}
        color="black"
      />
    ),
    factor: "Anxiety",
  },
  Depression: {
    icon: (
      <MaterialCommunityIcons
        name="emoticon-cry-outline"
        size={24}
        color="black"
      />
    ),
    factor: "Depression",
  },
  Allergies: {
    icon: <MaterialCommunityIcons name="flower" size={24} color="black" />,
    factor: "Allergies",
  },
  Illness: {
    icon: <MaterialCommunityIcons name="hospital" size={24} color="black" />,
    factor: "Illness",
  },
};

export default function Sleep() {
  // Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [notes, setNotes] = useState("");
  const [sleepHours, setSleepHours] = useState(0);
  // Icons
  const [selectedMood, setSelectedMood] = useState(null);
  const [iconColors, setIconColors] = useState({
    Awful: "red",
    Poor: "orange",
    Ok: "yellow",
    Good: "green",
    Great: "blue",
  });
  // Factors
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    Stress: false,
    Caffeine: false,
    Noise: false,
    Exercise: false,
    Alcohol: false,
    "Late meal": false,
    "Screen time": false,
    "Room temperature": false,
    "Bed comfort": false,
    "Partner disturbance": false,
    "Kids disturbance": false,
    "Pet disturbance": false,
    Pain: false,
    Medication: false,
    Travel: false,
    Work: false,
    Anxiety: false,
    Depression: false,
    Allergies: false,
    Illness: false,
  });

  // Retreiving userId
  const { gUser } = useUserData();
  const userId = gUser._id;
  // Sleep Timer
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  // Bed Time Hours
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Bed Time Picker
  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (date) => {
    setStartTime(date);
    setSleepHours(calculateSleepHours(date, endTime));
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (date) => {
    setEndTime(date);
    setSleepHours(calculateSleepHours(startTime, date));
    hideEndTimePicker();
  };

  // Calculate sleep hours
  const calculateSleepHours = () => {
    // FIXME: add condition to filter the case (endTime > startTime : only)
    if (startTime && endTime) {
      const diffInMs = endTime.getTime() - startTime.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      if (diffInHours < 0 || diffInHours > 24) {
        // Validation for sleep hours
        console.error("Invalid sleep hours. Must be between 0 and 24.");
        return null;
      }
      const hours = Math.floor(diffInHours);
      const minutes = Math.round((diffInHours - hours) * 60);
      return `${hours}h${minutes}mins`;
    }
    return "0h0mins";
  };

  // Sleep Timer
  useEffect(() => {
    let timerInterval;
    if (timerRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [timerRunning]);

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const showTimerModal = () => {
    setIsTimerVisible(true);
  };

  // Verify id of the current User
  useEffect(() => {
    const storedUserData = {
      userId_fromUserContext: gUser._id,
    };
    console.log("Stored User Data :", storedUserData);
  }, [gUser]);

  // Calendar
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

  // Save sleep log entry
  const saveSleepLogEntry = async () => {
    // Validate sleep hours
    const sleepHours = calculateSleepHours();
    if (!sleepHours) {
      return;
    }

    const selectedFactors = Object.keys(checkboxes).filter(
      (factor) => checkboxes[factor]
    );

    const factors = selectedFactors.map((factor) => factorIcons[factor].factor);

    // FIXME: Factors are null when log is saved
    // FIXME: calculate sleep hours properly and deliver it to the database
    const sleepEntry = {
      userId: userId,
      date: format(currentDate, "yyyy-MM-dd"),
      sleepHours: sleepHours,
      mood: selectedMood,
      notes: notes,
      factors: factors,
    };
    console.log("Sleep log:", sleepEntry);
    try {
      const response = await axios.post(`${API_URL}/api/sleep/add`, sleepEntry);
      console.log("Log entry saved successfully:", response.data);

      // Clear form fields after successful save
      setCurrentDate(new Date());
      setSleepHours(0);
      setSelectedMood(null);
      setNotes("");
      setCheckboxes((prevCheckboxes) => ({
        ...prevCheckboxes,
        ...Object.fromEntries(
          Object.keys(prevCheckboxes).map((key) => [key, false])
        ),
      }));
      console.log("Form fields cleared.");
    } catch (error) {
      console.error("Error saving log entry:", error);
    }
  };

  // Mood
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  // Switch
  const handleToggle = (value) => {
    setIsSwitchEnabled(value);
  };

  // Checkboxes
  const handleCheckboxChange = (factor) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [factor]: !prevCheckboxes[factor],
    }));
  };

  // Slider Change
  const handleSliderChange = (value) => {
    setSleepHours(Math.floor(value));
  };

  return (
    <ScrollView className="flex-1 bg-white px-3">
      {/* Date Selection */}
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
          {format(currentDate, "EEEE, MMMM do, yyyy")}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* End of Date Selection */}

      <View className="p-3 bg-slate-100 rounded-lg mt-4">
        {/* Display Total Sleep Time */}
        <View className="flex-row items-center justify-between">
          <View className=" flex-row items-center ">
            <Ionicons name="moon" size={24} color="black" />
            <Text className="text-xl mt-4 mb-6 mx-2">Total Sleep Time</Text>
          </View>
          <Text className="text-xl mt-4 mb-6 bg-green-300 p-2 rounded">
            {calculateSleepHours()}
          </Text>
        </View>
        {/* End of Display Total Sleep Time */}

        {/* Slider for Manual Insert of Total Sleep hours and minutes increments of 1/4 */}
        {/* FIXME: When the Bed Hours start time is not selected by default moving the slider should indicate the total sleep hours */}
        <Slider
          className="w-full h-[40px] mt-4"
          minimumValue={1}
          maximumValue={24}
          step={0.25}
          value={Math.round(sleepHours * 4) / 4}
          onValueChange={(value) => {
            setSleepHours(value);
            if (!startTime) {
              const totalSleepTime = calculateSleepHours(value);
              setSleepHours(totalSleepTime);
            } else if (endTime) {
              const hours = Math.floor(value);
              const minutes = Math.round((value - hours) * 60);
              const newEndTime = new Date(
                startTime.getTime() +
                  hours * 60 * 60 * 1000 +
                  minutes * 60 * 1000
              );
              setEndTime(newEndTime);

              const diffInMs = newEndTime.getTime() - startTime.getTime();
              const diffInHours = diffInMs / (1000 * 60 * 60);
              const totalSleepTime = `${Math.floor(diffInHours)}h${Math.round(
                (diffInHours - Math.floor(diffInHours)) * 60
              )}mins`;
              setSleepHours(totalSleepTime);
            }
          }}
          minimumTrackTintColor="#1FB28A"
          maximumTrackTintColor="#d3d3d3"
        />
        {/* Sleep Quality */}
        <Text className="text-xl mt-4 mx-2 text-center">
          Did you sleep well?
        </Text>
        <View className="flex-row gap-x-6 mt-2 justify-center">
          {moodIcons.map((moodIcon, index) => {
            const IconComponent = moodIcon.component;
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  handleMoodSelection(moodIcon.mood, moodIcon.value)
                }
              >
                <IconComponent
                  name={moodIcon.name}
                  size={30}
                  color={
                    selectedMood === moodIcon.mood
                      ? iconColors[moodIcon.mood]
                      : "black"
                  }
                />
                <Text
                  className={`text-[10px] text-center ${
                    selectedMood === moodIcon.mood
                      ? "text-blue-500"
                      : "text-black"
                  }`}
                >
                  {moodIcon.mood}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* End of Sleep Quality */}

        {/* Factors */}
        <View className="flex-row items-center px-2 justify-between">
          <Text className="text-xl">Factors</Text>
          <ToggleSwitch onToggle={handleToggle} isEnabled={isSwitchEnabled} />
        </View>
        {isSwitchEnabled && (
          <View style={{ marginTop: 10 }}>
            {Object.keys(checkboxes).map((factor) => (
              <View key={factor} className=" flex-row items-center mt-2">
                <Checkbox
                  status={checkboxes[factor] ? "checked" : "unchecked"}
                  onPress={() => handleCheckboxChange(factor)}
                />
                <View className=" flex-row items-center ml-2">
                  {factorIcons[factor].icon}
                  <Text className=" text-[16px] ml-2">
                    {factorIcons[factor].factor}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {/* End of Factors */}

        {/* Time Tracker */}
        <View className=" mt-4">
          <View className=" flex-row gap-1 mb-2">
            <MaterialCommunityIcons name="bed" size={24} color="black" />
            <Text className="text-xl">Bed Time Hours</Text>
          </View>
          <View className=" flex-row justify-between mb-2">
            <TouchableOpacity
              onPress={showStartTimePicker}
              className=" bg-green-100 p-2 rounded"
            >
              <Text className="text-lg">
                Start Time: {startTime ? format(startTime, "HH:mm") : "00:00"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={handleStartTimeConfirm}
              onCancel={hideStartTimePicker}
              is24Hour={true}
            />
            <TouchableOpacity
              onPress={showEndTimePicker}
              className=" bg-red-100 p-2 rounded"
            >
              <Text className="text-lg">
                End Time: {endTime ? format(endTime, "HH:mm") : "00:00"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={handleEndTimeConfirm}
              onCancel={hideEndTimePicker}
              is24Hour={true}
            />
          </View>
        </View>
        {/* Sync Devices and Sleep timer */}
        <View className=" justify-between flex-row mt-4">
          <TouchableOpacity
            className=" items-center flex-row"
            onPress={showTimerModal}
          >
            <MaterialCommunityIcons name="timer" size={24} color="black" />
            <Text className=" text-blue-500 "> Sleep Timer </Text>
          </TouchableOpacity>

          {/* Sleep timer modal */}
          <Modal
            visible={isTimerVisible}
            onRequestClose={() => setIsTimerVisible(false)}
            transparent={true}
          >
            <View className="flex-1 justify-center items-center ">
              <View className="w-[80%] h-[150px] justify-center items-center bg-black p-4 rounded-xl">
                <Text className="text-4xl text-white mb-3">
                  {formatTime(timer)}
                </Text>
                <View className="flex-row justify-center mt-4 gap-2">
                  {!timerRunning && (
                    <TouchableOpacity
                      onPress={() => {
                        setTimer(0);
                        setTimerRunning(true);
                      }}
                    >
                      <Text className="text-blue-500 p-2 border border-blue-500 rounded-xl">
                        Start
                      </Text>
                    </TouchableOpacity>
                  )}
                  {timerRunning && (
                    <TouchableOpacity onPress={stopTimer}>
                      <Text className="text-red-500 p-2 border border-red-500 rounded-xl">
                        Stop
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={resetTimer}>
                    <Text className="text-gray-500 p-2 border border-gray-500 rounded-xl">
                      Reset
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className=" ">
                  <TouchableOpacity onPress={() => setIsTimerVisible(false)}>
                    <Text className=" text-white mt-6">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* End of Sleep timer modal */}

          <TouchableOpacity className=" items-center flex-row">
            <MaterialIcons name="sync" size={24} color="black" />
            <Text className=" text-blue-500 ">Sync Device</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notes */}
      {/* <View className="mt-4">
        <Text className="text-lg">Note:</Text>
        <TextInput
          className="border border-black p-2 my-1 rounded"
          placeholder="Write Something..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View> */}
      <Note notes={notes} setNotes={setNotes} />
      {/* End Of Notes */}
      {/* Save Log Entry */}
      <TouchableOpacity className="mt-4" onPress={saveSleepLogEntry}>
        <Text className="bg-blue-500 p-3 text-center rounded-xl text-white">
          Save Log
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
