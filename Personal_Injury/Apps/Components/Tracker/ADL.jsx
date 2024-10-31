import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { Checkbox, List } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUserData } from "../../Contexts/UserContext";
import { API_URL } from "@env";
import axios from "axios";
import Note from "../Memo/Note";

/*******Notes*******/
// TODO: Research and Add more presets ADL's for each categories
// TODO: Add difficulty level for each ADL's
// OPTIONAL: Research another way of saving the log to database.
// FIXME: If no checkboxes are checked, add a note

// Preset Data For ADL's
const categories = [
  {
    title: "Personal Care",
    items: [
      {
        label: "Bathing or showering",
        description: "Taking a bath or shower",
      },
      {
        label: "Brushing teeth",
        description: "Cleaning teeth with a toothbrush",
      },
      { label: "Grooming", description: "Hair care, shaving, nail care" },
      { label: "Dressing", description: "Putting on clothes" },
      { label: "Eating", description: "Feeding oneself, using utensils" },
    ],
  },
  {
    title: "Mobility",
    items: [
      {
        label: "Transferring",
        description:
          "Moving from one location to another, e.g., from bed to chair",
      },
      {
        label: "Walking or using mobility aids",
        description: "Moving with or without assistance",
      },
      {
        label: "Using transportation",
        description: "Driving, using public transit",
      },
    ],
  },
  {
    title: "Household Tasks",
    items: [
      { label: "Cleaning", description: "Mopping, vacuuming" },
      { label: "Laundry", description: "Washing, drying, folding clothes" },
      { label: "Dishwashing", description: "Washing dishes" },
      {
        label: "Taking out trash",
        description: "Removing garbage from the home",
      },
      {
        label: "Meal preparation and planning",
        description: "Cooking and organizing meals",
      },
      {
        label: "Storing food appropriately",
        description: "Ensuring food is stored safely",
      },
    ],
  },
  {
    title: "Managing Life Tasks",
    items: [
      { label: "Managing finances", description: "Paying bills, budgeting" },
      { label: "Communication", description: "Using phone, email, letters" },
      {
        label: "Medication management",
        description: "Taking medications, refills",
      },
      {
        label: "Technology use",
        description: "Using computer, smartphone, internet",
      },
      { label: "Shopping", description: "Making a list, purchasing items" },
    ],
  },
];

export default function ADL() {
  // Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // ADL's
  const [checkedItems, setCheckedItems] = useState({});
  const [notes, setNotes] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  // User Id
  const { gUser } = useUserData();
  const userId = gUser._id;
  // Difficulty
  // const [difficultyLevels, setDifficultyLevels] = useState({});

  // Verify id of the current User
  useEffect(() => {
    const storedUserData = {
      userId_fromUserContext: gUser._id,
    };
    console.log("Stored User Data :", storedUserData);
  }, []);

  // Calendar for current and previous dates
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setStartDate(date);
    setCurrentDate(date);
    hideDatePicker();
  };

  const navigateToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const navigateToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  // ADl Categories and checkboxes
  const handleAccordionPress = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleCheck = (categoryTitle, itemLabel) => {
    const key = `${categoryTitle}-${itemLabel}`;
    setCheckedItems({
      ...checkedItems,
      [key]: !checkedItems[key],
    });
  };

  // Save ADL log entry
  const saveActivityLogs = async () => {
    const selectedItems = Object.keys(checkedItems)
      .filter((key) => checkedItems[key])
      .map((key) => {
        const [category, itemLabel] = key.split("-");
        return { category, itemLabel };
      });

    // FIXME: If no checkboxes are checked, add a note
    let notesToAdd =
      selectedItems.length === 0 ? "Able to perform all ADLs" : "";

    const categories = Array.from(
      new Set(selectedItems.map((item) => item.category))
    );
    const itemLabels = selectedItems.map((item) => item.itemLabel);

    const adlEntry = {
      userId,
      categories,
      itemLabels,
      notes: notes + notesToAdd,
      date: format(currentDate, "yyyy-MM-dd HH:mm:ss"),
    };

    console.log("New activity logs:", adlEntry);

    try {
      const response = await axios.post(`${API_URL}/api/adls/add`, adlEntry);
      console.log("ADL entries saved successfully:", response.data);
      setActivityLogs([...activityLogs, adlEntry]);

      // Clear form fields after successful save
      setCheckedItems({});
      setNotes("");
    } catch (error) {
      console.error("Error saving ADL entries:", error);
    }
  };

  // FIXME: Handle Difficulty
  // const handleDifficultyChange = (itemLabel, value) => {
  //   setDifficultyLevels({
  //     ...difficultyLevels,
  //     [itemLabel]: value,
  //   });
  // };

  return (
    <ScrollView className=" flex-1 bg-white px-3 ">
      {/* Date Selection */}
      <View className=" flex-row items-center justify-center mt-8">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <Entypo className=" px-1" name="calendar" size={24} color="black" />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            display="default"
            maximumDate={startDate}
          />
        </TouchableOpacity>
        <Text className=" text-center text-[16px]">
          {format(currentDate, "EEEE, MMMM do, yyyy, HH:mm")}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* End of Date Selection */}

      {/* Categories and Checkboxes */}
      <View className="mt-4 justify-center">
        <View className="justify-center items-center mt-4">
          <Text className="text-xl font-bold mb-4">
            Manage Your Daily Routine
          </Text>
        </View>
        {categories.map((category, index) => (
          <List.Accordion
            key={index}
            title={<Text className="font-bold">{category.title}</Text>}
            className="bg-white mt-4"
            expanded={expandedCategory === index}
            onPress={() => handleAccordionPress(index)}
          >
            {category.items.map((item, itemIndex) => (
              <List.Item
                key={itemIndex}
                title={<Text className="">{item.label}</Text>}
                description={item.description}
                descriptionNumberOfLines={2}
                right={() => (
                  <Checkbox
                    status={
                      checkedItems[`${category.title}-${item.label}`]
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handleCheck(category.title, item.label)}
                  />
                )}
              />
            ))}
          </List.Accordion>
        ))}
      </View>
      {/* End of Categories and Checkboxes */}

      {/* Notes */}
      {/* <Text className=" text-lg mt-4">Note:</Text>
      <TextInput
        className="border border-black p-2 my-1 rounded"
        placeholder="Add More..."
        value={notes}
        onChangeText={setNotes}
        multiline
      /> */}
      <Note notes={notes} setNotes={setNotes} />
      {/* End of Notes */}

      {/* Save Log button */}
      <TouchableOpacity className=" mt-4" onPress={saveActivityLogs}>
        <Text className=" bg-blue-500 p-3 text-center rounded-xl">
          Save Log
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
