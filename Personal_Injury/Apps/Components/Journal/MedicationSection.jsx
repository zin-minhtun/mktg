// Purpose: This component is used to display the Lifestyle section of the journal entry form. 
// The user can expand or collapse the section by clicking on the section header. 

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';

const MedicationSection = ({ medication, setMedication, adherence, setAdherence, sideEffects, setSideEffects }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medication</Text>
        <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.sectionContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Medication Name</Text>
            <TextInput placeholder="ex: Name" value={medication.name} onChangeText={(text) => setMedication({ ...medication, name: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput placeholder="ex: Dosage" value={medication.dosage} onChangeText={(text) => setMedication({ ...medication, dosage: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Frequency</Text>
            <TextInput placeholder="ex: Frequency" value={medication.frequency} onChangeText={(text) => setMedication({ ...medication, frequency: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Taken On Time</Text>
            <TextInput placeholder="ex: Yes/No" value={adherence.takenOnTime} onChangeText={(text) => setAdherence({ ...adherence, takenOnTime: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Missed Doses</Text>
            <TextInput placeholder="ex: Yes/No" value={adherence.missedDoses} onChangeText={(text) => setAdherence({ ...adherence, missedDoses: text })} style={styles.input} />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Observed Side Effects</Text>
            <TextInput placeholder="ex: Side effects" value={sideEffects.observedSideEffects} onChangeText={(text) => setSideEffects({ ...sideEffects, observedSideEffects: text })} style={styles.input} />
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

export default MedicationSection;
