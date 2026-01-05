import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import IconWithGlow from '../UI/IconWithGlow';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // 16px padding on each side

const JournalOutlookCard = ({ 
  colors, 
  journalCategories, 
  currentJournalIndex, 
  navigateToPreviousJournal, 
  navigateToNextJournal, 
  handleGoToJournal,
  notesData,
  isDarkMode
}) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.cardContainer, 
        { 
          backgroundColor: isDarkMode ? '#00192F' : '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }
      ]}>
        {/* Card Header */}
        <Text style={[styles.title, { color: isDarkMode ? '#E0E0E0' : colors.textPrimary }]}>
          Journal Outlook
        </Text>
        
        {/* Icon Section with Navigation */}
        <View style={styles.iconSection}>
          <TouchableOpacity 
            onPress={navigateToPreviousJournal} 
            style={[styles.navButton, { marginRight: 30 }]} // Closer to the icon
          >
            <Text style={[styles.navText, { color: colors.primaryBlue }]}>{'<'}</Text>
          </TouchableOpacity>
          
          {/* Centered Icon with Glow */}
          <IconWithGlow 
            icon={journalCategories[currentJournalIndex].icon} 
            isDarkMode={isDarkMode}
          />
          
          <TouchableOpacity 
            onPress={navigateToNextJournal} 
            style={[styles.navButton, { marginLeft: 30 }]} // Closer to the icon
          >
            <Text style={[styles.navText, { color: colors.primaryBlue }]}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content Section */}
        <View style={[
          styles.contentSection, 
          { 
            backgroundColor: isDarkMode ? '#00192F' : '#FFFFFF',
            borderRadius: 12,
            margin: 16,
            marginTop: 10
          }
        ]}>
          <Text style={[styles.categoryTitle, { color: isDarkMode ? '#E0E0E0':'black' }]}>
            {journalCategories[currentJournalIndex].title}
          </Text>
          
          <Text style={[styles.summary, { color: '#E0E0E0' }]}>
            {currentJournalIndex === 3 && notesData 
              ? notesData.text 
              : journalCategories[currentJournalIndex].summary}
          </Text>
          
          {/* Go to Journal Button */}
          <TouchableOpacity 
            onPress={handleGoToJournal}
            style={[styles.button, { backgroundColor: colors.buttonBackground }]}
          >
            <Text style={[styles.buttonText, { color: isDarkMode ? '#00192F' : '#FFFFFF' }]}>
              Go to Journal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 10
  },
  cardContainer: {
    overflow: 'hidden',
    paddingBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 16
  },
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navText: {
    fontSize: 24,
    fontWeight: '300'
  },
  contentSection: {
    padding: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  summary: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 20
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 180
  },
  buttonText: {
    color: '#E0E0E0',
    fontWeight: '600',
    fontSize: 16
  }
});

export default JournalOutlookCard;