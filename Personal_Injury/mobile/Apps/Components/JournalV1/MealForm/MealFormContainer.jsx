import React, { useState } from 'react';
import { View } from 'react-native';
import { MealForm } from './MealForm';

// Array of meal types for mapping
const MEAL_TYPES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Others",
  "Drinks"
];

export const MealFormContainer = ({ 
  meals, 
  setMeals, 
  getUserId, 
  selectedDate, 
  voiceHintShown, 
  setVoiceHintShown 
}) => {
  // State to track which form is currently visible
  const [visibleForm, setVisibleForm] = useState(null);

  // Toggle form visibility
  const toggleFormVisibility = (mealType) => {
    setVisibleForm(visibleForm === mealType ? null : mealType);
  };

  return (
    <View>
      {MEAL_TYPES.map(mealType => (
        <MealForm
          key={mealType}
          mealType={mealType}
          isVisible={visibleForm === mealType}
          toggleVisibility={() => toggleFormVisibility(mealType)}
          meal={meals[mealType]}
          meals={meals}
          setMeals={setMeals}
          getUserId={getUserId}
          selectedDate={selectedDate}
          voiceHintShown={voiceHintShown}
          setVoiceHintShown={setVoiceHintShown}
        />
      ))}
    </View>
  );
};