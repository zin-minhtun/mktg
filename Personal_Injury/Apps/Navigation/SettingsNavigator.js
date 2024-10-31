import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import tw from "twrnc";

// Settings Screens
import ProfileSettings from "../Screens/Settings/ProfileSettings";
import EditProfile from "../Screens/Settings/EditProfile";
import ResetPassword from "../Screens/Settings/ResetPassword";
import AboutUs from "../Screens/Settings/AboutUs";
import ContactSupport from "../Screens/Settings/ContactSupport";
import FAQs from "../Screens/Settings/FAQs";
import Feedback from "../Screens/Settings/Feedback";

// Theme Context Provider
import { useTheme } from "../Contexts/ThemeContext";

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Dark Mode - color setting
  const headerBackgroundColor = isDarkMode ? "bg-gray-800" : " bg-white";
  const headerTextColor = isDarkMode ? "text-white" : "text-black";
  const antDesignColor = isDarkMode ? "white" : "black";

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings Main"
        component={ProfileSettings}
        options={({ navigation }) => ({
          headerTitle: "Settings",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`, // Background color
          headerTitleStyle: tw`${headerTextColor} font-bold`, // Text color and font weight
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={({ navigation }) => ({
          headerTitle: "Edit Profile",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`,
          headerTitleStyle: tw`${headerTextColor} font-bold`,
        })}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={({ navigation }) => ({
          headerTitle: "Reset Password",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`,
          headerTitleStyle: tw`${headerTextColor} font-bold`,
        })}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={({ navigation }) => ({
          headerTitle: "About Us",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`,
          headerTitleStyle: tw`${headerTextColor} font-bold`,
        })}
      />
      <Stack.Screen
        name="ContactSupport"
        component={ContactSupport}
        options={({ navigation }) => ({
          headerTitle: "Contact Support",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`,
          headerTitleStyle: tw`${headerTextColor} font-bold`,
        })}
      />
      <Stack.Screen
        name="FAQs"
        component={FAQs}
        options={({ navigation }) => ({
          headerTitle: "FAQs",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`,
          headerTitleStyle: tw`${headerTextColor} font-bold`,
        })}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={({ navigation }) => ({
          headerTitle: "Feedback",
          headerLeft: () => (
            <AntDesign
              name="left"
              size={24}
              color={antDesignColor}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: tw`${headerBackgroundColor}`,
          headerTitleStyle: tw`${headerTextColor} font-bold`,
        })}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
