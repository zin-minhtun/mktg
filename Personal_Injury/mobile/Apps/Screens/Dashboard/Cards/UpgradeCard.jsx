import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const UpgradeCard = ({ colors, isDarkMode }) => {
  // Sabit renkler - Dark mode'da da aynı light mode renklerini kullan
  const fixedColors = {
    background: '#F4F4F4', // Her zaman light mode rengi
    highlight: '#00192F', // Her zaman light mode rengi
    textPrimary: '#00192F', // Her zaman light mode rengi
    textSecondary: '#6E7682', // Her zaman light mode rengi
    primaryBlue: '#00B8DF', // Zaten her iki modda da aynı
  };

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <View style={{ 
        backgroundColor: isDarkMode ? '#00203B' : fixedColors.background,
        borderRadius: 12,
        overflow: 'hidden',
        padding: 16,
        // Sadece dark mode'da border ekle
        borderWidth: isDarkMode ? 1 : 0
      }}>
        <Text style={{ 
          fontSize: 16,
          fontWeight: '600',
          color: isDarkMode ? '#E0E0E0' : fixedColors.textPrimary,
          textAlign: 'center',
          marginBottom: 12
        }}>
          Upgrade your Plan
        </Text>
        
        <View style={{ 
          backgroundColor: '#003361',
          borderRadius: 12,
          padding: 56
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: isDarkMode ? "#E0E0E0" :'#FFFFFF', fontWeight: 'bold' }}>Premium plan</Text>
              <Text style={{ color: isDarkMode ? "#E0E0E0" :'#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
                $70 <Text style={{ fontSize: 14, fontWeight: 'normal' }}>/month</Text>
              </Text>
            </View>
            
            <View>
              <Text style={{ color: isDarkMode ? "#E0E0E0" :'#FFFFFF', textAlign: 'right', fontWeight:'bold', marginBottom: 8 }}>Recommended</Text>
              <TouchableOpacity
                style={{
                  width: 40, 
                  height: 40, 
                  borderRadius: 20,
                  backgroundColor: fixedColors.primaryBlue,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: isDarkMode ? "#00192F" :'#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UpgradeCard;