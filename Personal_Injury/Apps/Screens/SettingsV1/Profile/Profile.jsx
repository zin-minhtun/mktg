import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import UserIcon from "../svg/UserIcon";
import CameraFillIcon from "../svg/CameraFillIcon";

const Profile = ({ navigation }) => {
	return (
		<View className="flex-1 bg-[#FAFBFC] px-4 mt-6">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 250 }}
				showsVerticalScrollIndicator={false}te
			>
				<View className="mt-8 flex flex-row justify-center relative">
					<View className="bg-white rounded-full w-[180px] h-[180px] flex items-center justify-center overflow-hidden">
						<UserIcon width={150} height={150} />
					</View>
					<CameraFillIcon className="absolute bottom-0 right-[120px]" />
				</View>
			</ScrollView>
		</View>
	);
};

export default Profile;
