import { Ionicons } from '@expo/vector-icons';
import {TouchableOpacity, View, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useTheme } from "../../Contexts/ThemeContext";

export default function SettingsItem(props) {
    const navigation = useNavigation(); // Access navigation directly
    const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity className="py-4 px-2 flex-row justify-between items-center" 
        onPress={() => {
            if (props.navigator) {
              navigation.navigate(props.navigator, {
                screen: props.screen,
                params: props.params,
              });
            } else if (props.screen) {
              navigation.navigate(props.screen, props.params);
            }
        }}>
          <View className="flex-row items-center">
            <Ionicons name={props.iconName} size={24} color={theme.darkGrey} />
            <Text style={{ color: theme.textColor }} className="text-base ml-3">{props.itemText}</Text>
          </View>
          <View className="flex-row">
          <Text style={{ color: theme.darkGrey }} className="text-base mr-1">{props.status}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.darkGrey} />
          </View>
        </TouchableOpacity>
  )
}

