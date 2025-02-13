import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from "@/constants/images"
import CustomButton from '@/components/CustomButton'

export default function index() {
  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className='w-full items-center min-h-[85vh] px-4 m'>
          <Image 
            source={images.logo}
            className="w-[120px] h-[80px] mt-15 mb-20"
            resizeMode="contain"
          />
          <Image
            source={images.Students}
            className="max-w--[280px] w-full max-h--[230px] mt-10"
            resizeMode='contain'
          />
          <Text className="text-2xl text-primary font-OsSemibold text-center mt-8 mb-10">
          Learn Filipino Sign Language For An Inclusive Future!
          </Text>

          <CustomButton
            title="Get Started"
            variant="primary"
            handlePress={() => router.push('/(auth)/Register')}
            containerStyles="w-full mt-20"
            textStyles="text-2xl font-Osmedium text-gray-50"
          />

          <CustomButton
            title="I Have Already An Account"
            handlePress={() => router.push('/(auth)/Login')}
            containerStyles="w-full mt-5"
            textStyles="text-2xl font-Osmedium text-violet-950"
          />

        </View>
      </ScrollView>

    </SafeAreaView>
  )
}