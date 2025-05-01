import { View, TouchableOpacity, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

const Matching_Type = ({ 
  question,
  leftItems = [],
  rightItems = [],
  correctPairs = [],
  image,
  showFeedback = false,
  onSelect,
  currentSelection = []
}) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState([]);

 
  useEffect(() => {
    setMatches(currentSelection);
  }, [currentSelection]);

  // Reset when question changes
  useEffect(() => {
    setSelectedLeft(null);
    setMatches([]);
  }, [question]);

  const handleLeftSelect = (leftId) => {
    if (!showFeedback) {
      setSelectedLeft(leftId === selectedLeft ? null : leftId);
    }
  };

  const handleRightSelect = (rightId) => {
    if (selectedLeft && !showFeedback) {
      const newMatch = { leftId: selectedLeft, rightId };
      const newMatches = [
        ...matches.filter(m => m.leftId !== selectedLeft),
        newMatch
      ];
      
      setMatches(newMatches);
      setSelectedLeft(null);
      onSelect(newMatches);
    }
  };

  const getMatchStatus = (leftId, rightId) => {
    if (!showFeedback) return 'neutral';
    
    const correctPair = correctPairs.find(p => p.leftId === leftId);
    const userPair = matches.find(m => m.leftId === leftId);

    if (!userPair) return 'neutral';
    
    const isCorrect = correctPair?.rightId === rightId;
    const isWrong = userPair.rightId === rightId && !isCorrect;

    return isCorrect ? 'correct' : isWrong ? 'wrong' : 'neutral';
  };

  const calculateLinePosition = (leftIndex, rightIndex) => {
    const leftPos = (leftIndex + 1) * (100 / (leftItems.length + 1));
    const rightPos = (rightIndex + 1) * (100 / (rightItems.length + 1));
    
    return {
      top: `${leftPos}%`,
      bottom: `${100 - rightPos}%`,
      transform: [{ rotate: '-3deg' }]
    };
  };

  return (
    <View className="w-full items-center p-4">
      <View className="flex-row items-center w-full px-4">
        {image && (
          <Image 
            source={{ uri: image }} 
            className="w-[100px] h-[100px] mr-2" 
            resizeMode="contain" 
          />
        )}
        <Text className="text-lg flex-1 font-OsSemibold text-violet-950">
          {question}
        </Text>
      </View>

      <View className="flex-row justify-between w-full mt-8">
        {/* Left Column */}
        <View className="w-[48%]">
          {leftItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleLeftSelect(item.id)}
              className={`mb-4 p-3 rounded-lg border-2 ${
                selectedLeft === item.id ? 'border-violet-950 bg-violet-100' : 'border-gray-300'
              } ${showFeedback ? 'opacity-50' : ''}`}
              disabled={showFeedback}
            >
              {item.image_src ? (
                <Image
                  source={{ uri: item.image_src }}
                  className="w-full h-16 rounded-md"
                  resizeMode="contain"
                />
              ) : (
                <Text className="text-center text-violet-950">{item.text}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Right Column */}
        <View className="w-[48%]">
          {rightItems.map((item, index) => {
            const status = getMatchStatus(
              matches.find(m => m.rightId === item.id)?.leftId,
              item.id
            );

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleRightSelect(item.id)}
                className={`mb-4 p-3 rounded-lg border-2 ${
                  status === 'correct' ? 'border-green-500 bg-green-100' :
                  status === 'wrong' ? 'border-red-500 bg-red-100' :
                  'border-gray-300'
                } ${showFeedback ? 'opacity-50' : ''}`}
                disabled={showFeedback}
              >
                <Text className="text-center text-violet-950">{item.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Connection Lines */}
      <View className="absolute w-full h-full pointer-events-none">
        {matches.map((match) => {
          const leftIndex = leftItems.findIndex(i => i.id === match.leftId);
          const rightIndex = rightItems.findIndex(i => i.id === match.rightId);
          const status = getMatchStatus(match.leftId, match.rightId);

          return (
            <View
              key={`${match.leftId}-${match.rightId}`}
              className="absolute border-2 border-dashed"
              style={[
                calculateLinePosition(leftIndex, rightIndex),
                {
                  borderColor: status === 'correct' ? '#10B981' : 
                               status === 'wrong' ? '#EF4444' : '#6D28D9'
                }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Matching_Type;