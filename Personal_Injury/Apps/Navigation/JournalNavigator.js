import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Import Components
import CustomHeader from "../Components/JournalV1/CustomHeader";
import AddPainCardDetails from "../Components/JournalV1/Pain/AddPainCardDetails";
import AddAdditionalInfo from "../Components/JournalV1/Pain/AddAdditionalInfo";
import AddSymptomsDetails from "../Components/JournalV1/Symptoms/AddSymptomsDetails";
import SelectedSymptomsDetails from "../Components/JournalV1/Symptoms/SelectedSymptomsDetails";
import AddMedicationDetails from "../Components/JournalV1/Medication/AddMedicationDetails";
import SleepDuration from "../Components/JournalV1/Sleep/SleepDuration";
import Exercise from "../Components/JournalV1/Lifestyle/Exercise";
import SocialActivity from "../Components/JournalV1/Lifestyle/SocialActivity";
import AddSupplement from "../Components/JournalV1/Lifestyle/AddSupplement";
import AddSupplementDetails from "../Components/JournalV1/Lifestyle/AddSupplementDetails";
import AddWater from "../Components/JournalV1/Lifestyle/AddWater";
import Meal from "../Components/JournalV1/Lifestyle/Meal";
import AddMobility from "../Components/JournalV1/Lifestyle/AddMobility";
import AddMobilityDetails from "../Components/JournalV1/Lifestyle/AddMobilityDetails";
import AddPersonalCareDetails from "../Components/JournalV1/Lifestyle/AddPersonalCareDetails";
import AddPersonalCare from "../Components/JournalV1/Lifestyle/AddPersonalCare";

const JournalNavigator = ({ navigation }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="AddPainCardDetails"
				component={AddPainCardDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Add Pain Card Details"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddAdditionalInfo"
				component={AddAdditionalInfo}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Additional Information"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddSymptomsDetails"
				component={AddSymptomsDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Symptom Tracker"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="SelectedSymptomsDetails"
				component={SelectedSymptomsDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Symptom Tracker"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddMedicationDetails"
				component={AddMedicationDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Add Medication"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="SleepDuration"
				component={SleepDuration}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Sleep Duration"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="Exercise"
				component={Exercise}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Exercise"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="SocialActivity"
				component={SocialActivity}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Social Activity"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddSupplement"
				component={AddSupplement}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Add Supplement"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddSupplementDetails"
				component={AddSupplementDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Add Supplement"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddWater"
				component={AddWater}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Water"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="Meal"
				component={Meal}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Meal"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddMobility"
				component={AddMobility}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Mobility"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddMobilityDetails"
				component={AddMobilityDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Mobility"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddPersonalCare"
				component={AddPersonalCare}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Personal Care"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddPersonalCareDetails"
				component={AddPersonalCareDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Personal Care"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	);
};

export default JournalNavigator;
