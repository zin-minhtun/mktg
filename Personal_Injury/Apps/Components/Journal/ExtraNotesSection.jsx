// Purpose: This component is used to display the Extra Notes section of the Journal page.

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ExtraNotesSection = ({ extraNotes, setExtraNotes }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Extra Notes</Text>
      
      <Text style={styles.label}>General Notes</Text>
      <TextInput placeholder="ex: Additional information, reflections, observations" value={extraNotes.general} onChangeText={(text) => setExtraNotes({ ...extraNotes, general: text })} style={styles.input} />
    </View>
  );


const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ExtraNotesSection;
