import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";

// Authentication Screens
import LandingScreen from "../Screens/Authentication/LandingScreen";
import LoginScreen from "../Screens/Authentication/LoginScreen";
import ForgotPassword from "../Screens/Authentication/ForgotPassword";
import SignUp from "../Screens/Authentication/SignUp";
import SignUpInfo from "../Screens/Authentication/signUpInfo/SignUpInfo";

const Stack = createNativeStackNavigator();

const AuthenticationNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Landing"
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Sign Up Email"
      component={SignUp}
      options={({ navigation }) => ({
        headerTitle: " ",
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
    <Stack.Screen
      name="SignUpInfo"
      component={SignUpInfo}
      options={{ headerShown: false }}
      // options={({ navigation }) => ({
      //   headerTitle: " ",
      //   headerLeft: () => (
      //     <AntDesign
      //       name="left"
      //       size={24}
      //       color="black"
      //       onPress={() => navigation.goBack()}
      //     />
      //   ),
      // })}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={({ navigation }) => ({
        headerTitle: " ",
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
    <Stack.Screen
      name="Forgot Password"
      component={ForgotPassword}
      options={({ navigation }) => ({
        headerTitle: " ",
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

export default AuthenticationNavigator;
