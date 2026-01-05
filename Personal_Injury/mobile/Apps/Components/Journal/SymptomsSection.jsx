// Purpose: This component is used to display the Lifestyle section of the journal entry form. 
// The user can expand or collapse the section by clicking on the section header. 

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';

const SymptomsSection = ({ symptoms, setSymptoms, painScale, setPainScale }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Symptoms</Text>
        <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.sectionContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Symptom Type</Text>
            <TextInput placeholder="ex: Type of symptom" value={symptoms.type} onChangeText={(text) => setSymptoms({ ...symptoms, type: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Symptom Severity</Text>
            <TextInput placeholder="ex: Severity of symptom" value={symptoms.severity} onChangeText={(text) => setSymptoms({ ...symptoms, severity: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Symptom Duration</Text>
            <TextInput placeholder="ex: Duration of symptom" value={symptoms.duration} onChangeText={(text) => setSymptoms({ ...symptoms, duration: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Symptom Triggers</Text>
            <TextInput placeholder="ex: Triggers of symptom" value={symptoms.triggers} onChangeText={(text) => setSymptoms({ ...symptoms, triggers: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Pain Severity</Text>
            <TextInput placeholder="ex: Severity of pain" value={painScale.severity} onChangeText={(text) => setPainScale({ ...painScale, severity: text })} style={styles.input} />
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
    backgroundColor: '#e0f5fe',
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

export default SymptomsSection;
