import { View, TouchableOpacity, Text, Image } from 'react-native';
import React from 'react';

const MultipleChoiceTwo = ({ question, options, selectedOption, showFeedback, correctIndex, onSelect, image, quizImage }) => {
  return (
    <View className="w-full items-center">
      {/* Question Row */}
      <View className="flex-row items-center w-full px-4 mt-4">
        <Image source={image} 
                      className="w-[100px] h-[100px] items-start mt-2" 
                      resizeMode="contain" />
        <Text className="text-small flex-1 font-OsSemibold text-violet-950">
          {question}
        </Text>
      </View>

      {/* Quiz Image Container */}
      <View className="w-full aspect-square max-h-60 my-4 border-2 border-slate-300 bg-gray-50 rounded-xl items-center justify-center">
        <Image 
          source={quizImage} 
          className="w-full h-full items-center mt-5" 
          resizeMode="contain" 
        />
      </View>

      {/* Options Row */}
      <View className="flex-row flex-wrap justify-center gap-4 w-full px-2 mb-4 mt-4">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(index)}
            className={`w-20 h-20 rounded-xl border-2 items-center justify-center ${
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
            <Text className="font-OsSemibold text-violet-950 text-2xl">
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};

export default MultipleChoiceTwo;