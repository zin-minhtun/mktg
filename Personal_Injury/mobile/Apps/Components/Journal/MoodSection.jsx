import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const MoodSelection = () => {

    const moods = [
        { name: 'Happy', image: require('../../../assets/happy.png') },
        { name: 'Energised', image: require('../../../assets/happy.png') },
        { name: 'Confident', image: require('../../../assets/happy.png') },
        { name: 'Calm', image: require('../../../assets/happy.png') },
        { name: 'Refreshed', image: require('../../../assets/happy.png') },
        { name: 'Angry', image: require('../../../assets/happy.png') },
        { name: 'Anxious', image: require('../../../assets/happy.png') },
        { name: 'Confused', image: require('../../../assets/happy.png') },
        { name: 'Depressed', image: require('../../../assets/happy.png') },
        { name: 'Fatigued', image: require('../../../assets/happy.png') },
        { name: 'Gloomy', image: require('../../../assets/happy.png') },
        { name: 'Mean', image: require('../../../assets/happy.png') },
        { name: 'Irritable', image: require('../../../assets/happy.png') },
        { name: 'Restless', image: require('../../../assets/happy.png') },
        { name: 'Hungry', image: require('../../../assets/happy.png') },
        { name: 'Impatient', image: require('../../../assets/happy.png') },
        { name: 'Sad', image: require('../../../assets/happy.png') },
        { name: 'Scared', image: require('../../../assets/happy.png') },
        { name: 'Sensitive', image: require('../../../assets/happy.png') },
        { name: 'Sick', image: require('../../../assets/happy.png') },
        { name: 'Sleepy', image: require('../../../assets/happy.png') },
        { name: 'Spacey', image: require('../../../assets/happy.png') },
        { name: 'Stressed', image: require('../../../assets/happy.png') },
        { name: 'Unbalanced', image: require('../../../assets/happy.png') },
    ];

    const [selectedMoods, setSelectedMoods] = useState([]);

    const handleMoodSelect = (moodName) => {
        setSelectedMoods((prevSelectedMoods) => {
            if (prevSelectedMoods.includes(moodName)) {
                return prevSelectedMoods.filter((mood) => mood !== moodName);
            } else {
                return [...prevSelectedMoods, moodName];
            }
        });
    };

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-2xl font-bold text-blue-900 mb-3 m-9">
                Tell us how you're feeling today
            </Text>
            <View className="flex-row flex-wrap justify-center">
                {moods.map((mood, index) => (
                    <TouchableOpacity
                        key={index}
                        className="w-1/3 p-4"
                        onPress={() => handleMoodSelect(mood.name)}
                    >
                        <View
                            className={`items-center bg-white border
                                 ${selectedMoods.includes(mood.name) ? 'border-blue-500' : 'border-gray-300'
                                } rounded-lg p-3`}>
                            <Image
                                source={mood.image}
                                className="w-10 h-10 rounded-full mb-2"
                                style={{ borderWidth: 1, borderColor: '#ccc' }}
                            />
                            <Text
                                className={`text-sm ${selectedMoods.includes(mood.name) ? 'text-blue-500' : 'text-gray-700'
                                    }`}
                            >
                                {mood.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default MoodSelection;
