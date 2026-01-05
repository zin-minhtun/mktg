import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";
import { useTheme } from "../../../Contexts/ThemeContext";

// SVGs
import Confusion from "./svg/Confusion";
import BalanceLoss from "./svg/BalanceLoss";
import Dazed from "./svg/Dazed";
import Tinnitus from "./svg/Tinnitus";
import NoiseSensitivity from "./svg/NoiseSensitivity";
import LightSensitivity from "./svg/LightSensitivity";
import Nausea from "./svg/Nausea";
import ConsciousnessLoss from "./svg/ConsciousnessLoss";
import AffectedVision from "./svg/AffectedVision";

const StyledTextInput = styled(TextInput);

const symptomsData = [
  { id: "confusion", name: "Confusion", icon: <Confusion />, color: "#D9E6FF" },
  { id: "balanceLoss", name: "Loss of Balance", icon: <BalanceLoss />, color: "#FFE1D4" },
  { id: "feelingDazed", name: "Feeling Dazed", icon: <Dazed />, color: "#FFAEC6" },
  { id: "tinnitus", name: "Tinnitus\n(Ringing in ears)", icon: <Tinnitus />, color: "#DDFFD8" },
  { id: "noiseSensitivity", name: "Noise Sensitivity", icon: <NoiseSensitivity />, color: "#D8CAFF" },
  { id: "lightSensitivity", name: "Light Sensitivity", icon: <LightSensitivity />, color: "#FFF6C7" },
  { id: "nausea", name: "Nausea", icon: <Nausea />, color: "#D5FCFF" },
  { id: "consciousnessLoss", name: "Loss of Consciousness", icon: <ConsciousnessLoss />, color: "#FFD8F7" },
  { id: "affectedVision", name: "Affected Vision", icon: <AffectedVision />, color: "#CCFFED" },
];

const AddSymptomsDetails = ({ navigation }) => {
  const [otherSymptomNote, setOtherSymptomNote] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const { theme } = useTheme();

  const handleSymptomSelect = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    navigation.navigate("SelectedSymptomsDetails", {
      selectedSymptoms,
      otherSymptomNote,
    });
  };

  return (
    <SafeAreaView className="flex-1 px-4" style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingTop: 70 }} showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          <Text className="mb-3 font-ralewaySemiBold text-[24px] leading-8" style={{ color: theme.textColor }}>
            What symptoms are you experiencing today?
          </Text>
        </View>

        <View className="flex flex-wrap flex-row justify-between pt-5">
          {symptomsData.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <View className="items-center w-28 mb-4" key={symptom.id}>
                <TouchableOpacity
                  onPress={() => handleSymptomSelect(symptom.id)}
                  className={`rounded-full w-20 h-20 justify-center items-center ${isSelected ? "border-2 border-primaryBlue" : ""}`}
                  style={{ backgroundColor: symptom.color }}
                >
                  {symptom.icon}
                </TouchableOpacity>
                <Text className="font-raleway font-semibold text-[14px] pt-2 text-center" style={{ color: theme.textColor }}>
                  {symptom.name}
                </Text>
              </View>
            );
          })}
        </View>

        <View className="mt-3">
          <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
            Add any other Symptom
          </Text>
          <StyledTextInput
            multiline
            value={otherSymptomNote}
            onChangeText={setOtherSymptomNote}
            placeholder="Add symptom"
            placeholderTextColor={theme.darkGrey}
            style={{ 
                backgroundColor: theme.textFieldBG, 
                borderColor: theme.borderColor, 
                color: theme.textColor,
                height: 84, padding: 12, borderRadius: 8, borderWidth: 1, textAlignVertical: "top"
            }}
          />
        </View>

        <View className="mt-8 mb-6">
          <TouchableOpacity
            className={`w-full py-4 rounded-full ${selectedSymptoms.length > 0 ? "bg-primaryBlue" : "bg-gray-300"}`}
            onPress={handleNext}
            disabled={selectedSymptoms.length === 0}
          >
            <Text className="text-center text-white font-ralewaySemiBold text-[16px]">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddSymptomsDetails;