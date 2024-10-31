import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { CommonActions } from '@react-navigation/native';

import React, { useState } from "react";
import ToggleSwitch from "../../Components/Switch/ToggleSwitch";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { useUserData } from "../../Contexts/UserContext";
import { useSignUpUserData } from "../../Contexts/SignUpContext";

export default function ProfileSettings({ navigation }) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [isEnabled, setIsEnabled] = useState(isDarkMode);
  const { logOut } = useUserData();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const { deleteAuthUser } = useSignUpUserData();

  const deleteAccount = async () => {
    try {
      const result = await deleteAuthUser(currentPassword);
      console.log("Delete Account result : ", result); // for debuggig - to remove
      console.log("Delete Account result Msg : ", result.message); // for debuggig - to remove
      console.log("Delete Account result status : ", result.status); // for debuggig - to remove

      if (result.status === 200) {
        // Alert.alert("Success", "User Account has been deleted successfully!");
        Alert.alert("Success", `${result.message}`);

        // clean up User data from the AsyncStorage
        await logOut();

        //Navigate to the Home screen
       
        navigation.reset({
          index: 0,
          routes: [{ name: "AuthenticationNavigator" }],
        });
      } else {
        if (result.status === 401 || result.status === 500) {
          throw new Error("Invalid Password!");
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.log("Error Delete Account :", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleLogOut = async () => {
    try {
     

      await logOut(); // Call the logOut function
      console.log("User signed out!");
      //Navigate to the login screen
      
      console.log('navigation object:', navigation);
      

    // Navigate to the login screen
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "AuthenticationNavigator" }],
    // });

    setLogoutModalVisible(false)

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AuthenticationNavigator"}],
      })
    );
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleToggle = () => {
    toggleTheme();
    setIsEnabled(!isEnabled);
  };

  return (
    <View
      className={`flex-1 justify-start p-[20px] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <View className="my-[20px]">
        {/* <View className="h-[10px] bg-gray-300 mb-[8px]" /> */}
        <Text
          className={`font-bold text-[20px] mb-[5px] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          My Account
        </Text>
        <View
          className={`h-[2px] ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          } mb-[8px]`}
        />
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "EditProfile" })
          }
        >
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Edit Profile
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", {
              screen: "ResetPassword",
            })
          }
        >
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Reset Password
          </Text>
        </TouchableHighlight>

        <View>
          <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
            <Text
              className={`text-[18px] my-[10px] ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Delete Account
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-gray-400/50">
              <View className="flex-col items-center w-[95%] p-[10px] bg-white rounded-lg ">
                <Text className="text-[18px] my-[10px]">
                  Please enter your current password.
                </Text>

                <View className="mt-[5px] w-full">
                  <TextInput
                    className="w-full border border-gray-300 rounded-lg text-lg h-[70px] p-3 bg-gray-50 my-[10px]"
                    placeholder="Current Password"
                    value={currentPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 20, top: 30 }}
                  >
                    <Entypo
                      name={showPassword ? "eye-with-line" : "eye"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                <View className="flex-row mt-[5px] w-full justify-between ">
                  <TouchableOpacity
                    className=" my-[5px] w-[100px] h-[40px] bg-[#0b8fc4]  items-center justify-center rounded-lg"
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text className="font-bold text-[16px] text-white">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className=" my-[5px] w-[100px] h-[40px] bg-[#c40b74]  items-center justify-center rounded-lg"
                    onPress={deleteAccount}
                  >
                    <Text className="font-bold text-[16px] text-white">
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View>
          <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
            <Text
              className={`text-[18px] my-[10px] ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Log Out
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={() => setLogoutModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-gray-400/50">
              <View className="flex-col items-center w-[95%] p-[10px] bg-white rounded-lg ">
                <Text className="text-[18px] my-[10px]">
                  Are you sure you want to log out?
                </Text>
                <View className="flex-row mt-[5px] w-full justify-between ">
                  <TouchableOpacity
                    className=" my-[5px] w-[100px] h-[40px] bg-[#0b8fc4]  items-center justify-center rounded-lg"
                    onPress={() => setLogoutModalVisible(false)}
                  >
                    <Text className="font-bold text-[16px] text-white">No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className=" my-[5px] w-[100px] h-[40px] bg-[#c40b74]  items-center justify-center rounded-lg"
                    onPress={handleLogOut}
                  >
                    <Text className="font-bold text-[16px] text-white">
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View className="my-[20px]">
        {/* <View className="h-[10px] bg-gray-300 mb-[8px]" /> */}
        <Text
          className={`font-bold text-[20px] mb-[5px] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Settings
        </Text>
        <View
          className={`h-[2px] ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          } mb-[8px]`}
        />
        <View className="flex flex-row justify-between items-center">
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Dark Mode
          </Text>
          <ToggleSwitch onToggle={handleToggle} isEnabled={isEnabled} />
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Notification
          </Text>
          <ToggleSwitch onToggle={() => {}} />
        </View>
      </View>

      <View className="my-[20px]">
        {/* <View className="h-[10px] bg-gray-300 mb-[8px]" /> */}
        <Text
          className={`font-bold text-[20px] mb-[5px] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Help
        </Text>
        <View
          className={`h-[2px] ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          } mb-[8px]`}
        />
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "AboutUs" })
          }
        >
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            AboutUs
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", {
              screen: "ContactSupport",
            })
          }
        >
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Contact Support
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "FAQs" })
          }
        >
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            FAQs
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "Feedback" })
          }
        >
          <Text
            className={`text-[18px] my-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Feedback
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}
