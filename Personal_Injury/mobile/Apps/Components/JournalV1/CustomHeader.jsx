import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView
import BackIcon from "../Icons/BackIcon";
import NotificationIcon from "../Icons/NotificationIcon";
import { useTheme } from "../../Contexts/ThemeContext";

const CustomHeader = ({ title, onIconPress, onBackPress }) => {

	const {theme} = useTheme();

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor: theme.backgroundColor }}>
			<View className="flex flex-row items-center justify-between px-4 h-16 " >
				<TouchableOpacity onPress={onBackPress} style={{color: theme.textColor}}>
					<BackIcon color={theme.textColor} />
				</TouchableOpacity>
				<Text className="flex-1 text-center font-raleway SemiBold text-[20px]" style={{ color: theme.textColor }}>
					{title} 
				</Text>
				<TouchableOpacity onPress={onIconPress}>
					<NotificationIcon color={theme.textColor}/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default CustomHeader;
