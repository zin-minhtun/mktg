import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "twrnc";
import axios from "axios";
import { API_URL } from "@env";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchStoredUserData = async () => {
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
      setFirstName(userDataLoaded.data.data.firstName);
      setLastName(userDataLoaded.data.data.lastName);
      console.log("DOB loaded : ", userDataLoaded.data.data.dob);
      setDob(new Date(userDataLoaded.data.data.dob));
    };
    fetchStoredUserData();

    AsyncStorage.getItem("userId")
      .then((id) => {
        setUserId(id);
      })
      .catch((error) => {
        console.error("Error retrieving userId from AsyncStorage: ", error);
      });
  }, []);

  // TODO: Add logic to load the profile image

  const handleSaveChanges = async () => {
    const userDataToUpdate = {
      dateOfBirth: dob,
      firstName: firstName,
      lastName: lastName,
    };

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/users/${userId}`,
        userDataToUpdate
      );

      console.log("Response status:", response.status); // Check the HTTP status
      console.log("Response data:", response.data); // Check the response data

      if (response.status === 200) {
        Alert.alert("Success", "User profile is updated successfully.");
      } else {
        console.log(`Error ${response.status} : ${response.data.message} `);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      Alert.alert(
        "Error",
        `Error ${error.response?.status}: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className={`flex-1 p-4 ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <View className={`flex-1 p-4 ${isDarkMode ? "bg-black" : "bg-white"}`}>
          <View className=" justify-center items-center mt-8">
            <Image
              // FIXME: Display the profile image of the currently logged-in user
              source={require("../../../assets/images/avatar.jpg")}
              className=" h-[200px] w-[200px]"
            />
            <TouchableOpacity className=" absolute bottom-0 right-[60px] p-8">
              <View className=" rounded-full bg-gray-300 p-2">
                <MaterialIcons
                  name="add-a-photo"
                  size={32}
                  color="black"
                  className=""
                />
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex-row w-full mt-1 ">
            <View className="w-[35%]">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Email:
              </Text>
            </View>
            <View className="w-[65%]">
              <Text
                className={` text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {email}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center w-full my-2 ">
            <View className="w-[35%]">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                First Name:
              </Text>
            </View>
            <View className="w-[65%]">
              <TextInput
                style={tw`w-full p-2 border border-gray-300 rounded text-[16px] ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                }`}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                keyboardType="text"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={isDarkMode ? "#B0B0B0" : "#A0A0A0"}
              />
            </View>
          </View>

          <View className="flex-row items-center w-full my-2 ">
            <View className="w-[35%]">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Last Name:
              </Text>
            </View>
            <View className="w-[65%]">
              <TextInput
                style={tw`w-full p-2 border border-gray-300 rounded text-[16px] ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                }`}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                keyboardType="text"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={isDarkMode ? "#B0B0B0" : "#A0A0A0"}
              />
            </View>
          </View>

          <View className="flex-row w-full my-2 ">
            <View className="w-[35%]">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                DOB:
              </Text>
            </View>
            <View className="w-[65%]">
              <TouchableOpacity
                style={tw`w-full p-3 border border-gray-300 rounded mb-4 text-[16px] ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                }`}
                onPress={() => setIsDatePickerOpen(true)}
              >
                <Text
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } text-[16px]`}
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
                  textColor={isDarkMode ? "white" : "black"}
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
