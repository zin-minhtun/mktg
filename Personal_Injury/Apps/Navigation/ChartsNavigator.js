import React from "react";
import { View } from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Charts
import PainChart from "../Screens/Charts/PainChart";

const ChartsNavigator = () => (
  <Stack.Navigator>
  <Stack.Screen
    name="Pain Chart"
    component={PainChart}
    options={({ navigation }) => ({
      headerLeft: () => (
        <AntDesign
          name="left"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <View className="flex-row mx-2">
          <Entypo name="upload" size={24} color="black" />
          <View style={{ width: 10 }} />
          <Ionicons name="journal" size={24} color="black" />
        </View>
      ),
    })}
  />
  </Stack.Navigator>
);

export default ChartsNavigator;
