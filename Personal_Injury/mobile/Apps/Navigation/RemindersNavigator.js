import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Theme Context Provider
import { useTheme } from "../Contexts/ThemeContext";
import Reminders from "../Screens/Settings/Reminders";
import ReminderType from "../Screens/Settings/ReminderType";
import AddSchedule from "../Screens/Settings/AddSchedule";

const Stack = createNativeStackNavigator();

const RemindersNavigator = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Stack.Navigator
    screenOptions={{
      headerTintColor: theme.textColor,
      headerStyle: { backgroundColor: theme.background },
      contentStyle: { backgroundColor: theme.background },
      headerShadowVisible: false,
    }}
    >
      <Stack.Screen
        name="Reminders"
        component={Reminders}
        options={({ navigation }) => ({
          headerTitle: "Reminders",
          headerTitleAlign: "center",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={theme.textColor}
              onPress={() => navigation.goBack()}
            />
          ),
         //header style
        //  headerTitleStyle: tw`${headerTextColor} font-semibold`,
        })}
      />
      <Stack.Screen
        name="Reminder Item"
        component={ReminderType}
        options={({ navigation }) => ({
          headerTitle: "Reminders",
          headerTitleAlign: "center",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={theme.textColor}
              onPress={() => navigation.goBack()}
            />
          ),
         //header style
         // headerTitleStyle: ` font-semibold`,
        })}
      />
      <Stack.Screen
        name="add schedule"
        component={AddSchedule}
        options={({ navigation }) => ({
          headerTitle: "New Reminder",
          headerTitleAlign: "center",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={theme.textColor}
              onPress={() => navigation.goBack()}
            />
          ),
         //header style
          //headerTitleStyle: tw`${headerTextColor} font-semibold`,
        })}
      />
    </Stack.Navigator>
  );
};

export default RemindersNavigator;
