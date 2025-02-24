import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { supabase } from '../../lib/gesturadb';

export default function Register(){
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!isChecked) {
      Alert.alert('Error', 'You must agree to the Terms and Conditions to register.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else if (data.user && !data.session) {
      Alert.alert(
        'Check your email',
        'We sent you a confirmation email. Please verify your account.'
      );
      router.push('/(quiz)/Welcome');
    } else if (data.session) {
      Alert.alert('Registration Successful', 'You are now logged in!');
      router.replace('/(quiz)/Welcome');
    }
    setLoading(false);
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

        <View className="absolute top-[340px] h-full w-full bg-violet-950 rounded-t">
          <Text className="font-Osregular text-3xl text-center text-gray-50 p-5">
            REGISTRATION
          </Text>
        </View>

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles="mt-5"
          keyboardType="email-address"
        />

        <FormField
              title="Password"
              value={form.password} 
               handleChangeText={(e) => setForm({ ...form, password: e })}
            />
              <Image
                source={showPassword ? icons.eyehide : icons.eyeopen}
                className="w-4 h-0"
                resizeMode="contain"
              />

        <View className="flex-row items-center mb-4 justify-center">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className={`w-4 h-4 rounded-full border-2 border-gray-100 ${
              isChecked ? 'bg-purple-800' : 'bg-white'
            }`}
          />
          <Text className="ml-1 text-sm text-gray-400 font-Oslight">
            I agree to the <Text className="text-gray-50">Terms and Conditions</Text>
          </Text>
        </View>

        <CustomButton
          title="Register"
          handlePress={handleRegister}
          containerStyles="w-[350px] ml-5"
          textStyles="text-2xl font-Osmedium text-gray-50 text-center"
          isLoading={loading}
        />

        <View className="flex-row items-center mb-2 m-3">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500 text-sm">WITH</Text>
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
        <View className="justify-center items-center">
        <Text className="mt-2">
          <TouchableOpacity onPress={() => router.push('/Login')}>
            <Text className="text-gray-200 font-Osregular text-decoration-line: underline">
              I Have Account
            </Text>
          </TouchableOpacity>
        </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
