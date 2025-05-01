import { View, TouchableOpacity, Text, Image } from 'react-native';
import images from '../../constants/images';

const Image_Select = ({ 
  question, 
  options, 
  selectedOption, 
  showFeedback, 
  onSelect, 
  image 
}) => {
  return (
    <View className="w-full">
      <View className="flex-row items-start mb-4">
       
          <Image 
            source={images.questiongirl}
            className="w-[100px] h-[100px] ml-2"
            resizeMode="contain"
          />
        
        <Text className="text-lg mt-8 m-2 align-middle flex-1 font-OsSemibold text-violet-950">
          {question}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option.id)}
            className={`w-[48%] mb-4 p-2 rounded-xl border-2 ${
              showFeedback
                ? option.correct
                  ? 'border-green-500 bg-green-100'
                  : option.id === selectedOption
                  ? 'border-red-500 bg-red-100'
                  : 'border-gray-300 bg-white'
                : option.id === selectedOption
                ? 'border-violet-950 bg-violet-200'
                : 'border-gray-300 bg-white'
            }`}
          >
           <Image
              source={{ uri: option.image_src }}
              className="w-full h-32 rounded-md"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Image_Select;