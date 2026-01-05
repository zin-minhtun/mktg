import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';

const Stack = createNativeStackNavigator();

// Import Components
import CustomHeader from "../Components/JournalV1/CustomHeader";
import AddPainCardDetails from "../Components/JournalV1/Pain/AddPainCardDetails";
import AddAdditionalInfo from "../Components/JournalV1/Pain/AddAdditionalInfo";
import AddSymptomsDetails from "../Components/JournalV1/Symptoms/AddSymptomsDetails";
import SelectedSymptomsDetails from "../Components/JournalV1/Symptoms/SelectedSymptomsDetails";
import EditSymptomDetails from "../Components/JournalV1/Symptoms/EditSymptomDetails";
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
import WeeklySleepLog from "../Components/JournalV1/Sleep/WeeklySleepLog";
import AddExercise from "../Components/JournalV1/Lifestyle/AddExercise";
import AddSocialActivity from "../Components/JournalV1/Lifestyle/AddSocialActivity";
import MoodRecords from "../Components/JournalV1/Mood/MoodRecords";
import JournalV1 from "../Screens/NavigatorTabs/JournalV1";
import MoodDetail from "../Components/JournalV1/Mood/MoodDetail";

const JournalNavigator = ({ navigation }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="JournalMain"
				component={JournalV1}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="MoodRecords"
				component={MoodRecords}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="MoodDetail"
				component={MoodDetail}
				options={{ headerShown: false }}
			/>
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
							onBackPress={() => navigation.navigate("JournalMain", { section: "symptoms" })}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="EditSymptomDetails"
				component={EditSymptomDetails}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Edit Symptoms"
							onBackPress={() => navigation.navigate("JournalMain", { section: "symptoms" })}
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
				options={({ route }) => ({
					header: () => {
						// 1. Read the custom return screen parameter
						const returnScreen = route.params?.returnScreen;

						// 2. Define conditional back action
						const onBackPress = () => {
							if (returnScreen === "WeeklySleepLog") {
								navigation.navigate("WeeklySleepLog");
							} else {
								navigation.goBack();
							}
						};

						return (
							<CustomHeader
								title="Sleep Duration"
								onBackPress={onBackPress} // Use the custom handler
								onIconPress={() => null}
							/>
						);
					},
				})}
			/>
			<Stack.Screen
				name="WeeklySleepLog"
				component={WeeklySleepLog}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Weekly Sleep Log"
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
			<Stack.Screen
				name="AddExercise"
				component={AddExercise}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Add Exercise"
							onBackPress={() => navigation.goBack()}
							onIconPress={() => null}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="AddSocialActivity"
				component={AddSocialActivity}
				options={() => ({
					header: () => (
						<CustomHeader
							title="Add Social Activity"
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
