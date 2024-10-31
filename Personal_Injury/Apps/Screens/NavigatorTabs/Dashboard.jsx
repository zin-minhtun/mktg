import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { format, addDays, subDays } from "date-fns";

import Charts from "../../Components/Chart/Charts";
import Log from "../../Components/Log/Log";
// import Explore from "../../Components/Explore (To Be Remove)/Explore";

export default function Dashboard({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const navigateToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "Settings" })
          }
        >
          <Image
            source={require("../../../assets/images/avatar.jpg")}
            style={{ width: 30, height: 30, borderRadius: 15 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text>{format(currentDate, "EEEE, MMMM do, yyyy")}</Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Charts />
        {/* <Log /> */}
        {/* <Explore /> */}
      </ScrollView>
    </View>
  );
}
