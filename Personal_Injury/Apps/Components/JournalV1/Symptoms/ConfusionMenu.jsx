import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";

// Components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

// Custom RadioButton component
const RadioButton = ({ value, status, onPress }) => (
	<TouchableOpacity
		onPress={onPress}
		style={{ flexDirection: "row", alignItems: "center" }}
	>
		<View
			style={{
				width: 23,
				height: 23,
				borderRadius: 13,
				borderWidth: 2,
				borderColor: "#00b8df",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{status === "checked" && (
				<View
					style={{
						width: 12,
						height: 12,
						borderRadius: 6,
						backgroundColor: "#00b8df",
					}}
				/>
			)}
		</View>
		<Text style={{ marginLeft: 8 }}>{value}</Text>
	</TouchableOpacity>
);

const ConfusionMenu = () => {
	const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false);
	const [selectedConfusionTime, setSelectedConfusionTime] = useState(null);
	const [confusionNote, setConfusionNote] = useState(""); // State for other confusion note

	useEffect(() => {
		console.log(selectedConfusionTime);
	}, [selectedConfusionTime]);

	const toggleHeadPainMenu = () => {
		setIsHeadPainMenuVisible(!isHeadPainMenuVisible);
	};

	return (
		<>
			<View className={`border rounded-lg px-3 ${
                isHeadPainMenuVisible ? "bg-primaryLightBlue border-primaryBlue" : "border-[#EDECF4] bg-white"
            }`}>
				<View className="flex flex-row justify-between">
					<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
						Confusion
					</Text>
					<TouchableOpacity onPress={toggleHeadPainMenu}>
						<View className="pl-6 py-3">
							{isHeadPainMenuVisible ? <ArrowDown /> : <ArrowRight />}
						</View>
					</TouchableOpacity>
				</View>
			</View>

			{isHeadPainMenuVisible && (
				<View className="p-5 bg-white mt-4 rounded-lg">
					<View className="flex flex-row flex-wrap">
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedConfusionTime === "morning" ? "checked" : "unchecked"
								}
								onPress={() => setSelectedConfusionTime("morning")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Morning
							</Text>
						</View>
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedConfusionTime === "afternoon"
										? "checked"
										: "unchecked"
								}
								onPress={() => setSelectedConfusionTime("afternoon")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Afternoon
							</Text>
						</View>
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedConfusionTime === "evening" ? "checked" : "unchecked"
								}
								onPress={() => setSelectedConfusionTime("evening")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Evening
							</Text>
						</View>
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedConfusionTime === "night" ? "checked" : "unchecked"
								}
								onPress={() => setSelectedConfusionTime("night")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Night
							</Text>
						</View>
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedConfusionTime === "throughoutDay"
										? "checked"
										: "unchecked"
								}
								onPress={() => setSelectedConfusionTime("throughoutDay")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Throughout the day
							</Text>
						</View>
					</View>

					<View className="mt-3">
						<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
							Tell us more about it
						</Text>

						{/* Textarea for notes */}
						<StyledTextInput
							multiline
							value={confusionNote}
							onChangeText={setConfusionNote}
							placeholder="Add notes"
							placeholderTextColor="#C8C8C8"
							className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg border-[#EDECF4] bg-white focus:border-primaryBlue"
							style={{ textAlignVertical: "top" }}
						/>

						<View className="flex-row justify-end mt-3">
							<View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
								<AudioInputIcon />
							</View>
							<View
								className={`first-letter:justify-center items-center mr-3 rounded-full w-10 h-10 ${
									confusionNote.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
								}`}
							>
								<CrossIcon isActive={confusionNote.length > 0} />
							</View>
							<TouchableOpacity
								onPress={() => null}
								disabled={confusionNote.length === 0}
								className={`justify-center items-center rounded-full w-10 h-10 ${
									confusionNote.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
								}`}
							>
								<CheckIcon isActive={confusionNote.length > 0} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</>
	);
};

export default ConfusionMenu;
