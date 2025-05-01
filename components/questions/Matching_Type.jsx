import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';

const Matching_Type = ({ challengeId }) => {
  const [pairs, setPairs] = useState([{ left: '', right: '' }]);

  const handleAddPair = () => {
    setPairs([...pairs, { left: '', right: '' }]);
  };

  const handlePairChange = (index, side, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index][side] = value;
    setPairs(updatedPairs);
  };

  const handleSubmit = async () => {
    if (!challengeId) {
      Alert.alert('Missing challenge ID');
      return;
    }

    if (pairs.some(p => !p.left.trim() || !p.right.trim())) {
      Alert.alert('Please fill in all pairs');
      return;
    }

    const options = pairs.map(pair => ({
      challenge_id: challengeId,
      content: pair.left,
      matching_pair: pair.right,
    }));

    const { error } = await supabase.from('challenge_options').insert(options);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved!', 'Matching options added.');
      setPairs([{ left: '', right: '' }]);
    }
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-2">Matching Pairs</Text>
      {pairs.map((pair, index) => (
        <View key={index} className="flex-row gap-2 mb-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-md p-2"
            placeholder="Left Side (e.g. Apple)"
            value={pair.left}
            onChangeText={(text) => handlePairChange(index, 'left', text)}
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-md p-2"
            placeholder="Right Side (e.g. Fruit)"
            value={pair.right}
            onChangeText={(text) => handlePairChange(index, 'right', text)}
          />
        </View>
      ))}

      <TouchableOpacity onPress={handleAddPair} className="bg-blue-500 py-2 px-4 rounded-md my-2">
        <Text className="text-white text-center">+ Add Pair</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} className="bg-green-600 py-3 px-4 rounded-md mt-4">
        <Text className="text-white text-center font-semibold">Save to Database</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Matching_Type;
