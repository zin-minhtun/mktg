import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";

// Authentication Screens
import SplashScreen from "../Screens/Authentication/SplashScreen.jsx";
import GetStartedScreen from "../Screens/Authentication/GetStartedScreen.jsx";
import LandingScreen from "../Screens/Authentication/LandingScreen";
import LoginScreen from "../Screens/Authentication/LoginScreen";
import AuthLoading from "../Screens/Authentication/AuthLoading";
import ForgotPasswordScreen from "../Screens/Authentication/ForgotPassword";
import VerificationCodeScreen from "../Screens/Authentication/VerificationCode";
import ResetPasswordFinalScreen from "../Screens/Authentication/ResetPasswordFinal";
import SignUp from "../Screens/Authentication/SignUp";
import OnboardingStack from "./OnboardingStack";

const Stack = createNativeStackNavigator();

const AuthenticationNavigator = () => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen
      name="Splash"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="GetStarted"
      component={GetStartedScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Landing"
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="OnboardingStack"
      component={OnboardingStack}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AuthLoading"
      component={AuthLoading}
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
      component={ForgotPasswordScreen}
      options={({ navigation }) => ({
        headerTitle: "Log In",
        headerTitleAlign: "center",
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
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={({ navigation }) => ({
        headerTitle: "Log In",
        headerTitleAlign: "center",
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
      name="VerificationCode"
      component={VerificationCodeScreen}
      options={({ navigation }) => ({
        headerTitle: "Log In",
        headerTitleAlign: "center",
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
      name="ResetPasswordFinal"
      component={ResetPasswordFinalScreen}
      options={({ navigation }) => ({
        headerTitle: "Log In",
        headerTitleAlign: "center",
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
