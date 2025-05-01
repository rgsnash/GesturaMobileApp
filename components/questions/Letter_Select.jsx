import { View, TouchableOpacity, Text, Image } from 'react-native';
import images from '../../constants/images';

const Letter_Select = ({ 
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
        
        <Text className="text-xl mt-8 m-2 align-middle flex-1 font-OsSemibold text-violet-950">
          {question}
        </Text>
      </View>
      <View className="w-[50%] h-[40%] self-center items-center p-2 bg-gray-80 rounded-2xl border-slate-300 border-2 border-b-4">
      {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-40 rounded-md"
            resizeMode="contain"
          />
        )}
      </View>

      <View className="flex-row flex-wrap justify-around mt-10">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option.id)}
            className={`w-[15%] h-[80%] text-center mb-4 p-2 rounded-xl border-2 ${
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
            <Text className="text-center align-middle text-2xl font-Osbold text-purple-950">{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Letter_Select;