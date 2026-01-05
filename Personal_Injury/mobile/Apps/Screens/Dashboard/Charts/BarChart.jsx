import React from 'react';
import { View, Text } from 'react-native';

const BarChart = ({ currentData, maxValue, statMetric, timeframe, colors, isDarkMode }) => {
  if (!currentData || !currentData.data || currentData.data.length === 0) {
    return (
      <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: isDarkMode ? 'E0E0E0' : colors.textSecondary }}>No data available</Text>
      </View>
    );
  }
  
  return (
    <View style={{ marginTop: 8 }}>
      {/* Peak indicator */}
      {currentData.peak && currentData.peak.value > 0 && (
        <Text 
          style={{ 
            fontSize: 14, 
            textAlign: 'center',
            color: isDarkMode ? '#E0E0E0' : colors.textSecondary,
            marginBottom: 8,
            paddingHorizontal: 8
          }}
        >
          Peak: {currentData.peak.day || currentData.peak.week || currentData.peak.month}
        </Text>
      )}
      
      {/* Difference indicator */}
      {currentData.difference && (
        <Text 
          style={{ 
            fontSize: 14, 
            color: isDarkMode ? '#E0E0E0' : colors.textSecondary,
            marginBottom: 8,
            paddingHorizontal: 8
          }}
        >
          {currentData.difference}
        </Text>
      )}
      
      {/* Chart container */}
      <View style={{ marginTop: 8 }}>
        {/* Y-axis values */}
        <View style={{ 
          position: 'absolute', 
          left: 0, 
          height: '100%', 
          justifyContent: 'space-between',
          paddingVertical: 4
        }}>
          <Text style={{ color: isDarkMode ? '#E0E0E0' : '#003361', fontSize: 12 }}>100</Text>
          <Text style={{ color: isDarkMode ? '#E0E0E0' : '#003361', fontSize: 12 }}>90</Text>
          <Text style={{ color: isDarkMode ? '#E0E0E0' : '#003361', fontSize: 12 }}>80</Text>
          <Text style={{ color: isDarkMode ? '#E0E0E0' : '#003361', fontSize: 12 }}>70</Text>
          <Text style={{ color: isDarkMode ? '#E0E0E0' : '#003361', fontSize: 12 }}>0</Text>
        </View>
        
        {/* Horizontal grid lines */}
        <View style={{ marginLeft: 24 }}>
          <View style={{ width: '100%', height: 1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E0E0E0' }} />
          <View style={{ width: '100%', height: 1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E0E0E0', marginTop: 20 }} />
          <View style={{ width: '100%', height: 1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E0E0E0', marginTop: 20 }} />
          <View style={{ width: '100%', height: 1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E0E0E0', marginTop: 20 }} />
          <View style={{ width: '100%', height: 1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E0E0E0', marginTop: 20 }} />
        </View>
        
        {/* Bars */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginLeft: 24, 
          marginTop: 8,
          height: 120,
          alignItems: 'flex-end'
        }}>
          {currentData.data.map((item, index) => {
            const barHeight = item.value > 0 
              ? (item.value / Math.max(maxValue, 100)) * 100 
              : 1;
            
            // Highlight Friday or the current month (based on design screenshot)
            const isHighlighted = (timeframe === 'daily' && item.day === 'FRI') || 
                                 (timeframe === 'monthly' && index === currentData.data.length - 1);
            
            // Bar color based on dark mode and highlighted status
            const barColor = isDarkMode 
              ? (isHighlighted ? '#FFFFFF' : '#00B8DF') // In dark mode: White for highlighted, blue for others
              : (isHighlighted ? colors.highlight : colors.primaryBlue); // In light mode: as before
            
            return (
              <View key={index} style={{ alignItems: 'center' }}>
                <View 
                  style={{ 
                    height: barHeight, 
                    width: 32,
                    backgroundColor: barColor,
                    borderTopLeftRadius: 4, 
                    borderTopRightRadius: 4,
                  }} 
                />
                <Text 
                  style={{ 
                    fontSize: statMetric === 'fluidIntake' && timeframe === 'monthly' ? 9 : 11,
                    color: isDarkMode ? '#E0E0E0' : '#003361',
                    marginTop: 4,
                    textAlign: 'center',
                    width: 36
                  }}
                  numberOfLines={2}
                >
                  {item.day || item.week || item.month}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default BarChart;