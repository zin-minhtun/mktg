import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import AudioRecorder from "../Audio/AudioRecorder";

export default function Note({ notes, setNotes }) {
  return (
    <View>
      <Text className=" text-lg font-bold mt-4">Note:</Text>
      <View className=" flex-row justify-between items-center border border-black rounded-lg my-3 flex-1">
        <TextInput
          className=" p-2 my-1 rounded"
          placeholder="Add Note..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <AudioRecorder />
      </View>
      {/* End of Notes */}
    </View>
  );
}
