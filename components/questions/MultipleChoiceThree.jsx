import { View, TouchableOpacity, Text, Image } from 'react-native';
import React, { useState, useRef } from 'react';
// import Video from 'react-native-video';

const MultipleChoiceThree = ({ question, options, correctAnswer, videoSource, showFeedback, onSelect, image }) => {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([...options]);
  const videoRef = useRef(null);

  const handleLetterSelect = (letter) => {
    if (selectedLetters.length < 2) {
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);
      setAvailableLetters(availableLetters.filter(l => l !== letter));
      onSelect(newSelected);
    }
  };

  const handleLetterDeselect = (index) => {
    const deselected = selectedLetters[index];
    const newSelected = selectedLetters.filter((_, i) => i !== index);
    setSelectedLetters(newSelected);
    setAvailableLetters([...availableLetters, deselected]);
    onSelect(newSelected);
  };

  return (
    <View className="w-full items-center p-4">
      <View className="flex-row items-center w-full px-4">
        <Image source={image} 
                      className="w-[100px] h-[100px] items-start mt-2" 
                      resizeMode="contain" />
        <Text className="text-lg flex-1 font-OsSemibold text-violet-950">
          {question}
        </Text>
      </View>
      {/* Video Player */}
      <View className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-2">
        {/* <Video
          ref={videoRef}
          source={videoSource}
          style={{ width: '100%', height: '100%' }}
          controls={true}
          repeat={true}
          resizeMode="contain"
        /> */}
        <Text>Video</Text>
      </View>

      <Text className="p-5 font-Osmedium text-violet-950 text-lg text-center">Select the letters in the {"\n"}correct order as shown in the video</Text>

      {/* Answer Slots */}
      <View className="flex-row gap-4 mb-8">
        {[0, 1].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleLetterDeselect(index)}
            className={`w-16 h-16 border-2 rounded-lg items-center justify-center ${
              showFeedback
                ? selectedLetters[index] === correctAnswer?.[index]
                  ? 'border-green-500 bg-green-100'
                  : 'border-red-500 bg-red-100'
                : 'border-gray-300 bg-white'
            }`}
          >
            <Text className="text-2xl font-bold text-violet-950">
              {selectedLetters[index] || ' '}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Letter Bank */}
      <View className="flex-row flex-wrap justify-center gap-3">
        {availableLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleLetterSelect(letter)}
            className="w-12 h-12 border-2 border-gray-300 rounded-lg items-center justify-center bg-white"
            disabled={showFeedback}
          >
            <Text className="text-xl font-bold text-violet-950">{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MultipleChoiceThree;