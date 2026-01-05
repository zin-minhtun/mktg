import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Checkbox from "expo-checkbox";

// Import components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import ThighIcon from "./svg/ThighIcon";
import KneeIcon from "./svg/KneeIcon";
import FeetIcon from "./svg/FeetIcon";
import AnkleIcon from "./svg/AnkleIcon";

const LowerBodyMenuItems = ({ painLocation = [], setPainLocation }) => {
	const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false); // State to control visibility

	// State for all checkboxes
	const [checkboxes, setCheckboxes] = useState({
		// Thigh
		thighBoth: false,
		thighRightSide: false,
		thighLeftSide: false,
		// Knee
		kneeBoth: false,
		kneeRightSide: false,
		kneeLeftSide: false,
		// Ankle
		ankleBoth: false,
		ankleRightSide: false,
		ankleLeftSide: false,
		// Feet
		feetBoth: false,
		feetRightSide: false,
		feetLeftSide: false,
	});

	// Initialize checkboxes from painLocation prop
	useEffect(() => {
		if (painLocation && Array.isArray(painLocation) && painLocation.length > 0) {
			const newCheckboxes = { ...checkboxes };
			Object.keys(checkboxes).forEach(key => {
				newCheckboxes[key] = painLocation.includes(key);
			});
			setCheckboxes(newCheckboxes);
		}
	}, [painLocation]);

	// Handle checkbox toggle
	const toggleCheckbox = (key) => {
		const newValue = !checkboxes[key];

		setCheckboxes((prev) => ({
			...prev,
			[key]: newValue,
		}));

		// Update parent component
		if (setPainLocation) {
			if (newValue) {
				// Add to array if checked
				setPainLocation([...painLocation, key]);
			} else {
				// Remove from array if unchecked
				setPainLocation(painLocation.filter(item => item !== key));
			}
		}
	};

	// Toggle visibility when ArrowRight is pressed
	const toggleHeadPainMenu = () => {
		setIsHeadPainMenuVisible(!isHeadPainMenuVisible);
	};

	return (
		<>
			<View className="border-b border-b-[#EDECF4]">
				<View className="flex flex-row justify-between">
					<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
						Lower Body
					</Text>
					{/* Touchable ArrowRight to toggle menu */}
					<TouchableOpacity onPress={toggleHeadPainMenu}>
						<View className="pl-6 py-3">
							{isHeadPainMenuVisible ? <ArrowDown /> : <ArrowRight />}
						</View>
					</TouchableOpacity>
				</View>

				{isHeadPainMenuVisible && (
					<>
						<View className="border-b border-b-[#EDECF4]">
							<View className="flex flex-row">
								{/* Left Side with Checkboxes */}
								<View className="flex-1 p-4">
									<View className="mb-2">
										<ThighIcon />
									</View>
									<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
										Thigh
									</Text>
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Both
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.thighBoth}
											onValueChange={() => toggleCheckbox("thighBoth")}
											color={checkboxes.thighBoth ? "#00b8df" : undefined} // Checked color
										/>
									</View>
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Right Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.thighRightSide}
											onValueChange={() => toggleCheckbox("thighRightSide")}
											color={checkboxes.thighRightSide ? "#00b8df" : undefined} // Checked color
										/>
									</View>
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Left Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.thighLeftSide}
											onValueChange={() => toggleCheckbox("thighLeftSide")}
											color={checkboxes.thighLeftSide ? "#00b8df" : undefined} // Checked color
										/>
									</View>
								</View>

								{/* Vertical Divider */}
								<View className="w-[1px] bg-[#EDECF4] my-4"></View>

								{/* Right Side with Checkboxes */}
								<View className="flex-1 p-4">
									<View className="mb-2">
										<KneeIcon />
									</View>
									<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
										Knee
									</Text>
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Both
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.kneeBoth}
											onValueChange={() => toggleCheckbox("kneeBoth")}
											color={checkboxes.kneeBoth ? "#00b8df" : undefined} // Checked color
										/>
									</View>
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Right Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.kneeRightSide}
											onValueChange={() => toggleCheckbox("kneeRightSide")}
											color={checkboxes.kneeRightSide ? "#00b8df" : undefined} // Checked color
										/>
									</View>
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Left Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.kneeLeftSide}
											onValueChange={() => toggleCheckbox("kneeLeftSide")}
											color={checkboxes.kneeLeftSide ? "#00b8df" : undefined} // Checked color
										/>
									</View>
								</View>
							</View>
						</View>

						<View className="flex flex-row border-t border-t-[#EDECF4]">
							{/* Left Side with Checkboxes */}
							<View className="flex-1 p-4">
								<View className="mb-2">
									<AnkleIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
									Ankle
								</Text>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.ankleBoth}
										onValueChange={() => toggleCheckbox("ankleBoth")}
										color={checkboxes.ankleBoth ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.ankleRightSide}
										onValueChange={() => toggleCheckbox("ankleRightSide")}
										color={checkboxes.ankleRightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.ankleLeftSide}
										onValueChange={() => toggleCheckbox("ankleLeftSide")}
										color={checkboxes.ankleLeftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>

							{/* Vertical Divider */}
							<View className="w-[1px] bg-[#EDECF4] my-4"></View>

							{/* Right Side with Checkboxes */}
							<View className="flex-1 p-4">
								<View className="mb-2">
									<FeetIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
									Feet
								</Text>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.feetBoth}
										onValueChange={() => toggleCheckbox("feetBoth")}
										color={checkboxes.feetBoth ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.feetRightSide}
										onValueChange={() => toggleCheckbox("feetRightSide")}
										color={checkboxes.feetRightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.feetLeftSide}
										onValueChange={() => toggleCheckbox("feetLeftSide")}
										color={checkboxes.feetLeftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>
						</View>
					</>
				)}
			</View>
		</>
	);
};

export default LowerBodyMenuItems;
