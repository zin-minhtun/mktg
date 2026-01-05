import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Entypo,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Slider from "@react-native-community/slider";
import { SegmentedButtons } from "react-native-paper";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../Contexts/UserContext";
import ToggleSwitch from "../Switch/ToggleSwitch";
import { Checkbox } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Note from "../Memo/Note";
import { useTheme } from "../../Contexts/ThemeContext";

/*******Notes*******/
// TOADD: Factors depending on the mood
// Optional: Disabling AM PM or Night
// FIXME: Theme colors for buttons

// Presets Data of Mood
const moodIcons = [
  {
    component: MaterialCommunityIcons,
    name: "emoticon-angry-outline",
    mood: "Terrible",
    value: 1,
  },
  {
    component: Entypo,
    name: "emoji-sad",
    mood: "Bad",
    value: 2,
  },
  {
    component: MaterialCommunityIcons,
    name: "emoticon-neutral-outline",
    mood: "Neutral",
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

export default function Mood() {
  const { theme } = useTheme();

  const getPositiveMoodIcons = (color) => ({
    Joy: {
      icon: <FontAwesome5 name="grin" size={24} color={color} />,
      feeling: "Joy",
    },
    Excitement: {
      icon: <FontAwesome5 name="grin-stars" size={24} color={color} />,
      feeling: "Excitement",
    },
    Gratitude: {
      icon: <FontAwesome5 name="praying-hands" size={24} color={color} />,
      feeling: "Gratitude",
    },
    Contentment: {
      icon: <FontAwesome5 name="smile" size={24} color={color} />,
      feeling: "Contentment",
    },
    Love: {
      icon: <FontAwesome5 name="heart" size={24} color={color} />,
      feeling: "Love",
    },
    Amusement: {
      icon: <FontAwesome5 name="laugh-squint" size={24} color={color} />,
      feeling: "Amusement",
    },
    Hope: {
      icon: <FontAwesome5 name="hand-holding-heart" size={24} color={color} />,
      feeling: "Hope",
    },
    Pride: {
      icon: <FontAwesome5 name="trophy" size={24} color={color} />,
      feeling: "Pride",
    },
    Inspiration: {
      icon: <FontAwesome5 name="lightbulb" size={24} color={color} />,
      feeling: "Inspiration",
    },
    Satisfaction: {
      icon: <FontAwesome5 name="smile-beam" size={24} color={color} />,
      feeling: "Satisfaction",
    },
    Serenity: {
      icon: <FontAwesome5 name="spa" size={24} color={color} />,
      feeling: "Serenity",
    },
    Enthusiasm: {
      icon: <FontAwesome5 name="rocket" size={24} color={color} />,
      feeling: "Enthusiasm",
    },
    Affection: {
      icon: <FontAwesome5 name="hand-holding" size={24} color={color} />,
      feeling: "Affection",
    },
    Cheerfulness: {
      icon: <FontAwesome5 name="laugh-beam" size={24} color={color} />,
      feeling: "Cheerfulness",
    },
    Optimism: {
      icon: <FontAwesome5 name="smile-wink" size={24} color={color} />,
      feeling: "Optimism",
    },
    Elation: {
      icon: <FontAwesome5 name="grin-hearts" size={24} color={color} />,
      feeling: "Elation",
    },
    Confidence: {
      icon: <FontAwesome5 name="thumbs-up" size={24} color={color} />,
      feeling: "Confidence",
    },
    Fulfillment: {
      icon: <FontAwesome5 name="check" size={24} color={color} />,
      feeling: "Fulfillment",
    },
    Delight: {
      icon: <FontAwesome5 name="grin-tongue" size={24} color={color} />,
      feeling: "Delight",
    },
  });

  const getNegativeMoodIcons = (color) => ({
    Despair: {
      icon: <FontAwesome5 name="sad-cry" size={24} color={color} />,
      feeling: "Despair",
    },
    Anguish: {
      icon: <FontAwesome5 name="sad-tear" size={24} color={color} />,
      feeling: "Anguish",
    },
    SevereAnxiety: {
      icon: <FontAwesome5 name="heartbeat" size={24} color={color} />,
      feeling: "Severe Anxiety",
    },
    Misery: {
      icon: <FontAwesome5 name="frown" size={24} color={color} />,
      feeling: "Misery",
    },
    Overwhelmed: {
      icon: <FontAwesome5 name="dizzy" size={24} color={color} />,
      feeling: "Overwhelmed",
    },
    Sad: {
      icon: <FontAwesome5 name="frown-open" size={24} color={color} />,
      feeling: "Sad",
    },
    Irritable: {
      icon: <FontAwesome5 name="angry" size={24} color={color} />,
      feeling: "Irritable",
    },
    Lonely: {
      icon: <FontAwesome5 name="meh-blank" size={24} color={color} />,
      feeling: "Lonely",
    },
    Frustrated: {
      icon: <FontAwesome5 name="grin-beam-sweat" size={24} color={color} />,
      feeling: "Frustrated",
    },
    Hopeless: {
      icon: <FontAwesome5 name="meh" size={24} color={color} />,
      feeling: "Hopeless",
    },
    Indifferent: {
      icon: <FontAwesome5 name="meh-rolling-eyes" size={24} color={color} />,
      feeling: "Indifferent",
    },
    Bored: {
      icon: <FontAwesome5 name="meh" size={24} color={color} />,
      feeling: "Bored",
    },
    Calm: {
      icon: <FontAwesome5 name="smile" size={24} color={color} />,
      feeling: "Calm",
    },
    Content: {
      icon: <FontAwesome5 name="smile-beam" size={24} color={color} />,
      feeling: "Content",
    },
    Peaceful: {
      icon: <FontAwesome5 name="peace" size={24} color={color} />,
      feeling: "Peaceful",
    },
    Apathetic: {
      icon: <FontAwesome5 name="meh-blank" size={24} color={color} />,
      feeling: "Apathetic",
    },
    Uninterested: {
      icon: <FontAwesome5 name="meh" size={24} color={color} />,
      feeling: "Uninterested",
    },
    Complacent: {
      icon: <FontAwesome5 name="smile" size={24} color={color} />,
      feeling: "Complacent",
    },
    Serene: {
      icon: <FontAwesome5 name="grin" size={24} color={color} />,
      feeling: "Serene",
    },
    Stable: {
      icon: <FontAwesome5 name="smile-wink" size={24} color={color} />,
      feeling: "Stable",
    },
  });

  const positiveMoodIcons = getPositiveMoodIcons(theme.textColor);
  const negativeMoodIcons = getNegativeMoodIcons(theme.textColor);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [notes, setNotes] = useState("");
  const [moodValue, setMoodValue] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [iconColors, setIconColors] = useState({
    Terrible: "red",
    Bad: "orange",
    Neutral: "yellow",
    Good: "green",
    Great: "blue",
  });
  const [timeOfDay, setTimeOfDay] = useState("");
  const { gUser } = useUserData();
  const userId = gUser._id;

  // Feeling
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [selectedPositiveFeelings, setSelectedPositiveFeelings] = useState([]);
  const [selectedNegativeFeelings, setSelectedNegativeFeelings] = useState([]);

  // Verify id of the current User
  useEffect(() => {
    const storedUserData = {
      userId_fromUserContext: gUser._id,
    };
    console.log("Stored User Data :", storedUserData);
  }, []);

  // Calendar for current and previous dates
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

  // Save mood log entry
  const saveLogEntry = async () => {
    // Validation if required fields are missing
    if (!selectedMood || !moodValue || !timeOfDay) {
      alert("Please select your mood, mood scale, and time of day.");
      return;
    }

    const moodEntry = {
      userId: userId,
      date: format(currentDate, "yyyy-MM-dd"),
      mood: selectedMood,
      moodScale: moodValue,
      notes: notes,
      timeOfDay: timeOfDay,
    };
    console.log("Mood log:", moodEntry);
    try {
      const response = await axios.post(`${API_URL}/api/moods/add`, moodEntry);
      console.log("Log entry saved successfully:", response.data);

      // Clear form fields after successful save
      setCurrentDate(new Date());
      setStartDate(new Date());
      setNotes("");
      setMoodValue(0);
      setSelectedMood(null);
      setTimeOfDay("");
      console.log("Form fields cleared.");
    } catch (error) {
      console.error("Error saving log entry:", error);
    }
  };

  // Mood
  const handleMoodSelection = (mood, value) => {
    setSelectedMood(mood);
    setMoodValue(value);
  };

  // Switch
  const handleToggle = (value) => {
    setIsSwitchEnabled(value);
  };

  // Checkboxes
  const handleCheckboxChange = (feelingType, feeling) => {
    if (feelingType === "negative") {
      setSelectedNegativeFeelings((prev) =>
        prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
      );
    } else if (feelingType === "positive") {
      setSelectedPositiveFeelings((prev) =>
        prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
      );
    }
  };

  const renderFeelingCheckboxes = (
    feelings,
    selectedFeelings,
    feelingType
  ) => {
    return Object.keys(feelings).map((feeling) => (
      <View key={feeling} className=" flex-row items-center my-2">
        <Checkbox
          status={selectedFeelings.includes(feeling) ? "checked" : "unchecked"}
          onPress={() => handleCheckboxChange(feelingType, feeling)}
          color={theme.primaryLighBlue}
          uncheckedColor={theme.textColor}
        />
        {feelings[feeling].icon}
        <Text className=" ml-2" style={{ color: theme.textColor }}>{feeling}</Text>
      </View>
    ));
  };

  const showNegativeFeelings = ["Terrible", "Bad", "Neutral"].includes(
    selectedMood
  );

  const showPositiveFeelings = ["Good", "Great"].includes(selectedMood);

  return (
    <ScrollView className="flex-1 px-3" style={{ backgroundColor: theme.background }}>
      {/* Date Selection */}
      <View className=" flex-row items-center justify-center mt-8">
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

      <Text className="text-center text-xl mt-4 mb-6" style={{ color: theme.textColor }}>
        How are you feeling today?
      </Text>

      {/* Time Of Day */}
      <SegmentedButtons
        className=" mb-6"
        value={timeOfDay}
        onValueChange={setTimeOfDay}
        buttons={[
          { value: "am", label: "AM", style: { backgroundColor: timeOfDay === 'am' ? theme.textFieldBG : theme.background } },
          { value: "pm", label: "PM", style: { backgroundColor: timeOfDay === 'pm' ? theme.textFieldBG : theme.background } },
          { value: "night", label: "Night", style: { backgroundColor: timeOfDay === 'night' ? theme.textFieldBG : theme.background } },
        ]}
        theme={{
          colors: {
            secondaryContainer: theme.primaryLighBlue,
            onSecondaryContainer: theme.mode === 'dark' ? '#fff' : '#000',
            outline: theme.borderColor
          },
        }}
      />
      {/* End of Time Of Day */}

      {/* Mood Selection */}
      <View className="p-3 rounded-lg" style={{ backgroundColor: theme.textFieldBG }}>
        <View className="flex-row m-4 pl-5 gap-9 justify-center">
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
                      : theme.textColor
                  }
                />
                <Text
                  className="text-[10px] text-center"
                  style={{
                    color: selectedMood === moodIcon.mood ? "rgb(59, 130, 246)" : theme.textColor
                  }}
                >
                  {moodIcon.mood}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Slider
          className=" w-100 h-[40px] mt-4"
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={moodValue}
          onValueChange={(value) => {
            const mood = moodIcons.find((icon) => icon.value === value).mood;
            handleMoodSelection(mood, value);
          }}
          minimumTrackTintColor="#1FB28A"
          maximumTrackTintColor={theme.borderColor || "#d3d3d3"}
        />
        {selectedMood && (
          <Text className="text-center text-lg mt-2" style={{ color: theme.textColor }}>
            Mood Rating:{" "}
            <Text style={{ color: iconColors[selectedMood] }}>
              {moodValue}/5 {selectedMood}
            </Text>
          </Text>
        )}
      </View>
      {/* End Of Mood Selection */}

      {/* Feeling Selection */}
      <View className="p-3 rounded-lg mt-5" style={{ backgroundColor: theme.textFieldBG }}>
        <View className=" flex-row justify-between p-2 items-center">
          <Text className="text-lg font-semibold " style={{ color: theme.textColor }}>Feelings:</Text>
          <ToggleSwitch isEnabled={isSwitchEnabled} onToggle={handleToggle} />
        </View>
        {isSwitchEnabled && showNegativeFeelings && (
          <View className="flex-row flex-wrap justify-evenly items-center px-2">
            {renderFeelingCheckboxes(
              negativeMoodIcons,
              selectedNegativeFeelings,
              "negative"
            )}
          </View>
        )}

        {isSwitchEnabled && showPositiveFeelings && (
          <View className="flex-row flex-wrap justify-evenly items-center px-2">
            {renderFeelingCheckboxes(
              positiveMoodIcons,
              selectedPositiveFeelings,
              "positive"
            )}
          </View>
        )}
      </View>
      {/* End of Feeling Selection */}

      {/* Notes */}
      <Note notes={notes} setNotes={setNotes} />
      {/* End of Notes */}

      {/* Save Log button */}
      <TouchableOpacity className=" mt-4 mb-4" onPress={saveLogEntry}>
        <Text className=" bg-blue-500 p-3 text-center rounded-xl text-white">
          Save Log
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
