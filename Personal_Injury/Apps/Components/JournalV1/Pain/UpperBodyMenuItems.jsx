import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
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

const UpperBodyMenuItems = () => {
	const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false); // State to control visibility

	// State for all checkboxes
	const [checkboxes, setCheckboxes] = useState({
		both: false,
		rightSide: false,
		leftSide: false,
		frontSide: false,
		backSide: false,
	});

	// Handle checkbox toggle
	const toggleCheckbox = (key) => {
		setCheckboxes((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
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
				{/* Touchable ArrowRight to toggle menu */}
				<TouchableOpacity onPress={toggleHeadPainMenu}>
					<View className="pl-6 py-3">
						{isHeadPainMenuVisible ? <ArrowDown /> : <ArrowRight />}
					</View>
				</TouchableOpacity>
			</View>
			{/* Conditionally render the head pain menu section */}
			{isHeadPainMenuVisible && (
				<>
					<View className="p-8 gap-y-2 border-b border-b-[#EDECF4]">
						<View className="flex flex-row justify-between space-x-6">
							{/* Left Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<ShoulderIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Shoulder
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.rightSide}
										onValueChange={() => toggleCheckbox("rightSide")}
										color={checkboxes.rightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.leftSide}
										onValueChange={() => toggleCheckbox("leftSide")}
										color={checkboxes.leftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>

							{/* Vertical Divider */}
							<View className="w-[1px] h-[150px] bg-[#EDECF4]" />

							{/* Right Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<UpperArmIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Upper Arm
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Front Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.frontSide}
										onValueChange={() => toggleCheckbox("frontSide")}
										color={checkboxes.frontSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Back Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backSide}
										onValueChange={() => toggleCheckbox("backSide")}
										color={checkboxes.backSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>
						</View>
					</View>

					<View className="p-8 gap-y-2 border-b border-b-[#EDECF4]">
						<View className="flex flex-row justify-between space-x-6">
							{/* Left Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View>
									<ForearmIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Forearm
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.rightSide}
										onValueChange={() => toggleCheckbox("rightSide")}
										color={checkboxes.rightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.leftSide}
										onValueChange={() => toggleCheckbox("leftSide")}
										color={checkboxes.leftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>

							{/* Vertical Divider */}
							<View className="w-[1px] h-[150px] bg-[#EDECF4]" />

							{/* Right Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<ElbowIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Elbow
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Front Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.frontSide}
										onValueChange={() => toggleCheckbox("frontSide")}
										color={checkboxes.frontSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Back Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backSide}
										onValueChange={() => toggleCheckbox("backSide")}
										color={checkboxes.backSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>
						</View>
					</View>

					<View className="p-8 gap-y-2 border-b border-b-[#EDECF4]">
						<View className="flex flex-row justify-between space-x-6">
							{/* Left Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<WristIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Wrist
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.rightSide}
										onValueChange={() => toggleCheckbox("rightSide")}
										color={checkboxes.rightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.leftSide}
										onValueChange={() => toggleCheckbox("leftSide")}
										color={checkboxes.leftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>

							{/* Vertical Divider */}
							<View className="w-[1px] h-[150px] bg-[#EDECF4]" />

							{/* Right Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<HandIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Hand
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Front Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.frontSide}
										onValueChange={() => toggleCheckbox("frontSide")}
										color={checkboxes.frontSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Back Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backSide}
										onValueChange={() => toggleCheckbox("backSide")}
										color={checkboxes.backSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>
						</View>
					</View>

					<View className="p-8 gap-y-2 border-b border-b-[#EDECF4]">
						<View className="flex flex-row justify-between space-x-6">
							{/* Left Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<ChestIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Chest
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.rightSide}
										onValueChange={() => toggleCheckbox("rightSide")}
										color={checkboxes.rightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.leftSide}
										onValueChange={() => toggleCheckbox("leftSide")}
										color={checkboxes.leftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>

							{/* Vertical Divider */}
							<View className="w-[1px] h-[150px] bg-[#EDECF4]" />

							{/* Right Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<AbdomenIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Abdomen
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Front Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.frontSide}
										onValueChange={() => toggleCheckbox("frontSide")}
										color={checkboxes.frontSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Back Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.backSide}
										onValueChange={() => toggleCheckbox("backSide")}
										color={checkboxes.backSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>
						</View>
					</View>
					
					<View className="p-8 gap-y-2">
						<View className="flex flex-row justify-between space-x-6">
							{/* Left Side with Checkboxes */}
							<View className="flex-1 gap-y-2">
								<View className="w-9">
									<BackIcon />
								</View>
								<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
									Back
								</Text>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.both}
										onValueChange={() => toggleCheckbox("both")}
										color={checkboxes.both ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.rightSide}
										onValueChange={() => toggleCheckbox("rightSide")}
										color={checkboxes.rightSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
								<View className="flex flex-row justify-between items-center">
									<Text className="font-raleway text-primaryDarkBlue text-[16px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.leftSide}
										onValueChange={() => toggleCheckbox("leftSide")}
										color={checkboxes.leftSide ? "#00b8df" : undefined} // Checked color
									/>
								</View>
							</View>
						</View>
					</View>
				</>
			)}
		</View>
	);
};

export default UpperBodyMenuItems;
