import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../Contexts/UserContext";
import { Picker } from "@react-native-picker/picker";
import Note from "../Memo/Note";
import { useTheme } from "../../Contexts/ThemeContext";

export default function BodyComposition() {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [weight, setWeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [heightM, setHeightM] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [notes, setNotes] = useState('');
  const [isMetric, setIsMetric] = useState(true);
  const [measurementMethod, setMeasurementMethod] = useState("weight");
  const [bodyFatPercentage, setBodyFatPercentage] = useState(null);

  const { gUser } = useUserData();
  const userId = gUser._id;

  useEffect(() => {
    if (
      measurementMethod !== "weight" &&
      (isMetric ? heightM && heightCm : heightFt && heightIn) &&
      weight &&
      neck &&
      waist &&
      (measurementMethod === "2-part" ||
        (measurementMethod === "3-part" && hips))
    ) {
      const bodyFatPercentage = calculateBodyFatPercentage();
      setBodyFatPercentage(bodyFatPercentage);
    } else {
      setBodyFatPercentage(null);
    }
  }, [
    heightM,
    heightCm,
    heightFt,
    heightIn,
    weight,
    neck,
    waist,
    hips,
    isMetric,
    measurementMethod,
  ]);

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

  const calculateBodyFatPercentage = () => {
    let height = parseFloat(heightCm);
    if (isMetric) {
      height = parseFloat(heightM) * 100 + parseFloat(heightCm);
    } else {
      height = parseFloat(heightFt) * 12 + parseFloat(heightIn);
      height = height * 2.54;
    }

    let bodyFatPercentage = 0;
    if (isMetric) {
      if (measurementMethod === "2-part") {
        bodyFatPercentage =
          495 /
          (1.0324 -
            0.19077 * Math.log10(waist - neck) +
            0.15456 * Math.log10(height)) -
          450;
      } else {
        bodyFatPercentage =
          495 /
          (1.29579 -
            0.35004 * Math.log10(waist + hips - neck) +
            0.221 * Math.log10(height)) -
          450;
      }
    } else {
      let waistCm = waist * 2.54;
      let neckCm = neck * 2.54;
      let hipsCm = hips * 2.54;

      if (measurementMethod === "2-part") {
        bodyFatPercentage =
          495 /
          (1.0324 -
            0.19077 * Math.log10(waistCm - neckCm) +
            0.15456 * Math.log10(height)) -
          450;
      } else {
        bodyFatPercentage =
          495 /
          (1.29579 -
            0.35004 * Math.log10(waistCm + hipsCm - neckCm) +
            0.221 * Math.log10(height)) -
          450;
      }
    }

    return bodyFatPercentage.toFixed(2);
  };

  const getBodyFatPercentageColorMen = (percentage) => {
    switch (true) {
      case percentage <= 2:
        return "#ff0000"; // Critical
      case percentage <= 6:
        return "#FFFF00"; // Essential
      case percentage <= 14:
        return "#00FF00"; // Athlete
      case percentage <= 18:
        return "#008000"; // Fitness
      case percentage <= 23:
        return "#FFD700"; // Average
      case percentage <= 25:
        return "#FFA500"; // Overweight
      default:
        return "#A52A2A"; // Obese
    }
  };

  const getBodyFatPercentageColorWomen = (percentage) => {
    switch (true) {
      case percentage <= 10:
        return "#ff0000"; // Critical
      case percentage <= 14:
        return "#FFFF00"; // Essential
      case percentage <= 21:
        return "#00FF00"; // Athlete
      case percentage <= 25:
        return "#008000"; // Fitness
      case percentage <= 30:
        return "#FFD700"; // Average
      case percentage <= 32:
        return "#FFA500"; // Overweight
      default:
        return "#A52A2A"; // Obese
    }
  };

  const validateInputs = () => {
    if (measurementMethod === "weight") {
      if (!weight) {
        Alert.alert("Error", "Weight is required.");
        return false;
      }
    } else {
      if (
        !weight ||
        !neck ||
        !waist ||
        (measurementMethod === "3-part" && !hips) ||
        (isMetric ? !heightM || !heightCm : !heightFt || !heightIn)
      ) {
        Alert.alert(
          "Error",
          "All fields are required for the selected measurement method."
        );
        return false;
      }
    }

    if (measurementMethod !== "weight") {
      const bodyFatPercentage = calculateBodyFatPercentage();
      if (bodyFatPercentage <= 0) {
        Alert.alert("Error", "The entered values are not valid.");
        return false;
      }
    }

    return true;
  };

  const handleLogEntry = async () => {
    if (!validateInputs()) {
      return;
    }

    let height = parseFloat(heightCm);
    let weightMetric = parseFloat(weight);
    let neckMetric = parseFloat(neck);
    let waistMetric = parseFloat(waist);
    let hipsMetric = parseFloat(hips);

    if (isMetric) {
      height = parseFloat(heightM) * 100 + parseFloat(heightCm);
    } else {
      height = parseFloat(heightFt) * 30.48 + parseFloat(heightIn) * 2.54;
      weightMetric = weightMetric * 0.453592;
      neckMetric = neckMetric * 2.54;
      waistMetric = waistMetric * 2.54;
      hipsMetric = hipsMetric * 2.54;
    }

    const logEntry = {
      userId: userId,
      date: format(currentDate, "yyyy-MM-dd"),
      weight: weightMetric,
      neck: neckMetric,
      waist: waistMetric,
      hips: hipsMetric,
      height: height,
      notes: notes,
      bodyFatPercentage: bodyFatPercentage,
    };

    console.log("Body Composition log:", logEntry);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/body-compositions`,
        logEntry
      );
      console.log("Log entry saved successfully:", response.data);

      setCurrentDate(new Date());
      setStartDate(new Date());
      setWeight("");
      setNeck("");
      setWaist("");
      setHips("");
      setHeightM("");
      setHeightCm("");
      setHeightFt("");
      setHeightIn("");
      setNotes("");
      setBodyFatPercentage(null);
    } catch (error) {
      console.error(
        "Error saving log entry:",
        error.response?.data ?? error.message
      );
    }
  };

  return (
    <ScrollView className="flex-1 px-3" style={{ backgroundColor: theme.background }}>
      <View className="flex-row items-center justify-center mt-8">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <Entypo name="chevron-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <Entypo className="px-1" name="calendar" size={24} color={theme.textColor} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            display="default"
            maximumDate={startDate}
          />
        </TouchableOpacity>
        <Text className="text-center text-[16px]" style={{ color: theme.textColor }}>
          {format(currentDate, "EEEE, MMMM do, yyyy, HH:mm")}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <Text className="text-center text-xl mt-4 mb-6" style={{ color: theme.textColor }}>
        Track Your Weight and Body Fat
      </Text>

      <View className="mt-4">
        <Text className="text-lg" style={{ color: theme.textColor }}>Select Measurement System:</Text>
        <View className="border rounded overflow-hidden mt-1 mb-4"
          style={{
            borderColor: theme.borderColor || theme.textColor,
            backgroundColor: theme.textFieldBG
          }}>
          <Picker
            selectedValue={isMetric ? "metric" : "imperial"}
            style={{ height: 50, width: "100%", color: theme.textColor }}
            dropdownIconColor={theme.textColor}
            onValueChange={(itemValue) => setIsMetric(itemValue === "metric")}
          >
            <Picker.Item label="Metric (kg, cm)" value="metric" color={theme.mode === 'dark' ? '#fff' : '#000'} />
            <Picker.Item label="Imperial (lbs, inches)" value="imperial" color={theme.mode === 'dark' ? '#fff' : '#000'} />
          </Picker>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-lg" style={{ color: theme.textColor }}>Select Measurement Method:</Text>
        <View className="border rounded overflow-hidden mt-1 mb-4"
          style={{
            borderColor: theme.borderColor || theme.textColor,
            backgroundColor: theme.textFieldBG
          }}>
          <Picker
            selectedValue={measurementMethod}
            style={{ height: 50, width: "100%", color: theme.textColor }}
            dropdownIconColor={theme.textColor}
            onValueChange={(itemValue) => setMeasurementMethod(itemValue)}
          >
            <Picker.Item label="Weight" value="weight" color={theme.mode === 'dark' ? '#fff' : '#000'} />
            <Picker.Item label="2 Body Part Measurement (Men)" value="2-part" color={theme.mode === 'dark' ? '#fff' : '#000'} />
            <Picker.Item
              label="3 Body Part Measurement (Women)"
              value="3-part"
              color={theme.mode === 'dark' ? '#fff' : '#000'}
            />
          </Picker>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-lg" style={{ color: theme.textColor }}>Weight ({isMetric ? "kg" : "lbs"}):</Text>
        <TextInput
          className="border p-2 my-1 rounded"
          placeholder={`Enter weight in ${isMetric ? "kg" : "lbs"}`}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={{
            borderColor: theme.borderColor || theme.textColor,
            color: theme.textColor,
            backgroundColor: theme.textFieldBG
          }}
          placeholderTextColor={theme.darkGrey}
        />
      </View>

      {measurementMethod !== "weight" && (
        <>
          {isMetric ? (
            <View className="flex flex-row mt-4 space-x-2">
              <View className="flex-1">
                <Text className="text-lg" style={{ color: theme.textColor }}>Height (m):</Text>
                <TextInput
                  className="border p-2 my-1 rounded"
                  placeholder="Enter height in meters"
                  value={heightM}
                  onChangeText={setHeightM}
                  keyboardType="numeric"
                  style={{
                    borderColor: theme.borderColor || theme.textColor,
                    color: theme.textColor,
                    backgroundColor: theme.textFieldBG
                  }}
                  placeholderTextColor={theme.darkGrey}
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg" style={{ color: theme.textColor }}>Height (cm):</Text>
                <TextInput
                  className="border p-2 my-1 rounded"
                  placeholder="Enter height in cm"
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="numeric"
                  style={{
                    borderColor: theme.borderColor || theme.textColor,
                    color: theme.textColor,
                    backgroundColor: theme.textFieldBG
                  }}
                  placeholderTextColor={theme.darkGrey}
                />
              </View>
            </View>
          ) : (
            <View className="flex flex-row mt-4 space-x-2">
              <View className="flex-1">
                <Text className="text-lg" style={{ color: theme.textColor }}>Height (ft):</Text>
                <TextInput
                  className="border p-2 my-1 rounded"
                  placeholder="Enter height in feet"
                  value={heightFt}
                  onChangeText={setHeightFt}
                  keyboardType="numeric"
                  style={{
                    borderColor: theme.borderColor || theme.textColor,
                    color: theme.textColor,
                    backgroundColor: theme.textFieldBG
                  }}
                  placeholderTextColor={theme.darkGrey}
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg" style={{ color: theme.textColor }}>Height (in):</Text>
                <TextInput
                  className="border p-2 my-1 rounded"
                  placeholder="Enter height in inches"
                  value={heightIn}
                  onChangeText={setHeightIn}
                  keyboardType="numeric"
                  style={{
                    borderColor: theme.borderColor || theme.textColor,
                    color: theme.textColor,
                    backgroundColor: theme.textFieldBG
                  }}
                  placeholderTextColor={theme.darkGrey}
                />
              </View>
            </View>
          )}

          <View className="mt-4">
            <Text className="text-lg" style={{ color: theme.textColor }}>
              Neck ({isMetric ? "cm" : "inches"}):
            </Text>
            <TextInput
              className="border p-2 my-1 rounded"
              placeholder={`Enter neck circumference in ${isMetric ? "cm" : "inches"
                }`}
              value={neck}
              onChangeText={setNeck}
              keyboardType="numeric"
              style={{
                borderColor: theme.borderColor || theme.textColor,
                color: theme.textColor,
                backgroundColor: theme.textFieldBG
              }}
              placeholderTextColor={theme.darkGrey}
            />
          </View>

          <View className="mt-4">
            <Text className="text-lg" style={{ color: theme.textColor }}>
              Waist ({isMetric ? "cm" : "inches"}):
            </Text>
            <TextInput
              className="border p-2 my-1 rounded"
              placeholder={`Enter waist circumference in ${isMetric ? "cm" : "inches"
                }`}
              value={waist}
              onChangeText={setWaist}
              keyboardType="numeric"
              style={{
                borderColor: theme.borderColor || theme.textColor,
                color: theme.textColor,
                backgroundColor: theme.textFieldBG
              }}
              placeholderTextColor={theme.darkGrey}
            />
          </View>

          {measurementMethod === "3-part" && (
            <View className="mt-4">
              <Text className="text-lg" style={{ color: theme.textColor }}>
                Hips ({isMetric ? "cm" : "inches"}):
              </Text>
              <TextInput
                className="border p-2 my-1 rounded"
                placeholder={`Enter hips circumference in ${isMetric ? "cm" : "inches"
                  }`}
                value={hips}
                onChangeText={setHips}
                keyboardType="numeric"
                style={{
                  borderColor: theme.borderColor || theme.textColor,
                  color: theme.textColor,
                  backgroundColor: theme.textFieldBG
                }}
                placeholderTextColor={theme.darkGrey}
              />
            </View>
          )}

          {bodyFatPercentage > 0 && (
            <View className="mt-4">
              <Text
                className="text-lg text-center"
                style={{
                  color:
                    measurementMethod === "2-part"
                      ? getBodyFatPercentageColorMen(bodyFatPercentage)
                      : getBodyFatPercentageColorWomen(bodyFatPercentage),
                }}
              >
                Your Body Fat Percentage: {bodyFatPercentage}%
              </Text>
            </View>
          )}
        </>
      )}

      {/* Notes */}
      <View className="mt-4">
        <Text className="text-lg" style={{ color: theme.textColor }}>Notes:</Text>
        <TextInput
          className="border p-2 my-1 rounded"
          placeholder="Write any notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{
            borderColor: theme.borderColor || theme.textColor,
            color: theme.textColor,
            backgroundColor: theme.textFieldBG
          }}
          placeholderTextColor={theme.darkGrey}
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
