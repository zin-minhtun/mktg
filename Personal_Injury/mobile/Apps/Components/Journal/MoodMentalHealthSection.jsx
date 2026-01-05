// Purpose: This component is used to display the Lifestyle section of the journal entry form. 
// The user can expand or collapse the section by clicking on the section header. 

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';

const MoodMentalHealthSection = ({
  mood,
  setMood,
  mentalHealthNotes,
  setMentalHealthNotes,
  mentalHealthActivities,
  setMentalHealthActivities,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mood/Mental Health</Text>
        <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.sectionContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Morning Mood</Text>
            <TextInput
              placeholder="ex: Happy"
              value={mood.morning}
              onChangeText={(text) => setMood({ ...mood, morning: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Afternoon Mood</Text>
            <TextInput
              placeholder="ex: Stressed"
              value={mood.afternoon}
              onChangeText={(text) => setMood({ ...mood, afternoon: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Evening Mood</Text>
            <TextInput
              placeholder="ex: Content"
              value={mood.evening}
              onChangeText={(text) => setMood({ ...mood, evening: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Stress Levels</Text>
            <TextInput
              placeholder="ex: 1-10"
              value={mentalHealthNotes.stressLevels}
              onChangeText={(text) => setMentalHealthNotes({ ...mentalHealthNotes, stressLevels: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anxiety</Text>
            <TextInput
              placeholder="ex: Yes/No"
              value={mentalHealthNotes.anxiety}
              onChangeText={(text) => setMentalHealthNotes({ ...mentalHealthNotes, anxiety: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Specific Thoughts</Text>
            <TextInput
              placeholder="ex: Specific thoughts"
              value={mentalHealthNotes.thoughts}
              onChangeText={(text) => setMentalHealthNotes({ ...mentalHealthNotes, thoughts: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Meditation</Text>
            <TextInput
              placeholder="ex: Meditation"
              value={mentalHealthActivities.meditation}
              onChangeText={(text) => setMentalHealthActivities({ ...mentalHealthActivities, meditation: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Therapy Sessions</Text>
            <TextInput
              placeholder="ex: Therapy sessions"
              value={mentalHealthActivities.therapy}
              onChangeText={(text) => setMentalHealthActivities({ ...mentalHealthActivities, therapy: text })}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Self-Care Activities</Text>
            <TextInput
              placeholder="ex: Self-care activities"
              value={mentalHealthActivities.selfCare}
              onChangeText={(text) => setMentalHealthActivities({ ...mentalHealthActivities, selfCare: text })}
              style={styles.input}
            />
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

export default MoodMentalHealthSection;