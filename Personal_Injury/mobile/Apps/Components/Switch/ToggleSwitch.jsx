import { Switch } from "react-native";
import React, { useState, useEffect } from "react";

export default function ToggleSwitch({ onToggle, isEnabled }) {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(isEnabled);

  useEffect(() => {
    setIsSwitchEnabled(isEnabled);
  }, [isEnabled]);

  const toggleSwitch = () => {
    setIsSwitchEnabled((previousState) => !previousState);
    onToggle(!isSwitchEnabled);
  };

  return (
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={isSwitchEnabled ? "#f5dd4b" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isSwitchEnabled}
    />
  );
}
