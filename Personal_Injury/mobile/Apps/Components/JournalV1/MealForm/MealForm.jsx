import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useTheme } from '../../../Contexts/ThemeContext';
import EditIcon from '../../Icons/EditIcon';
import AudioInputIcon from '../../Icons/AudioInputIcon';
import CrossIcon from '../../Icons/CrossIcon';
import CheckIcon from '../../Icons/CheckIcon';
import DeleteIcon from '../../Icons/DeleteIcon';
import AudioHandler from './AudioHandler';

// API constants (from .env if available)
import { API_URL } from '@env';
const HTTP_TIMEOUT = 10000;

export const MealForm = ({
  mealType,
  isVisible,
  toggleVisibility,
  meal,
  meals,
  setMeals,
  getUserId,
  selectedDate,
  setVoiceHintShown,
  voiceHintShown
}) => {
  const { theme } = useTheme();

  // Form input refs
  const foodNameRef = useRef(null);
  const foodTypeRef = useRef(null);
  const servingDetailsRef = useRef(null);

  // Form fields state
  const [foodName, setFoodName] = useState(meal.content?.foodName || "");
  const [foodType, setFoodType] = useState(meal.content?.foodType || "");
  const [servingDetails, setServingDetails] = useState(meal.content?.servingDetails || "");

  // Active input field for focusing
  const [activeInputField, setActiveInputField] = useState('foodName');

  // Automatically focus first input field when form opens
  useEffect(() => {
    if (isVisible && foodNameRef.current) {
      // Short delay to ensure component is fully rendered
      setTimeout(() => {
        foodNameRef.current.focus();
      }, 100);
    }
  }, [isVisible]);

  // Update form fields when meal data changes
  useEffect(() => {
    if (meal.content) {
      setFoodName(meal.content.foodName || "");
      setFoodType(meal.content.foodType || "");
      setServingDetails(meal.content.servingDetails || "");
    }
  }, [meal]);

  // Handle microphone button click - focus the active input field
  const handleMicrophonePress = () => {
    // Determine which input field to focus
    let inputRef;

    switch (activeInputField) {
      case 'foodName':
        inputRef = foodNameRef;
        break;
      case 'foodType':
        inputRef = foodTypeRef;
        break;
      case 'servingDetails':
        inputRef = servingDetailsRef;
        break;
      default:
        inputRef = foodNameRef;
    }

    // Focus the input field and show voice hint if needed
    AudioHandler.focusInputWithVoiceHint(inputRef, setVoiceHintShown, voiceHintShown);
  };

  // Save meal to API
  const saveMeal = async () => {
    // Dismiss keyboard before saving
    Keyboard.dismiss();

    const userId = getUserId();
    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    if (!foodName.trim()) {
      Alert.alert("Error", "Food name is required");
      return;
    }

    try {
      const mealData = {
        userId,
        date: selectedDate,
        mealType,
        foodName,
        foodType,
        servingDetails
      };

      let response;

      if (meal.content?.id) {
        // Update existing meal
        response = await axios.put(`${API_URL}/api/v1/meals/${meal.content.id}`, mealData);
      } else {
        // Create new meal
        response = await axios.post(`${API_URL}/api/v1/meals`, mealData);
      }

      // Update local state
      const updatedMeals = {
        ...meals,
        [mealType]: {
          content: {
            id: response.data._id,
            foodName,
            foodType,
            servingDetails
          },
          isSubmitted: true
        }
      };

      setMeals(updatedMeals);
      // Mirror into optional Journal store (offline view)
      try {
        if (global?.journalStore?.setLifestyle) {
          global.journalStore.setLifestyle({ meals: updatedMeals });
        }
      } catch (_) { }
      toggleVisibility();

      Alert.alert("Success", "Meal saved successfully");
    } catch (error) {
      console.error("Error saving meal:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      Alert.alert("Error", "Failed to save meal data");
    }
  };

  // Delete meal
  const deleteMeal = async () => {
    // Dismiss keyboard before showing alert
    Keyboard.dismiss();

    if (!meal.content?.id) return;

    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/v1/meals/${meal.content.id}`);

              // Update local state
              const updatedMeals = {
                ...meals,
                [mealType]: { content: null, isSubmitted: false }
              };

              setMeals(updatedMeals);
              toggleVisibility();

              Alert.alert("Success", "Meal deleted successfully");
            } catch (error) {
              console.error("Error deleting meal:", error);
              Alert.alert("Error", "Failed to delete meal data");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Clear form fields or close the form
  const handleCross = () => {
    // Dismiss keyboard before closing
    Keyboard.dismiss();

    // If form is empty, just close it
    if (!foodName && !foodType && !servingDetails) {
      toggleVisibility();
      return;
    }

    // If the form has content, ask for confirmation
    Alert.alert(
      "Close Form",
      "Your changes will not be saved. Do you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Close",
          onPress: () => toggleVisibility(),
          style: "destructive"
        }
      ]
    );
  };

  // Closed or collapsed view
  if (!isVisible) {
    const canEdit = !!meal.isSubmitted;
    const onRowPress = () => {
      if (!canEdit) toggleVisibility(); // Only open editor if not submitted yet
    };
    const onEditPress = () => toggleVisibility();
    return (
      <TouchableOpacity onPress={onRowPress} activeOpacity={canEdit ? 1 : 0.7}>
        <View
          className="flex-row items-center mb-4 px-5 py-4 rounded-xl"
          style={{
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: theme.textFieldBG,
            shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
            elevation: 2
          }}
        >
          <View className="flex-1 justify-center">
            <Text
              className="font-ralewaySemiBold text-[16px]"
              style={{ color: theme.textColor }}
            >
              {mealType}
            </Text>
            {meal.isSubmitted ? (
              <Text
                className="font-raleway text-[14px]"
                style={{ color: theme.darkGrey }}
              >
                {`${meal.content?.foodName || ''}${meal.content?.foodType ? ' • ' + meal.content.foodType : ''}${meal.content?.servingDetails ? ' • ' + meal.content.servingDetails : ''}`}
              </Text>
            ) : (
              <Text
                className="font-raleway text-[16px]"
                style={{ color: theme.darkGrey }}
              >
                Click to Add Content
              </Text>
            )}
          </View>

          {meal.isSubmitted ? (
            <TouchableOpacity onPress={onEditPress}>
              <View
                className="h-12 w-12 rounded-lg justify-center items-center"
                style={{ backgroundColor: theme.mode === 'dark' ? theme.background : '#E6F4FF', borderColor: theme.primaryLighBlue, borderWidth: 1 }}
              >
                <EditIcon />
              </View>
            </TouchableOpacity>
          ) : (
            <View
              className="h-12 w-12 rounded-lg justify-center items-center"
              style={{ backgroundColor: theme.mode === 'dark' ? theme.background : '#E6F4FF', borderColor: theme.primaryLighBlue, borderWidth: 1 }}
            >
              <Text
                className="font-bold text-2xl"
                style={{ color: theme.primaryLighBlue }}
              >
                +
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Open form view
  return (
    <View className="my-3">
      <Text
        className="font-ralewaySemiBold text-[16px] w-full pb-3"
        style={{ color: theme.textColor }}
      >
        {mealType}
      </Text>
      <View
        className="rounded-xl px-4 py-4 space-y-4"
        style={{
          borderWidth: 1,
          borderColor: theme.borderColor,
          backgroundColor: theme.textFieldBG,
          shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
          elevation: 2
        }}
      >
        <TextInput
          ref={foodNameRef}
          value={foodName}
          onChangeText={setFoodName}
          placeholder={`Food Name (e.g. ${mealType === "Breakfast" ? "Eggs and Toast" : mealType})`}
          placeholderTextColor={theme.darkGrey}
          className="font-raleway text-[16px] border-b px-3 pb-2"
          style={{
            borderBottomColor: theme.borderColor,
            color: theme.textColor
          }}
          onFocus={() => setActiveInputField('foodName')}
          autoFocus={true}
        />
        <TextInput
          ref={foodTypeRef}
          value={foodType}
          onChangeText={setFoodType}
          placeholder="Fast food or Home-made"
          placeholderTextColor={theme.darkGrey}
          className="font-raleway text-[16px] border-b px-3 pb-2"
          style={{
            borderBottomColor: theme.borderColor,
            color: theme.textColor
          }}
          onFocus={() => setActiveInputField('foodType')}
        />
        <TextInput
          ref={servingDetailsRef}
          value={servingDetails}
          onChangeText={setServingDetails}
          placeholder="Serving Details (e.g. 2 eggs, 1 slice of toast)"
          placeholderTextColor={theme.darkGrey}
          className="font-raleway text-[16px] border-b px-3 pb-2"
          style={{
            borderBottomColor: theme.borderColor,
            color: theme.textColor
          }}
          onFocus={() => setActiveInputField('servingDetails')}
        />
        <View className="flex-row justify-between mt-3">
          {/* Left side buttons */}
          <View className="flex-row">
            {/* Delete button - only shown for existing meals */}
            {meal.content?.id && (
              <TouchableOpacity
                onPress={deleteMeal}
                className="justify-center items-center mr-3 rounded-full w-12 h-12 bg-[#E0E0E0]"
                style={{ backgroundColor: theme.mode === 'dark' ? '#003361' : undefined }}
              >
                <DeleteIcon />
              </TouchableOpacity>
            )}
          </View>

          {/* Right side buttons */}
          <View className="flex-row">
            {/* Microphone button - Now simply focuses the active input field */}
            <TouchableOpacity
              onPress={handleMicrophonePress}
              className="justify-center items-center mr-3 rounded-full w-12 h-12"
              style={{ backgroundColor: theme.primaryLighBlue }}
            >
              <AudioInputIcon />
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              onPress={handleCross}
              className="justify-center items-center mr-3 rounded-full w-12 h-12 bg-[#E0E0E0]"
              style={{ backgroundColor: theme.mode === 'dark' ? '#003361' : undefined }}
            >
              <CrossIcon />
            </TouchableOpacity>

            {/* Save button */}
            <TouchableOpacity
              onPress={saveMeal}
              className="justify-center items-center rounded-full w-12 h-12 bg-[#E0E0E0]"
              style={{ backgroundColor: theme.mode === 'dark' ? '#003361' : undefined }}
            >
              <CheckIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
