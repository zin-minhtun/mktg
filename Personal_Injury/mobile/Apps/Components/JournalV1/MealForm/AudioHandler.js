import { Alert } from 'react-native';

/**
 * Handles microphone button interactions for speech-to-text in meal forms
 * Using built-in keyboard microphone functionality
 */
export const AudioHandler = {
  /**
   * Shows the voice hint if not already shown and focuses the input field
   * @param {Object} inputRef - React ref for the input field
   * @param {Function} setVoiceHintShown - State setter for voice hint shown flag
   * @param {Boolean} voiceHintShown - Whether voice hint has been shown
   */
  focusInputWithVoiceHint: (inputRef, setVoiceHintShown, voiceHintShown) => {
    if (inputRef && inputRef.current) {
      // Focus input to show keyboard
      inputRef.current.focus();
      
      // Show hint if not shown before
      if (!voiceHintShown) {
        Alert.alert(
          "Voice Input Hint",
          "You can enter your meal details by speaking into the microphone button on the keyboard.",
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
    }
  },

  /**
   * Handles the speech-to-text functionality by focusing input field to show keyboard
   * User can then use the keyboard's built-in microphone button
   * @param {Object} inputRef - React ref for the input field
   * @param {Function} setTextFunc - State setter for the input text (not used in this implementation)
   * @param {Function} setVoiceHintShown - State setter for voice hint shown flag
   * @param {Boolean} voiceHintShown - Whether voice hint has been shown
   */
  handleSpeechToText: async (inputRef, setTextFunc, setVoiceHintShown, voiceHintShown) => {
    try {
      // Just focus the input field to show keyboard
      AudioHandler.focusInputWithVoiceHint(inputRef, setVoiceHintShown, voiceHintShown);
      
      // Log to console for debugging
      console.log("Input field focused, keyboard should show with microphone option");
    } catch (error) {
      console.error("Error with input focus:", error);
    }
  }
};

export default AudioHandler;