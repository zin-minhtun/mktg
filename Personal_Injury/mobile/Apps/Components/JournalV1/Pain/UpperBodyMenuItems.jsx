import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Checkbox from "expo-checkbox";

// Import components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import ShoulderIcon from "./svg/ShoulderIcon";
import UpperArmIcon from "./svg/UpperArmIcon";
import ForearmIcon from "./svg/ForearmIcon";
import ElbowIcon from "./svg/ElbowIcon";
import WristIcon from "./svg/WristIcon";
import HandIcon from "./svg/HandIcon";
import BackIcon from "./svg/BackIcon";
import ChestIcon from "./svg/ChestIcon";
import AbdomenIcon from "./svg/AbdomenIcon";

const UpperBodyMenuItems = ({ painLocation = [], setPainLocation }) => {
	const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false); // State to control visibility

	// State for all checkboxes
	const [checkboxes, setCheckboxes] = useState({
		//Shoulder
		shoulderBoth: false,
		shoulderRightSide: false,
		shoulderLeftSide: false,
		//Upper Arm
		upperArmBoth: false,
		upperArmRightSide: false,
		upperArmLeftSide: false,
		//Forearm
		forearmBoth: false,
		forearmRightSide: false,
		forearmLeftSide: false,
		//Elbow
		elbowBoth: false,
		elbowRightSide: false,
		elbowLeftSide: false,
		//Wrist
		wristBoth: false,
		wristRightSide: false,
		wristLeftSide: false,
		//Hand
		handBoth: false,
		handRightSide: false,
		handLeftSide: false,
		//Chest
		chestBoth: false,
		chestRightSide: false,
		chestLeftSide: false,
		//Abdomen
		abdomenBoth: false,
		abdomenRightSide: false,
		abdomenLeftSide: false,
		//Back
		backBoth: false,
		backRightSide: false,
		backLeftSide: false,
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
		<View className="border-b border-b-[#EDECF4]">
			<View className="flex flex-row justify-between">
				<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
					Upper Body
				</Text>
				<TouchableOpacity onPress={toggleHeadPainMenu}>
					<View className="pl-6 py-3">
						{isHeadPainMenuVisible ? <ArrowDown /> : <ArrowRight />}
					</View>
				</TouchableOpacity>
			</View>
			{/* SHOULDER SECTION */}
			{isHeadPainMenuVisible && (
				<View className="border-b border-b-[#EDECF4]">
					<View className="flex flex-row">
						<View className="flex-1 p-4">
							<View className="mb-2">
								<ShoulderIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Shoulder
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.shoulderBoth}
									onValueChange={() => toggleCheckbox("shoulderBoth")}
									color={checkboxes.shoulderBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.shoulderRightSide}
									onValueChange={() => toggleCheckbox("shoulderRightSide")}
									color={checkboxes.shoulderRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.shoulderLeftSide}
									onValueChange={() => toggleCheckbox("shoulderLeftSide")}
									color={checkboxes.shoulderLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
						<View className="w-[1px] bg-[#EDECF4] my-4"></View>
						{/* UPPER ARM SECTION */}
						<View className="flex-1 p-4">
							<View className="mb-2">
								<UpperArmIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Upper Arm
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.upperArmBoth}
									onValueChange={() => toggleCheckbox("upperArmBoth")}
									color={checkboxes.upperArmBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.upperArmRightSide}
									onValueChange={() => toggleCheckbox("upperArmRightSide")}
									color={checkboxes.upperArmRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.upperArmLeftSide}
									onValueChange={() => toggleCheckbox("upperArmLeftSide")}
									color={checkboxes.upperArmLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
					</View>
					{/* FORARM SECTION */}
					<View className="flex flex-row border-t border-t-[#EDECF4]">
						<View className="flex-1 p-4">
							<View className="mb-2">
								<ForearmIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Forearm
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.forearmBoth}
									onValueChange={() => toggleCheckbox("forearmBoth")}
									color={checkboxes.forearmBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.forearmRightSide}
									onValueChange={() => toggleCheckbox("forearmRightSide")}
									color={checkboxes.forearmRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.forearmLeftSide}
									onValueChange={() => toggleCheckbox("forearmLeftSide")}
									color={checkboxes.forearmLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
						<View className="w-[1px] bg-[#EDECF4] my-4"></View>
						{/* ELBOW SECTION */}
						<View className="flex-1 p-4">
							<View className="mb-2">
								<ElbowIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Elbow
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.elbowBoth}
									onValueChange={() => toggleCheckbox("elbowBoth")}
									color={checkboxes.elbowBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.elbowRightSide}
									onValueChange={() => toggleCheckbox("elbowRightSide")}
									color={checkboxes.elbowRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.elbowLeftSide}
									onValueChange={() => toggleCheckbox("elbowLeftSide")}
									color={checkboxes.elbowLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
					</View>
					{/* WRIST SECTION */}
					<View className="flex flex-row border-t border-t-[#EDECF4]">
						<View className="flex-1 p-4">
							<View className="mb-2">
								<WristIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Wrist
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.wristBoth}
									onValueChange={() => toggleCheckbox("wristBoth")}
									color={checkboxes.wristBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.wristRightSide}
									onValueChange={() => toggleCheckbox("wristRightSide")}
									color={checkboxes.wristRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.wristLeftSide}
									onValueChange={() => toggleCheckbox("wristLeftSide")}
									color={checkboxes.wristLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
						<View className="w-[1px] bg-[#EDECF4] my-4"></View>
						{/* HAND SECTION */}
						<View className="flex-1 p-4">
							<View className="mb-2">
								<HandIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Hand
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.handBoth}
									onValueChange={() => toggleCheckbox("handBoth")}
									color={checkboxes.handBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.handRightSide}
									onValueChange={() => toggleCheckbox("handRightSide")}
									color={checkboxes.handRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.handLeftSide}
									onValueChange={() => toggleCheckbox("handLeftSide")}
									color={checkboxes.handLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
					</View>
					{/* CHEST SECTION */}
					<View className="flex flex-row border-t border-t-[#EDECF4]">
						<View className="flex-1 p-4">
							<View className="mb-2">
								<ChestIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Chest
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.chestBoth}
									onValueChange={() => toggleCheckbox("chestBoth")}
									color={checkboxes.chestBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.chestRightSide}
									onValueChange={() => toggleCheckbox("chestRightSide")}
									color={checkboxes.chestRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.chestLeftSide}
									onValueChange={() => toggleCheckbox("chestLeftSide")}
									color={checkboxes.chestLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
						<View className="w-[1px] bg-[#EDECF4] my-4"></View>
						{/* ABDOMEN SECTION */}
						<View className="flex-1 p-4">
							<View className="mb-2">
								<AbdomenIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
								Abdomen
							</Text>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Both
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.abdomenBoth}
									onValueChange={() => toggleCheckbox("abdomenBoth")}
									color={checkboxes.abdomenBoth ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center mb-1">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Right Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.abdomenRightSide}
									onValueChange={() => toggleCheckbox("abdomenRightSide")}
									color={checkboxes.abdomenRightSide ? "#00b8df" : undefined}
								/>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-raleway text-primaryDarkBlue text-[14px]">
									Left Side
								</Text>
								<Checkbox
									className="border-2 border-primaryBlue"
									value={checkboxes.abdomenLeftSide}
									onValueChange={() => toggleCheckbox("abdomenLeftSide")}
									color={checkboxes.abdomenLeftSide ? "#00b8df" : undefined}
								/>
							</View>
						</View>
					</View>
					{/* BACK SECTION */}
					<View className="border-t border-t-[#EDECF4]">
						<View className="items-center p-4">
							<View className="w-full max-w-[150px]">
								<View className="mb-2">
									<BackIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] mb-2">
									Back
								</Text>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backBoth}
										onValueChange={() => toggleCheckbox("backBoth")}
										color={checkboxes.backBoth ? "#00b8df" : undefined}
									/>
								</View>
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backRightSide}
										onValueChange={() => toggleCheckbox("backRightSide")}
										color={checkboxes.backRightSide ? "#00b8df" : undefined}
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backLeftSide}
										onValueChange={() => toggleCheckbox("backLeftSide")}
										color={checkboxes.backLeftSide ? "#00b8df" : undefined}
									/>
								</View>
							</View>
						</View>
					</View>
				</View>
			)}
		</View>
	);
};

export default UpperBodyMenuItems;
