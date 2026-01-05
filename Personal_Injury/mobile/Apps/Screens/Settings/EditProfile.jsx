import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView, // Can remove if ScreenLayout replaces it entirely, but keeping for safety if referenced. Actually ScreenLayout encapsulates it.
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { useUserData } from "../../Contexts/UserContext";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "twrnc";
import axios from "axios";
import { API_URL } from "@env";
import * as ImagePicker from 'expo-image-picker';
import { User as UserIcon } from 'lucide-react-native';
import ScreenLayout from "../../Components/Layout/ScreenLayout";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [dob, setDob] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const { theme } = useTheme();
  // Safe check for mode, though theme object structure ensures it exists
  const isDarkMode = theme?.mode === "dark";
  const { gUser, gSetUser } = useUserData();

  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        // Use gUser from UserContext if available
        if (gUser) {
          setEmail(gUser.email || "");
          setFirstName(gUser.firstName || "");
          setLastName(gUser.lastName || "");
          setProfileImage(gUser.profilePicture || null);
          setUserId(gUser.id || gUser._id);

          // Fetch DOB from backend
          const userDataLoaded = await axios.get(
            `${API_URL}/api/v1/users/getUserId`,
            {
              params: {
                email: gUser.email,
              },
            }
          );
          if (userDataLoaded.data.data.dob) {
            setDob(new Date(userDataLoaded.data.data.dob));
          }
        } else {
          const userEmail = await AsyncStorage.getItem("userEmail");
          setEmail(userEmail);

          const userDataLoaded = await axios.get(
            `${API_URL}/api/v1/users/getUserId`,
            {
              params: {
                email: userEmail,
              },
            }
          );
          setFirstName(userDataLoaded.data.data.firstName || "");
          setLastName(userDataLoaded.data.data.lastName || "");
          setProfileImage(userDataLoaded.data.data.profilePicture || null);
          console.log("DOB loaded : ", userDataLoaded.data.data.dob);
          if (userDataLoaded.data.data.dob) {
            setDob(new Date(userDataLoaded.data.data.dob));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchStoredUserData();

    // Fallback: also ensure userId is set
    if (!userId) {
      AsyncStorage.getItem("userId")
        .then((id) => {
          setUserId(id);
        })
        .catch((error) => {
          console.error("Error retrieving userId from AsyncStorage: ", error);
        });
    }
  }, [gUser]);

  const pickImage = async () => {
    Alert.alert(
      "Profile Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert("Permission Denied", "Sorry, we need camera permissions to make this work!");
              return;
            }
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
              base64: true,
            });
            handleImageResult(result);
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
              base64: true,
            });
            handleImageResult(result);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleImageResult = (result) => {
    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImage(base64Img);
    }
  };

  const handleSaveChanges = async () => {
    // Build update object with only provided fields (make all optional)
    const userDataToUpdate = {};

    if (firstName.trim()) {
      userDataToUpdate.firstName = firstName.trim();
    }
    if (lastName.trim()) {
      userDataToUpdate.lastName = lastName.trim();
    }
    if (dob) {
      userDataToUpdate.dateOfBirth = dob;
    }
    if (profileImage) {
      userDataToUpdate.profilePicture = profileImage;
    }

    // If no fields to update, show alert
    if (Object.keys(userDataToUpdate).length === 0) {
      Alert.alert("Info", "Please enter at least one field to update.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/users/${userId}`,
        userDataToUpdate
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200) {
        // Update UserContext with new data
        const updatedUserData = {
          ...gUser,
          firstName: userDataToUpdate.firstName || gUser.firstName,
          lastName: userDataToUpdate.lastName || gUser.lastName,
          profilePicture: userDataToUpdate.profilePicture || gUser.profilePicture,
        };
        gSetUser(updatedUserData);

        // Update AsyncStorage
        await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserData));

        Alert.alert("Success", "User profile is updated successfully.");
      } else {
        console.log(`Error ${response.status} : ${response.data.message} `);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      Alert.alert(
        "Error",
        `Error ${error.response?.status}: ${error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <ScreenLayout
      scroll={true}
      backgroundColor={theme.background}
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="flex-1 p-4" style={{ backgroundColor: theme.background }}>
        <View className=" justify-center items-center mt-8">
          <View
            className="h-[200px] w-[200px] rounded-full overflow-hidden justify-center items-center border"
            style={{
              backgroundColor: theme.textFieldBG,
              borderColor: theme.borderColor || '#e5e7eb'
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <UserIcon size={120} color={theme.darkGrey || "#9CA3AF"} />
            )}
          </View>
          <TouchableOpacity
            className="absolute bottom-0 right-[60px] p-8"
            onPress={pickImage}
          >
            <View className="rounded-full bg-blue-500 p-3 shadow-lg">
              <MaterialIcons
                name="add-a-photo"
                size={24}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex-row w-full mt-1 items-center">
          <View className="w-[35%]">
            <Text
              className="font-bold text-lg"
              style={{ color: theme.textColor }}
            >
              Email:
            </Text>
          </View>
          <View className="w-[65%]">
            <Text
              className="text-lg"
              style={{ color: theme.textColor }}
            >
              {email}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center w-full my-2 ">
          <View className="w-[35%]">
            <Text
              className="font-bold text-lg"
              style={{ color: theme.textColor }}
            >
              First Name:
            </Text>
          </View>
          <View className="w-[65%]">
            <TextInput
              style={[
                tw`w-full p-2 border rounded text-[16px]`,
                {
                  backgroundColor: theme.textFieldBG,
                  color: theme.textColor,
                  borderColor: theme.borderColor || '#d1d5db'
                }
              ]}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              keyboardType="text"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.darkGrey || "#A0A0A0"}
            />
          </View>
        </View>

        <View className="flex-row items-center w-full my-2 ">
          <View className="w-[35%]">
            <Text
              className="font-bold text-lg"
              style={{ color: theme.textColor }}
            >
              Last Name:
            </Text>
          </View>
          <View className="w-[65%]">
            <TextInput
              style={[
                tw`w-full p-2 border rounded text-[16px]`,
                {
                  backgroundColor: theme.textFieldBG,
                  color: theme.textColor,
                  borderColor: theme.borderColor || '#d1d5db'
                }
              ]}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              keyboardType="text"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.darkGrey || "#A0A0A0"}
            />
          </View>
        </View>

        <View className="flex-row w-full my-2 items-center">
          <View className="w-[35%]">
            <Text
              className="font-bold text-lg"
              style={{ color: theme.textColor }}
            >
              DOB:
            </Text>
          </View>
          <View className="w-[65%]">
            <TouchableOpacity
              style={[
                tw`w-full p-3 border rounded mb-4 text-[16px]`,
                {
                  backgroundColor: theme.textFieldBG,
                  borderColor: theme.borderColor || '#d1d5db'
                }
              ]}
              onPress={() => setIsDatePickerOpen(true)}
            >
              <Text
                style={{ color: theme.textColor, fontSize: 16 }}
              >
                {/* {dob.toDateString()} */}
                {format(dob, "MMM dd, yyyy")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className=" flex-row w-full gap-1">
          <View className="w-full">
            {isDatePickerOpen && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="spinner"
                textColor={theme.textColor}
                style={tw`w-full`}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setIsDatePickerOpen(false);
                    setDob(selectedDate);
                  } else {
                    setIsDatePickerOpen(false);
                  }
                }}
              />
            )}
          </View>
        </View>

        <TouchableOpacity
          className="w-full p-3 bg-blue-500 rounded mt-4"
          onPress={handleSaveChanges}
        >
          <Text className="text-white text-center text-lg">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}
