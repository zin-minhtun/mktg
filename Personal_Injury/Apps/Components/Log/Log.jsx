import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserData } from "../../Contexts/UserContext";
import EditLogCard from "./EditLogCard";
import LogCard from "./LogCard";
import { Card } from "react-native-paper";
import Pagination from "./Pagination";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const logData = [
  {
    iconType: "MaterialIcons",
    iconName: "local-pharmacy",
    label: "Medications",
    screen: "Medication",
    isEnabled: true,
  },
  {
    iconType: "FontAwesome5",
    iconName: "briefcase-medical",
    label: "Pain",
    screen: "Pain",
    isEnabled: true,
  },
  {
    iconType: "Ionicons",
    iconName: "walk",
    label: "Activity",
    screen: "ADL",
    isEnabled: true,
  },
  {
    iconType: "Entypo",
    iconName: "emoji-happy",
    label: "Mood",
    screen: "Mood",
    isEnabled: true,
  },
  {
    iconType: "Ionicons",
    iconName: "water",
    label: "Fluid",
    screen: "Fluid",
    isEnabled: true,
  },
  {
    iconType: "Ionicons",
    iconName: "bed",
    label: "Sleep",
    screen: "Sleep",
    isEnabled: true,
  },
  {
    iconType: "MaterialIcons",
    iconName: "healing",
    label: "Treatment",
    screen: "Treatment",
    isEnabled: true,
  },
  {
    iconType: "FontAwesome5",
    iconName: "weight",
    label: "Body Composition",
    screen: "BodyComposition",
    isEnabled: true,
  },
  {
    iconType: "MaterialIcons",
    iconName: "restaurant",
    label: "Diet",
    screen: "Diet",
    isEnabled: true,
  },
  {
    iconType: "MaterialIcons",
    iconName: "fitness-center",
    label: "Exercise",
    screen: "Exercise",
    isEnabled: true,
  },
  {
    iconType: "MaterialIcons",
    iconName: "groups",
    label: "Social Activity",
    screen: "SocialActivity",
    isEnabled: true,
  },
];

const Log = () => {
  const { gUser } = useUserData();

  const [modalVisible, setModalVisible] = useState(false);
  const [logs, setLogs] = useState(logData);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!gUser) {
      return;
    }

    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem(`logs_${gUser.uid}`);
        if (storedLogs) {
          const parsedStoredLogs = JSON.parse(storedLogs);

          const updatedLogs = logData.map((log) => {
            const storedLog = parsedStoredLogs.find(
              (r) => r.label === log.label
            );
            return storedLog ? { ...log, isEnabled: storedLog.isEnabled } : log;
          });

          if (
            JSON.stringify(parsedStoredLogs) !== JSON.stringify(updatedLogs)
          ) {
            await AsyncStorage.setItem(
              `logs_${gUser.uid}`,
              JSON.stringify(updatedLogs)
            );
          }

          setLogs(updatedLogs);
        } else {
          await AsyncStorage.setItem(
            `logs_${gUser.uid}`,
            JSON.stringify(logData)
          );
          setLogs(logData);
        }
      } catch (error) {
        console.error("Failed to load logs:", error);
      }
    };

    loadLogs();
  }, [gUser]);

  const handleToggleSwitch = async (index, isEnabled) => {
    if (!gUser) {
      return;
    }

    const log = logs[index];
    if (
      log.label === "Pain" ||
      log.label === "Medications" ||
      log.label === "Mood" ||
      log.label === "Activity"
    ) {
      return;
    }

    const updatedLogs = logs.map((item, idx) =>
      idx === index ? { ...item, isEnabled } : item
    );
    setLogs(updatedLogs);

    try {
      await AsyncStorage.setItem(
        `logs_${gUser.uid}`,
        JSON.stringify(updatedLogs)
      );
    } catch (error) {
      console.error("Failed to save logs:", error);
    }
  };

  const handleGesture = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -50) {
        // Swipe left
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
      } else if (nativeEvent.translationX > 50) {
        // Swipe right
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
      }
    }
  };

  const totalPages = Math.ceil(
    logs.filter((item) => item.isEnabled).length / itemsPerPage
  );

  return (
    <PanGestureHandler onHandlerStateChange={handleGesture}>
      <View style={{ flex: 1 }}>
        <Card className="bg-white p-4 flex-1">
          <View className="flex-row justify-between bg-white w-full p-2">
            <Text className="text-2xl">Log</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="text-lg text-blue-500">Add</Text>
            </TouchableOpacity>
          </View>

          <LogCard
            logs={logs.slice(
              currentPage * itemsPerPage,
              currentPage * itemsPerPage + itemsPerPage
            )}
          />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onChangePage={setCurrentPage}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View className="flex-1 bg-white pt-4">
              <View className="flex-row justify-between p-2">
                <Text className="text-2xl">Edit Log</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-lg text-blue-500">Close</Text>
                </TouchableOpacity>
              </View>
              <ScrollView className="flex-1 mx-3 mt-2">
                <EditLogCard logs={logs} onToggleSwitch={handleToggleSwitch} />
              </ScrollView>
            </View>
          </Modal>
        </Card>
      </View>
    </PanGestureHandler>
  );
};

export default Log;
