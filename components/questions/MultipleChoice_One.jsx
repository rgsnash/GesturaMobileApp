//THIS IS FOR IMAGES MULTIPLE CHOICE

import { View, TouchableOpacity, Text, Image } from 'react-native';
import React from 'react';
import images from '../../constants/images';

const MultipleChoice_One = ({ question, options, selectedOption, showFeedback, correctIndex, onSelect, image }) => {
  return (
    <View className="w-full">
      <View className="flex-row">
        <Image source={image} 
              className="w-[100px] h-[80px] items-start mt-2" 
              resizeMode="contain" />
      <Text className="text-small text-start max-w-[60%] mt-8 font-OsSemibold text-violet-950">
        {question}
      </Text>
      </View>
      <View className="flex-row flex-wrap justify-between">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(index)}
            className={`w-[48%] h-[40%] p-6 mb-4 rounded-xl border-2 items-center justify-center ${
              showFeedback
              ? correctIndex.includes(index)
              ? 'border-green-500 bg-green-100'
              : index === selectedOption
              ? 'border-red-500 bg-red-100'
              : 'border-gray-300 bg-white'
            : selectedOption === index
            ? 'border-violet-950 bg-violet-200'
            : 'border-gray-300 bg-white'
            }`}
          >
            <Image source={option} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MultipleChoice_One;