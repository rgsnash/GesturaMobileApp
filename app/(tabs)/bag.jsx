import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Animated } from 'react-native';
import { supabase } from '../../lib/supabase';

const Bag = () => {
  const [bagAssets, setBagAssets] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchBagAssets = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error getting user:', userError);
          return;
        }

        if (!user) {
          console.error('No logged-in user found.');
          return;
        }

        const userId = user.id;

        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', userId)
          .eq('completed', true);

        if (progressError) {
          console.error('Error fetching lesson progress:', progressError);
          return;
        }

        const completedLessonIds = progressData.map(p => p.lesson_id);
       

        if (completedLessonIds.length > 0) {
          const { data: assetsData, error: assetsError } = await supabase
            .from('bag_assets')
            .select('id, lesson_id, image_url, name')
            .in('lesson_id', completedLessonIds);

          if (assetsError) {
            console.error('Error fetching bag assets:', assetsError);
            return;
          }

          setBagAssets(assetsData);
      

          // Start animation after loading
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchBagAssets();
  }, []);

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="font-Mextrabold text-violet-950 text-3xl text-center mt-10">
        GESTURA
      </Text>
      <Text className="font-Osregular text-violet-950 text-xl text-center mt-5">
        Here's what you've collected!
      </Text>

      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
        {bagAssets.length > 0 ? (
          bagAssets.map((asset) => (
            <Animated.View
              key={asset.id}
              style={{ opacity: fadeAnim }}
              className="bg-gray-50 rounded-lg p-4 m-2 border-slate-300 border-2 border-b-4 w-[40%] items-center shadow-md"
            >
              <Image 
                source={{ uri: asset.image_url }}
                className="w-24 h-24 rounded-lg mb-2"
                resizeMode="contain"
              />
              <Text className="font-OsSemibold text-purple-950 text-center text-lg">{asset.name}</Text>
            </Animated.View>
          ))
        ) : (
          <Text className="text-gray-400 text-center mt-10">Nothing collected yet!</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Bag;