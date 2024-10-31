// This component displays the Journal tab in the app. It contains multiple sections for the user to input their daily journal entries.

import React, { useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LifestyleSection from '../../Components/Journal/LifestyleSection';
import MoodMentalHealthSection from '../../Components/Journal/MoodMentalHealthSection';
import MedicationSection from '../../Components/Journal/MedicationSection';
import SymptomsSection from '../../Components/Journal/SymptomsSection';
import ExtraNotesSection from '../../Components/Journal/ExtraNotesSection';
import PainSection from '../../Components/Journal/PainSection';

const Journal = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [sleep, setSleep] = useState({ duration: '', quality: '', wakeUpTime: '' });
  const [exercise, setExercise] = useState({ type: '', duration: '', intensity: '' });
  const [socialActivity, setSocialActivity] = useState({ interactions: '', timeSpent: '' });
  const [nutrition, setNutrition] = useState({ meals: '', waterIntake: '', dietaryNotes: '' });
  
  const [mood, setMood] = useState({ morning: '', afternoon: '', evening: '' });
  const [mentalHealthNotes, setMentalHealthNotes] = useState({ stressLevels: '', anxiety: '', thoughts: '' });
  const [mentalHealthActivities, setMentalHealthActivities] = useState({ meditation: '', therapy: '', selfCare: '' });
  
  const [medication, setMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [adherence, setAdherence] = useState({ takenOnTime: '', missedDoses: '' });
  const [sideEffects, setSideEffects] = useState({ observedSideEffects: '' });
  
  const [symptoms, setSymptoms] = useState({ type: '', severity: '', duration: '', triggers: '' });
  const [painScale, setPainScale] = useState({ severity: '' });
  
  const [extraNotes, setExtraNotes] = useState({ general: '' });

  const handleSave = () => {
    console.log('Journal saved', {
      date,
      sleep,
      exercise,
      socialActivity,
      nutrition,
      mood,
      mentalHealthNotes,
      mentalHealthActivities,
      medication,
      adherence,
      sideEffects,
      symptoms,
      painScale,
      extraNotes,
    });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateContainer}>
        {/* <Text style={styles.sectionTitle}>Select Date</Text> */}
        <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      <PainSection />

      <LifestyleSection 
        sleep={sleep} setSleep={setSleep}
        exercise={exercise} setExercise={setExercise}
        socialActivity={socialActivity} setSocialActivity={setSocialActivity}
        nutrition={nutrition} setNutrition={setNutrition}
      />
      <MoodMentalHealthSection 
        mood={mood} setMood={setMood}
        mentalHealthNotes={mentalHealthNotes} setMentalHealthNotes={setMentalHealthNotes}
        mentalHealthActivities={mentalHealthActivities} setMentalHealthActivities={setMentalHealthActivities}
      />
      <MedicationSection 
        medication={medication} setMedication={setMedication}
        adherence={adherence} setAdherence={setAdherence}
        sideEffects={sideEffects} setSideEffects={setSideEffects}
      />
      <SymptomsSection 
        symptoms={symptoms} setSymptoms={setSymptoms}
        painScale={painScale} setPainScale={setPainScale}
      />
      <ExtraNotesSection 
        extraNotes={extraNotes} setExtraNotes={setExtraNotes}
      />

      <View style={styles.saveButtonContainer}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 0, 
  },
});

export default Journal;
