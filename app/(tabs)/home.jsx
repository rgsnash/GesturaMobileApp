import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from "../../constants/images"
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const lessons = [
  { id: 1, status: "unlocked" },  // Active lesson
  { id: 2, status: "locked" },
  { id: 3, status: "locked" },
  { id: 4, status: "locked" },
  { id: 5, status: "locked" }
];

const Home = () => {
  const [progress, setProgress] = useState(1); // Current unlocked lesson

  const handleLessonComplete = () => {
    if (progress < lessons.length) {
      setProgress(progress + 1); // Unlock next lesson
    }
  };

  return (
    <ScrollView>
      <SafeAreaView>
      <View className='w-full items-center min-h-[85vh] px-4 m'>
          <Image 
                      source={images.logo}
                      className="w-[35%] h-[15%] mt-15"
                      resizeMode="contain"
                    />
          <CustomButton
            title="Section 1: Alphabets"
            variant="primary"
            handlePress={() => router.push('/(tabs)/bag')}
            containerStyles="rounded-full w-full"
            textStyles="text-2xl font-Osmedium text-gray-50"
          />

          <TouchableOpacity onPress={handleLessonComplete} className="mt-5">
            <Text className="bg-gray-200 px-4 py-2 rounded-lg">START</Text>
          </TouchableOpacity>

          <View className="flex-row flex-wrap justify-center mt-5">
            {lessons.map((lesson, index) => (
              <TouchableOpacity 
              key={lesson.id} 
              disabled={index >= progress} 
              onPress={() => router.push('(sectionOne)/lessonOne')}
            >
              <Image 
                source={index < progress ? images.Unlocked1 : images.Locked} 
                className="w-16 h-16 m-2"
              />
            </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Home;
