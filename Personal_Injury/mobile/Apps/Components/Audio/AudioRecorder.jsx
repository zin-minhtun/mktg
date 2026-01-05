import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { Entypo, FontAwesome } from "@expo/vector-icons";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState("");

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    // FIXME: currently Not functional - waiting for the implementation of S3 bucket
    const uri = recording.getURI();
    setRecordedURI(uri);
    console.log("Recording stopped and stored at", uri);
  }

  return (
    // Audio Recording
    <View className="">
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        className="p-2 rounded-md "
      >
        {recording ? (
          <Entypo name="controller-stop" size={24} color="black" />
        ) : (
          <FontAwesome name="microphone" size={24} color="black" />
        )}
      </TouchableOpacity>
      {recordedURI ? (
        <View className="mt-2">
          {/* Testing */}
          {/* TODO: Create a popup that audio recording has been saved */}
          <Text className="text-green-500">
            Recording saved at: {recordedURI}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
