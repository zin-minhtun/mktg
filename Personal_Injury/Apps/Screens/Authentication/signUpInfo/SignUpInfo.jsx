import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import * as Progress from "react-native-progress";
import DateTimePicker from "@react-native-community/datetimepicker";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { API_URL } from "@env";
import axios from "axios";
import { useSignUpUserData } from "../../../Contexts/SignUpContext";
import { useUserData } from "../../../Contexts/UserContext";

const SignUpInfo = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasPreCondition, setHasPreCondition] = useState(false);
  const [preCondition, setPreCondition] = useState("");
  const { id } = useSignUpUserData();
  const { setNavigation } = useUserData();

  const handleSubmit = async () => {
    console.log("making request to submit answers");

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/users/${id}`,
        {
          personalInjuryAccident: answers[0] || false,
          accidentDate: selectedDate.toISOString(),
          hasLawyer: answers[2] || false,
          insuranceApproval: answers[3] || false,
          inTherapy: answers[4] || false,
          preCondition: hasPreCondition ? preCondition : "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);
      if (response.status !== 200) {
        throw new Error("Failed to update user");
      }

      // console.log("User updated successfully:", response.data);
      console.log("now navigating to home ");
      setNavigation(navigation);
      navigation.navigate("TabNavigator", { screen: "HomeScreenTabs" });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log("Collected Data: ", answers);
      console.log("preCondition", preCondition);
      console.log("date", selectedDate.toDateString());
      //   console.log(answers[3]);
      handleSubmit();
    }
  };

  const handleInputChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
      handleInputChange(date.toLocaleDateString());
    }
  };

  const renderBoolean = () => (
    <View className="flex flex-row justify-between gap-3">
      <TouchableOpacity onPress={() => handleInputChange(false)}>
        <View
          className="p-2 border-2 border-[#00B8DF] rounded-3xl w-32"
          style={[
            styles.buttonText,
            answers[currentQuestion] === false && styles.selectedButton,
          ]}
        >
          <Text
            className="text-center text-lg text-[#00B8DF]"
            style={[
              styles.buttonText,
              answers[currentQuestion] === false && styles.selectedButtonText,
            ]}
          >
            No
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleInputChange(true)}>
        <View
          className="p-2 border-2 border-[#00B8DF] rounded-3xl w-32"
          style={[
            styles.buttonText,
            answers[currentQuestion] === true && styles.selectedButton,
          ]}
        >
          <Text
            className="text-center text-lg text-[#00B8DF]"
            style={[
              styles.buttonText,
              answers[currentQuestion] === true && styles.selectedButtonText,
            ]}
          >
            Yes
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <>
            <Text style={styles.questionText} className="text-center">
              Have you had a Personal Injury accident in Ontario?
            </Text>
            {renderBoolean()}
          </>
        );
      case 1:
        return (
          <>
            <Text style={styles.questionText} className="text-center">
              Date of Accident
            </Text>
            <View className="flex flex-row justify-center">
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      handleDateChange(event, date);
                    }
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <TextInput
                      style={styles.input}
                      value={selectedDate.toLocaleDateString()}
                      editable={false}
                      placeholder="Select date"
                      className="text-center text-black rounded-3xl p-3 text-md"
                    />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </>
              )}
            </View>
            <View style={styles.checkboxContainer}>
              <View className="flex flex-row mb-4 justify-center">
                <BouncyCheckbox
                  fillColor="#00B8DF"
                  isChecked={hasPreCondition}
                  onPress={(isChecked) => setHasPreCondition(isChecked)}
                />
                <Text className="text-lg">I have a pre-existing condition</Text>
              </View>
              {hasPreCondition && (
                <TextInput
                  style={styles.input}
                  placeholder="Specify pre-existing condition"
                  onChangeText={(text) => setPreCondition(text)}
                />
              )}
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.questionText} className="text-center">
              Do you have a lawyer?
            </Text>
            {renderBoolean()}
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.questionText} className="text-center">
              Is your insurance company approving your treatment?
            </Text>
            {renderBoolean()}
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.questionText} className="text-center">
              Are you in Therapy?
            </Text>
            {renderBoolean()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={(currentQuestion + 1) / 5}
            width={null}
            height={2}
            color="#00B8DF"
          />
        </View>
        <View style={styles.questionContainer}>{renderQuestion()}</View>
        <View
          style={[
            styles.buttonContainer,
            currentQuestion === 0 && styles.buttonContainerRight,
          ]}
        >
          {currentQuestion > 0 && (
            <TouchableOpacity
              onPress={() =>
                setCurrentQuestion((prev) => Math.max(prev - 1, 0))
              }
              style={styles.button}
            >
              <Text className="text-center text-lg text-[#00B8DF]">Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, styles.nextButton]}
          >
            <Text className="text-center text-lg text-white">Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonContainerRight: {
    justifyContent: "flex-end",
  },
  button: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#00B8DF",
    borderRadius: 30,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#00B8DF",
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 20,
    borderRadius: 4,
  },
  checkboxContainer: {
    marginVertical: 20,
  },
  selectedButton: {
    backgroundColor: "#00B8DF",
  },
  selectedButtonText: {
    color: "white",
  },
});

export default SignUpInfo;
