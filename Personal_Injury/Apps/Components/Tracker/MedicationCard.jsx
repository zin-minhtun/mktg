import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Card } from "react-native-paper";
import {
  AntDesign,
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
// import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import { useUserData } from "../../Contexts/UserContext";
import { API_URL } from "@env";
import axios from "axios";
import { parseISO } from "date-fns";
import { utcToZonedTime, toZonedTime, toDate, format } from "date-fns-tz";
import Note from "../Memo/Note";

/*******Notes*******/
// TODO: Add logic for CRUD (DELETE)
// FIXME: delete icon on the medication card should remove data from DB

const frequencyPresets = [
  { label: "[ Choose Frequency ]", value: null, enabled: false },
  { label: "Once daily", value: "Once_daily" },
  { label: "Twice daily", value: "Twice_daily" },
  { label: "Three times daily", value: "Three_times_daily" },
  { label: "Interval - Many times", value: "Interval" },
  { label: "As Needed for pain (PRN)", value: "As_Needed_PRN" },
];

const timeOfDayOncePresets = [
  { label: "[ Choose Valid Option ]", value: null, enabled: false },
  { label: "Every Morning (QAM)", value: "Every_Morning_QAM" },
  { label: "Every Evening (QPM)", value: "Every_Evening_QPM" },
  { label: "Once Daily (OD)", value: "Once_Daily_OD" },
];

const timeOfDayManyTimesPresets = [
  { label: "[ Choose Valid Option ]", value: null, enabled: false },
  { label: "Before Meal (30min/1H)", value: "Before_Meal_30min_or_1H" },
  { label: "After Meal (30min/1H)", value: "After_Meal_30min_or_1H" },
];

const commonUnitsPresets = [
  { label: "[ Choose Unit ]", value: null, enabled: false },
  { label: "Milligrams (mg)", value: "Milligrams_mg" },
  { label: "Micrograms (mcg or µg)", value: "Micrograms_mcg_or_ug" },
  { label: "Milliliters (ml)", value: "Milliliters_ml" },
  { label: "International Units (IU)", value: "International_Units_IU" },
  { label: "Grams (g)", value: "Grams_g" },
  { label: "Tablets (tab)", value: "Tablets_tab" },
  { label: "Teaspoons (tsp)", value: "Teaspoons_tsp" },
  { label: "Drops (gtt)", value: "Drops_gtt" },
];

const instructionsPresets = [
  { label: "[ Choose Instruction ]", value: null, enabled: false },
  { label: "Oral", value: "Oral" },
  { label: "Injection", value: "Injection" },
  { label: "Topical", value: "Topical" },
  { label: "Inhaled", value: "Inhaled" },
];

export default function MedicationCard({
  minimized,
  onDelete,
  onToggleMinimize,
  medication,
  onSave,
}) {
  const [prescriptionNum, setPrescriptionNum] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");
  const [medications, setMedications] = useState([]);
  const [dosage, setDosage] = useState(null);
  const [unit, setUnit] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [timeOfDayOnce, setTimeOfDayOnce] = useState(null);
  const [timeOfDayManyTimes, setTimeOfDayManyTimes] = useState(null);
  const [intervalTime, setIntervalTime] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [instructions, setInstructions] = useState(null);
  const [notes, setNotes] = useState("");
  const [startDatePickerVisibility, setStartDatePickerVisibility] =
    useState(false);
  const [expirationDatePickerVisibility, setExpirationDatePickerVisibility] =
    useState(false);
  // const [isCameraVisible, setCameraVisible] = useState(false);
  // const cameraRef = useRef(null);
  const { gUser } = useUserData();
  const userId = gUser._id;
  const [medicationName, setMedicationName] = useState("Med Name");
  const [isEditingMedName, setIsEditingMedName] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    const initializeState = () => {
      // const timeZone = "America/Toronto";
      // const startDateDelivered = medication.startDate
      //   ? toZonedTime(parseISO(medication.startDate), timeZone)
      //   : new Date();
      // const expDateDelivered = medication.expirationDate
      //   ? toZonedTime(parseISO(medication.expirationDate), timeZone)
      //   : new Date();

      setPrescriptionNum(medication.prescriptionNum || null);
      setSelectedCategory(medication.medicationCategory || "");
      setSelectedMedication(medication.medicationName || "");
      setDosage(`${medication.dosage}` || null);
      setUnit(medication.unit || null);
      setFrequency(medication.frequency || null);
      setTimeOfDayOnce(medication.timeOfDayEnumOnceDaily || null);
      setTimeOfDayManyTimes(
        medication.timeOfDayEnumTwiceOrThreeTimesDaily || null
      );
      setIntervalTime(`${medication.intervalTime}` || null);
      setStartDate(new Date(medication.startDate));
      setExpirationDate(new Date(medication.expirationDate));
      // setStartDate(startDateDelivered);
      // setExpirationDate(expDateDelivered);
      setInstructions(medication.instructions || null);
      setNotes(medication.notes || "");
    };

    initializeState();
  }, [medication]);

  // for Debugging - to remove
  useEffect(() => {
    const storedUserData = {
      userId_fromUserContext: gUser._id,
    };
    console.log("Stored User Data :", storedUserData);
    console.log("Checking Medication delivered: ", medication);
  }, []);

  // for managing existing data loaded
  useEffect(() => {
    const initializeData = async () => {
      setBackgroundColor(minimized ? "#8cebf2" : "#cddef9");

      if (categoryOptions.length === 0) {
        await fetchCategoryOptions();
      }

      if (selectedCategory !== "") {
        handleCategoryChange(selectedCategory);
        handleMedicationChange(selectedMedication);
      }
    };

    initializeData();
  }, [categoryOptions, selectedCategory, selectedMedication]);

  // Effect for managing background color and fetching category options
  useEffect(() => {
    if (!minimized) {
      setBackgroundColor("#cddef9");

      if (selectedCategory !== "") {
        handleCategoryChange(selectedCategory);
        handleMedicationChange(selectedMedication);
      }
    } else {
      setBackgroundColor("#8cebf2");
    }
  }, [minimized]);

  const fetchCategoryOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/meds/categories`);
      console.log("fetch Category response : ", response.data); // for debugging - to remove

      setCategoryOptions(response.data);
    } catch (error) {
      console.error("Error fetching medication categories: ", error);
    }
  };

  const handleEditMedName = () => {
    setIsEditingMedName(true);
  };

  const handleSaveMedName = () => {
    setIsEditingMedName(false);
  };

  const handleCategoryChange = (value) => {
    console.log("Category change value : ", value); // for debugging - to remove
    setMedications([]);
    setSelectedCategory(value);

    // set the medications list according to the selection of category
    const category = categoryOptions.find(
      (category) => category.category === value
    );

    if (category) {
      const medsWithCategory = category.medications.map((med) => ({
        name: med,
        category: category.category,
        _id: category._id,
      }));
      setMedications(medsWithCategory);
    }
    setIsEditingMedName(false); // Reset editing state when category changes
  };

  const handleMedicationChange = (value) => {
    setSelectedMedication(value);
    setMedicationName(value);
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleConfirmStartDate = (date) => {
    // Convert date to UTC before setting
    // const utcStartDate = toZonedTime(date, "UTC");
    // setStartDate(utcStartDate);
    setStartDate(date);
    hideStartDatePicker();
  };

  const showExpirationDatePicker = () => {
    setExpirationDatePickerVisibility(true);
  };

  const hideExpirationDatePicker = () => {
    setExpirationDatePickerVisibility(false);
  };

  const handleConfirmExpirationDate = (date) => {
    // Convert date to UTC before setting
    // const utcExpDate = toZonedTime(date, "UTC");
    // setExpirationDate(utcExpDate);
    setExpirationDate(date);
    hideExpirationDatePicker();
  };

  const toggleCardMaximized = () => {
    onToggleMinimize();
  };

  const deleteCard = () => {
    onDelete();
  };

  const validateMedData = (medDataToCheck) => {
    if (
      medDataToCheck.medicationName === "Med Name" ||
      medDataToCheck.medicationName === "none"
    ) {
      return { status: false, message: "Please Enter valid Medication Name." };
    }

    if (medDataToCheck.prescriptionNum === null) {
      return { status: false, message: "Prescription number is required." };
    }

    if (medDataToCheck.dosage === null || medDataToCheck.unit === null) {
      return { status: false, message: "Dosage number and Unit are required." };
    }

    if (medDataToCheck.frequency === null) {
      return { status: false, message: "Frequency is required." };
    }

    if (medDataToCheck.frequency === "Once_daily") {
      setTimeOfDayManyTimes(null);
      setIntervalTime(null);
      if (timeOfDayOnce === null) {
        return { status: false, message: "Time of Day info is required." };
      }
    } else if (
      medDataToCheck.frequency === "Twice_daily" ||
      medDataToCheck.frequency === "Three_times_daily"
    ) {
      setTimeOfDayOnce(null);
      setIntervalTime(null);
      if (timeOfDayManyTimes === null) {
        return { status: false, message: "Time of Day info is required." };
      }
    } else {
      setTimeOfDayOnce(null);
      setTimeOfDayManyTimes(null);
      if (medDataToCheck.intervalTime === null) {
        return { status: false, message: "Interval Time is required." };
      }
    }

    if (
      new Date(medDataToCheck.expirationDate) <
      new Date(medDataToCheck.startDate)
    ) {
      return {
        status: false,
        message: "Expiration Date should be equal to or later than Start Date.",
      };
    }

    if (medDataToCheck.instructions === null) {
      return { status: false, message: "Instruction is required." };
    }

    return { status: true, message: "Valid Input." };
  };

  const saveMedication = async () => {
    // Ensure intervalTime remains null if it is not a valid number
    const parsedIntervalTime =
      intervalTime !== null && intervalTime !== ""
        ? parseInt(intervalTime, 10)
        : null;
    const parsedDosage =
      dosage !== null && dosage !== "" ? parseInt(dosage, 10) : null;

    const medicationLog = {
      _id: medication._id,
      medicationName,
      medicationCategory: selectedCategory,
      prescriptionNum,
      dosage: parsedDosage,
      unit,
      frequency,
      timeOfDayEnumOnceDaily: timeOfDayOnce,
      timeOfDayEnumTwiceOrThreeTimesDaily: timeOfDayManyTimes,
      intervalTime: parsedIntervalTime,
      startDate: format(startDate, "yyyy-MM-dd"),
      expirationDate: format(expirationDate, "yyyy-MM-dd"),
      instructions,
      notes,
      userId,
    };
    console.log("Medication log to save:", medicationLog);
    const isValidData = validateMedData(medicationLog);
    if (isValidData.status === false) {
      Alert.alert("Invalid Input", isValidData.message);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/meds/add`,
        medicationLog
      );
      console.log("Medication log saved:", response.data);
      onSave(response.data); // Notify parent component about the saved data
    } catch (error) {
      console.error("Error saving medication log:", error);
    }
  };

  // TODO: Add logic for CRUD (DELETE)

  const updateMedication = async () => {
    console.log("Handling Update Medication"); // for debugging - to remove

    /* Convert intervalTime and dosage to numbers or null
     Ensure intervalTime remains null if it is not a valid number */
    const parsedIntervalTime =
      intervalTime !== null && intervalTime !== ""
        ? parseInt(intervalTime, 10)
        : null;
    const parsedDosage =
      dosage !== null && dosage !== "" ? parseInt(dosage, 10) : null;

    const medicationLog = {
      medId: medication._id,
      medicationName,
      medicationCategory: selectedCategory,
      prescriptionNum,
      dosage: parsedDosage,
      unit,
      frequency,
      timeOfDayEnumOnceDaily: timeOfDayOnce,
      timeOfDayEnumTwiceOrThreeTimesDaily: timeOfDayManyTimes,
      intervalTime: parsedIntervalTime,
      startDate: format(startDate, "yyyy-MM-dd"),
      expirationDate: format(expirationDate, "yyyy-MM-dd"),
      instructions,
      notes,
    };
    console.log("Medication log to update:", medicationLog); // for debugging - to remove

    const isValidData = validateMedData(medicationLog);
    if (isValidData.status === false) {
      Alert.alert("Invalid Input", isValidData.message);
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/meds/update`,
        medicationLog
      );
      console.log("Medication log updated:", response.data);
      onSave(response.data); // Notify parent component about the saved data
    } catch (error) {
      console.error("Error updating medication log:", error);
    }
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     let photo = await cameraRef.current.takePictureAsync();
  //     console.log("Photo taken:", photo);
  //     // TODO: Implement Handle the photo
  //   }
  // };

  const handleDosageChange = (value) => {
    setDosage(value);
  };

  const handleUnitChange = (value) => {
    setUnit(value);
  };

  return (
    <ScrollView className="">
      <Card className=" p-2" style={{ backgroundColor }}>
        <View className="flex-1 items-end border-t">
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
        <View className="flex-row justify-between items-center">
          {/* Med Name */}
          <View className="flex-row gap-2 items-center border-b flex-1">
            {isEditingMedName && selectedMedication === "none" ? (
              <TextInput
                className="text-2xl font-bold px-2 border-b border-gray-500"
                value={medicationName}
                onChangeText={setMedicationName}
                onBlur={handleSaveMedName}
                autoFocus
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (selectedMedication === "none") handleEditMedName();
                }}
                style={{ flex: 1 }}
              >
                <Text className="text-2xl font-bold px-2">
                  {medicationName}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                if (selectedMedication === "none") handleEditMedName();
              }}
            >
              <FontAwesome name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {/* End Med Name */}
        </View>

        {!minimized && (
          <>
            <View className="flex-row justify-between items-center ">
              {/* Category  */}
              <View className="flex-row gap-2 items-center">
                <Text className=" text-lg font-bold mt-2">Category:</Text>
                <Picker
                  style={{ height: 50, width: 250 }}
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => handleCategoryChange(itemValue)}
                >
                  <Picker.Item
                    label="[ Select Category ]"
                    value=""
                    enabled={false}
                  />
                  {categoryOptions.map((category) => (
                    <Picker.Item
                      key={category._id}
                      label={category.category}
                      value={category.category}
                      enabled={true}
                    />
                  ))}
                </Picker>
              </View>
              {/* End of Category  */}
            </View>

            {selectedCategory !== "" && selectedCategory !== "none" && (
              <View className="flex-row justify-between items-center ">
                {/* Medication Name  */}
                <View className="flex-row gap-2 items-center">
                  <Text className=" text-lg font-bold mt-2">Medication:</Text>
                  <Picker
                    style={{ height: 50, width: 250 }}
                    selectedValue={selectedMedication}
                    onValueChange={(itemValue) =>
                      handleMedicationChange(itemValue)
                    }
                  >
                    <Picker.Item
                      label="[ Select Medication ]"
                      value=""
                      enabled={false}
                    />

                    {
                      // for debugging - to remove
                      console.log("select Medication check:", medications)
                    }

                    {medications.map((medication, index) => (
                      <Picker.Item
                        key={index}
                        label={medication.name}
                        value={medication.name}
                        enabled={true}
                      />
                    ))}
                    <Picker.Item
                      label="None - Not listed"
                      value="none"
                      enabled={true}
                    />
                  </Picker>
                </View>
                {/* End of Medication Name  */}
              </View>
            )}
          </>
        )}
        {!minimized && (
          <>
            <Card.Content>
              {/* TODO to add Medication Link Picture */}
              <View className=" flex-row justify-between mt-4 items-center">
                <TouchableOpacity>
                  <Text className="text-lg font-bold ">View Medication </Text>
                </TouchableOpacity>
                <TouchableOpacity
                // onPress={() => setCameraVisible(true)}
                >
                  <AntDesign name="camera" size={24} color="black" />
                </TouchableOpacity>
              </View>
              {/* End of Medication Link Picture */}

              {/* Prescription Number */}
              <Text className=" text-lg font-bold mt-2">Prescription #:</Text>
              <TextInput
                className="border-b p-2 my-1 rounded text-[16px]"
                placeholder="Rx#: 000000-000"
                value={prescriptionNum}
                onChangeText={setPrescriptionNum}
              />
              {/* End of Prescription Number */}

              {/* Dosage */}
              <Text className=" text-lg font-bold mt-2">Dosage:</Text>
              <View className="flex-row justify-between items-center">
                <TextInput
                  placeholder="E.g., 10"
                  value={dosage}
                  onChangeText={handleDosageChange}
                  keyboardType="numeric"
                  className=" border-b text-[16px] w-[30%]"
                />
                <View className=" flex-1">
                  <Picker selectedValue={unit} onValueChange={handleUnitChange}>
                    {commonUnitsPresets.map((preset, index) => (
                      <Picker.Item
                        key={index}
                        label={preset.label}
                        value={preset.value}
                        enabled={preset.enabled !== false}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {/* End of Dosage */}

              {/* Frequency */}
              <Text className="text-lg font-bold">Frequency:</Text>
              <Picker
                selectedValue={frequency}
                onValueChange={(itemValue) => setFrequency(itemValue)}
              >
                {frequencyPresets.map((preset, index) => (
                  <Picker.Item
                    key={index}
                    label={preset.label}
                    value={preset.value}
                    enabled={preset.enabled !== false}
                  />
                ))}
              </Picker>
              {/* End of Frequency */}

              {/* Time of day */}
              {frequency === "Once_daily" ? (
                <>
                  <Text className="text-lg font-bold">Time Of Day:</Text>
                  <Picker
                    selectedValue={timeOfDayOnce}
                    onValueChange={(itemValue) => setTimeOfDayOnce(itemValue)}
                  >
                    {timeOfDayOncePresets.map((preset, index) => (
                      <Picker.Item
                        key={index}
                        label={preset.label}
                        value={preset.value}
                        enabled={preset.enabled !== false}
                      />
                    ))}
                  </Picker>
                </>
              ) : frequency === "Twice_daily" ||
                frequency === "Three_times_daily" ? (
                <>
                  <Text className="text-lg font-bold">Time Of Day:</Text>
                  <Picker
                    selectedValue={timeOfDayManyTimes}
                    onValueChange={(itemValue) =>
                      setTimeOfDayManyTimes(itemValue)
                    }
                  >
                    {timeOfDayManyTimesPresets.map((preset, index) => (
                      <Picker.Item
                        key={index}
                        label={preset.label}
                        value={preset.value}
                        enabled={preset.enabled !== false}
                      />
                    ))}
                  </Picker>
                </>
              ) : (
                <>
                  <Text className="text-lg font-bold">Interval Time:</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      placeholder="E.g., 4"
                      value={intervalTime}
                      onChangeText={setIntervalTime}
                      keyboardType="numeric"
                      className=" border-b text-[16px] w-[30%]"
                    />
                    <Text> Hour(s) </Text>
                  </View>
                </>
              )}
              {/* End of Time of day */}

              {/* Start Date */}
              <Text className=" text-lg font-bold mt-4">Start Date:</Text>
              <View className="">
                <TouchableOpacity
                  onPress={showStartDatePicker}
                  className=" flex-row items-center  p-3 rounded mt-2"
                >
                  <Entypo name="calendar" size={24} color="black" />
                  <Text className=" px-2 ">
                    {/* {startDate.toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })} */}
                    {/* {format(startDate, "yyyy-MM-dd", {
                      timeZone: "America/Toronto",
                    })} */}
                    {format(startDate, "yyyy-MM-dd")}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={startDatePickerVisibility}
                  mode="date"
                  onConfirm={handleConfirmStartDate}
                  onCancel={hideStartDatePicker}
                />
              </View>
              {/* End of Start Date */}

              {/* Expiration Date */}
              <Text className=" text-lg font-bold mt-4">Expiration Date:</Text>
              <View className="">
                <TouchableOpacity
                  onPress={showExpirationDatePicker}
                  className=" flex-row items-center  p-3 rounded mt-2"
                >
                  <Entypo name="calendar" size={24} color="black" />
                  <Text className=" px-2 ">
                    {/* {expirationDate.toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })} */}
                    {/* {format(toZonedTime(expirationDate, "UTC"), "yyyy-MM-dd", {
                      timeZone: "America/Toronto",
                    })} */}
                    {/* {format(
                      toDate(expirationDate, { timeZone: "America/Toronto" }),
                      "yyyy-MM-dd"
                    )} */}

                    {/* {format(expirationDate, "yyyy-MM-dd", {
                      timeZone: "UTC",
                    })} */}

                    {format(expirationDate, "yyyy-MM-dd")}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={expirationDatePickerVisibility}
                  mode="date"
                  onConfirm={handleConfirmExpirationDate}
                  onCancel={hideExpirationDatePicker}
                />
              </View>
              {/* End of Expiration Date */}

              {/* Instructions */}
              <Text className="text-lg font-bold">Instructions:</Text>
              <Picker
                selectedValue={instructions}
                onValueChange={(itemValue) => setInstructions(itemValue)}
              >
                {instructionsPresets.map((preset, index) => (
                  <Picker.Item
                    key={index}
                    label={preset.label}
                    value={preset.value}
                    enabled={preset.enabled !== false}
                  />
                ))}
              </Picker>
              {/* End of Instructions */}

              <Note notes={notes} setNotes={setNotes} />
              {/* End Of Notes */}
              {medication.isLoaded ? (
                <TouchableOpacity
                  className="bg-orange-500 p-4 rounded my-5"
                  onPress={updateMedication}
                >
                  <Text className="text-base font-bold self-center">
                    Update Medication
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="bg-blue-500 p-4 rounded my-5"
                  onPress={saveMedication}
                >
                  <Text className="text-base font-bold self-center">
                    Add Medication
                  </Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </>
        )}
      </Card>
      {/* Camera */}
      {/* {isCameraVisible && (
        <View>
          <Camera type={Camera.Constants.Type.back} ref={cameraRef}>
            <View>
              <TouchableOpacity onPress={() => setCameraVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePicture}>
                <Text>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )} */}
    </ScrollView>
  );
}
