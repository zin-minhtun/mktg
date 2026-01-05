import {View, Text} from 'react-native';
import React from 'react';
import { useTheme } from "../../Contexts/ThemeContext";

export default function SettingsSection({title, children}) {
    const { theme, toggleTheme } = useTheme();
    
  return (
    <View className="mb-6">
        <Text style={{ color: theme.textColor }} className="text-base font-semibold mb-2">{title}</Text>
        <View style={{ borderColor: theme.borderColor, backgroundColor: theme.textFieldBG }} className="border border-borderColor rounded-lg">{
            React.Children.count(children) == 1 ?
                <View>{children}</View>
            : children.map((item, index)=>{
                return(
                    <View 
                        key={index}
                        style={{
                            borderTopWidth: index == 0 ? 0 : 0.5,
                            borderColor: theme.borderColor
                        }}
                    >
                        {item}
                    </View>
                );
            })
        }</View>
    </View>
  )
}


