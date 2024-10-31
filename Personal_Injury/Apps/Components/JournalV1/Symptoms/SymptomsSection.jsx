import React from "react";
import { Text, View, Image } from "react-native";
import DecoratedAddBtn from "../DecoratedAddBtn";
import Symptoms from "../../Icons/Symptoms";

const SymptomsSection = ({ navigation }) => {
	return (
		<View className="flex-1 items-center relative">
			<Symptoms />

			<View className="absolute bottom-36 items-center">
				<Text className="text-[20px] font-ralewaySemiBold text-primaryDarkBlue">
					You don’t have any records.
				</Text>
				<Text className="text-[16px] pt-1.5 font-raleway text-[#939598]">
					Click the plus button to add a Pain Card
				</Text>
			</View>

			<DecoratedAddBtn navigation={navigation} screen={"AddSymptomsDetails"} />
		</View>
	);
};

export default SymptomsSection;
