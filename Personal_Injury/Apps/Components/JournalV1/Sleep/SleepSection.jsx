import React from "react";
import { Text, View, Image } from "react-native";
import DecoratedAddBtn from "../DecoratedAddBtn";
import Pain from "../../Icons/Pain";
import Sleep from "./svg/Sleep";

const SleepSection = ({ navigation }) => {
	return (
		<View className="flex-1 items-center relative">
			<View className="mt-8">
				<Sleep />
			</View>

			<View className="absolute bottom-36 items-center">
				<Text className="text-[20px] font-ralewaySemiBold text-primaryDarkBlue">
					You don’t have any records.
				</Text>
				<Text className="text-[16px] pt-1.5 font-raleway text-[#939598]">
					Click the plus button to add
				</Text>
			</View>

			<DecoratedAddBtn
				navigation={navigation}
				screen={"SleepDuration"}
			/>
		</View>
	);
};

export default SleepSection;
