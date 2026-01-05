import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  Linking,
  KeyboardAvoidingView, // Keep if needed for Modal, though ScreenLayout has one too but only for its children
  Platform
} from "react-native";
import { CommonActions } from '@react-navigation/native';
import React, { useState } from "react";
import ToggleSwitch from "../../Components/Switch/ToggleSwitch";
import { Entypo, EvilIcons } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { useUserData } from "../../Contexts/UserContext";
import { useSignUpUserData } from "../../Contexts/SignUpContext";
import { User as UserIcon } from 'lucide-react-native';
import ScreenLayout from "../../Components/Layout/ScreenLayout";

export default function ProfileSettings({ navigation }) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();
  // Properly access mode from theme object
  // const isDarkMode = theme.mode === "dark"; 
  const [isEnabled, setIsEnabled] = useState(theme.mode === "dark");
  const { logOut } = useUserData();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const { deleteAuthUser } = useSignUpUserData();

  const deleteAccount = async () => {
    try {
      const result = await deleteAuthUser(currentPassword);
      console.log("Delete Account result : ", result);

      if (result.status === 200) {
        Alert.alert("Success", `${result.message}`);
        await logOut();
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
      await logOut();
      console.log("User signed out!");
      setLogoutModalVisible(false)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AuthenticationNavigator" }],
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
    <ScreenLayout
      scroll={true}
      backgroundColor={theme.background}
      contentContainerStyle={{ padding: 20 }}
    >
      <View className="mb-[20px]">
        <Text className="font-bold text-[20px] mb-[5px]" style={{ color: theme.textColor }}>
          My Account
        </Text>

        {/* Profile Card Header */}
        <View className="flex-row items-center mb-6">
          <View className="h-16 w-16 rounded-full bg-gray-200 justify-center items-center overflow-hidden border border-gray-300">
            {useUserData().gUser?.profilePicture ? (
              <Image
                source={{ uri: useUserData().gUser.profilePicture }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <UserIcon size={40} color="#9CA3AF" />
            )}
          </View>
          <Text className="text-xl font-ralewayBold ml-4" style={{ color: theme.textColor }}>
            {useUserData().gUser ? `${useUserData().gUser.firstName} ${useUserData().gUser.lastName}` : "Guest User"}
          </Text>
        </View>

        <View className="h-[2px] mb-[8px]" style={{ backgroundColor: theme.borderColor }} />

        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "EditProfile" })
          }
        >
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
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
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            Reset Password
          </Text>
        </TouchableHighlight>

        <View>
          <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
            <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
              Delete Account
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View className="flex-col items-center w-[95%] p-[10px] rounded-lg"
                style={{ backgroundColor: theme.mode === 'dark' ? theme.textFieldBG : 'white' }}>
                <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
                  Please enter your current password.
                </Text>

                <View className="mt-[5px] w-full">
                  <TextInput
                    className="w-full border rounded-lg text-lg h-[70px] p-3 my-[10px]"
                    style={{
                      backgroundColor: theme.background,
                      color: theme.textColor,
                      borderColor: theme.borderColor
                    }}
                    placeholder="Current Password"
                    placeholderTextColor={theme.darkGrey}
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
                      color={theme.textColor}
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
            <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
              Log Out
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={() => setLogoutModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View className="flex-col items-center w-[95%] p-[10px] rounded-lg"
                style={{ backgroundColor: theme.mode === 'dark' ? theme.textFieldBG : 'white' }}>
                <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
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
        <Text className="font-bold text-[20px] mb-[5px]" style={{ color: theme.textColor }}>
          Settings
        </Text>
        <View className="h-[2px] mb-[8px]" style={{ backgroundColor: theme.borderColor }} />

        <View className="flex flex-row justify-between items-center">
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            Dark Mode
          </Text>
          <ToggleSwitch onToggle={handleToggle} isEnabled={theme.mode === 'dark'} />
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            Notification
          </Text>
          <ToggleSwitch onToggle={() => { }} />
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.facebook.com/groups/230392641374560/?rdid=MhFFE57DlcWuniaI&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1C4mRvLRz5%2F#")}
          className="flex flex-row justify-between items-center"
        >
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            Join Community
          </Text>
          <EvilIcons name="external-link" size={30} color={theme.darkGrey} />
        </TouchableOpacity>
      </View>

      <View className="my-[20px]">
        <Text className="font-bold text-[20px] mb-[5px]" style={{ color: theme.textColor }}>
          Help
        </Text>
        <View className="h-[2px] mb-[8px]" style={{ backgroundColor: theme.borderColor }} />

        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "AboutUs" })
          }
        >
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
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
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            Contact Support
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "FAQs" })
          }
        >
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            FAQs
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#c0e7ef"
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "Feedback" })
          }
        >
          <Text className="text-[18px] my-[10px]" style={{ color: theme.textColor }}>
            Feedback
          </Text>
        </TouchableHighlight>
      </View>
    </ScreenLayout>
  );
}
