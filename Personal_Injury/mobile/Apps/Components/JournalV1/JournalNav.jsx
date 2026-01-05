import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";

const JournalNav = ({ activeNavItem, onSelectNavItem, navItems }) => {
	const { theme } = useTheme();
	// Render each navigation item
	const renderNavItem = (item, index) => {
		const isActive = item === activeNavItem;
		return (
			<TouchableOpacity
				key={item} // Ensure you have a unique key
				onPress={() => onSelectNavItem(item)}
				className={`flex-1 items-center mx-5 ${isActive
						? "border-b-2 border-primaryBlue"
						: "border-b-0 border-transparent"
					}`}
			>
				<Text
					className={`font-raleway mb-3 capitalize text-[16px] ${isActive ? "font-ralewayBold" : ""
						}`}
					style={{
						color: theme.mode === 'dark'
							? (isActive ? '#FFFFFF' : theme.darkGrey)
							: (isActive ? '#003B5C' : '#6B7280')
					}}
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
