import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { useSignUpUserData } from "../../Contexts/SignUpContext";
import { useUserData } from "../../Contexts/UserContext";

export default function ResetPassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { updateUserPassword } = useSignUpUserData();
  const { logOut } = useUserData();

  const handleLogOut = async () => {
    try {
      await logOut(); // Call the logOut function
      console.log("User signed out!");
      //Navigate to the Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthenticationNavigator" }],
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const checkResetPwd = () => {
    if (newPassword === "" || confirmPassword === "") {
      Alert.alert("Invalid Input", "Please enter all the fields!");
      return;
    }

    // TODO: add validation logic for valid password
    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Input",
        "Password should be longer than 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords are the same!"
      );
      setConfirmPassword("");
      return;
    }

    setModalVisible(true);
  };

  const handleResetPwd = async () => {
    try {
      if (newPassword === currentPassword) {
        Alert.alert(
          "Invalid Input",
          "New password must be different from current one!"
        );
        setCurrentPassword("");
        setModalVisible(false);
        return;
      }
      const result = await updateUserPassword(currentPassword, newPassword);
      if (result) {
        Alert.alert("Success", "Password has been reset successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setModalVisible(false);
        handleLogOut();
      } else {
        throw new Error("Invalid password!");
      }
    } catch (error) {
      console.error("Error updating password: ", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-1 p-[10px] ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <View className="mt-[20px]">
          <Text
            className={`text-[30px] font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Reset Password
          </Text>
          <Text
            className={`text-[18px] text-slate-500 mt-[10px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Your new password must be unique from those previously used
          </Text>
        </View>

        <View className="mt-[25px]">
          <TextInput
            className="w-full border border-gray-300 rounded-lg text-lg h-[70px] p-3 bg-gray-50 my-[10px]"
            placeholder="New Password"
            value={newPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setNewPassword}
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

        <View className="mt-[1px] ">
          <TextInput
            className="w-full border border-gray-300 rounded-lg text-lg h-[70px] p-3 bg-gray-50 my-[10px]"
            placeholder="Confirm Password"
            value={confirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: "absolute", right: 20, top: 30 }}
          >
            <Entypo
              name={showConfirmPassword ? "eye-with-line" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
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
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="font-bold text-[16px] text-white">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className=" my-[5px] w-[100px] h-[40px] bg-[#c40b74]  items-center justify-center rounded-lg"
                  onPress={handleResetPwd}
                >
                  <Text className="font-bold text-[16px] text-white">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View className="mt-[40px] ">
          <TouchableOpacity
            className="border border-sky-600 h-[70px] rounded-lg bg-sky-400 justify-center items-center"
            onPress={checkResetPwd}
          >
            <Text className="text-center text-[20px] text-white text-bold">
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
