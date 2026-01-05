import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Importing Components
import Pain from "../Components/Tracker/Pain";
import Mood from "../Components/Tracker/Mood";
import Fluid from "../Components/Tracker/Fluid";
import Medication from "../Components/Tracker/Medication";
import ADL from "../Components/Tracker/ADL";
import BodyComposition from "../Components/Tracker/BodyComposition";
import Sleep from "../Components/Tracker/Sleep";
import Exercise from "../Components/Tracker/Exercise";
import SocialActivity from "../Components/Tracker/SocialActivity";
import Treatment from "../Components/Tracker/Treatment";
import Diet from "../Components/Tracker/Diet";

const LogNavigator = () => (
  <Stack.Navigator>
    {/* Medication */}
    <Stack.Screen
      name="Medication"
      component={Medication}
      options={({ navigation }) => ({
        headerTitle: "Medication",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Pain tracker */}
    <Stack.Screen
      name="Pain"
      component={Pain}
      options={({ navigation }) => ({
        headerTitle: "Pain",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Mood tracker */}
    <Stack.Screen
      name="Mood"
      component={Mood}
      options={({ navigation }) => ({
        headerTitle: "Mood",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Activity of Daily Living tracker */}
    <Stack.Screen
      name="ADL"
      component={ADL}
      options={({ navigation }) => ({
        headerTitle: "Activity of daily living",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Body Composition tracker */}
    <Stack.Screen
      name="BodyComposition"
      component={BodyComposition}
      options={({ navigation }) => ({
        headerTitle: "Body Composition",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Sleep tracker */}
    <Stack.Screen
      name="Sleep"
      component={Sleep}
      options={({ navigation }) => ({
        headerTitle: "Sleep",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Exercise tracker */}
    <Stack.Screen
      name="Exercise"
      component={Exercise}
      options={({ navigation }) => ({
        headerTitle: "Exercise",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Social Activity tracker */}
    <Stack.Screen
      name="Fluid"
      component={Fluid}
      options={({ navigation }) => ({
        headerTitle: "Fluid",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Fluid tracker */}
    <Stack.Screen
      name="SocialActivity"
      component={SocialActivity}
      options={({ navigation }) => ({
        headerTitle: "Social Activity",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Treatment tracker */}
    <Stack.Screen
      name="Treatment"
      component={Treatment}
      options={({ navigation }) => ({
        headerTitle: "Treatment",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
    {/* Diet tracker */}
    <Stack.Screen
      name="Diet"
      component={Diet}
      options={({ navigation }) => ({
        headerTitle: "Diet",
        headerLeft: () => (
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

export default LogNavigator;
