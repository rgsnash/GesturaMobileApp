import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import icons  from "@/constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`flex justify-center items-center space-y-2 ${otherStyles}`}>
      <Text className="text-gray-100 font-Osmedium text-lg text-left w-full ml-12">{title}</Text>

      <View className="w-[350px] mt-2 justify-center mb-5 h-12 px-4 bg-gray shadow-slate-400 rounded-2xl border-2 border-white focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-purple-950 font-OsSemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eyehide : icons.eyeopen }
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;