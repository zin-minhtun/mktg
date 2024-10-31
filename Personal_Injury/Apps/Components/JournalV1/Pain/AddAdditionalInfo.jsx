import {
	ScrollView,
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";

// Components
import EditIcon from "../../Icons/EditIcon";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

const AddAdditionalInfo = () => {
	const [notes, setNotes] = useState(""); // State for notes
	const [notes_1, setNotes_1] = useState(""); // State for notes_1
	const [notes_2, setNotes_2] = useState(""); // State for notes_2
	const [notes_3, setNotes_3] = useState(""); // State for notes_3

	return (
		<View className="flex-1 px-4 bg-[#FAFBFC] mt-6">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 250 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="mt-8">
					<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
						What made the pain go away or feel better
					</Text>
 
					{/* Textarea for notes */}
					<StyledTextInput
						multiline
						value={notes}
						onChangeText={setNotes}
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
								notes.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
							}`}
						>
							<CrossIcon isActive={notes.length > 0} />
						</View>
						<TouchableOpacity
							onPress={() => null}
							disabled={notes.length === 0}
							className={`justify-center items-center rounded-full w-10 h-10 ${
								notes.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
							}`}
						>
							<CheckIcon isActive={notes.length > 0} />
						</TouchableOpacity>
					</View>
				</View>
				<View className="mt-6">
					<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
						What triggered the pain
					</Text>

					{/* Textarea for notes */}
					<StyledTextInput
						multiline
						value={notes_1}
						onChangeText={setNotes_1}
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
								notes_1.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
							}`}
						>
							<CrossIcon isActive={notes_1.length > 0} />
						</View>
						<TouchableOpacity
							onPress={() => null}
							disabled={notes_1.length === 0}
							className={`justify-center items-center rounded-full w-10 h-10 ${
								notes_1.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
							}`}
						>
							<CheckIcon isActive={notes_1.length > 0} />
						</TouchableOpacity>
					</View>
				</View>
				<View className="mt-6">
					<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
						How does the pain limit what you can do
					</Text>

					{/* Textarea for notes */}
					<StyledTextInput
						multiline
						value={notes_2}
						onChangeText={setNotes_2}
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
								notes_2.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
							}`}
						>
							<CrossIcon isActive={notes_2.length > 0} />
						</View>
						<TouchableOpacity
							onPress={() => null}
							disabled={notes_2.length === 0}
							className={`justify-center items-center rounded-full w-10 h-10 ${
								notes_2.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
							}`}
						>
							<CheckIcon isActive={notes_2.length > 0} />
						</TouchableOpacity>
					</View>
				</View>
				<View className="mt-6">
					<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
						What activity worsened the pain
					</Text>

					{/* Textarea for notes */}
					<StyledTextInput
						multiline
						value={notes_3}
						onChangeText={setNotes_3}
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
								notes_3.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
							}`}
						>
							<CrossIcon isActive={notes_2.length > 0} />
						</View>
						<TouchableOpacity
							onPress={() => null}
							disabled={notes_3.length === 0}
							className={`justify-center items-center rounded-full w-10 h-10 ${
								notes_3.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
							}`}
						>
							<CheckIcon isActive={notes_3.length > 0} />
						</TouchableOpacity>
					</View>
				</View>

				<View className="absolute bottom-10 left-0 right-0">
					<TouchableOpacity
						className="w-full bg-primaryBlue py-4 rounded-full"
						onPress={() => null}
					>
						<Text className="text-center text-white font-ralewaySemiBold text-[16px]">
							Continue
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

export default AddAdditionalInfo;
