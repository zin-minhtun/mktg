import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../Contexts/ThemeContext";

export default function TimePicker() {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // Function to handle time change
  const onChange = (event, selectedTime) => {
    if (event.type === "set") {
      // Only update if time was set (not dismissed)
      const currentTime = selectedTime || time;
      setTime(currentTime);
    }
    setShowPicker(false); // Close the picker after selection
  };

  // Format time for display
  const formattedTime = time
    ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:-- --";

  return (
    <View className="flex-1 justify-center items-center">
        <View className="flex-row items-center w-full justify-between">
         <Text style={{ color: theme.textColor }} className="text-base">Time</Text>
      <TouchableOpacity
        style={{ borderColor: theme.borderColor, backgroundColor: theme.textFieldBG }}
        className="flex-row items-center justify-between border rounded-lg py-2 px-3 space-x-8"
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: theme.textColor }} className="text-base">{formattedTime}</Text>
        <Ionicons name="time-outline" size={24} color={theme.textColor} />
      </TouchableOpacity>
      </View>

      {/* Show the DateTimePicker only when needed */}
      {showPicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="spinner"
          onChange={onChange}
          is24Hour={false} // Set to false for 12-hour format
        />
      )}
    </View>
  );
}

