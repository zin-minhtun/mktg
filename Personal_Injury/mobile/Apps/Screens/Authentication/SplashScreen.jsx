import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = ({navigation}) => {

    useEffect(() => {
        console.log('SplashScreen mounted');
        const timer = setTimeout(() => {
            console.log('Navigating to GetStarted');
            navigation.replace('GetStarted'); // Replace 'Home' with your target screen
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, [navigation]);

    return (
    <View className="flex-1 items-center justify-center bg-white">
        {/* style={styles.container} */}
        <Image

        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/6c02a697e2359c18ba2f3d4dc3eabc57a0d41b01",
        // uri: assets/images/IHP_Logo.png,
        }}
        // style={styles.logo}
        // source={require("../../../assets/images/IHP_Logo.png")}
        className="w-[250px] h-[250px] object-cover rounded-full mt-10 flex-1"
     
        // className="w-32 h-8"
        resizeMode="contain"
        accessibilityLabel="Interact Health Pro Logo"
      />
    </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#ffffff',
//     },
//     text: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#000000',
//     },
// });

export default SplashScreen;