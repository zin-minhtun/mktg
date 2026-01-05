import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import {
  Entypo,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Card, Checkbox } from "react-native-paper";
import { Audio } from "expo-av";
import { useUserData } from "../../Contexts/UserContext";
import { API_URL } from "@env";
import axios from "axios";
import Note from "../Memo/Note";

/*******Notes*******/
// TOADD: Necessary Preset Values
// TODO: Audio Recordings
// FIXME: BG Color

// Presets Pain Data
const painScaleValues = [
  { label: "0 - No pain", value: "0" },
  { label: "1 - Mild", value: "1" },
  { label: "2 - Moderate", value: "2" },
  { label: "3 - Severe", value: "3" },
  { label: "4 - Very severe", value: "4" },
  { label: "5 - Worst possible pain", value: "5" },
];

const painLocations = [
  { label: "Select Pain location", value: "" },
  { label: "Head", value: "head" },
  { label: "Neck", value: "neck" },
  { label: "Back", value: "back" },
  { label: "Shoulder", value: "shoulder" },
  { label: "UpperLimb", value: "upperLimb" },
  { label: "LowerLimb", value: "lowerLimb" },
  { label: "Chest", value: "chest" },
  { label: "Abdomen", value: "abdomen" },
  { label: "Hip", value: "hip" },
];

const detailedPainLocations = {
  shoulder: [
    { label: "Left Shoulder", value: "leftShoulder" },
    { label: "Right Shoulder", value: "rightShoulder" },
  ],
  upperLimb: [
    { label: "Upper Arm-Left", value: "leftUpperArm" },
    { label: "Upper Arm-Right", value: "rightUpperArm" },
    { label: "Fore Arm-Left", value: "leftForeArm" },
    { label: "Fore Arm-Right", value: "rightForeArm" },
    { label: "Elbow-Left", value: "leftElbow" },
    { label: "Elbow-Right", value: "rightElbow" },
    { label: "Wrist-Left", value: "leftWrist" },
    { label: "Wrist-Right", value: "rightWrist" },
  ],
  lowerLimb: [
    { label: "Knee-Left", value: "leftKnee" },
    { label: "Knee-Right", value: "rightKnee" },
    { label: "Ankle-Left", value: "leftAnkle" },
    { label: "Ankle-Right", value: "rightAnkle" },
    { label: "Foot-Left", value: "leftFoot" },
    { label: "Foot-Right", value: "rightFoot" },
  ],
  back: [
    { label: "Upper Back", value: "upperBack" },
    { label: "Middle Back", value: "middleBack" },
    { label: "Lower Back", value: "lowerBack" },
  ],
};

const painDurations = [
  { label: "Select Pain Duration", value: "" },
  { label: "Less than 1 hour", value: "Less than 1 hour" },
  { label: "1-2 hours", value: "1-2 hours" },
  { label: "2-4 hours", value: "2-4 hours" },
  { label: "4-6 hours", value: "4-6 hours" },
  { label: "More than 6 hours", value: "More than 6 hours" },
];

const painTypes = [
  { label: "Select Type Of Pain", value: "" },
  { label: "Sharp", value: "sharp" },
  { label: "Dull", value: "dull" },
  { label: "Stinging", value: "stinging" },
  { label: "Aching", value: "aching" },
  { label: "Burning", value: "burning" },
];

// TODO: Research and add more possible symptoms
const painSymptoms = [
  { label: "Headache", value: "headache" },
  { label: "Dizziness", value: "dizziness" },
  { label: "Nausea", value: "nausea" },
  { label: "Fatigue", value: "fatigue" },
  { label: "Muscle Weakness", value: "muscle_weakness" },
];

// FIXME: Random colors TBD
const randomColors = [
  "blue",
  "green",
  "red",
  "purple",
  "orange",
  "yellow",
  "cyan",
  "magenta",
];

export default function PainCard({ minimized, onDelete, onToggleMinimize }) {
  // Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [isStartDateTimePickerVisible, setStartDateTimePickerVisibility] =
    useState(false);
  // Forms
  const [notes, setNotes] = useState("");
  const [painLocation, setPainLocation] = useState("");
  const [detailedLocation, setDetailedLocation] = useState("");
  const [painDuration, setPainDuration] = useState("");
  const [painType, setPainType] = useState("");
  const [painScale, setPainScale] = useState("0");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [painName, setPainName] = useState("Pain Name");
  // Audio
  // const [recording, setRecording] = useState();
  // const [recordedURI, setRecordedURI] = useState("");
  // UserId
  const { gUser } = useUserData();
  const userId = gUser._id;
  const [isEditingPainName, setIsEditingPainName] = useState(false);
  // For Random Color
  const [backgroundColor, setBackgroundColor] = useState("");

  // Update background color based on minimized state
  // FIXME: Set the random Bg color when minimized only to change once
  useEffect(() => {
    if (!minimized) {
      setBackgroundColor("white");
    } else {
      setBackgroundColor(
        randomColors[Math.floor(Math.random() * randomColors.length)]
      );
    }
  }, [minimized]);

  // Editing The Pain Name
  const handleEditPainName = () => {
    setIsEditingPainName(true);
  };

  const handleSavePainName = () => {
    setIsEditingPainName(false);
  };

  // Verify id of the current User
  useEffect(() => {
    const storedUserData = {
      userId_fromUserContext: gUser._id,
    };
    console.log("Stored User Data :", storedUserData);
  }, []);

  // Maxmimize, minimize and Delete Card
  const toggleCardMaximized = () => {
    onToggleMinimize();
  };

  const deleteCard = () => {
    onDelete();
  };

  // Calendar for current and previous dates
  const showStartDateTimePicker = () => {
    setStartDateTimePickerVisibility(true);
  };

  const hideStartDateTimePicker = () => {
    setStartDateTimePickerVisibility(false);
  };

  const handleConfirmStartDateTime = (time) => {
    const selectedTime = new Date();
    selectedTime.setHours(time.getHours());
    selectedTime.setMinutes(time.getMinutes());
    setStartDateTime(selectedTime);
    hideStartDateTimePicker();
  };

  // Save pain log entry
  const savePainLog = async () => {
    // Check if required fields are missing
    if (
      !painLocation ||
      !painType ||
      !painScale ||
      selectedSymptoms.length === 0
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const painEntry = {
      painName: painName || "",
      userId: userId,
      date: new Date(),
      time: format(currentDate, "HH:mm"),
      painScale: painScale,
      painLocation: painLocation,
      detailedLocation: detailedLocation || "",
      painDuration: painDuration,
      painType: painType,
      symptoms: selectedSymptoms,
      notes: notes || "",
      startDateTime: startDateTime,
      // TODO: Research how to implement and save audio recordings
      // recordedURI: recordedURI,
    };
    console.log("Pain log:", painEntry);
    // Minimize Card After Successfully save log
    onToggleMinimize();
    try {
      const response = await axios.post(`${API_URL}/api/pains/add`, painEntry);
      console.log("Pain entry saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving Pain entry:", error);
    }
  };

  // Audio Recording Functions
  // async function startRecording() {
  //   try {
  //     console.log("Requesting permissions..");
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });
  //     console.log("Starting recording..");
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  //     );
  //     setRecording(recording);
  //     console.log("Recording started");
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //   }
  // }

  // async function stopRecording() {
  //   console.log("Stopping recording..");
  //   setRecording(undefined);
  //   await recording.stopAndUnloadAsync();
  //   // TODO: Save it to S3 Bucket
  //   const uri = recording.getURI(); // Not functional
  //   setRecordedURI(uri);
  //   console.log("Recording stopped and stored at", uri);
  // }

  return (
    <ScrollView className="">
      {/* Random Background Color */}
      <Card className=" p-3" style={{ backgroundColor }}>
        <View className="flex-row justify-between items-center p-2">
          {/* Pain Name */}
          <View className="flex-row gap-2 items-center">
            {isEditingPainName ? (
              <TextInput
                className="text-2xl font-bold px-2 border-b border-gray-500"
                value={painName}
                onChangeText={setPainName}
                onBlur={handleSavePainName}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={handleEditPainName}>
                <Text className="text-2xl font-bold px-2">{painName}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleEditPainName}>
              <FontAwesome name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {/* End Pain Name */}

          <View className=" flex-row gap-4 p-2">
            <TouchableOpacity onPress={toggleCardMaximized}>
              {minimized ? (
                <Entypo name="plus" size={24} color="black" />
              ) : (
                <Entypo name="minus" size={24} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteCard}>
              <MaterialCommunityIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {!minimized && (
          <>
            <Card.Content>
              <View className="mt-4">
                {/* Pain Location */}
                <Text className=" text-lg font-bold">Location:</Text>
                <Picker
                  selectedValue={painLocation}
                  onValueChange={(value) => {
                    setPainLocation(value);
                    setDetailedLocation("");
                  }}
                  mode="dropdown"
                >
                  {painLocations.map((location) => (
                    <Picker.Item
                      key={location.value}
                      label={location.label}
                      value={location.value}
                    />
                  ))}
                </Picker>
                {detailedPainLocations[painLocation] && (
                  <View>
                    <Text className=" text-lg font-bold">
                      Detailed Location:
                    </Text>
                    <Picker
                      selectedValue={detailedLocation}
                      onValueChange={setDetailedLocation}
                      mode="dropdown"
                    >
                      {detailedPainLocations[painLocation].map((location) => (
                        <Picker.Item
                          key={location.value}
                          label={location.label}
                          value={location.value}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
                {/* End of Pain Location */}

                {/* Pain Type */}
                <Text className=" text-lg mt-4 font-bold">Type of Pain:</Text>
                <Picker
                  selectedValue={painType}
                  onValueChange={(itemValue) => setPainType(itemValue)}
                  mode="dropdown"
                >
                  {painTypes.map((item) => (
                    <Picker.Item
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
                {/* End of Pain Type */}

                {/* Pain Scale */}
                <Text className=" text-lg font-bold">Scale:</Text>
                <Picker
                  selectedValue={painScale}
                  onValueChange={(itemValue) => setPainScale(itemValue)}
                  mode="dropdown"
                >
                  {painScaleValues.map((item) => (
                    <Picker.Item
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
                {/*End of Pain Type */}

                {/* Pain Start time */}
                <Text className=" text-lg font-bold">Start Time:</Text>
                <TouchableOpacity
                  onPress={showStartDateTimePicker}
                  className="flex-row gap-2 mt-2 items-center"
                >
                  <Entypo
                    className=" px-1"
                    name="calendar"
                    size={24}
                    color="black"
                  />
                  <Text>Current Time: {format(startDateTime, "HH:mm")}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isStartDateTimePickerVisible}
                  mode="time"
                  onConfirm={handleConfirmStartDateTime}
                  onCancel={hideStartDateTimePicker}
                  display="default"
                />
                {/* End of Pain Start time */}

                {/* Pain Duration */}
                <Text className=" text-lg mt-4 font-bold">Duration:</Text>
                <Picker
                  selectedValue={painDuration}
                  onValueChange={(itemValue) => setPainDuration(itemValue)}
                  mode="dropdown"
                >
                  {painDurations.map((item) => (
                    <Picker.Item
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
                {/* End of Pain Duration */}

                {/* Pain Symptoms */}
                <Text className="text-lg mt-4 font-bold">Symptoms:</Text>
                {painSymptoms.map((symptom) => (
                  <View
                    key={symptom.value}
                    className="flex-row gap-2 mt-2 items-center"
                  >
                    <Checkbox
                      status={
                        selectedSymptoms.includes(symptom.value)
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => {
                        const newSelected = selectedSymptoms.includes(
                          symptom.value
                        )
                          ? selectedSymptoms.filter(
                              (item) => item !== symptom.value
                            )
                          : [...selectedSymptoms, symptom.value];
                        setSelectedSymptoms(newSelected);
                      }}
                    />
                    <Text>{symptom.label}</Text>
                  </View>
                ))}
                {/* End Pain Symptoms */}

                {/* TODO: Need Cloud (e.g, AWS-S3) to save the file */}
                {/* Audio Recording */}
                {/* <View className="mt-4">
                  <Text className=" text-lg font-bold">Record Audio:</Text>
                  <TouchableOpacity
                    onPress={recording ? stopRecording : startRecording}
                    className=" mt-2 p-2 bg-blue-500 rounded-md"
                  >
                    <Text className=" text-white text-center">
                      {recording ? "Stop Recording" : "Start Recording"}
                    </Text>
                  </TouchableOpacity>
                  {recordedURI ? (
                    <View className="mt-2">
                      <Text className="text-green-500">
                        Recording saved at: {recordedURI}
                      </Text>
                    </View>
                  ) : null}
                </View> */}
                {/* End of Audio Recording */}
                {/* Notes */}
                {/* <Text className=" text-lg font-bold mt-4">Note:</Text>
                <TextInput
                  className="border border-black p-2 my-1 rounded"
                  placeholder="Write Something..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                /> */}
                <Note notes={notes} setNotes={setNotes} />
                {/* End of Notes */}
              </View>

              {/* Save Log button */}
              <TouchableOpacity className=" my-4" onPress={savePainLog}>
                <Text className=" bg-blue-500 p-3 text-center rounded-xl">
                  Save Log
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </>
        )}
      </Card>
    </ScrollView>
  );
}
