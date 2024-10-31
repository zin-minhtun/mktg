import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';
import { useFonts, Raleway_500Medium, Raleway_400Regular,Raleway_600SemiBold} from '@expo-google-fonts/raleway';



const PainSection = () => {

  const [fontsLoaded] = useFonts({
    Raleway_500Medium,
    Raleway_400Regular,
    Raleway_600SemiBold,
  });

  const [painName, setPainName] = useState('');
  const [painType, setPainType] = useState(null);
  const [intensity, setIntensity] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    head: {},
    upperBody: {},
    lowerBody: {},
    arms: {},
    torso: {}
  });

  const painTypes = [
    { label: 'Sharp', value: 'sharp' },
    { label: 'Dull', value: 'dull' },
    { label: 'Throbbing', value: 'throbbing' },
    { label: 'Burning', value: 'burning' },
  ];

  const painLocations = [
    { value: 'head', label: 'Head' },
    { value: 'upperBody', label: 'Upper Body' },
    { value: 'lowerBody', label: 'Lower Body' },
    { value: 'arms', label: 'Arms' },
    { value: 'torso', label: 'Torso' },
  ];

  const subLocations = {
    head: [
      { label: 'Head', image: require('../../../assets/head.png') },
      { label: 'Neck', image: require('../../../assets/head.png') },
    ],
    upperBody: [
      { label: 'Shoulder', image: require('../../../assets/head.png') },
      { label: 'Upper Arm', image: require('../../../assets/head.png') },
      { label: 'Forearm', image: require('../../../assets/head.png') },
      { label: 'Elbow', image: require('../../../assets/head.png') },
    ],
    lowerBody: [
      { label: 'Thigh', image: require('../../../assets/head.png') },
      { label: 'Knee', image: require('../../../assets/head.png') },
      { label: 'Ankle', image: require('../../../assets/head.png') },
      { label: 'feet', image: require('../../../assets/head.png') },
    ],
    arms: [
      { label: 'Wrist', image: require('../../../assets/head.png') },
      { label: 'Hand', image: require('../../../assets/head.png') },
    ],
    torso: [
      { label: 'Chest', image: require('../../../assets/head.png') },
      { label: 'Back', image: require('../../../assets/head.png') },
      { label: 'Abdomen', image: require('../../../assets/head.png') },
    ],
  };
  const numbers = Array.from({ length: 6 }, (_, index) => index);


  const CheckboxGroup = ({ subLocationLabel, selectedOptions, setSelectedOptions }) => {
    const toggleOption = (option) => {
      const updatedOptions = {
        ...selectedOptions,
        [subLocationLabel]: {
          ...selectedOptions[subLocationLabel],
          [option]: !selectedOptions[subLocationLabel]?.[option]
        }
      };
      setSelectedOptions(updatedOptions);
    };
  
    return (
      <View className="ml-2">
        <Text className="text-blue-900 text-sm font-medium mb-2">{subLocationLabel}</Text>
        <View className="flex-col mt-2">
          {['Both', 'Right Side', 'Left Side'].map((option) => (
            <View key={option} className="flex-row items-center justify-between mb-2">
              <Text className="text-blue-900 text-xs mr-5">{option}</Text>
              <TouchableOpacity
                className="w-5 h-5 border border-blue-900 rounded mr-9"
                onPress={() => toggleOption(option.toLowerCase().replace(' ', ''))}
              >
                <View
                  className={`flex-1 rounded ${selectedOptions[subLocationLabel]?.[option.toLowerCase().replace(' ', '')] ? 'bg-blue-900' : ''}`}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };


  const SubLocation = ({ label, image, selectedOptions, setSelectedOptions, index }) => (
    <View
      className='mb-2 w-auto mr-5 ml-2'
      style={{ borderRightWidth: index % 2 === 0 ? 1 : 0, borderColor: '#d3d3d3' }}
    >
      <Image source={image} className="w-12 h-12 mb-2" />
      <CheckboxGroup subLocationLabel={label} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </View>
  );


  const LocationSection = ({ label, subLocations, isOpen, toggleOpen, selectedOptions, setSelectedOptions }) => (
    <View className="mb-2 border-b border-gray-300 bg-white ">
      <TouchableOpacity
        className="flex-row items-center justify-between p-2 bg-white"
        onPress={toggleOpen}
      >
        <Text className="text-blue-900 text-lg">{label}</Text>
        <Text className="text-blue-900 text-lg">{isOpen ? '▼' : '>'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View className="flex-wrap flex-row mt-4">
          {subLocations.map((subLocation, index) => (
            <SubLocation
              key={subLocation.label}
              label={subLocation.label}
              image={subLocation.image}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              index={index}
            />
          ))}
        </View>
      )}
    </View>
  );

  const toggleLocation = (location) => {
    setSelectedLocation(selectedLocation === location ? null : location);
  };

  return (
    <ScrollView className="flex-1 p-4">

      <View>
        <Text  style={{ fontFamily: 'Raleway_600SemiBold' }} className="text-base font-bold mb-2 text-blue-900 ">Pain Name</Text>
        <TextInput
          className="border border-blue-500 rounded px-3 py-2 mb-4"
          placeholder="Enter Pain name"
          value={painName}
          onChangeText={setPainName}
        />
      </View>

      <View>
        <Text style={{ fontFamily: 'Raleway_600SemiBold' }} className="text-base font-bold mb-2 text-blue-900 ">Select Pain Location</Text>
        <View className="border border-gray-300 rounded p-2">
          {painLocations.map((location) => (
            <LocationSection
              key={location.value}
              label={location.label}
              subLocations={subLocations[location.value]}
              isOpen={selectedLocation === location.value}
              toggleOpen={() => toggleLocation(location.value)}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          ))}
        </View>
      </View>

      <View>
        <Text style={{ fontFamily: 'Raleway_600SemiBold' }} className="text-base font-bold mb-2 text-blue-900 ">Select Pain Type</Text>
        <RNPickerSelect
          onValueChange={(value) => setPainType(value)}
          value={painType}
          items={painTypes}
          style={{
            inputIOS: {
              borderColor: 'blue',
              borderWidth: 1,
              borderRadius: 4,
              padding: 10,
              color: 'black',
              paddingRight: 30,
            },
            inputAndroid: {
              borderColor: 'blue',
              borderWidth: 1,
              borderRadius: 4,
              padding: 10,
              color: 'black',
              paddingRight: 30,
            },
          }}
          placeholder={{ label: 'Select', value: null }}
        />
      </View>

      <View>

        <Text style={{ fontFamily: 'Raleway_600SemiBold' }} className="text-base font-bold mb-2 text-blue-900 ">Select Intensity (Level 0 - 5)</Text>

        <View className="flex flex-row justify-between">
          {numbers.map((number) => (
              <Text key={number}>{number}</Text>
           ))}
        </View>
        <Slider
          style="w-full mt-2"
          minimumValue={0}
          maximumValue={5}
          step={1}
          value={intensity}
          onValueChange={setIntensity}
          minimumTrackTintColor="#00BCD4"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#00BCD4"
         
          thumbStyle={{ width: 20, height: 20 }} 
        />
      </View>

      <View>

     
        <TouchableOpacity className="w-full p-2 bg-cyan-500 rounded-3xl" onPress={() => console.log('Next pressed')}>
          <Text className="text-white text-center text-base rounded-xl">Next</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};


export default PainSection;
