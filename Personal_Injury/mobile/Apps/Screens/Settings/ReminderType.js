import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ToggleSwitch from "../../Components/Switch/ToggleSwitch";
import { useTheme } from "../../Contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ReminderSyncService from "../../Services/ReminderSyncService";
import { useUserData } from "../../Contexts/UserContext";
import axios from "axios";
import { API_URL } from "@env";

export default function ReminderType({ navigation, route }) {
  const { theme } = useTheme();
  const { gUser } = useUserData();
  const type = route?.params?.type || "Medication";

  // helpers (inline)
  const minutesToLabel = (n) => {
    if (n < 60) return `${n} minutes`;
    const h = n / 60;
    return Number.isInteger(h) ? `${h} hour${h === 1 ? "" : "s"}` : `${n} minutes`;
  };
  const toAmPm = (hhmm) => {
    const parts = String(hhmm || "0:00").split(":");
    const hNum = parseInt(parts[0], 10) || 0;
    const mNum = parseInt(parts[1] || "0", 10) || 0;
    const ampm = hNum >= 12 ? "PM" : "AM";
    let h = hNum % 12;
    if (h === 0) h = 12;
    const mm = `${mNum}`.padStart(2, "0");
    return `${h}:${mm} ${ampm}`;
  };
  const formatWeekdays = (days) => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const set = new Set(days || []);
    const ordered = [0, 1, 2, 3, 4, 5, 6].filter((d) => set.has(d));
    return ordered.map((d) => labels[d]).join(", ");
  };
  const parseDailyTime = (str) => {
    const [hh, mm] = String(str || "0:00").split(":").map((x) => parseInt(x, 10));
    const d = new Date();
    d.setHours(hh || 0, mm || 0, 0, 0);
    return d;
  };
  const formatSchedule = (s) => {
    if (!s || s.kind === "none") return "No schedule";
    if (s.kind === "interval") {
      const n = Number(s.value) || 0;
      if (n < 60) return `Every ${n} minutes`;
      const h = n / 60;
      const label = Number.isInteger(h) ? `${h} hour${h === 1 ? "" : "s"}` : `${n} minutes`;
      return `Every ${label}`;
    }
    if (s.kind === "daily") return `Daily ${toAmPm(s.value)}`;
    if (s.kind === "weekly") return `Weekly ${formatWeekdays(s.days)} ${toAmPm(s.time)}`;
    return "No schedule";
  };

  const defaultState = useMemo(() => {
    switch (type) {
      case "Medication":
        return {
          enabled: false,
          message: "",
          schedule: { kind: "none", value: null },
          items: [], // No mock data - should load from journal
        };
      case "Supplement":
        return {
          enabled: false,
          message: "",
          schedule: { kind: "interval", value: 120 },
          items: [], // No mock data - should load from journal
        };
      case "Water":
        return { enabled: false, message: "", schedule: { kind: "interval", value: 60 }, items: [] };
      case "Meal":
        return { enabled: false, message: "", schedule: { kind: "interval", value: 240 }, items: [] };
      case "DailyCheckin":
        return { enabled: false, message: "", schedule: { kind: "daily", value: "19:00" }, items: [] };
      case "Sleep":
        return { enabled: false, message: "", schedule: { kind: "daily", value: "22:00" }, items: [] };
      default:
        return { enabled: false, message: "Reminder", schedule: { kind: "none", value: null }, items: [] };
    }
  }, [type]);

  const [enabled, setEnabled] = useState(defaultState.enabled);
  const [message, setMessage] = useState(defaultState.message);
  const [schedule, setSchedule] = useState(defaultState.schedule);
  const [items, setItems] = useState(defaultState.items);

  const [msgModalVisible, setMsgModalVisible] = useState(false);
  const [draftMessage, setDraftMessage] = useState(message);

  const saveTimer = useRef(null);
  const storageKey = `reminders:${type}`;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        const data = raw ? JSON.parse(raw) : {};
        if (mounted) {
          setEnabled(typeof data.enabled === "boolean" ? data.enabled : defaultState.enabled);
          const msg = typeof data.message === "string" ? data.message : defaultState.message;
          setMessage(msg);
          setDraftMessage(msg);
          setSchedule(data.schedule || defaultState.schedule);
          setItems(Array.isArray(data.items) ? data.items : defaultState.items);
        }
      } catch { }
    })();
    return () => {
      mounted = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const payload = { enabled, message, schedule, items };

        // Save to AsyncStorage (local cache)
        await AsyncStorage.setItem(storageKey, JSON.stringify(payload));

        // Sync to backend if user is logged in
        if (gUser && (gUser._id || gUser.id)) {
          const userId = gUser._id || gUser.id;
          await ReminderSyncService.saveReminder(userId, type, payload);
        }
      } catch (error) {
        console.error('[ReminderType] Error saving reminder:', error);
      }
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [enabled, message, schedule, items, storageKey, type, gUser]);

  const changedRef = useRef(false);
  useEffect(() => {
    changedRef.current = true;
  }, [enabled, message, schedule, items]);

  // Load Data from backend based on type - REFRESH ON FOCUS
  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      const fetchData = async () => {
        if (!gUser) return;
        const userId = gUser.id || gUser._id;

        try {
          if (type === 'Medication') {
            // Use specific endpoint that returns user records wrapped in { data: [...] }
            const res = await axios.get(`${API_URL}/api/meds/records/${userId}`);
            if (mounted && res.data?.data) {
              const realMeds = res.data.data.map(m => ({
                id: m._id,
                name: m.medicationName,
                subtitle: `${m.dosage} • ${m.frequency || 'Daily'}`,
                enabled: true
              }));

              setItems(prev => {
                const prevMap = new Map(prev.map(p => [p.id, p]));
                return realMeds.map(r => ({
                  ...r,
                  enabled: prevMap.has(r.id) ? prevMap.get(r.id).enabled : true
                }));
              });
            }
          }
          else if (type === 'Supplement') {
            const res = await axios.get(`${API_URL}/api/supplements`, { params: { userId } });
            // API returns array directly: [ ... ]
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);

            if (mounted && data.length >= 0) {
              const realSupps = data.map(s => ({
                id: s._id,
                name: s.name,
                subtitle: s.dosage || 'Daily',
                enabled: true
              }));

              setItems(prev => {
                const prevMap = new Map(prev.map(p => [p.id, p]));
                return realSupps.map(r => ({
                  ...r,
                  enabled: prevMap.has(r.id) ? prevMap.get(r.id).enabled : true
                }));
              });
            }
          }
        } catch (err) {
          console.log(`[ReminderType] Error fetching data for ${type}:`, err);
        }
      };

      fetchData();
      return () => { mounted = false; };
    }, [type, gUser])
  );

  const notifiedRef = useRef(false);
  useFocusEffect(
    React.useCallback(() => {
      notifiedRef.current = false;
      return () => {
        if (changedRef.current && !notifiedRef.current) {
          notifiedRef.current = true;
          navigation.navigate("RemindersHome", { refresh: Date.now() });
        }
      };
    }, [navigation])
  );

  const scheduleSummary = useMemo(() => formatSchedule(schedule), [schedule]);

  // interval options: 15/30/45 then 1h..24h
  const INTERVAL_OPTIONS = (() => {
    const mins = [15, 30, 45];
    for (let m = 60; m <= 1440; m += 60) mins.push(m);
    return mins;
  })();

  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(schedule);
  const usesInterval = type === "Water" || type === "Meal" || type === "Supplement";
  const usesDaily = type === "Sleep" || type === "DailyCheckin";
  const [checkinTab, setCheckinTab] = useState("daily");
  const [weeklyDays, setWeeklyDays] = useState(new Set());
  const [weeklyTime, setWeeklyTime] = useState(parseDailyTime("19:00"));

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

  // NEW: hideChevron prop for rows that must not show the chevron (Medication -> Schedule)
  const Row = ({ onPress, left, right, isLast, hideChevron }) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={{
        minHeight: 44,
        paddingVertical: 14,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: theme.borderColor,
        opacity: onPress ? 1 : 1, // keep same look when disabled
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {left}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {right}
        {!hideChevron && (
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={theme.darkGrey}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </Pressable>
  );

  const Avatar = () => (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.background,
        borderWidth: 1,
        borderColor: theme.borderColor,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
      }}
    >
      <Ionicons name="medkit-outline" size={16} color={theme.textColor} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header toggle */}
        <Section>
          <View
            style={{
              minHeight: 44,
              paddingVertical: 14,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: theme.textColor, fontSize: 16 }}>{type}</Text>
            <ToggleSwitch isEnabled={enabled} onToggle={setEnabled} />
          </View>
        </Section>

        {/* MESSAGE + SCHEDULE CARD (shown for ALL types when enabled) */}
        {enabled && (
          <Section style={{ marginTop: 16 }}>
            {/* Message (editable) */}
            <Row
              onPress={() => {
                setDraftMessage(message);
                setMsgModalVisible(true);
              }}
              left={
                <>
                  <Text style={{ color: theme.textColor, fontSize: 16 }}>Message</Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: theme.darkGrey, fontSize: 14, marginLeft: 8, flexShrink: 1 }}
                  >
                    {message || (type === "Medication" ? "It’s time to take your medication" : "")}
                  </Text>
                </>
              }
              right={null}
            />

            {/* Schedule */}
            {type === "Medication" ? (
              // EXACTLY like Figma: non-pressable row with "Go to Journal to edit" and NO chevron
              <Row
                onPress={undefined}
                hideChevron
                left={<Text style={{ color: theme.textColor, fontSize: 16 }}>Schedule</Text>}
                right={<Text style={{ color: theme.darkGrey, fontSize: 14 }}>Go to Journal to edit</Text>}
                isLast
              />
            ) : (
              <Row
                onPress={() => {
                  setEditingSchedule(schedule || defaultState.schedule);
                  if (schedule?.kind === "weekly" && Array.isArray(schedule.days)) {
                    setCheckinTab("weekly");
                    setWeeklyDays(new Set(schedule.days));
                    setWeeklyTime(parseDailyTime(schedule.time || "19:00"));
                  } else if (schedule?.kind === "daily") {
                    setCheckinTab("daily");
                  }
                  setScheduleModalVisible(true);
                }}
                left={
                  <>
                    <Text style={{ color: theme.textColor, fontSize: 16 }}>Schedule</Text>
                    <Text
                      numberOfLines={1}
                      style={{ color: theme.darkGrey, fontSize: 14, marginLeft: 8, flexShrink: 1 }}
                    >
                      {formatSchedule(schedule)}
                    </Text>
                  </>
                }
                right={null}
                isLast
              />
            )}
          </Section>
        )}

        {/* EXISTING MEDICATION (simple rows with toggle) */}
        {enabled && type === "Medication" && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 8 }}>
              Existing Medication
            </Text>

            <Section>
              {items.map((it, idx) => (
                <View
                  key={it.id}
                  style={{
                    minHeight: 56,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: idx === items.length - 1 ? 0 : 1,
                    borderBottomColor: theme.borderColor,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Avatar />
                    <View style={{ flexShrink: 1 }}>
                      <Text style={{ color: theme.textColor, fontSize: 16 }}>{it.name}</Text>
                      {!!it.subtitle && (
                        <Text style={{ color: theme.darkGrey, fontSize: 12 }}>{it.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  <ToggleSwitch
                    isEnabled={!!it.enabled}
                    onToggle={(val) => {
                      setItems((prev) =>
                        prev.map((p) => (p.id === it.id ? { ...p, enabled: val } : p))
                      );
                    }}
                  />
                </View>
              ))}
            </Section>
          </View>
        )}

        {/* Notification Preview (only shown if enabled) */}
        {enabled && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 8 }}>
              Notification Preview
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.borderColor,
                backgroundColor: theme.textFieldBG,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.borderColor,
                  borderRadius: 16,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={{ color: theme.textColor, fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>
                  {(() => {
                    // Get emoji based on type
                    const getEmoji = () => {
                      switch (type) {
                        case 'Water': return '💧';
                        case 'Sleep': return '😴';
                        case 'DailyCheckin': return '📝';
                        case 'Meal': return '🍽️';
                        case 'Medication': return '💊';
                        case 'Supplement': return '💊';
                        default: return '⏰';
                      }
                    };
                    return `${getEmoji()} ${type} Reminder`;
                  })()}
                </Text>
                <Text style={{ color: theme.textColor, fontSize: 14 }}>
                  {(() => {
                    // Show custom message if exists, otherwise show type-specific default
                    if (message && message.trim()) {
                      return message;
                    }

                    // Default messages by type
                    switch (type) {
                      case 'Water': return 'Time for your water!';
                      case 'Sleep': return 'Time for your sleep!';
                      case 'DailyCheckin': return 'Time for your daily check-in!';
                      case 'Meal': return 'Time for your meal!';
                      case 'Medication':
                        if (items && items.length > 0) {
                          const activeItems = items.filter(i => i.enabled).map(i => i.name).join(", ");
                          if (activeItems) return `Time to take: ${activeItems}`;
                        }
                        return 'Time for your medication!';
                      case 'Supplement':
                        if (items && items.length > 0) {
                          const activeItems = items.filter(i => i.enabled).map(i => i.name).join(", ");
                          if (activeItems) return `Time to take: ${activeItems}`;
                        }
                        return 'Time for your supplement!';
                      default: return 'Reminder notification';
                    }
                  })()}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Message editor modal */}
      <Modal
        visible={msgModalVisible}
        // ... (content skipped, I can't use skips in replacement content unless matching)
        // I will target the specific blocks.

        // Let's target the Notification Preview end FIRST.
        // And then the Save Logic. 
        // I'll do this in two chunks.

        transparent
        animationType="fade"
        onRequestClose={() => setMsgModalVisible(false)}
      >
        <Pressable
          onPress={() => setMsgModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => { }}
            style={{
              borderRadius: 12,
              padding: 16,
              backgroundColor: theme.background,
              borderWidth: 1,
              borderColor: theme.borderColor,
            }}
          >
            <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 8 }}>
              Edit Message
            </Text>
            <TextInput
              value={draftMessage}
              onChangeText={setDraftMessage}
              multiline
              placeholder="Reminder message"
              placeholderTextColor={theme.darkGrey}
              style={{
                color: theme.textColor,
                borderWidth: 1,
                borderColor: theme.borderColor,
                backgroundColor: theme.textFieldBG,
                borderRadius: 8,
                padding: 12,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Pressable
                onPress={() => setMsgModalVisible(false)}
                style={{ paddingVertical: 10, paddingHorizontal: 12, marginRight: 8 }}
              >
                <Text style={{ color: theme.textColor, fontSize: 14 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMessage(draftMessage.trim());
                  setMsgModalVisible(false);
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.borderColor,
                  backgroundColor: theme.textFieldBG,
                }}
              >
                <Text style={{ color: theme.textColor, fontSize: 14 }}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Schedule modal (unchanged for non-Medication types) */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <Pressable
          onPress={() => setScheduleModalVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 }}
        >
          <Pressable
            onPress={() => { }}
            style={{ borderRadius: 12, padding: 16, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.borderColor }}
          >
            <Text style={{ color: theme.textColor, fontSize: 16, marginBottom: 12 }}>
              Edit Schedule
            </Text>

            {/* Interval list (Water/Meal/Supplement) */}
            {(type === "Water" || type === "Meal" || type === "Supplement") && (
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {INTERVAL_OPTIONS.map((n) => {
                  const selected =
                    editingSchedule?.kind === "interval" && Number(editingSchedule?.value) === n;
                  return (
                    <Pressable
                      key={n}
                      onPress={() => setEditingSchedule({ kind: "interval", value: n })}
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
                      <Text style={{ color: theme.textColor, fontSize: 14 }}>
                        {`Every ${minutesToLabel(n)}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Sleep Schedule */}
            {type === "Sleep" && (
              <View>
                {Platform.OS === 'ios' ? (
                  <DateTimePicker
                    value={parseDailyTime(
                      editingSchedule?.kind === "daily" ? editingSchedule.value : "22:00"
                    )}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    textColor={theme.textColor}
                    onChange={(e, d) => {
                      if (d) {
                        const hh = `${d.getHours()}`.padStart(2, "0");
                        const mm = `${d.getMinutes()}`.padStart(2, "0");
                        setEditingSchedule({ kind: "daily", value: `${hh}:${mm}` });
                      }
                    }}
                  />
                ) : (
                  <>
                    <Pressable
                      onPress={() => setShowTimePicker(true)}
                      style={{
                        backgroundColor: theme.textFieldBG,
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: theme.borderColor,
                        alignItems: 'center',
                        marginTop: 10
                      }}
                    >
                      <Text style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}>
                        {toAmPm(editingSchedule?.kind === "daily" ? editingSchedule.value : "22:00")}
                      </Text>
                    </Pressable>
                    {showTimePicker && (
                      <DateTimePicker
                        value={parseDailyTime(
                          editingSchedule?.kind === "daily" ? editingSchedule.value : "22:00"
                        )}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(e, d) => {
                          setShowTimePicker(false);
                          if (d) {
                            const hh = `${d.getHours()}`.padStart(2, "0");
                            const mm = `${d.getMinutes()}`.padStart(2, "0");
                            setEditingSchedule({ kind: "daily", value: `${hh}:${mm}` });
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            )}

            {/* Daily Check-in: daily/weekly */}
            {type === "DailyCheckin" && (
              <View>
                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                  {["daily", "weekly"].map((t) => {
                    const sel = checkinTab === t;
                    return (
                      <Pressable
                        key={t}
                        onPress={() => {
                          setCheckinTab(t);
                          if (t === "daily") {
                            setEditingSchedule({ kind: "daily", value: "19:00" });
                          } else {
                            const hh = `${weeklyTime.getHours()}`.padStart(2, "0");
                            const mm = `${weeklyTime.getMinutes()}`.padStart(2, "0");
                            setEditingSchedule({
                              kind: "weekly",
                              days: Array.from(weeklyDays).sort((a, b) => a - b),
                              time: `${hh}:${mm}`
                            });
                          }
                        }}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: sel ? theme.textColor : theme.borderColor,
                          backgroundColor: sel ? theme.background : theme.textFieldBG,
                          marginRight: 8,
                        }}
                      >
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>
                          {t === "daily" ? "Daily" : "Weekly"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {checkinTab === "daily" ? (
                  Platform.OS === 'ios' ? (
                    <DateTimePicker
                      value={parseDailyTime(
                        editingSchedule?.kind === "daily" ? editingSchedule.value : "19:00"
                      )}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      textColor={theme.textColor}
                      onChange={(e, d) => {
                        if (d) {
                          const hh = `${d.getHours()}`.padStart(2, "0");
                          const mm = `${d.getMinutes()}`.padStart(2, "0");
                          setEditingSchedule({ kind: "daily", value: `${hh}:${mm}` });
                        }
                      }}
                    />
                  ) : (
                    <>
                      <Pressable
                        onPress={() => setShowTimePicker(true)}
                        style={{
                          backgroundColor: theme.textFieldBG,
                          padding: 12,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: theme.borderColor,
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <Text style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}>
                          {toAmPm(editingSchedule?.kind === "daily" ? editingSchedule.value : "19:00")}
                        </Text>
                      </Pressable>
                      {showTimePicker && (
                        <DateTimePicker
                          value={parseDailyTime(
                            editingSchedule?.kind === "daily" ? editingSchedule.value : "19:00"
                          )}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={(e, d) => {
                            setShowTimePicker(false);
                            if (d) {
                              const hh = `${d.getHours()}`.padStart(2, "0");
                              const mm = `${d.getMinutes()}`.padStart(2, "0");
                              setEditingSchedule({ kind: "daily", value: `${hh}:${mm}` });
                            }
                          }}
                        />
                      )}
                    </>
                  )
                ) : (
                  <View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
                      {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        const sel = weeklyDays.has(d);
                        return (
                          <Pressable
                            key={d}
                            onPress={() => {
                              const next = new Set(weeklyDays);
                              if (next.has(d)) next.delete(d);
                              else next.add(d);
                              setWeeklyDays(next);

                              // Sync state
                              const ordered = Array.from(next).sort((a, b) => a - b);
                              const hh = `${weeklyTime.getHours()}`.padStart(2, "0");
                              const mm = `${weeklyTime.getMinutes()}`.padStart(2, "0");
                              setEditingSchedule({ kind: "weekly", days: ordered, time: `${hh}:${mm}` });
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 999,
                              borderWidth: 1,
                              borderColor: sel ? theme.textColor : theme.borderColor,
                              backgroundColor: sel ? theme.background : theme.textFieldBG,
                              marginRight: 6,
                              marginBottom: 6,
                            }}
                          >
                            <Text style={{ color: theme.textColor }}>{labels[d]}</Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    {Platform.OS === 'ios' ? (
                      <DateTimePicker
                        value={weeklyTime}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        textColor={theme.textColor}
                        onChange={(e, d) => {
                          if (d) {
                            setWeeklyTime(d);
                            const hh = `${d.getHours()}`.padStart(2, "0");
                            const mm = `${d.getMinutes()}`.padStart(2, "0");
                            const ordered = Array.from(weeklyDays).sort((a, b) => a - b);
                            setEditingSchedule({ kind: "weekly", days: ordered, time: `${hh}:${mm}` });
                          }
                        }}
                      />
                    ) : (
                      <>
                        <Pressable
                          onPress={() => setShowTimePicker(true)}
                          style={{
                            backgroundColor: theme.textFieldBG,
                            padding: 12,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: theme.borderColor,
                            alignItems: 'center',
                            marginTop: 10
                          }}
                        >
                          <Text style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}>
                            {toAmPm(`${weeklyTime.getHours()}:${weeklyTime.getMinutes()}`)}
                          </Text>
                        </Pressable>

                        {showTimePicker && (
                          <DateTimePicker
                            value={weeklyTime}
                            mode="time"
                            is24Hour={false}
                            display="default"
                            onChange={(e, d) => {
                              setShowTimePicker(false);
                              if (d) {
                                setWeeklyTime(d);
                                const hh = `${d.getHours()}`.padStart(2, "0");
                                const mm = `${d.getMinutes()}`.padStart(2, "0");
                                const ordered = Array.from(weeklyDays).sort((a, b) => a - b);
                                setEditingSchedule({ kind: "weekly", days: ordered, time: `${hh}:${mm}` });
                              }
                            }}
                          />
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            )}

            <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "flex-end" }}>
              <Pressable
                onPress={() => setScheduleModalVisible(false)}
                style={{ paddingVertical: 14, paddingHorizontal: 24, marginRight: 8 }}
              >
                <Text style={{ color: theme.textColor, fontSize: 14 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  let finalSchedule = editingSchedule;

                  // Safety checks: Ensure finalSchedule isn't null and matches type constraints
                  if (type === "Water" || type === "Meal" || type === "Supplement") {
                    if (finalSchedule?.kind !== "interval") finalSchedule = { kind: "interval", value: 60 };
                  }
                  else if (type === "Sleep") {
                    if (finalSchedule?.kind !== "daily") finalSchedule = { kind: "daily", value: "22:00" };
                  }
                  else if (type === "DailyCheckin") {
                    // Tab switching logic ensures editingSchedule is correct kind, but fallback if null
                    if (!finalSchedule) finalSchedule = { kind: "daily", value: "19:00" };
                  }

                  setSchedule(finalSchedule);
                  setScheduleModalVisible(false);
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.borderColor,
                  backgroundColor: theme.textFieldBG,
                }}
              >
                <Text style={{ color: theme.textColor, fontSize: 14 }}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
