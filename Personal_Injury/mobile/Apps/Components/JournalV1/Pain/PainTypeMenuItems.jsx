import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../Contexts/ThemeContext";

// Import components
import ArrowUp from "../../Icons/ArrowUp";
import ArrowDown from "../../Icons/ArrowDown";

// Array containing all available pain types
const painTypes = [
	"Spasms",
	"Cramping",
	"Gnawing",
	"Heavy",
	"Hot or burning",
	"Sharp",
	"Shooting",
	"Sickening",
	"Splitting",
	"Stabbing",
];

const PainTypeMenuItems = ({ painType = [], setPainType }) => {
	const { theme } = useTheme();
	const [isPainTypeMenuVisible, setIsPainTypeMenuVisible] = useState(false); // State to control menu visibility
	const [selectedPainType, setSelectedPainType] = useState(null); // State to store the selected pain type (a single string)

	useEffect(() => {
		if (painType && painType.length > 0) {
			setSelectedPainType(painType[0]);
		}
	}, [painType]);

	// Handles when the user selects a pain type
	const handleSelectType = (type) => {
		setSelectedPainType(type); // Store selected type
		setIsPainTypeMenuVisible(false); // Close the dropdown menu

		// Update parent component
		if (setPainType) {
			setPainType([type]); // Store as array to match data structure
		}
	};

	// Toggles menu visibility (open/close)
	const togglePainTypeMenu = () => {
		setIsPainTypeMenuVisible(!isPainTypeMenuVisible);
	};

	// Text displayed in the dropdown header
	const headerText = selectedPainType ? selectedPainType : "Select";

	// Determines which arrow icon to show (up when open, down when closed)
	const ArrowIcon = isPainTypeMenuVisible ? ArrowUp : ArrowDown;

	return (
		<View
			className="px-5 py-3 border rounded-lg"
			style={{
				backgroundColor: theme.textFieldBG,
				borderColor: theme.borderColor
			}}
		>
			{/* DROPDOWN HEADER */}
			<TouchableOpacity onPress={togglePainTypeMenu}>
				<View className="flex flex-row justify-between items-center">
					<Text
						className={`font-raleway text-[16px]`}
						style={{
							color: selectedPainType ? theme.textColor : theme.darkGrey
						}}
					>
						{headerText}
					</Text>
					<View className="pl-6">
						{/* Arrow icon indicating dropdown state */}
						<ArrowIcon color={theme.darkGrey} />
					</View>
				</View>
			</TouchableOpacity>

			{/* DROPDOWN MENU CONTENT */}
			{isPainTypeMenuVisible && (
				<View
					className="pt-2 mt-2 border-t"
					style={{ borderColor: theme.borderColor }}
				>
					{painTypes.map((type, index) => (
						<TouchableOpacity
							key={type}
							onPress={() => handleSelectType(type)}
							className={`py-3`}
							style={index < painTypes.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.borderColor } : {}}
						>
							<Text
								className={`font-raleway text-[16px] ${selectedPainType === type ? 'font-bold' : ''
									}`}
								style={{ color: theme.textColor }}
							>
								{type}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
};

export default PainTypeMenuItems;