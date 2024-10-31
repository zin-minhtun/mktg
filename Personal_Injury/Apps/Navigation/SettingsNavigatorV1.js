import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomHeader from "../Components/JournalV1/CustomHeader";
import Profile from "../Screens/SettingsV1/Profile/Profile";

// Settings Screens

const Stack = createNativeStackNavigator();

const SettingsNavigatorV1 = ({ navigation }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Profile"
				component={Profile}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Profile"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	);
};

export default SettingsNavigatorV1;
