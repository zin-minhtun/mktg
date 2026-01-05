import React from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";

// Function to get the appropriate icon component
const getIconComponent = (iconType, iconName, size, color) => {
  switch (iconType) {
    case "MaterialIcons":
      return <MaterialIcons name={iconName} size={size} color={color} />;
    case "FontAwesome5":
      return <FontAwesome5 name={iconName} size={size} color={color} />;
    case "Ionicons":
      return <Ionicons name={iconName} size={size} color={color} />;
    case "Entypo":
      return <Entypo name={iconName} size={size} color={color} />;
    default:
      return null;
  }
};

// Function to render a single card with specific styles
const renderCard = (item, index, navigation) => {
  let cardClasses = "m-1 rounded-lg bg-white relative"; // default card classes with relative positioning

  // Apply specific styles for special layout cards
  if (index % 4 === 0) {
    cardClasses += " w-1/2 h-50";
  } else if (index % 4 === 1 || index % 4 === 2) {
    cardClasses += " w-full h-24";
  } else if (index % 4 === 3) {
    cardClasses += " w-full h-24 mt-1";
  }

  return (
    <Card
      key={item.label}
      className={cardClasses}
      onPress={() =>
        navigation.navigate("LogsNavigator", { screen: item.screen })
      }
    >
      <View className="flex-row items-center justify-between p-4">
        {getIconComponent(item.iconType, item.iconName, 24, "black")}
        <Text className="text-lg font-bold">+</Text>
      </View>
      <View className={index % 4 === 0 ? "ml-2" : "ml-2"}>
        <Text className="text-lg font-bold">{item.label}</Text>
      </View>
    </Card>
  );
};

// Component to display log cards
const LogCard = ({ logs }) => {
  const navigation = useNavigation();
  const enabledLogs = logs.filter((item) => item.isEnabled); // Filter to get only enabled logs

  return (
    <View className="flex-col p-1">
      {enabledLogs.map((item, index) => {
        if (index % 4 === 0) {
          return (
            <View key={item.label} className="flex-row mb-1">
              {renderCard(item, index, navigation)}
              <View className="flex-1">
                {enabledLogs[index + 1] &&
                  renderCard(enabledLogs[index + 1], index + 1, navigation)}
                {enabledLogs[index + 2] &&
                  renderCard(enabledLogs[index + 2], index + 2, navigation)}
              </View>
            </View>
          );
        } else if (index % 4 === 3) {
          return (
            <View key={item.label}>{renderCard(item, index, navigation)}</View>
          );
        } else {
          return null;
        }
      })}
    </View>
  );
};

export default LogCard;