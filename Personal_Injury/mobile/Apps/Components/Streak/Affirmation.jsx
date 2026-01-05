import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import BaseText from "../../designSystem/components/BaseText";
import { Card } from "react-native-paper";

const firstAffirmations = [
    "Welcome! Great start to a healthier you!",
    "Fantastic! Keep up the progress!",
    "Good job! Consistency is key!",
    "Amazing! Every step counts!",
    "Halfway there! Keep pushing!",
    "You're on a roll! Great results!",
    "Lucky 7! Healthy habits stick!",
    "Impressive! Stay motivated!",
    "Almost there! Great effort!",
    "Congrats on 10 logins! Keep going!",
];

const randomAffirmations = [
    "Every step forward counts!",
    "Believe in yourself!",
    "Your progress is amazing!",
    "Stay focused and keep moving!",
    "You got this!",
    "One step at a time!",
    "Keep pushing forward!",
    "Your effort is paying off!",
    "Stay committed to your goals!",
    "You're doing fantastic!",
    "Great job! Keep it up!",
    "Stay strong and motivated!",
    "You're making progress!",
    "Consistency is key!",
    "Keep your momentum going!",
    "You're achieving greatness!",
    "Stay positive and persistent!",
    "You're on the right track!",
    "Keep striving for success!",
    "Your hard work shows!",
    "Stay dedicated!",
    "You're unstoppable!",
    "Keep up the great work!",
    "You're making a difference!",
    "Stay inspired!",
    "Keep moving forward!",
    "Your dedication is inspiring!",
    "Believe in your journey!",
    "Stay focused on your goals!",
    "You're doing a great job!",
    "Keep up the amazing work!",
    "You're making it happen!",
    "Stay motivated and strong!",
    "You're on your way!",
    "Keep pushing towards your goals!",
    "Your effort is inspiring!",
    "Stay determined!",
    "You're doing wonderfully!",
    "Keep up the fantastic work!",
    "You're achieving your goals!",
    "Stay positive!",
    "You're making progress daily!",
    "Keep up the momentum!",
    "Your dedication is admirable!",
    "Stay focused and strong!",
    "You're doing excellent!",
    "Keep striving forward!",
    "Your hard work is evident!",
    "Stay motivated!",
    "You're on a great path!",
    "Keep reaching for your goals!",
    "Your progress is inspiring!",
    "Stay committed and strong!",
    "You're doing incredible!",
    "Keep up the good work!",
    "Your effort is amazing!",
    "Stay positive and focused!",
    "You're making strides!",
    "Keep pushing ahead!",
    "Your dedication is showing!",
    "Stay strong and motivated!",
    "You're on the right path!",
    "Keep going strong!",
    "Your progress is fantastic!",
    "Stay inspired and focused!",
    "You're doing a wonderful job!",
    "Keep up the excellent work!",
    "Your hard work is paying off!",
    "Stay committed to your journey!",
    "You're making great progress!",
    "Keep moving towards your goals!",
    "Your effort is fantastic!",
    "Stay positive and strong!",
    "You're doing a terrific job!",
    "Keep striving for greatness!",
    "Your dedication is impressive!",
    "Stay focused on your journey!",
    "You're on the path to success!",
    "Keep pushing towards greatness!",
    "Your progress is amazing!",
    "Stay motivated and inspired!",
    "You're doing incredible work!",
    "Keep up the determination!",
    "Your effort is admirable!",
    "You're making great strides!",
    "Keep reaching for success!",
    "Your dedication is wonderful!",
    "Stay committed and focused!",
    "You're doing a great job!",
    "Keep pushing forward!",
    "Your progress is inspiring!",
    "Stay motivated and strong!",
    "You're on your way to success!",
    "Keep up the fantastic effort!",
    "Your hard work is impressive!",
    "Stay positive and committed!",
    "You're making incredible progress!",
    "Keep striving for your goals!"
];

export default function Affirmation({ streak }) {
    const [affirmation, setAffirmation] = useState("");

    useEffect(() => {
        if (streak < 10) {
            setAffirmation(firstAffirmations[streak]);
        } else {
            const randomIndex = Math.floor(Math.random() * randomAffirmations.length);
            setAffirmation(randomAffirmations[randomIndex]);
        }
    }, [])


    return (
        <Card className="my-4 bg-white p-4">
            <View className="flex-row items-center">
                <Image
                    source={require("../../../assets/images/Streak.png")}
                    className="w-[60px] h-[60px] mr-4"
                    resizeMode="contain"
                />
                <View className="flex-1">
                    <BaseText style={{ fontFamily: 'InknutAntiqua' }}>
                        {affirmation}
                    </BaseText>
                </View>
            </View>
        </Card>
    );
};

