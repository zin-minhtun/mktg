import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { User as UserIcon } from 'lucide-react-native';
import { useTheme } from "../../../Contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { auth } from "../../../../firebase";
import * as ImagePicker from "expo-image-picker";

const Profile = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { logOut, gUser } = useUserData();
  const isDarkMode = theme.mode === "dark"; // Keep track of the current theme mode
  const [avatarUri, setAvatarUri] = useState(null);

  console.log(theme.mode);

  return (
    <View className=" mt-3" style={{ backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 250 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-10 flex flex-row justify-center relative">
          <View className="bg-white rounded-full w-[180px] h-[180px] flex items-center justify-center overflow-hidden border border-gray-200">
            {gUser?.profilePicture ? (
              <Image
                source={{ uri: gUser.profilePicture }}
                style={{ width: 180, height: 180 }}
                resizeMode="cover"
              />
            ) : (
              <UserIcon size={120} color="#9CA3AF" />
            )}
          </View>
        </View>

        <View className="flex flex-col mx-2">
          <View
            className="mt-8  p-4 rounded-t-xl border border-1"
            style={{
              backgroundColor: theme.textFieldBG,
              borderColor: theme.darkGrey,
            }}
          >
            <View className="flex flex-row justify-between items-center">
              <Text className=" text-lg" style={{ color: theme.darkGrey }}>
                Name
              </Text>
              <View>
                <Text className="text-lg" style={{ color: theme.darkGrey }}>
                  {gUser
                    ? `${gUser.firstName || ""}${gUser.lastName ? ` ${gUser.lastName}` : ""
                      }`.trim()
                    : "-"}
                </Text>
              </View>
            </View>
          </View>

          <View
            className="p-4 rounded-b-xl border "
            style={{
              backgroundColor: theme.textFieldBG,
              borderColor: theme.darkGrey,
            }}
          >
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg" style={{ color: theme.darkGrey }}>
                Email
              </Text>
              <View>
                <Text className="text-lg" style={{ color: theme.darkGrey }}>
                  {gUser?.email || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Edit Profile action (kept minimal, matches current style) */}
          <TouchableOpacity
            className="mt-4 border border-primaryBlue py-2 rounded-2xl items-center"
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text className="text-primaryBlue text-lg">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Dark Mode Switch */}
        <View
          className="mt-4 rounded-xl p-4 mx-2 border"
          style={{
            backgroundColor: theme.textFieldBG,
            borderColor: theme.darkGrey,
            borderWidth: 1,
          }}
        >
          <View className="flex flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-500">
              Dark Mode
            </Text>
            <View style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#3E3E3E", true: "#00C8FF" }}
                thumbColor={isDarkMode ? "#001F3F" : "#F4F3F4"}
                ios_backgroundColor="#3E3E3E"
              />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <TouchableOpacity
          className="mt-8 border border-primaryBlue py-2 rounded-2xl items-center mx-2"
          onPress={async () => {
            try {
              await logOut();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "AuthenticationNavigator" }],
                })
              );
            } catch (e) {
              console.error("Error signing out:", e);
            }
          }}
        >
          <Text className="text-primaryBlue text-lg">Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={async () => {
            Alert.alert("", "Are you sure you want to delete your account?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  try {
                    const userId = await AsyncStorage.getItem("userId");
                    if (userId) {
                      await axios.delete(`${API_URL}/api/v1/users/deleteUser`, {
                        params: { userId },
                      });
                    }
                    try {
                      await auth.currentUser?.delete();
                    } catch (e) {
                      // Ignore re-auth errors; user will be logged out regardless
                    }
                    await logOut();
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "AuthenticationNavigator" }],
                      })
                    );
                  } catch (err) {
                    console.error("Error deleting account:", err);
                    Alert.alert(
                      "Error",
                      "Could not delete account. Please try again later."
                    );
                  }
                },
              },
            ]);
          }}
        >
          <Text className="text-gray-500 text-lg">Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
