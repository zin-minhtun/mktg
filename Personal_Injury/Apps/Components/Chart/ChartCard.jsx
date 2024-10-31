import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

export default function ChartCard() {
  const navigation = useNavigation();

  // Dummy Data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2, 4, 3, 8, 10, 4],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Pain Level'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
  };

  // TODO: Map all charts
  return (
    <Card className="w-100 h-[250px] m-4 ">
      {/* TODO: Navigate to the specific Detailed Chart */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChartsNavigator', { screen: 'Pain Chart' })
        }
      >
        <View className="flex justify-between items-center mt-5 mx-5">
          <LineChart
            data={data}
            width={250}
            height={175}
            chartConfig={chartConfig}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
}
