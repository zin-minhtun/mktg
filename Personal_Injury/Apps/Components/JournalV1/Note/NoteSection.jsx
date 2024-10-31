import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";
import dayjs from "dayjs";

// Components
import EditIcon from "../../Icons/EditIcon";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

const NoteSection = () => {
	const [notes, setNotes] = useState(""); // State for notes
	const [notesList, setNotesList] = useState([]); // List of added notes

	// Handle add note
	const addNote = () => {
		if (notes.trim() !== "") {
			const newNote = {
				text: notes,
				date: dayjs().format(), // Add creation date
			};
			setNotesList([newNote, ...notesList]); // Add the note to the list
			setNotes(""); // Clear the input field after adding
		}
	};

	// Render note item
	const renderNoteItem = ({ item }) => (
		<>
			<Text className="font-raleway text-[16px] text-gray-600 mb-2">
				{dayjs(item.date).format("hh:mm")}
			</Text>
			<View className="flex-row items-center mb-2 p-[16px] border border-[#EDECF4] bg-white h-[74px] rounded-lg space-x-4">
				<Image
					source={require("../../../../assets/journal/img/note.png")}
					style={{ width: 40, height: 40 }}
				/>
				<View className="flex-1 flex-row h-16 items-center">
					<Text
						className="font-raleway leading-5 text-[16px] text-gray-500 flex-1"
						numberOfLines={0}
					>
						{item.text}
					</Text>
					<EditIcon />
				</View>
			</View>
		</>
	);

	return (
		<View className="flex-1 mx-3 pt-8">
			<Text className="font-ralewayBold mb-3 text-primaryDarkBlue text-[16px]">
				Add Notes
			</Text>

			{/* Textarea for notes */}
			<StyledTextInput
				multiline
				value={notes}
				onChangeText={setNotes}
				placeholder="Add notes"
				placeholderTextColor="#C8C8C8"
				className="font-raleway text-[16px] h-28 p-3 border rounded-lg border-[#EDECF4] bg-white focus:border-primaryBlue"
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
					onPress={addNote}
					disabled={notes.length === 0}
					className={`justify-center items-center rounded-full w-10 h-10 ${
						notes.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
					}`}
				>
					<CheckIcon isActive={notes.length > 0} />
				</TouchableOpacity>
			</View>

			{/* Render list of added notes */}
			<View className="flex-1 mt-10">
				<FlatList
					data={notesList}
					showsVerticalScrollIndicator={false}
					renderItem={renderNoteItem}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		</View>
	);
};

export default NoteSection;
