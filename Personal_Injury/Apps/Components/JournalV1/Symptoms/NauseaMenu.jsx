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

const NauseaMenu = () => {
	const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false);
	const [selectedConfusionTime, setSelectedConfusionTime] = useState(null);
	const [didThrowUp, setDidThrowUp] = useState(null); // State for whether they threw up
	const [nauseaTrigger, setNauseaTrigger] = useState(""); // State for what triggered the nausea
	const [feelBetterNote, setFeelBetterNote] = useState(""); // State for what made them feel better
    const [additionalNotes, setAdditionalNotes] = useState(""); // State for additional notes

	useEffect(() => {
		console.log(selectedConfusionTime);
	}, [selectedConfusionTime]);

	useEffect(() => {
		console.log(didThrowUp);
	}, [didThrowUp]);

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
						Nausea
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
						{/* Radio buttons for time of confusion */}
						{["morning", "afternoon", "evening", "night", "throughoutDay"].map(
							(time) => (
								<View className="mr-3 flex flex-row mb-4" key={time}>
									<RadioButton
										status={
											selectedConfusionTime === time ? "checked" : "unchecked"
										}
										onPress={() => setSelectedConfusionTime(time)}
									/>
									<Text className="font-raleway text-gray-500 text-[16px]">
										{time.charAt(0).toUpperCase() + time.slice(1)}
									</Text>
								</View>
							)
						)}
					</View>

					<View className="mt-3">
						<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
							Did you throw up
						</Text>
						<View className="flex flex-row flex-wrap">
							<View className="mr-3 flex flex-row mb-4">
								<RadioButton
									status={didThrowUp === "yes" ? "checked" : "unchecked"}
									onPress={() => setDidThrowUp("yes")}
								/>
								<Text className="font-raleway text-gray-500 text-[16px]">
									Yes
								</Text>
							</View>
							<View className="mr-3 flex flex-row mb-4">
								<RadioButton
									status={didThrowUp === "no" ? "checked" : "unchecked"}
									onPress={() => setDidThrowUp("no")}
								/>
								<Text className="font-raleway text-gray-500 text-[16px]">
									No
								</Text>
							</View>
						</View>
					</View>

					<View className="mt-3">
						<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
							What triggered the nausea?
						</Text>

						{/* Textarea for nausea trigger notes */}
						<StyledTextInput
							multiline
							value={nauseaTrigger}
							onChangeText={setNauseaTrigger}
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
									nauseaTrigger.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
								}`}
							>
								<CrossIcon isActive={nauseaTrigger.length > 0} />
							</View>
							<TouchableOpacity
								onPress={() => null}
								disabled={nauseaTrigger.length === 0}
								className={`justify-center items-center rounded-full w-10 h-10 ${
									nauseaTrigger.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
								}`}
							>
								<CheckIcon isActive={nauseaTrigger.length > 0} />
							</TouchableOpacity>
						</View>
					</View>

					<View className="mt-8">
						<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
							What made you feel better?
						</Text>

						{/* Textarea for nausea trigger notes */}
						<StyledTextInput
							multiline
							value={feelBetterNote}
							onChangeText={setFeelBetterNote}
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
									feelBetterNote.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
								}`}
							>
								<CrossIcon isActive={feelBetterNote.length > 0} />
							</View>
							<TouchableOpacity
								onPress={() => null}
								disabled={feelBetterNote.length === 0}
								className={`justify-center items-center rounded-full w-10 h-10 ${
									feelBetterNote.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
								}`}
							>
								<CheckIcon isActive={feelBetterNote.length > 0} />
							</TouchableOpacity>
						</View>
					</View>

					<View className="mt-8">
						<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
							Tell us more about it
						</Text>

						{/* Textarea for nausea trigger notes */}
						<StyledTextInput
							multiline
							value={additionalNotes}
							onChangeText={setAdditionalNotes}
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
									additionalNotes.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
								}`}
							>
								<CrossIcon isActive={additionalNotes.length > 0} />
							</View>
							<TouchableOpacity
								onPress={() => null}
								disabled={additionalNotes.length === 0}
								className={`justify-center items-center rounded-full w-10 h-10 ${
									additionalNotes.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
								}`}
							>
								<CheckIcon isActive={additionalNotes.length > 0} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</>
	);
};

export default NauseaMenu;
