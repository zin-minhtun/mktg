import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BarChart from '../Charts/BarChart';

const StatsCard = ({
  colors,
  statMetric,
  timeframe,
  navigateToPreviousMetric,
  navigateToNextMetric,
  setTimeframe,
  isLoading,
  metricOptions,
  getCurrentData,
  getMaxValue,
  isDarkMode
}) => {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 2, zIndex: 0 }}>
      <View style={{ 
        backgroundColor: isDarkMode ? '#00192F' : colors.background,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        padding: 16,
        paddingBottom: 24
      }}>
        <Text style={{ 
          fontSize: 18,
          fontWeight: 'bold',
          color: '#E0E0E0',
          marginBottom: 16
        }}>
          My Stats
        </Text>
        
        {/* Stat Navigation - Aligned with design */}
        <View style={{ 
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <TouchableOpacity onPress={navigateToPreviousMetric} style={[styles.navButton, { marginRight: 30 }]}>
            <Text style={{ color: colors.primaryBlue, fontSize: 24, fontWeight: '300' }}>{'<'}</Text>
          </TouchableOpacity>
          
          <Text style={{ 
            fontSize: 16,
            fontWeight: '600',
            color: '#003361'
          }}>
            {metricOptions.find(m => m.id === statMetric)?.title || 'My Stats'}
          </Text>
          
          <TouchableOpacity onPress={navigateToNextMetric} style={[styles.navButton, { marginLeft: 30 }]}>
            <Text style={{ color: colors.primaryBlue, fontSize: 24, fontWeight: '300' }}>{'>'}</Text>
          </TouchableOpacity>
        </View>
          
        {/* Time Period Buttons */}
        <View style={{ 
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <TouchableOpacity 
            onPress={() => setTimeframe('daily')}
            style={{
              backgroundColor: timeframe === 'daily' ? 
                (isDarkMode ? 'rgba(0, 184, 223, 0.2)' : '#00B8DF') : 
                (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F5F5F5'),
              borderWidth: 1,
              borderColor: timeframe === 'daily' ? colors.primaryBlue : 
                (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E0E0E0'),
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginRight: 8
            }}
          >
            <Text style={{ 
              color: '#E0E0E0'
            }}>
              Daily
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setTimeframe('weekly')}
            style={{
              backgroundColor: timeframe === 'weekly' ? 
                (isDarkMode ? 'rgba(0, 184, 223, 0.2)' : '#00B8DF') : 
                (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F5F5F5'),
              borderWidth: 1,
              borderColor: timeframe === 'weekly' ? colors.primaryBlue : 
                (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E0E0E0'),
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginRight: 8
            }}
          >
            <Text style={{ 
              color:'#E0E0E0'
            }}>
              Weekly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setTimeframe('monthly')}
            style={{
              backgroundColor: timeframe === 'monthly' ? 
                (isDarkMode ? 'rgba(0, 184, 223, 0.2)' : '#00B8DF') : 
                (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F5F5F5'),
              borderWidth: 1,
              borderColor: timeframe === 'monthly' ? colors.primaryBlue : 
                (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E0E0E0'),
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16
            }}
          >
            <Text style={{ 
              color:'#E0E0E0'
            }}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
          
        {/* Bar Chart */}
        {isLoading ? (
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>Loading data...</Text>
          </View>
        ) : (
          <BarChart 
            currentData={getCurrentData()} 
            maxValue={getMaxValue()}
            statMetric={statMetric}
            timeframe={timeframe}
            colors={colors}
            isDarkMode={isDarkMode}
          />
        )}
      </View>
    </View>
  );
};
const styles = {
navButton: {
  padding: 8,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center'
},
};

export default StatsCard;