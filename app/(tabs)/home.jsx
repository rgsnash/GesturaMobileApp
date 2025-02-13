import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from "@/constants/images"
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

const home = () => {
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
           
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default home