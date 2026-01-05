import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Main settings screen (V1 UI moved under Settings)
import SettingsV1Main from "../Screens/Settings/Settings";

// Custom header used by V1 subpages
import CustomHeader from "../Components/JournalV1/CustomHeader";

// Sub-pages reused by Settings
import Profile from "../Screens/Settings/Profile/Profile";
import ResetPassword from "../Screens/Settings/ResetPassword";
import DataShare from "../Screens/Settings/DataShare";
import Feedback from "../Screens/Settings/Feedback";
import FAQs from "../Screens/Settings/FAQs";
import AboutUs from "../Screens/Settings/AboutUs";
import ContactSupport from "../Screens/Settings/ContactSupport";
import MyHealthRecord from "../Screens/Settings/MyHealthRecord";
import Legal from "../Screens/Settings/Legal";
import RemindersStack from "./RemindersStack";
import EditProfile from "../Screens/Settings/EditProfile";
import NotificationSettings from "../Screens/Settings/NotificationSettings";

const Stack = createNativeStackNavigator();
const SubStack = createNativeStackNavigator();

// Sub stack that previously lived in SettingsNavigatorV1.js
export const SettingsSubStack = ({ navigation, route }) => {
  const initial = route?.params?.screen || "Profile";
  return (
    <SubStack.Navigator initialRouteName={initial}>
      <SubStack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: () => (
            <CustomHeader title="Profile" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          header: () => (
            <CustomHeader title="Edit Profile" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          header: () => (
            <CustomHeader title="Security" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="DataShare"
        component={DataShare}
        options={{
          header: () => (
            <CustomHeader title="Data Share" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          header: () => (
            <CustomHeader title="Make a Suggestion" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="FAQs"
        component={FAQs}
        options={{
          header: () => (
            <CustomHeader title="FAQs" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          header: () => (
            <CustomHeader title="About Us" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="ContactSupport"
        component={ContactSupport}
        options={{
          header: () => (
            <CustomHeader title="Contact Support" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen name="RemindersNavigator" component={RemindersStack} options={{ headerShown: false }} />
      <SubStack.Screen
        name="MyHealthRecord"
        component={MyHealthRecord}
        options={{
          header: () => (
            <CustomHeader title="My Health Record" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="Legal"
        component={Legal}
        options={{
          header: () => (
            <CustomHeader title="Legal" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
      <SubStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{
          header: () => (
            <CustomHeader title="Notifications" onBackPress={() => navigation.goBack()} onIconPress={() => null} />
          ),
        }}
      />
    </SubStack.Navigator>
  );
};

// Unified settings stack (single file)
const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainSettings" component={SettingsV1Main} options={{ headerShown: false }} />
    {/* Keep route name for backward compatibility with existing navigation.push("SettingsNavigatorV1", { screen }) */}
    <Stack.Screen name="SettingsNavigatorV1" component={SettingsSubStack} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default SettingsStack;
