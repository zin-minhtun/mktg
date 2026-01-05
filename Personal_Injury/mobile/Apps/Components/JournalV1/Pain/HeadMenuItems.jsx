import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Checkbox from "expo-checkbox";

// Import components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import HeadIcon from "./svg/HeadIcon";
import NeckIcon from "./svg/NeckIcon";

const HeadMenuItems = ({ painLocation = [], setPainLocation }) => {
	const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false);

	// State for all checkboxes
	const [checkboxes, setCheckboxes] = useState({
		// Head
		headBothRight: false,
		headrightSide: false,
		headleftSide: false,
		headbothLeft: false,
		headfrontSide: false,
		headbackSide: false,
		// Neck
		neckBothRight: false,
		neckRightSide: false,
		neckLeftSide: false,
		neckBothLeft: false,
		neckFrontSide: false,
		neckBackSide: false,
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

	// Handle checkbox toggle and update parent
	const toggleCheckbox = (key) => {
		const newValue = !checkboxes[key];
		
		setCheckboxes((prev) => ({
			...prev,
			[key]: newValue,
		}));

		// Update parent component - safe check
		if (setPainLocation && painLocation) {
			if (newValue) {
				// Add to array if checked
				if (!painLocation.includes(key)) {
					setPainLocation([...painLocation, key]);
				}
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
						Head
					</Text>
					<TouchableOpacity onPress={toggleHeadPainMenu}>
						<View className="pl-6 py-3">
							{isHeadPainMenuVisible ? <ArrowDown /> : <ArrowRight />}
						</View>
					</TouchableOpacity>
				</View>

				{isHeadPainMenuVisible && (
					<>
						{/* HEAD SECTION */}
						<View className="border-b border-b-[#EDECF4]">
							<View className="items-center mb-2">
								<HeadIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] text-center mb-2">
								Head
							</Text>
							<View className="flex flex-row">
								{/* LEFT SIDE */}
								<View className="flex-1 p-4">
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Both
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.headBothRight}
											onValueChange={() => toggleCheckbox("headBothRight")}
											color={checkboxes.headBothRight ? "#00b8df" : undefined}
										/>
									</View>

									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Right Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.headrightSide}
											onValueChange={() => toggleCheckbox("headrightSide")}
											color={checkboxes.headrightSide ? "#00b8df" : undefined}
										/>
									</View>

									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Left Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.headleftSide}
											onValueChange={() => toggleCheckbox("headleftSide")}
											color={checkboxes.headleftSide ? "#00b8df" : undefined}
										/>
									</View>
								</View>

								{/* DIVIDER */}
								<View className="w-[1px] bg-[#EDECF4] my-4"></View>

								{/* RIGHT SIDE */}
								<View className="flex-1 p-4">
									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Both
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.headbothLeft}
											onValueChange={() => toggleCheckbox("headbothLeft")}
											color={checkboxes.headbothLeft ? "#00b8df" : undefined}
										/>
									</View>

									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Front Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.headfrontSide}
											onValueChange={() => toggleCheckbox("headfrontSide")}
											color={checkboxes.headfrontSide ? "#00b8df" : undefined}
										/>
									</View>

									<View className="flex flex-row justify-between items-center mb-1">
										<Text className="font-raleway text-primaryDarkBlue text-[14px]">
											Back Side
										</Text>
										<Checkbox
											className="border-2 border-primaryBlue"
											value={checkboxes.headbackSide}
											onValueChange={() => toggleCheckbox("headbackSide")}
											color={checkboxes.headbackSide ? "#00b8df" : undefined}
										/>
									</View>
								</View>
							</View>
						</View>
						
						{/* SPACING */}
						<View className="my-2" />

						<View className="items-center">
							<View className="transform scale-x-[-1] w-8 mb-2">
								<NeckIcon />
							</View>
							<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] text-center mb-2">
								Neck
							</Text>
						</View>

						{/* NECK SECTION */}
						<View className="flex flex-row">
							{/* LEFT SIDE */}
							<View className="flex-1 p-4">
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.neckBothRight}
										onValueChange={() => toggleCheckbox("neckBothRight")}
										color={checkboxes.neckBothRight ? "#00b8df" : undefined}
									/>
								</View>

								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Right Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.neckRightSide}
										onValueChange={() => toggleCheckbox("neckRightSide")}
										color={checkboxes.neckRightSide ? "#00b8df" : undefined}
									/>
								</View>

								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Left Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.neckLeftSide}
										onValueChange={() => toggleCheckbox("neckLeftSide")}
										color={checkboxes.neckLeftSide ? "#00b8df" : undefined}
									/>
								</View>
							</View>

							{/* DIVIDER */}
							<View className="w-[1px] bg-[#EDECF4] my-4"></View>

							{/* RIGHT SIDE */}
							<View className="flex-1 p-4">
								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Both
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.neckBothLeft}
										onValueChange={() => toggleCheckbox("neckBothLeft")}
										color={checkboxes.neckBothLeft ? "#00b8df" : undefined}
									/>
								</View>

								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Front Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.neckFrontSide}
										onValueChange={() => toggleCheckbox("neckFrontSide")}
										color={checkboxes.neckFrontSide ? "#00b8df" : undefined}
									/>
								</View>

								<View className="flex flex-row justify-between items-center mb-1">
									<Text className="font-raleway text-primaryDarkBlue text-[14px]">
										Back Side
									</Text>
									<Checkbox
										className="border-2 border-primaryBlue"
										value={checkboxes.neckBackSide}
										onValueChange={() => toggleCheckbox("neckBackSide")}
										color={checkboxes.neckBackSide ? "#00b8df" : undefined}
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

export default HeadMenuItems;