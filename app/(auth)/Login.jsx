import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import images from '@/constants/images';
import icons from '@/constants/icons';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = () => {
    router.push('/(tabs)/home');
  };

  const handleCreateAccountPress = () => {
    router.push('/(auth)/Register');
  };

  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="justify-center items-center">
          <Image
            source={images.Students}
            className="w-[250px] h-[180px] mt-10"
            resizeMode="contain"
          />
          <Text className="font-Mextrabold text-violet-950 text-7xl text-center mt-5 mb-20">
            GESTURA
          </Text>
        </View>

        <View className="absolute top-[350px] h-full w-full bg-violet-950 rounded-t" />

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles="mt-3"
          keyboardType="email-address"
        />

        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          secureTextEntry
        />

        <CustomButton
          title="LOG IN"
          handlePress={handleLogin}
          containerStyles="w-[350px] ml-5"
          textStyles="text-2xl font-Osmedium text-gray-50 text-center"
        />

        <View className="flex-row items-center mb-2 m-5">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500 text-sm">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <View className="flex-row justify-center">
          <Image
            source={icons.google}
            className="w-[40px] h-[40px] mt-1"
            resizeMode="contain"
          />
          <Image
            source={icons.fb}
            className="w-[50px] h-[45px]"
            resizeMode="contain"
          />
        </View>

        <Text className="mt-6">
          <Text className="text-center text-purple-400 font-Osregular">
            Don't have an account?{' '}
          </Text>
        </Text>
        <TouchableOpacity onPress={handleCreateAccountPress}>
          <Text className="text-gray-200 font-Osregular text-center underline">
            Create New Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
