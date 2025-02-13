import { TouchableOpacity, Text, Image } from 'react-native';
import React from 'react';
import icons from '@/constants/icons'

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  variant = 'default',
  isLoading = false,
}) => {

  const buttonVariants = {
    default: "bg-gray-80 text-violet-950 border-slate-300 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",
    primary: "bg-violet-950 text-primary-foreground hover:bg-sky400/90 border-violet-900 border border-b-4 active:border-b-0",
    secondary: "bg-gray-500 hover:bg-gray-700 text-white",
    danger: "bg-red-500 hover:bg-red-700 text-white",
    outline: "bg-transparent border-2 border-blue-500 hover:bg-blue-500 text-blue-500",
    ghost: "bg-transparent text-blue-500 hover:bg-blue-100",
    section: "bg-violet-900 hover:bg-violet-700 text-white border-violet-950 border-2 border border-b-4",
    
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-3xl min-h-[50px] min-w-[300px] justify-center items-center ${buttonVariants[variant]} ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
    >
      <Text className={`font-Osmedium text-center text-3xl ${textStyles}`}>
        {isLoading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
