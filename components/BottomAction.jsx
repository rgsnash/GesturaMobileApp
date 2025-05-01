import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';


const BottomActionArea = ({
  step,
  quizSteps,
  showFeedback,
  isCorrect,
  selectedOption,
  handleSubmit,
  handleContinue
}) => {
  if (step >= quizSteps.length) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 pt-10 px-3 pb-6">
      {showFeedback ? (
        <View className="absolute bottom-0 left-0 right-0 bg-[#0E0732] pt-2 px-4 border-t border-gray-200">
          <Text className="text-gray-100 text-4xl font-Osbold mt-2 mb-1">
            {isCorrect ? "Correct!" : "UH-OH!"}
          </Text>
          <Text className="text-xl font-Osbold text-gray-300 mb-5">
            {isCorrect ? "You did great! Let's learn more!" : "Let's try again later!"}
          </Text>
          <View className="pb-4 self-end">
            <CustomButton
              title="Continue"
              handlePress={handleContinue}
              containerStyles="bg-purple-950 min-w-[40%] items-center"
              textStyles="text-gray-50 text-3xl font-Osbold"
            />
          </View>
        </View>
      ) : (
        selectedOption !== null && (
          <View className="mb-4 items-center">
            <CustomButton
              title="SUBMIT"
              handlePress={handleSubmit}
              containerStyles="px-2 bg-[#2F265A]"
              textStyles="text-large font-Osbold text-gray-50"
            />
          </View>
        )
      )}
    </View>
  );
};

export default BottomActionArea;
