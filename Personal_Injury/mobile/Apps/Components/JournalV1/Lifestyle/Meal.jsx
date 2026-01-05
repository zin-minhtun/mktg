import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StatusBar,
  Switch,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "axios";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import WeekNavigation from "../WeekDay/WeekNavigation";
import { MealFormContainer } from "../MealForm/MealFormContainer";
// Removed duplicate inner header; rely on navigation bar title only

dayjs.extend(isoWeek);

// API URL
// API URL
import { API_URL } from '@env';
// HTTP timeout
const HTTP_TIMEOUT = 10000;

const Meal = ({ navigation }) => {
  // Theme context
  const { theme, toggleTheme } = useTheme();
  // We can use theme.mode instead of hardcoded dark check if available, or just stick to theme properties

  // UserContext data
  const { gUser, isLoading } = useUserData();

  // Voice hint state
  const [voiceHintShown, setVoiceHintShown] = useState(false);

  // Application state
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);

  // No animated inner header; spacing handled by scroll content padding

  // Meals data
  const [meals, setMeals] = useState({
    Breakfast: { content: null, isSubmitted: false },
    Lunch: { content: null, isSubmitted: false },
    Dinner: { content: null, isSubmitted: false },
    Snacks: { content: null, isSubmitted: false },
    Others: { content: null, isSubmitted: false },
    Drinks: { content: null, isSubmitted: false }
  });

  // Debug user information
  useEffect(() => {
    console.log("Meal component - User state:", gUser);
  }, [gUser]);

  // Test API connection
  useEffect(() => {
    testApiConnection();
  }, []);

  // Fetch meals when user or date changes
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchMealsByDate(userId);
    }
  }, [selectedDate, gUser]);

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection to:", API_URL);
      const response = await axios.get(`${API_URL}/api/v1/users/ping`, { timeout: HTTP_TIMEOUT });
      console.log("API ping response:", response.data);
    } catch (error) {
      console.error("API ping error:", error);
    }
  };

  const getUserId = () => {
    if (!gUser) return null;
    return gUser._id || gUser.id || gUser.uid;
  };

  const fetchMealsByDate = async (userId) => {
    if (!userId) {
      console.log("Cannot fetch meals: No user ID available");
      return;
    }

    console.log("Fetching meals with user ID:", userId);
    setIsLoadingMeals(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/meals`, {
        params: {
          userId: userId,
          date: selectedDate
        },
        timeout: HTTP_TIMEOUT
      });

      // Process the API response
      const mealsData = response.data;
      console.log("Fetched meals:", mealsData);

      const mealsByType = {
        Breakfast: { content: null, isSubmitted: false },
        Lunch: { content: null, isSubmitted: false },
        Dinner: { content: null, isSubmitted: false },
        Snacks: { content: null, isSubmitted: false },
        Others: { content: null, isSubmitted: false },
        Drinks: { content: null, isSubmitted: false }
      };

      // Organize meals by type
      mealsData.forEach(meal => {
        mealsByType[meal.mealType] = {
          content: {
            id: meal._id,
            foodName: meal.foodName,
            foodType: meal.foodType,
            servingDetails: meal.servingDetails
          },
          isSubmitted: true
        };
      });

      setMeals(mealsByType);
    } catch (error) {
      console.error("Error fetching meals:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
    } finally {
      setIsLoadingMeals(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Use only the navigation bar title; content starts below with padding */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text
            className="font-ralewayBold text-lg mb-2"
            style={{ color: theme.textColor }}
          >
            Loading...
          </Text>
        </View>
      ) : !getUserId() ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text
            className="font-ralewayBold text-lg text-center mb-4"
            style={{ color: theme.textColor }}
          >
            User session not found
          </Text>
          <Text
            className="font-raleway text-center mb-6"
            style={{ color: theme.darkGrey }}
          >
            Please log in to view and track your meals
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20, paddingTop: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Calendar section */}
            <View>
              <WeekNavigation
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onDateChanged={(date) => {
                  console.log("Date changed to:", date);
                }}
              />
            </View>

            <View className="mt-4">
              {isLoadingMeals ? (
                <View className="flex-1 justify-center items-center">
                  <Text style={{ color: theme.textColor }}>
                    Loading...
                  </Text>
                </View>
              ) : (
                <MealFormContainer
                  meals={meals}
                  setMeals={setMeals}
                  getUserId={getUserId}
                  selectedDate={selectedDate}
                  voiceHintShown={voiceHintShown}
                  setVoiceHintShown={setVoiceHintShown}
                />
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Meal;
