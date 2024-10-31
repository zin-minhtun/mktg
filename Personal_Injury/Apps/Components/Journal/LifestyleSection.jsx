// Purpose: This component is used to display the Lifestyle section of the journal entry form. 
// The user can expand or collapse the section by clicking on the section header. 



import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';

const LifestyleSection = ({ sleep, setSleep, exercise, setExercise, socialActivity, setSocialActivity, nutrition, setNutrition }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lifestyle</Text>
        <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.sectionContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sleep Duration (hours)</Text>
            <TextInput placeholder="ex: 8 hours" value={sleep.duration} onChangeText={(text) => setSleep({ ...sleep, duration: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sleep Quality (1-10)</Text>
            <TextInput placeholder="ex: 8" value={sleep.quality} onChangeText={(text) => setSleep({ ...sleep, quality: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Wake-up Time (HH:MM AM/PM)</Text>
            <TextInput placeholder="ex: 07:00 AM" value={sleep.wakeUpTime} onChangeText={(text) => setSleep({ ...sleep, wakeUpTime: text })} style={styles.input} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Exercise Type</Text>
            <TextInput placeholder="ex: Running" value={exercise.type} onChangeText={(text) => setExercise({ ...exercise, type: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Exercise Duration (minutes)</Text>
            <TextInput placeholder="ex: 30 minutes" value={exercise.duration} onChangeText={(text) => setExercise({ ...exercise, duration: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Exercise Intensity (1-10)</Text>
            <TextInput placeholder="ex: 7" value={exercise.intensity} onChangeText={(text) => setExercise({ ...exercise, intensity: text })} style={styles.input} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Social Activity Interactions</Text>
            <TextInput placeholder="ex: Met friends for lunch" value={socialActivity.interactions} onChangeText={(text) => setSocialActivity({ ...socialActivity, interactions: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Social Activity Time Spent (hours)</Text>
            <TextInput placeholder="ex: 2 hours" value={socialActivity.timeSpent} onChangeText={(text) => setSocialActivity({ ...socialActivity, timeSpent: text })} style={styles.input} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Meals</Text>
            <TextInput placeholder="ex: Breakfast: Eggs and toast" value={nutrition.meals} onChangeText={(text) => setNutrition({ ...nutrition, meals: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Water Intake (ml)</Text>
            <TextInput placeholder="ex: 500 ml" value={nutrition.waterIntake} onChangeText={(text) => setNutrition({ ...nutrition, waterIntake: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dietary Notes</Text>
            <TextInput placeholder="ex: Avoided dairy today" value={nutrition.dietaryNotes} onChangeText={(text) => setNutrition({ ...nutrition, dietaryNotes: text })} style={styles.input} />
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ddf4fe',
    padding: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    padding: 10,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default LifestyleSection;
