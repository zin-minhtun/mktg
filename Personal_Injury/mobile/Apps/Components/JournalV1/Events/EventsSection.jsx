import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../Contexts/ThemeContext';

const EventsSection = ({ dayEvents, onEditEvent, selectedDate }) => {
    const { theme } = useTheme();

    if (!dayEvents || dayEvents.length === 0) {
        return (
            <View className="items-center mt-10">
                <Ionicons name="calendar-outline" size={100} color={theme.darkGrey} />
                <View className="items-center mt-6">
                    <Text className="text-[20px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
                        No events for today
                    </Text>
                    <Text className="text-[16px] pt-1.5 font-raleway" style={{ color: theme.darkGrey }}>
                        Go to Calendar tab to add events
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            className="px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {dayEvents.map(ev => (
                <View key={ev._id} style={{
                    backgroundColor: theme.textFieldBG,
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 2,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: theme.borderColor
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E74C3C', marginRight: 12 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Raleway-SemiBold', fontSize: 16, color: theme.textColor }}>
                                    {ev.event_name}
                                </Text>
                                <Text style={{ fontFamily: 'Raleway', fontSize: 14, color: theme.darkGrey, marginTop: 2 }}>
                                    {ev.start_time} - {ev.end_time}
                                </Text>
                                {ev.notes && (
                                    <Text style={{ fontFamily: 'Raleway', fontSize: 13, color: theme.darkGrey, marginTop: 4 }} numberOfLines={2}>
                                        {ev.notes}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => onEditEvent(ev)}
                            style={{ marginLeft: 12, padding: 8 }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="create-outline" size={20} color="#00B8DF" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default EventsSection;
