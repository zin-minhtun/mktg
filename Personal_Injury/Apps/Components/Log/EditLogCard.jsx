import React from "react";
import { View, Text, Switch } from "react-native";
import { Card } from "react-native-paper";
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

// Component to edit log cards
const EditLogCard = ({ logs, onToggleSwitch }) => {
  return (
    <>
      {logs.map((item, index) => (
        <Card className="my-2" key={item.label || index}>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center mx-1">
              {getIconComponent(item.iconType, item.iconName, 24, "black")}
              <Text className="text-[16px] ml-2">{item.label}</Text>
            </View>
            <Switch
              value={item.isEnabled}
              onValueChange={(isEnabled) => onToggleSwitch(index, isEnabled)} // Call onToggleSwitch when the switch is toggled
            />
          </View>
        </Card>
      ))}
    </>
  );
};

export default EditLogCard;
