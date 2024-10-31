import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView
import BackIcon from "../Icons/BackIcon";
import NotificationIcon from "../Icons/NotificationIcon";

const CustomHeader = ({ title, onIconPress, onBackPress }) => {
	return (
		<SafeAreaView className="flex-1 bg-[#FAFBFC]">
			<View className="flex flex-row items-center justify-between px-4 h-16 bg-[#FAFBFC]">
				<TouchableOpacity onPress={onBackPress}>
					<BackIcon />
				</TouchableOpacity>
				<Text className="flex-1 text-center font-ralewaySemiBold text-primaryDarkBlue text-[20px]">
					{title}
				</Text>
				<TouchableOpacity onPress={onIconPress}>
					<NotificationIcon />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default CustomHeader;
