import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function ChartFilter() {
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const openChartModal = () => {
    setChartModalVisible(true);
    setCalendarModalVisible(false);
  };

  const openCalendarModal = () => {
    setCalendarModalVisible(true);
    setChartModalVisible(false);
  };

  const RadioButton = ({ selected }) => (
    <View className="h-6 w-6 rounded-full border-2 items-center justify-center m-4">
      {selected ? (
        <View className="h-3 w-3 rounded-full border-3 bg-black" />
      ) : null}
    </View>
  );
  return (
    <View className="flex-row justify-between m-6">
      <TouchableOpacity onPress={openChartModal}>
        <View className="flex-row items-center gap-2">
          <AntDesign name="linechart" size={30} color="black" />
          {/* TODO Ensure its the correct label thats being filtered */}
          <Text className="text-[16px]">Pain</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={openCalendarModal}>
        <View className="flex-row items-center gap-2">
          <AntDesign name="calendar" size={30} color="black" />
          {/* TODO Ensure its the correct label thats being filtered */}
          <Text className="text-[16px]">6 Months</Text>
        </View>
      </TouchableOpacity>

      {/* Charts Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chartModalVisible}
        onRequestClose={() => {
          setChartModalVisible(!chartModalVisible);
        }}
      >
        <View className="  bg-white border my-36 mx-10 rounded-xl flex-1">
          <Text className=" text-2xl text-center p-3 ">
            Select chart to display
          </Text>

          {/* Radio buttons */}
          <TouchableOpacity
            onPress={() => setSelectedOption("mood")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "mood"} />
            <Text>Mood</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("pain")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "pain"} />
            <Text>Pain</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("weight")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "weight"} />
            <Text>Weight</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("sleep")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "sleep"} />
            <Text>Sleep</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("fluid")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "fluid"} />
            <Text>Fluid</Text>
          </TouchableOpacity>
          {/* End of radio buttons */}
          <TouchableOpacity
            className=" items-center justify-center "
            onPress={() => setChartModalVisible(!chartModalVisible)}
          >
            <Text className="text-[16px] text-blue-500 text-center mt-4">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarModalVisible}
        onRequestClose={() => {
          setCalendarModalVisible(!calendarModalVisible);
        }}
      >
        <View className="  bg-white border my-20 mx-10 rounded-xl flex-1">
          <Text className=" text-2xl text-center p-3 ">
            Select chart to display
          </Text>

          {/* Radio buttons */}
          <TouchableOpacity
            onPress={() => setSelectedOption("mood")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "1 Week"} />
            <Text>1 Week</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("pain")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "1 Month"} />
            <Text>1 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("weight")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "2 Month"} />
            <Text>2 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("sleep")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "3 Month"} />
            <Text>3 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("fluid")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "4 Month"} />
            <Text>4 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("fluid")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "5 Month"} />
            <Text>5 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("fluid")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "6 Month"} />
            <Text>6 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("fluid")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton selected={selectedOption === "1 Year"} />
            <Text>1 Year</Text>
          </TouchableOpacity>

          {/* End of radio buttons */}
          <TouchableOpacity
            className=" items-center justify-center "
            onPress={() => setCalendarModalVisible(!calendarModalVisible)}
          >
            <Text className="text-[16px] text-blue-500 text-center mt-4">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
