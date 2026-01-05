import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { styled } from "nativewind";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import { API_URL } from "@env";

// Components
import Nausea from "../Symptoms/svg/Nausea";
import DailyFreqMenu from "./DailyFreqMenu";
import WeeklyFreqMenu from "./WeeklyFreqMenu";
import MonthlyFreqMenu from "./MonthlyFreqMenu";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import PainRelief from "./svg/PainRelief";
import SleepAids from "./svg/SleepAids";
import Seizure from "./svg/Seizure";
import Others from "./svg/Others";
import WaterGlass from "./svg/WaterGlass";
import Milk from "./svg/Milk";
import Salad from "./svg/Salad";
import Stomach from "./svg/Stomach";
import Anxiety from "./svg/Anxiety";
import AntiInflammatory from "./svg/AntiInflammatory";
import DatePicker from "../../sharedComponents/DatePicker";
import OneSelectDropDownPicker from "../../sharedComponents/OneSelectDropDownPicker";

//data
import dosageUnitOptions from "../../../Constants/options"

const StyledTextInput = styled(TextInput);
const symptomsData = [
  {
    id: "nauseaControl",
    name: "Nausea Control",
    icon: <Nausea />,
    color: "#BBCCED",
  },
  {
    id: "painRelief",
    name: "Pain Relief",
    icon: <PainRelief />,
    color: "#AAA8FF",
  },
  {
    id: "sleepAids",
    name: "Sleep Aids",
    icon: <SleepAids />,
    color: "#FFDB94",
  },
  {
    id: "antiSeizure",
    name: "Anti-seizure",
    icon: <Seizure />,
    color: "#F8C6C6",
  },
  {
    id: "anxiety",
    name: "Anxiety",
    icon: <Anxiety />,
    color: "#FFA88C",
  },
  {
    id: "anti-inflammatory",
    name: "Anti-\nInflammatory",
    icon: <AntiInflammatory />,
    color: "#BBE1ED",
  },
  {
    id: "others",
    name: "Others",
    icon: <Others />,
    color: "#EDECF4",
  },
];

const AddMedicationDetails = ({ navigation, route }) => {
  const [otherSymptomNote, setOtherSymptomNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { theme } = useTheme();

  const { medication } = route.params || {}; // Get medication if editing
  const isEditing = !!medication;

  // Initialize form with existing data if editing, or defaults
  const [form, setForm] = useState({
    name: medication?.medicationName || '',
    dosage: {
      value: medication?.dosage || null,
      unit: medication?.unit || 'mg'
    },
    frequency: {
      type: medication?.frequency || 'daily',
      days: [],
      dayOfMonth: null
    },
    duration: {
      start: medication?.startDate ? medication.startDate.split('T')[0] : (() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      end: medication?.expirationDate ? medication.expirationDate.split('T')[0] : null
    },
    instructions: [], // Will populate from mealTiming below
    reminder: {
      enabled: !!medication?.reminderTime,
      time: medication?.reminderTime || ''
    },
  });

  const { gUser } = useUserData();

  // Populate instructions from legacy/mealTiming on mount
  useEffect(() => {
    if (medication) {
      const newInstructions = [];
      if (medication.mealTiming === 'With Food') newInstructions.push('with_food');
      if (medication.mealTiming === 'Empty Stomach') newInstructions.push('empty_stomach');
      // Add others if your backend stores them
      setForm(prev => ({ ...prev, instructions: newInstructions }));
    }
  }, [medication]);

  const options = [
    { id: "water", label: "With water", icon: <WaterGlass /> },
    { id: "milk", label: "With milk", icon: <Milk /> },
    { id: "food", label: "With food", icon: <Salad /> },
    { id: "empty_stomach", label: "Empty stomach", icon: <Stomach /> },
  ];

  const medicationNameHandler = (newValue) => {
    setForm((f) => ({ ...f, name: newValue }));
  };

  const medicationDosageHandler = (text) => {
    const cleaned = String(text).replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    let normalized = parts[0];
    if (parts.length > 1) {
      normalized += "." + parts[1].slice(0, 3);
    }
    if (normalized.length > 10) normalized = normalized.slice(0, 10);
    const num = normalized === "" ? null : Number(normalized);
    setForm((f) => ({ ...f, dosage: { ...f.dosage, value: num } }));
  };

  const handleSymptomSelect = (id) => {
    setSelectedCategory(prev => prev === id ? null : id);
  };

  const toggleSwitch = () => {
    setForm((f) => ({
      ...f,
      reminder: { enabled: !f.reminder.enabled, time: !f.reminder.enabled ? f.reminder.time : '' },
    }));
  };

  const formatDateLocal = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (date) => {
    const dateStr = formatDateLocal(date);
    setForm((f) => {
      // If end date exists and is before new start date, reset end date or error?
      // User asked to validate startDate <= endDate.
      let newEnd = f.duration.end;
      if (newEnd && newEnd < dateStr) {
        newEnd = null; // Reset end date if invalid
      }
      return { ...f, duration: { ...f.duration, start: dateStr, end: newEnd } };
    });
  };

  const handleEndDateChange = (date) => {
    const dateStr = formatDateLocal(date);
    setForm((f) => ({ ...f, duration: { ...f.duration, end: dateStr } }));
  };

  const handleTimeChange = (date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    setForm((f) => ({ ...f, reminder: { ...f.reminder, time: `${hh}:${mm}` } }));
  };

  // Frequency
  const setFrequencyType = (type) => {
    setForm((f) => ({
      ...f,
      frequency: { ...f.frequency, type },
    }));
  };

  const toggleDay = (day) => {
    setForm((f) => {
      const days = f.frequency.days.includes(day)
        ? f.frequency.days.filter(d => d !== day)
        : [...f.frequency.days, day];
      return { ...f, frequency: { ...f.frequency, days } };
    });
  };

  const setDayOfMonth = (num) => {
    setForm((f) => ({ ...f, frequency: { ...f.frequency, dayOfMonth: num } }));
  };

  // Validation
  const todayIso = new Date().toISOString().slice(0, 10);

  const dosageError = useMemo(() => {
    const v = form.dosage.value;
    if (v === null || v === undefined) return null; // Don't show error while typing empty initially? Or show if touched.
    if (Number.isNaN(v) || v <= 0) return 'Enter a valid number greater than 0';
    return null;
  }, [form.dosage.value]);

  const durationError = useMemo(() => {
    const { start, end } = form.duration;
    if (!start) return 'Start date is required';
    if (end && start > end) return 'End date cannot be before start date';
    return null;
  }, [form.duration]);

  const isValid =
    form.name.length >= 2 &&
    form.dosage.value > 0 &&
    form.duration.start &&
    (!form.duration.end || form.duration.start <= form.duration.end) &&
    (!form.reminder.enabled || form.reminder.time);

  const SaveHandler = async () => {
    // 1. Validate
    if (!form.name) return alert("Please enter medication name");
    if (!form.dosage.value) return alert("Please enter dosage");
    if (form.reminder.enabled && !form.reminder.time) return alert("Please select a reminder time");
    if (durationError) return alert(durationError);

    // 2. Prepare Payload
    let mealTiming = null;
    if (form.instructions.includes('with_food')) mealTiming = 'With Food';
    else if (form.instructions.includes('empty_stomach')) mealTiming = 'Empty Stomach';

    const payload = {
      name: form.name,
      dosage: form.dosage.value,
      unit: form.dosage.unit,
      time: form.reminder.enabled ? form.reminder.time : null,
      repeat: form.frequency.type,
      startDate: form.duration.start,
      endDate: form.duration.end,
      mealTiming: mealTiming,
      userId: gUser._id,
    };

    console.log('FINAL PAYLOAD', payload);

    try {
      if (isEditing) {
        // Update existing
        const updatePayload = { ...payload, medId: medication._id };
        const response = await axios.put(`${API_URL}/api/meds/update`, updatePayload);
        console.log('Medication updated successfully:', response.data);
        alert('Medication updated successfully!');
      } else {
        // Create new
        const response = await axios.post(`${API_URL}/api/meds/add`, payload);
        console.log('Medication added successfully:', response.data);
        alert('Medication added successfully!');
      }
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.error('Error response from backend:', error.response.data);
        alert(`Error: ${error.response.data.message || "Failed to save"}`);
      } else {
        console.error('Error:', error.message);
        alert('Failed to connect to server');
      }
    }
  };

  return (
    <View className="flex-1 mt-10" style={{ backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Helper: Symptom Icons scroll view (unchanged logic, simplified render) */}
        <View className="pt-8 mt-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row mx-2">
              {symptomsData.map((symptom) => (
                <View className="items-center w-28 mb-4" key={symptom.id}>
                  <TouchableOpacity
                    onPress={() => handleSymptomSelect(symptom.id)}
                    className={`rounded-full w-20 h-20 justify-center items-center ${selectedCategory === symptom.id
                      ? "border-2 border-primaryBlue"
                      : ""
                      }`}
                    style={{ backgroundColor: symptom.color }}
                  >
                    {symptom.icon}
                  </TouchableOpacity>
                  <Text className="font-raleway font-semibold text-[14px] pt-2 text-center" style={{ color: selectedCategory === symptom.id ? theme.textColor : theme.darkGrey }}>
                    {symptom.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="mx-3">
          {/* Name */}
          <View className="mt-5">
            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
              Medication Name
            </Text>
            <StyledTextInput
              className="font-raleway text-[16px] border rounded-lg p-2 px-5 py-3"
              style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }}
              placeholder="Name of medication"
              placeholderTextColor={theme.darkGrey}
              value={form.name}
              onChangeText={medicationNameHandler}
            />
          </View>

          {/* Dosage & Unit */}
          <View className="flex-row mt-6">
            <View className="flex-1 mr-4">
              <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                Dosage
              </Text>
              <StyledTextInput
                className="font-raleway text-[16px] border rounded-lg p-2 px-5 py-3"
                style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }}
                placeholder="Dosage"
                placeholderTextColor={theme.darkGrey}
                keyboardType="numeric"
                value={form.dosage.value === null ? "" : String(form.dosage.value)}
                onChangeText={medicationDosageHandler}
              />
              {!!dosageError && <Text className="text-red-500 text-xs mt-1">{dosageError}</Text>}
            </View>
            <View className="flex-1">
              <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                Unit
              </Text>
              <OneSelectDropDownPicker
                placeHolder={form.dosage.unit || "Unit"}
                optionList={dosageUnitOptions}
                onChange={(val) => setForm(f => ({ ...f, dosage: { ...f.dosage, unit: val } }))}
              />
            </View>
          </View>

          {/* Frequency */}
          <View className="mt-6">
            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>Medication Frequency</Text>
            <View className="flex-row border rounded-lg overflow-hidden" style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}>
              {["daily", "weekly", "monthly"].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  className={`flex-1 py-3 items-center`}
                  style={{
                    backgroundColor: form.frequency.type === opt
                      ? theme.primaryLighBlue
                      : 'transparent',
                  }}
                  onPress={() => setFrequencyType(opt)}
                >
                  <Text
                    className="font-raleway"
                    style={{
                      color: form.frequency.type === opt
                        ? '#FFFFFF'
                        : theme.darkGrey,
                      fontFamily: form.frequency.type === opt
                        ? 'RalewaySemiBold'
                        : 'Raleway'
                    }}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Sub-menus for frequency */}
            {form.frequency.type === 'daily' && <View className="pt-6"><DailyFreqMenu /></View>}
            {form.frequency.type === 'weekly' && <View className="pt-6"><WeeklyFreqMenu days={form.frequency.days} onToggleDay={toggleDay} /></View>}
            {form.frequency.type === 'monthly' && <View className="pt-6"><MonthlyFreqMenu dayOfMonth={form.frequency.dayOfMonth} onChange={(t) => setDayOfMonth(parseInt(t) || null)} /></View>}
          </View>

          {/* Duration (Start/End Date) */}
          <View className="mt-6">
            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
              Medication Duration
            </Text>
            <View className="flex flex-row space-x-4">
              <View className="flex-1 mr-4">
                <Text className="text-xs mb-1" style={{ color: theme.darkGrey }}>Start Date</Text>
                <DatePicker
                  value={form.duration.start}
                  onChange={handleStartDateChange}
                  placeholder="Start Date"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs mb-1" style={{ color: theme.darkGrey }}>End Date (Optional)</Text>
                <DatePicker
                  value={form.duration.end}
                  onChange={handleEndDateChange}
                  placeholder="End Date"
                  minimumDate={form.duration.start ? new Date(form.duration.start) : undefined}
                />
              </View>
            </View>
            {!!durationError && <Text className="text-red-500 font-raleway mt-2">{durationError}</Text>}
          </View>

          {/* Instructions */}
          <View className="mt-6">
            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>How to take it</Text>
            <View className="flex flex-row flex-wrap">
              {options.map((option) => {
                const keyMap = { water: 'with_water', milk: 'with_milk', food: 'with_food', empty_stomach: 'empty_stomach' };
                const value = keyMap[option.id] || option.id;
                const selected = form.instructions.includes(value);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => {
                      setForm(f => {
                        let newInst = selected ? f.instructions.filter(i => i !== value) : [...f.instructions, value];
                        // Logic: food excludes empty stomach
                        if (value === 'with_food' && !selected) newInst = newInst.filter(i => i !== 'empty_stomach');
                        if (value === 'empty_stomach' && !selected) newInst = newInst.filter(i => i !== 'with_food');
                        return { ...f, instructions: newInst };
                      })
                    }}
                    className={`border rounded-lg px-3 mr-3 mb-3 ${selected ? 'bg-primaryLightBlue border-primaryBlue' : ''}`}
                    style={!selected ? { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor } : undefined}
                  >
                    <View className="flex flex-row items-center py-2">
                      <View className="mr-2">{option.icon}</View>
                      <Text className="font-raleway text-[16px]" style={{ color: theme.darkGrey }}>{option.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Reminder */}
          <View className="mt-6 flex-row justify-between items-center">
            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>Set Reminder</Text>
            <Switch
              value={form.reminder.enabled}
              onValueChange={toggleSwitch}
              trackColor={{ false: "#767577", true: "#00b8df" }}
            />
          </View>
          {form.reminder.enabled && (
            <View className="mt-2">
              <Text className="text-xs mb-1" style={{ color: theme.darkGrey }}>Time</Text>
              <DatePicker
                mode="time"
                value={form.reminder.time ? new Date(`2000-01-01T${form.reminder.time}:00`) : null}
                onChange={handleTimeChange}
                placeholder="Select Time"
              />
            </View>
          )}
        </View>

        <View className="absolute bottom-10 px-3 left-0 right-0">
          <TouchableOpacity
            className={`w-full py-4 rounded-full ${isValid ? 'bg-primaryBlue' : 'bg-gray-300'}`}
            onPress={SaveHandler}
            disabled={!isValid}
          >
            <Text className="text-center text-white font-ralewaySemiBold text-[16px]">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddMedicationDetails;

