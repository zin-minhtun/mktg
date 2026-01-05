import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../Contexts/ThemeContext";
import DropdownPicker from "../../Components/Settings/DropdownPicker";

export default function AddSchedule({ navigation, route }) {
  const { theme } = useTheme();
  const type = route?.params?.type || "Medication";

  const [time, setTime] = useState(() => new Date());
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === "ios");

  // Repeat state
  const repeatOptions = ["Never", "Hourly", "Daily", "Weekly", "Custom"];
  const [repeatType, setRepeatType] = useState("Never");
  const [hourlyInterval, setHourlyInterval] = useState(1);
  const [weeklyDays, setWeeklyDays] = useState(new Set()); // Mon..Sun
  const [customString, setCustomString] = useState("");

  // Medication-only fields
  const isMedication = type === "Medication";
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("Tablet");
  const unitOptions = useMemo(
    () => [
      { label: "Tablet", value: "Tablet" },
      { label: "Capsule", value: "Capsule" },
      { label: "mL", value: "mL" },
      { label: "mg", value: "mg" },
      { label: "Injection", value: "Injection" },
    ],
    []
  );
  const [mealTiming, setMealTiming] = useState("Before Meal"); // Before/With/After Meal

  const Section = ({ children, style }) => (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: theme.borderColor,
          borderRadius: 8,
          backgroundColor: theme.textFieldBG,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  const Row = ({ children, isLast, style }) => (
    <View
      style={[
        {
          minHeight: 44,
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  const DayPill = ({ label }) => {
    const selected = weeklyDays.has(label);
    return (
      <Pressable
        onPress={() => {
          const next = new Set(weeklyDays);
          if (next.has(label)) next.delete(label);
          else next.add(label);
          setWeeklyDays(next);
        }}
        accessibilityRole="button"
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: selected ? theme.textColor : theme.borderColor,
          backgroundColor: selected ? theme.background : theme.textFieldBG,
          marginRight: 8,
          marginBottom: 8,
        }}
      >
        <Text style={{ color: theme.textColor, fontSize: 14 }}>{label}</Text>
      </Pressable>
    );
  };

  const RepeatChoice = ({ label }) => {
    const selected = repeatType === label;
    return (
      <Pressable
        onPress={() => setRepeatType(label)}
        accessibilityRole="button"
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: selected ? theme.textColor : theme.borderColor,
          backgroundColor: selected ? theme.background : theme.textFieldBG,
          marginRight: 8,
          marginBottom: 8,
        }}
      >
        <Text style={{ color: theme.textColor, fontSize: 14 }}>{label}</Text>
      </Pressable>
    );
  };

  const Radio = ({ label, selected, onPress }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        minHeight: 44,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
      }}
    >
      <Text style={{ color: theme.textColor, fontSize: 16 }}>{label}</Text>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: theme.textColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.textColor,
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );

  const formatHHmm = (d) => {
    const hh = `${d.getHours()}`.padStart(2, "0");
    const mm = `${d.getMinutes()}`.padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const computeNextOccurrenceISO = (base) => {
    const now = new Date();
    const next = new Date();
    next.setHours(base.getHours(), base.getMinutes(), 0, 0);
    if (next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    return next.toISOString();
  };

  const onChangeTime = (_, selectedDate) => {
    if (Platform.OS !== "ios") setShowTimePicker(false);
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  const handleAdd = async () => {
    if (!time) {
      Alert.alert("Time required", "Please select a time.");
      return;
    }
    if (isMedication && !medicineName.trim()) {
      Alert.alert("Medicine required", "Please enter medicine name.");
      return;
    }
    if (repeatType === "Custom" && !customString.trim()) {
      Alert.alert("Custom repeat", "Please enter a summary string.");
      return;
    }
    if (repeatType === "Weekly" && weeklyDays.size === 0) {
      Alert.alert("Weekly repeat", "Please choose at least one day.");
      return;
    }

    const timeISO = computeNextOccurrenceISO(time);
    const timeStr = formatHHmm(time);

    let repeat = null;
    switch (repeatType) {
      case "Never":
        repeat = "Never";
        break;
      case "Hourly":
        repeat = Number(hourlyInterval) || 1; // numeric for summary
        break;
      case "Daily":
        repeat = "Daily";
        break;
      case "Weekly":
        repeat = `Weekly ${Array.from(weeklyDays).join(",")}`;
        break;
      case "Custom":
        repeat = customString.trim();
        break;
      default:
        repeat = "Never";
    }

    const schedule = {
      id: `${Date.now()}`,
      type,
      timeISO,
      time: timeStr,
      repeat,
      meta: isMedication
        ? {
            name: medicineName.trim(),
            dosage: dosage ? String(dosage).trim() : "",
            unit,
            mealTiming,
            days:
              repeatType === "Weekly" ? Array.from(weeklyDays) : undefined,
          }
        : {
            days:
              repeatType === "Weekly" ? Array.from(weeklyDays) : undefined,
          },
    };

    const key = `reminders:${type}`;
    try {
      const raw = await AsyncStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      const existing = Array.isArray(parsed.schedules) ? parsed.schedules : [];
      const next = { ...parsed, schedules: [...existing, schedule] };
      await AsyncStorage.setItem(key, JSON.stringify(next));
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Could not save schedule. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Time Picker */}
        <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 8 }}>
          Time
        </Text>
        <Section>
          <Row isLast>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour
                display="spinner"
                onChange={onChangeTime}
                themeVariant={theme.background === "#00192F" ? "dark" : "light"}
                style={{ alignSelf: "stretch" }}
              />
            ) : (
              <Pressable
                onPress={() => setShowTimePicker(true)}
                accessibilityRole="button"
                style={{
                  minHeight: 44,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: theme.textColor, fontSize: 16 }}>
                  {formatHHmm(time)}
                </Text>
                <Text style={{ color: theme.darkGrey, fontSize: 14 }}>
                  Change
                </Text>
              </Pressable>
            )}
          </Row>
        </Section>
        {showTimePicker && Platform.OS !== "ios" && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour
            display="default"
            onChange={onChangeTime}
          />
        )}

        {/* Repeat */}
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 8 }}>
            Repeat
          </Text>
          <Section>
            <Row isLast>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {repeatOptions.map((opt) => (
                  <RepeatChoice key={opt} label={opt} />
                ))}
              </View>
            </Row>
          </Section>

          {repeatType === "Hourly" && (
            <Section style={{ marginTop: 12 }}>
              <Row isLast>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {[1, 2, 3].map((n) => {
                    const selected = hourlyInterval === n;
                    return (
                      <Pressable
                        key={n}
                        onPress={() => setHourlyInterval(n)}
                        accessibilityRole="button"
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: selected
                            ? theme.textColor
                            : theme.borderColor,
                          backgroundColor: selected
                            ? theme.background
                            : theme.textFieldBG,
                          marginRight: 8,
                        }}
                      >
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>
                          {n} hour{n > 1 ? "s" : ""}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Row>
            </Section>
          )}

          {repeatType === "Weekly" && (
            <Section style={{ marginTop: 12 }}>
              <Row isLast>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <DayPill key={d} label={d} />
                    )
                  )}
                </View>
              </Row>
            </Section>
          )}

          {repeatType === "Custom" && (
            <Section style={{ marginTop: 12 }}>
              <Row isLast>
                <TextInput
                  value={customString}
                  onChangeText={setCustomString}
                  placeholder="e.g., Mon,Wed,Fri 09:00"
                  placeholderTextColor={theme.darkGrey}
                  style={{
                    color: theme.textColor,
                    borderWidth: 1,
                    borderColor: theme.borderColor,
                    backgroundColor: theme.background,
                    borderRadius: 8,
                    padding: 12,
                  }}
                />
              </Row>
            </Section>
          )}
        </View>

        {/* Medication extras */}
        {isMedication && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 8 }}>
              Medication Details
            </Text>
            <Section>
              <Row>
                <Text style={{ color: theme.textColor, marginBottom: 6 }}>
                  Medicine Name
                </Text>
                <TextInput
                  value={medicineName}
                  onChangeText={setMedicineName}
                  placeholder="e.g., Amoxicillin"
                  placeholderTextColor={theme.darkGrey}
                  style={{
                    color: theme.textColor,
                    borderWidth: 1,
                    borderColor: theme.borderColor,
                    backgroundColor: theme.background,
                    borderRadius: 8,
                    padding: 12,
                  }}
                />
              </Row>

              <Row>
                <Text style={{ color: theme.textColor, marginBottom: 6 }}>
                  Dosage
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    value={dosage}
                    onChangeText={(t) => setDosage(t.replace(/[^0-9.]/g, ""))}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={theme.darkGrey}
                    style={{
                      color: theme.textColor,
                      borderWidth: 1,
                      borderColor: theme.borderColor,
                      backgroundColor: theme.background,
                      borderRadius: 8,
                      padding: 12,
                      marginRight: 8,
                      width: 100,
                    }}
                  />
                  <DropdownPicker
                    selectedValue={unit}
                    onValueChange={(v) => setUnit(v)}
                    items={unitOptions}
                    label="Unit"
                  />
                </View>
              </Row>

              <Row isLast>
                <Text style={{ color: theme.textColor, marginBottom: 6 }}>
                  When
                </Text>
                <View>
                  <Radio
                    label="Before Meal"
                    selected={mealTiming === "Before Meal"}
                    onPress={() => setMealTiming("Before Meal")}
                  />
                  <Radio
                    label="With Meal"
                    selected={mealTiming === "With Meal"}
                    onPress={() => setMealTiming("With Meal")}
                  />
                  <View style={{ borderBottomWidth: 0 }}>
                    <Radio
                      label="After Meal"
                      selected={mealTiming === "After Meal"}
                      onPress={() => setMealTiming("After Meal")}
                    />
                  </View>
                </View>
              </Row>
            </Section>
          </View>
        )}

        {/* Action */}
        <Pressable
          onPress={handleAdd}
          accessibilityRole="button"
          style={{
            marginTop: 24,
            alignSelf: "stretch",
            paddingVertical: 14,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: theme.textFieldBG,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.textColor, fontSize: 16 }}>Add Reminder</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
