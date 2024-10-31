import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const JournalNav = ({ activeNavItem, onSelectNavItem, navItems }) => {
	// Render each navigation item
	const renderNavItem = (item, index) => {
		const isActive = item === activeNavItem;
		return (
			<TouchableOpacity
				key={item} // Ensure you have a unique key
				onPress={() => onSelectNavItem(item)}
				className={`flex-1 items-center mx-5 ${
					isActive
						? "border-b-2 border-primaryBlue"
						: "border-b-0 border-transparent"
				}`}
			>
				<Text
					className={`font-raleway mb-3 capitalize text-[16px] ${
						isActive ? "font-ralewayBold text-primaryDarkBlue" : "text-gray-500"
					}`}
				>
					{item}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View className="flex flex-row">
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{navItems.map((item, index) => renderNavItem(item, index))}
			</ScrollView>
		</View>
	);
};

export default JournalNav;
