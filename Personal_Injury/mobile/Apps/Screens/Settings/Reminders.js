import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../../Contexts/ThemeContext";
import { useFocusEffect } from '@react-navigation/native';

const TYPES = ["Medication", "Supplement", "Water", "Meal", "Sleep"];

const defaults = {
  Medication: { enabled: false },
  Supplement: { enabled: false },
  Water: { enabled: false },
  Meal: { enabled: false },
  Sleep: { enabled: false },
  DailyCheckin: { enabled: false },
};

export default function Reminders({ navigation }) {
  const { theme } = useTheme();
  const [state, setState] = useState({});

  const load = useCallback(async () => {
    const entries = await Promise.all(
      [...TYPES, 'DailyCheckin'].map(async (t) => {
        try {
          const raw = await AsyncStorage.getItem(`reminders:${t}`);
          return [t, raw ? JSON.parse(raw) : defaults[t]];
        } catch {
          return [t, defaults[t]];
        }
      })
    );
    setState(Object.fromEntries(entries));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const Section = ({ children, title }) => (
    <View style={{ marginTop: title ? 24 : 0 }}>
      {title ? (
        <Text style={{ marginBottom: 12, color: theme.textColor, fontSize: 16 }}>{title}</Text>
      ) : null}
      <View style={{
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 8,
        backgroundColor: theme.textFieldBG,
        overflow: 'hidden'
      }}>
        {children}
      </View>
    </View>
  );

  const Row = ({ label, typeKey, isLast }) => {
    const enabled = state?.[typeKey]?.enabled ?? defaults[typeKey]?.enabled ?? false;
    return (
      <Pressable
        onPress={() => navigation.navigate('ReminderType', { type: typeKey })}
        accessibilityRole="button"
        style={{
          minHeight: 44,
          paddingVertical: 12,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.borderColor,
        }}
      >
        <Text style={{ color: theme.textColor, fontSize: 16 }}>{label}</Text>
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: theme.borderColor,
          backgroundColor: theme.textFieldBG,
        }}>
          <Text style={{ color: theme.textColor, fontSize: 12 }}>{enabled ? 'On' : 'Off'}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <Section>
        {TYPES.map((name, idx) => (
          <Row key={name} label={name} typeKey={name} isLast={idx === TYPES.length - 1} />
        ))}
      </Section>

      <Section title="Other Reminders">
        <Row label="Daily Check-in" typeKey="DailyCheckin" isLast />
      </Section>
    </View>
  );
}
