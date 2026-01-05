import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styled } from "nativewind";
import dayjs from "dayjs";
import WaterGlass from "../Medication/svg/WaterGlass";
import Milk from "../Medication/svg/Milk";
import { useTheme } from "../../../Contexts/ThemeContext";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
import { Accessibility, PersonStanding, CarFront, BusFront } from "lucide-react-native";



const StyledTextInput = styled(TextInput);

const AddMobilityDetails = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { gUser } = useUserData();
  const { selectedDate, mobilityLog, isEditing, dailyLogId } = route.params;

  const [selectedTransferOption, setSelectedTransferOption] = useState(
    mobilityLog?.transferOptions || ""
  );
  const [selectedOtherOption, setSelectedOtherOption] = useState(
    mobilityLog?.others || ""
  );
  const [selectedTransportOption, setSelectedTransportOption] = useState(
    mobilityLog?.transportoptions || ""
  );
  const [notes, setNotes] = useState(mobilityLog?.additionalNotes || "");
  const [notesList, setNotesList] = useState([]);
  const MOBILITY_URL = `${API_URL}/api/dailyLog/mobility`;


  useEffect(() => {
    if (isEditing && mobilityLog) {
      console.log("Editing Mode:", isEditing);
      console.log("Mobility Log Data:", mobilityLog);
      console.log("Daily Log ID:", dailyLogId);
    }
  }, []);


  const transferOptions = [
    { id: "With Assistance", label: "With Assistance", icon: <Image source={require("../../../../assets/images/AssistiveTechnology.png")} style={{ width: 24, height: 24 }} resizeMode="contain" /> },
    { id: "Movies at Home", label: "Movies at Home", icon: <Image source={require("../../../../assets/images/StandingMan.png")} style={{ width: 24, height: 24 }} resizeMode="contain" /> },
  ];

  const otherOptions = [
    { id: "From bed to chair", label: "From bed to chair", icon: <Image source={require("../../../../assets/images/TicketPurchase.png")} style={{ width: 24, height: 24 }} resizeMode="contain" /> },
    { id: "From chair to bed", label: "From chair to bed", icon: <Image source={require("../../../../assets/images/TicketPurchaseFlipped.png")} style={{ width: 24, height: 24 }} resizeMode="contain" /> },
  ];

  const transportOptions = [
    { id: "Driving", label: "Driving", icon: <Image source={require("../../../../assets/images/Car.png")} style={{ width: 24, height: 24 }} resizeMode="contain" /> },
    { id: "Using Public Transit", label: "Using public transit", icon: <Image source={require("../../../../assets/images/Tram.png")} style={{ width: 24, height: 24 }} resizeMode="contain" /> },
  ];

  const toggleTransferOption = (id) => {
    setSelectedTransferOption(selectedTransferOption === id ? "" : id);
  };

  const toggleOtherOption = (id) => {
    setSelectedOtherOption(selectedOtherOption === id ? "" : id);
  };

  const toggleTransportOption = (id) => {
    setSelectedTransportOption(selectedTransportOption === id ? "" : id);
  };

  const addNote = () => {
    if (notes.trim() !== "") {
      const newNote = {
        text: notes.trim(),
        date: dayjs().format(),
      };
      setNotesList([newNote, ...notesList]);
      setNotes("");
    }
  };

  const handleSave = async () => {
    try {
      const mobilityData = {
        userId: gUser._id,
        date: selectedDate,
        mobility: {
          transferOptions: selectedTransferOption || undefined,
          others: selectedOtherOption || undefined,
          transportoptions: selectedTransportOption || undefined,
          additionalNotes: notes,
        }
      };
      // Create New Mobility Log
      if (!isEditing) {
        console.log("Sending mobility Data: ", mobilityData);
        const response = await axios.post(`${MOBILITY_URL}/add`, mobilityData);
        console.log("Response: ", response.data);
        navigation.goBack();
      } else {

        // Update Existing Mobility Log
        if (!dailyLogId || !mobilityLog?._id) {
          throw new Error(`Missing required IDs. dailyLogId: ${dailyLogId}, mobilityLogId: ${mobilityLog?._id}`);
        }
        console.log("Updating mobility Data: ", mobilityData);
        console.log("Request URL: ", `${MOBILITY_URL}/update/${dailyLogId}`);
        const response = await axios.put(`${MOBILITY_URL}/update/${dailyLogId}/${mobilityLog._id}`, mobilityData);
        console.log("Response: ", response.data);
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error sending Mobility", error);
    }

  };

  const renderNoteItem = ({ item }) => (
    <>
      <Text className="font-raleway text-[16px] mb-2" style={{ color: theme.darkGrey }}>
        {dayjs(item.date).format("hh:mm")}
      </Text>
      <View
        className="flex-row items-center mb-2 p-[16px] border h-[74px] rounded-lg space-x-4"
        style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
      >
        <Image
          source={require("../../../../assets/journal/img/note.png")}
          style={{ width: 40, height: 40 }}
        />
        <View className="flex-1 flex-row h-16 items-center">
          <Text
            className="font-raleway leading-5 text-[16px] flex-1"
            style={{ color: theme.textColor }}
            numberOfLines={0}
          >
            {item.text}
          </Text>
        </View>
      </View>
    </>
  );

  const renderHeader = () => (
    <View className="mx-2">
      <View className="mt-28">
        <Text
          className="mb-3 font-ralewaySemiBold text-[16px]"
          style={{ color: theme.textColor }}
        >
          Transferring
        </Text>
        <View className="flex flex-row flex-wrap">
          {transferOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => toggleTransferOption(option.id)}
              className={`border rounded-lg px-2 mr-3 mb-3 border-[#EDECF4] ${selectedTransferOption === option.id
                ? "border-primaryBlue"
                : ""
                }`}
              style={{
                backgroundColor: selectedTransferOption === option.id
                  ? theme.primaryLighBlue
                  : theme.textFieldBG,
                borderColor: selectedTransferOption === option.id
                  ? theme.primaryLighBlue
                  : theme.borderColor
              }}
            >
              <View className="flex flex-row justify-between space-x-1">
                <Text
                  className="font-raleway  text-[16px]"
                  style={{ color: selectedTransferOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                >
                  {option.icon}
                </Text>
                <Text
                  className="font-raleway py-2 text-[16px]"
                  style={{ color: selectedTransferOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-3">
        <Text
          className="mb-3 font-ralewaySemiBold text-[16px]"
          style={{
            color: theme.textColor,
          }}
        >
          Others
        </Text>
        <View className="flex flex-row flex-wrap">
          {otherOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => toggleOtherOption(option.id)}
              className={`border rounded-lg px-2 mr-3 mb-3 border-[#EDECF4] ${selectedOtherOption === option.id
                ? "border-primaryBlue"
                : ""
                }`}
              style={{
                backgroundColor: selectedOtherOption === option.id
                  ? theme.primaryLighBlue
                  : theme.textFieldBG,
                borderColor: selectedOtherOption === option.id
                  ? theme.primaryLighBlue
                  : theme.borderColor
              }}
            >
              <View className="flex flex-row justify-between space-x-1">
                <Text
                  className="font-raleway text-[16px]"
                  style={{ color: selectedOtherOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                >
                  {option.icon}
                </Text>
                <Text
                  className="font-raleway py-2 text-[16px]"
                  style={{ color: selectedOtherOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-3">
        <Text
          className="mb-3 font-ralewaySemiBold text-[16px]"
          style={{
            color: theme.textColor,
          }}
        >
          Using transport
        </Text>
        <View className="flex flex-row flex-wrap">
          {transportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => toggleTransportOption(option.id)}
              className={`border rounded-lg px-2 mr-3 mb-3 border-[#EDECF4] ${selectedTransportOption === option.id
                ? "border-primaryBlue"
                : ""
                }`}
              style={{
                backgroundColor: selectedTransportOption === option.id
                  ? theme.primaryLighBlue
                  : theme.textFieldBG,
                borderColor: selectedTransportOption === option.id
                  ? theme.primaryLighBlue
                  : theme.borderColor
              }}
            >
              <View className="flex flex-row justify-between space-x-1">
                <Text
                  className="font-raleway  text-[16px]"
                  style={{ color: selectedTransportOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                >
                  {option.icon}
                </Text>
                <Text
                  className="font-raleway py-2 text-[16px]"
                  style={{ color: selectedTransportOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1 mx-1 pt-8">
        <Text className="font-ralewayBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
          Additional Information
        </Text>
        <StyledTextInput
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes"
          placeholderTextColor={theme.darkGrey}
          className="font-raleway text-[16px] h-28 p-3 border rounded-lg focus:border-primaryBlue"
          style={{
            textAlignVertical: "top",
            backgroundColor: theme.textFieldBG,
            borderColor: theme.borderColor,
            color: theme.textColor
          }}
        />

        <View className="flex-row justify-end mt-3">
          <View className="justify-center items-center mr-6 rounded-full w-10 h-10" style={{ backgroundColor: theme.primaryLighBlue }}>
            <AudioInputIcon />
          </View>
          <TouchableOpacity
            onPress={() => setNotes("")}
            disabled={notes.length === 0}
            className={`first-letter:justify-center items-center mr-3 rounded-full w-10 h-10`}
            style={{ backgroundColor: notes.length > 0 ? "#FDA29B80" : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
          >
            <CrossIcon isActive={notes.length > 0} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={addNote}
            disabled={notes.length === 0}
            className={`justify-center items-center rounded-full w-10 h-10`}
            style={{ backgroundColor: notes.length > 0 ? theme.primaryLighBlue : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
          >
            <CheckIcon isActive={notes.length > 0} />
          </TouchableOpacity>
        </View>
      </View>

      {notesList.length > 0 && (
        <Text className="font-ralewayBold mb-3 text-[16px] mt-6" style={{ color: theme.textColor }}>
          Notes
        </Text>
      )}
    </View>
  );

  const renderFooter = () => (
    <View className="px-3 py-6">
      <TouchableOpacity
        className="w-full bg-primaryBlue py-4 rounded-full"
        onPress={handleSave}
      >
        <Text className="text-center font-ralewaySemiBold text-[16px] text-white">
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <FlatList
          data={notesList}
          renderItem={renderNoteItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddMobilityDetails;
