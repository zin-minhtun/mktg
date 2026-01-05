import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

// Component
import DecoratedAddBtn from "../DecoratedAddBtn";
import Pain from "../../Icons/Pain";
import { useTheme } from "../../../Contexts/ThemeContext";
import { useUserData } from "../../../Contexts/UserContext";
import { API_URL } from "@env";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react-native";

dayjs.extend(isoWeek);

const AddMobility = ({ navigation }) => {
  const { theme } = useTheme();
  const { gUser } = useUserData();
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [weekDates, setWeekDates] = useState([]);
  const [mobilityLogs, setMobilityLogs] = useState({ mobility: [] });
  const [loading, setLoading] = useState(false);
  const MOBILITY_URL = `${API_URL}/api/dailyLog/mobility`;

  // Fetch all mobility logs
  const fetchmobiltiyLogs = async () => {
    if (!gUser?._id) return;
    try {
      setLoading(true);

      const response = await axios.get(MOBILITY_URL, {
        params: { userId: gUser._id, date: selectedDate },
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const mobility = response.data;
        // Ensure structure is maintained even if empty
        setMobilityLogs(mobility || { mobility: [] });
      }
    } catch (error) {
      console.error("Error fetching mobility logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchmobiltiyLogs();
  }, [selectedDate]);

  useFocusEffect(
    React.useCallback(() => {
      fetchmobiltiyLogs();
    }, [selectedDate])
  );

  useEffect(() => {
    const getCurrentWeek = () => {
      const startOfWeek = dayjs().startOf("isoWeek");
      const dates = [];
      for (let i = 0; i < 7; i++) {
        dates.push(startOfWeek.add(i, "day").format("YYYY-MM-DD"));
      }
      setWeekDates(dates);
    };
    getCurrentWeek();
  }, []);

  const handleDelete = async (mobilityLogId) => {
    try {
      const dailyLogId = mobilityLogs.id || mobilityLogs._id;
      if (!dailyLogId) {
        Alert.alert("Error", "Could not identify daily log.");
        return;
      }
      await axios.delete(`${MOBILITY_URL}/${dailyLogId}/${mobilityLogId}`);
      fetchmobiltiyLogs();
    } catch (e) {
      console.error("Delete failed", e);
      Alert.alert("Error", "Failed to delete log.");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDelete(id) }
    ]);
  };

  const renderWeekDay = ({ item }) => {
    const isSelected = item === selectedDate;
    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item)}
        className="mt-6 rounded-lg w-[55px] h-[70px] border bg-opacity-80"
        style={{
          backgroundColor: isSelected
            ? theme.backgroundAccent
            : theme.textFieldBG,
          borderColor: isSelected ? theme.accentColor : theme.darkGrey,
          borderStyle: "solid",
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="font-raleway" style={{ color: theme.textColor }}>
            {dayjs(item).format("ddd")}
          </Text>
          <Text
            className="text-center font-ralewayBold text-2xl"
            style={{ color: isSelected ? theme.textAccent : theme.textColor }}
          >
            {dayjs(item).format("DD")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const MobilityLogItem = ({ item }) => {
    const isDarkMode = theme.mode === "dark";
    return (
      <View
        className="mx-4 my-2 p-4 rounded-lg flex-row items-center justify-between border"
        style={{
          backgroundColor: isDarkMode
            ? theme.textFieldBG
            : theme.backgroundAccent,
          borderColor: theme.primaryLighBlue,
        }}
      >
        <View className="flex-1">
          <Text
            className="font-ralewaySemiBold text-lg"
            style={{ color: theme.textColor }}
          >
            Transferring
          </Text>
          <Text className="font-raleway mt-1" style={{ color: theme.darkGrey }}>
            Transfers with {item.transferOptions}
          </Text>
          {item.others ? (
            <Text className="font-raleway mt-1" style={{ color: theme.darkGrey }}>
              Other: {item.others}
            </Text>
          ) : null}
          {item.transportoptions ? (
            <Text className="font-raleway mt-1" style={{ color: theme.darkGrey }}>
              Transport: {item.transportoptions}
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddMobilityDetails", {
                selectedDate,
                mobilityLog: {
                  _id: item._id,
                  transferOptions: item.transferOptions,
                  others: item.others,
                  transportoptions: item.transportoptions,
                  additionalNotes: item.additionalNotes,
                },
                isEditing: true,
                dailyLogId: mobilityLogs.id || mobilityLogs._id,
                userId: gUser._id,
              })
            }
            className="mr-3"
          >
            <Pencil size={20} color="#00B8DF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => confirmDelete(item._id)}>
            <Trash2 size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <View className="flex-1">
        {/* calendar section */}
        <View className="pt-14">
          <View className="mx-7">
            <Text className="font-raleway text-gray-600 text-[14px] h-6">
              {dayjs(selectedDate).format("MMM DD, YYYY")}
            </Text>
            <Text
              className="font-ralewayBold text-[24px]"
              style={{ color: theme.textColor }}
            >
              Today
            </Text>
          </View>

          {/* Horizontal scrollable week day section */}
          <View className="mx-3">
            <FlatList
              data={weekDates}
              horizontal
              renderItem={renderWeekDay}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="w-3" />}
            />
          </View>
        </View>

        {/* Content section */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={theme.accentColor} />
          </View>
        ) : mobilityLogs?.mobility?.length > 0 ? (
          <View className="flex-1 mt-4">
            <FlatList
              data={mobilityLogs.mobility}
              renderItem={({ item }) => <MobilityLogItem item={item} />}
              keyExtractor={(item, index) => item._id || index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        ) : (
          <View className="flex-1 items-center">
            <Pain />
            <View className="absolute bottom-36 items-center">
              <Text
                className="text-[20px] font-ralewaySemiBold"
                style={{ color: theme.textColor }}
              >
                You don't have any records.
              </Text>
              <Text
                className="text-[16px] pt-1.5 font-raleway"
                style={{ color: theme.textColor }}
              >
                Click the plus button to add
              </Text>
            </View>
          </View>
        )}

        <DecoratedAddBtn
          navigation={navigation}
          screen={"AddMobilityDetails"}
          selectedDate={selectedDate}
          params={{ selectedDate }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddMobility;
