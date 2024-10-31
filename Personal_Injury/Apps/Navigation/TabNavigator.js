import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import Svg, { Path } from "react-native-svg";

// Screens
import Dashboard from "../Screens/NavigatorTabs/Dashboard";
import Goals from "../Screens/NavigatorTabs/Goals";
import Records from "../Screens/NavigatorTabs/Records";
import HomeScreen from "../Screens/NavigatorTabs/HomeScreen";
import JournalV1 from "../Screens/NavigatorTabs/JournalV1.jsx";
import Settings from "../Screens/SettingsV1/Settings";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => (
	<Tab.Navigator
		screenOptions={{
			tabBarStyle: {
				height: 80, // Adjust the height of the tab bar
				paddingTop: 15,
				paddingBottom: 15, // Padding at the bottom of the tab bar
			},
			tabBarLabelStyle: {
				fontSize: 12, // Font size for the tab labels
			},
		}}
	>
		<Tab.Screen
			name="Home"
			component={HomeScreen}
			options={{
				tabBarIcon: ({ color, size }) => (
					<Entypo name="home" color={color} size={size} />
				),
				headerTitle: "",
				headerRight: () => (
					<Entypo
						name="bell"
						size={24}
						color={"black"}
						onPress={() => navigation.goBack()}
						style={tw`mr-5`}
					/>
				),
			}}
		/>

		<Tab.Screen
			name="Dashboard"
			component={Dashboard}
			options={{
				tabBarIcon: ({ color, size }) => (
					<MaterialIcons name="dashboard" color={color} size={size} />
				),
			}}
		/>
		<Tab.Screen
			name="Journal"
			component={JournalV1}
			options={{
				headerShown: false,
				tabBarLabel: "Journal",
				tabBarActiveTintColor: "#00B8DF",
				tabBarInactiveTintColor: "#939598",
				tabBarLabelStyle: {
					fontFamily: "Raleway",
					fontSize: 14,
				},
				tabBarIcon: ({ focused }) => (
					<Svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<Path
							d="M6 22.6666H13.3333C14.8061 22.6666 16 23.8606 16 25.3333V11.3333C16 8.50489 16 7.09067 15.1213 6.21199C14.2426 5.33331 12.8284 5.33331 10 5.33331H6C5.05719 5.33331 4.58579 5.33331 4.29289 5.62621C4 5.9191 4 6.3905 4 7.33331V20.6666C4 21.6095 4 22.0809 4.29289 22.3738C4.58579 22.6666 5.05719 22.6666 6 22.6666Z"
							fill={focused ? "#00B8DF" : "#939598"}
						/>
						<Path
							d="M26 22.6666H18.6667C17.1939 22.6666 16 23.8606 16 25.3333V11.3333C16 8.50489 16 7.09067 16.8787 6.21199C17.7574 5.33331 19.1716 5.33331 22 5.33331H26C26.9428 5.33331 27.4142 5.33331 27.7071 5.62621C28 5.9191 28 6.3905 28 7.33331V20.6666C28 21.6095 28 22.0809 27.7071 22.3738C27.4142 22.6666 26.9428 22.6666 26 22.6666Z"
							fill={focused ? "#00B8DF" : "#939598"}
						/>
					</Svg>
				),
			}}
		/>
		{/* <Tab.Screen
      name="Goals"
      component={Goals}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="star" color={color} size={size} />
        ),
      }}
    /> */}
		{/* <Tab.Screen
      name="Records"
      component={Records}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="database" color={color} size={size} />
        ),
      }}
    /> */}
		<Tab.Screen
			name="Settings"
			component={Settings}
			options={{
				headerShown: false,
				tabBarLabel: "Settings",
				tabBarActiveTintColor: "#00B8DF",
				tabBarInactiveTintColor: "#939598",
				tabBarLabelStyle: {
					fontFamily: "Raleway",
					fontSize: 14,
				},
				tabBarIcon: ({ focused }) => (
					<Svg
						width={33}
						height={32}
						viewBox="0 0 33 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<Path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M19.048 4.483c.166 1.653.248 2.48.8 2.709.554.229 1.197-.297 2.483-1.35.673-.55 1.01-.825 1.394-.806.385.02.689.323 1.297.931l1.212 1.212c.608.608.912.912.931 1.297.02.385-.256.722-.807 1.395-1.052 1.286-1.578 1.928-1.349 2.481.23.553 1.056.636 2.709.801.866.087 1.298.13 1.557.416.258.285.258.715.258 1.576v1.713c0 .86 0 1.29-.258 1.576-.259.286-.691.329-1.557.415-1.653.166-2.48.248-2.708.801-.23.553.297 1.196 1.349 2.481.55.674.826 1.01.806 1.395-.019.385-.323.689-.931 1.297l-1.212 1.212c-.608.608-.912.912-1.297.931-.385.02-.721-.256-1.395-.807-1.285-1.052-1.928-1.578-2.481-1.349-.553.23-.636 1.056-.8 2.71-.087.865-.13 1.297-.416 1.556-.286.259-.716.259-1.576.259h-1.714c-.86 0-1.29 0-1.576-.259-.285-.259-.329-.691-.415-1.557-.165-1.653-.248-2.48-.801-2.708-.553-.23-1.196.297-2.482 1.349-.673.55-1.01.826-1.394.807-.385-.02-.69-.324-1.297-.932l-1.212-1.211c-.608-.609-.912-.913-.932-1.298-.019-.384.257-.721.807-1.394 1.052-1.286 1.579-1.929 1.35-2.482-.23-.552-1.056-.635-2.71-.8-.865-.087-1.297-.13-1.556-.416-.258-.286-.258-.716-.258-1.576v-1.713c0-.86 0-1.29.258-1.576.259-.286.692-.33 1.557-.416 1.653-.165 2.48-.248 2.709-.8.229-.553-.297-1.197-1.35-2.483-.55-.673-.826-1.01-.806-1.394.019-.385.323-.69.931-1.298l1.212-1.211c.608-.608.912-.913 1.297-.932.385-.019.721.256 1.394.807 1.286 1.052 1.93 1.578 2.482 1.35.553-.23.636-1.056.8-2.709.087-.865.13-1.298.416-1.556.286-.259.716-.259 1.576-.259h1.714c.86 0 1.29 0 1.576.259.285.258.329.69.415 1.556zM16.2 21.335a5.333 5.333 0 100-10.667 5.333 5.333 0 000 10.667z"
							fill={focused ? "#00B8DF" : "#939598"}
						/>
					</Svg>
				),
			}}
		/>
	</Tab.Navigator>
);

const TabNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Tabs"
			component={Tabs}
			options={{ headerShown: false }}
		/>
	</Stack.Navigator>
);

export default TabNavigator;
