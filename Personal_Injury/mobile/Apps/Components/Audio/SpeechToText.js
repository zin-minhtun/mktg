import { Alert, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import { useState, useEffect } from 'react';

/**
 * SpeechToText utility for voice input recognition using react-native-voice
 */
export const SpeechToText = {
  // Initialize Voice instance
  _voice: Voice,
  
  // Check if speech recognition is available on the device
  isAvailable: async () => {
    try {
      // react-native-voice doesn't have a direct method to check availability
      // But we can assume it's available on most devices
      return true;
    } catch (error) {
      console.error("Error checking speech recognition availability:", error);
      return false;
    }
  },

  // Request microphone permissions (handled automatically by Voice)
  requestPermissions: async () => {
    try {
      // react-native-voice handles permissions internally
      return true;
    } catch (error) {
      console.error("Error requesting microphone permissions:", error);
      return false;
    }
  },

  // Start listening for speech
  startListening: async (onResult, onError) => {
    try {
      // Setup event listeners
      Voice.onSpeechStart = () => {
        console.log("Speech recognition started");
      };
      
      Voice.onSpeechEnd = () => {
        console.log("Speech recognition ended");
      };
      
      Voice.onSpeechResults = (event) => {
        console.log("Speech recognition results:", event);
        if (event.value && event.value.length > 0) {
          // Get the most likely result (first one)
          const recognizedText = event.value[0];
          if (onResult) {
            onResult(recognizedText);
          }
        }
      };
      
      Voice.onSpeechError = (error) => {
        console.error("Speech recognition error:", error);
        if (onError) {
          onError(error);
        }
      };
      
      // Start recognition
      await Voice.start('en-US'); // You can change the locale as needed
      return true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      if (onError) {
        onError(error);
      }
      return false;
    }
  },

  // Stop listening for speech
  stopListening: async () => {
    try {
      await Voice.stop();
      console.log("Speech recognition stopped");
      return true;
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
      return false;
    }
  },
  
  // Destroy Voice instance (call this in component unmount)
  destroy: async () => {
    try {
      await Voice.destroy();
      Voice.onSpeechStart = null;
      Voice.onSpeechEnd = null;
      Voice.onSpeechResults = null;
      Voice.onSpeechError = null;
    } catch (error) {
      console.error("Error destroying Voice instance:", error);
    }
  },

  // Show voice hint to the user
  showVoiceHint: (setVoiceHintShown) => {
    Alert.alert(
      "Voice Input",
      "you can enter your meal details by speaking into the microphone button on the keyboard.",
      [{ 
        text: "Got it", 
        onPress: () => {
          if (setVoiceHintShown) {
            setVoiceHintShown(true);
          }
        },
        style: "default" 
      }]
    );
  }
};

export default SpeechToText;