import { Pressable, Text } from 'react-native';
import { useTheme } from "../../Contexts/ThemeContext";

export default function AppButton({
    text,
    variant = "primary", // primary, secondary, disabled
    onPress,
  }) {

    const { theme, toggleTheme } = useTheme();

    // Define dynamic styles based on variant and theme
  const getStyles = () => {
    switch (variant) {
      case "primary":
        return {
          container: {
            backgroundColor: theme.primaryLighBlue,
            borderColor: theme.primaryLighBlue,
          },
          text: {
            color: theme.textFieldBG, // White text in light mode, adjusts in dark
          },
        };

      case "secondary":
        return {
          container: {
            backgroundColor: "transparent",
            borderColor: theme.primaryLighBlue,
            borderWidth: 2,
          },
          text: {
            color: theme.primaryLighBlue,
          },
        };

      case "disabled":
        return {
          container: {
            backgroundColor: theme.darkGrey,
            borderColor: theme.darkGrey,
          },
          text: {
            color: theme.borderColor,
          },
        };

      default:
        return {};
    }
  };

  const styles = getStyles();


  return (
    <Pressable
    style={{ backgroundColor: styles.container.backgroundColor,
        borderColor: styles.container.borderColor,
        borderWidth: styles.container.borderWidth || 0,
    }}
      className="flex-1 mx-2 py-2 rounded-3xl"
      onPress={onPress}
    >
      <Text style={{ color: styles.text.color }} className="text-center text-lg rounded-xl">
        {text}
      </Text>
    </Pressable>
  );
}