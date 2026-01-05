// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

// Context Providers
import { ThemeProvider } from "./Apps/Contexts/ThemeContext";
import { UserContextProvider } from "./Apps/Contexts/UserContext";
import { SignUpProvider } from "./Apps/Contexts/SignUpContext";
import { NotificationProvider } from "./Apps/Contexts/NotificationContext";
import { OnboardingProvider } from "./Apps/Contexts/OnboardingContext";

// Navigation Components
import AuthenticationNavigator from "./Apps/Navigation/AuthenticationNavigator";
import TabNavigator from "./Apps/Navigation/TabNavigator";
import ChartsNavigator from "./Apps/Navigation/ChartsNavigator";
import LogNavigator from "./Apps/Navigation/LogNavigator";
import RemindersNavigator from "./Apps/Navigation/RemindersNavigator";
import JournalNavigator from "./Apps/Navigation/JournalNavigator";
import SettingsStack from "./Apps/Navigation/SettingsStack";

// Triage Screens
import TermsAndConditionsScreen from "./Apps/Screens/Triage/TermsAndConditionsScreen";
import IntroVideoScreen from "./Apps/Screens/Triage/IntroVideoScreen";

// Notifications
import NotificationHandler from "./Apps/Components/Notifications/NotificationHandler";

const Stack = createNativeStackNavigator();

export default function App() {
	const [fontsLoaded] = useFonts({
		Raleway: require("./assets/fonts/static/Raleway-Regular.ttf"),
		RalewaySemiBold: require("./assets/fonts/static/Raleway-SemiBold.ttf"),
		RalewayBold: require("./assets/fonts/static/Raleway-Bold.ttf"),
		IntrudingCat: require("./assets/fonts/IntrudingCat.ttf"),
		InknutAntiqua: require("./assets/fonts/InknutAntiqua-Regular.ttf"),
	});

	if (!fontsLoaded) return null;

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<OnboardingProvider>
					<UserContextProvider>
						<SignUpProvider>
							<ThemeProvider>
								<NotificationProvider>

									<NavigationContainer>
										<NotificationHandler />

										<Stack.Navigator initialRouteName="Landing">
											<Stack.Screen
												name="AuthenticationNavigator"
												component={AuthenticationNavigator}
												options={{ headerShown: false }}
											/>

											<Stack.Screen
												name="TabNavigator"
												component={TabNavigator}
												options={{ headerShown: false }}
											/>

											<Stack.Screen
												name="SettingsNavigator"
												component={SettingsStack}
												options={{ headerShown: false }}
											/>

											<Stack.Screen
												name="ChartsNavigator"
												component={ChartsNavigator}
												options={{ headerShown: false }}
											/>

											<Stack.Screen
												name="LogsNavigator"
												component={LogNavigator}
												options={{ headerShown: false }}
											/>

											<Stack.Screen
												name="JournalNavigator"
												component={JournalNavigator}
												options={{ headerShown: false }}
											/>

											<Stack.Screen
												name="RemindersNavigator"
												component={RemindersNavigator}
												options={{ headerShown: false }}
											/>

											{/* Triage Flow Screens */}
											<Stack.Screen
												name="TermsAndConditions"
												component={TermsAndConditionsScreen}
												options={{ headerShown: false }}
											/>
											<Stack.Screen
												name="IntroVideo"
												component={IntroVideoScreen}
												options={{ headerShown: false }}
											/>

										</Stack.Navigator>
									</NavigationContainer>

								</NotificationProvider>
							</ThemeProvider>
						</SignUpProvider>
					</UserContextProvider>
				</OnboardingProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
