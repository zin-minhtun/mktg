import { View, TouchableOpacity } from "react-native";
import AddIcon from "../Icons/AddIcon";
import DecorativeLines from "../Icons/DecorativeLines";
import ArrowIcon from "../Icons/ArrowIcon";

const DecoratedAddBtn = ({ navigation, screen }) => {
	const handlePress = () => {
		navigation.navigate("JournalNavigator", {
			screen: screen,
		});
	};

	return (
		<>
			<View className="absolute bottom-10 right-24 w-[53px] h-[86px] items-center justify-center">
				<ArrowIcon />
			</View>

			<View className="absolute bottom-7 right-7 w-[44px] h-[80px] items-center justify-center">
				<DecorativeLines />
			</View>

			<TouchableOpacity
				className="absolute bottom-10 right-5 w-[56px] h-[56px] rounded-full bg-primaryBlue items-center justify-center shadow-md shadow-gray-400/80"
				onPress={handlePress}
			>
				<AddIcon />
			</TouchableOpacity>
		</>
	);
};

export default DecoratedAddBtn;
