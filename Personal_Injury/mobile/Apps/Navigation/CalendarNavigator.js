import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../Screens/NavigatorTabs/CalendarScreen";
import CalendarMonthlyView from "../Components/Calendar/CalendarMonthlyView";

const Stack = createNativeStackNavigator();

const CalendarNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="MonthlyCalendar" component={CalendarMonthlyView} />
    </Stack.Navigator>
  );
};

export default CalendarNavigator;
