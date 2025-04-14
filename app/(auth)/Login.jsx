import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { router } from 'expo-router';
import images from '../../constants/images';
import icons from '../../constants/icons';
import { supabase } from '../../lib/gesturadb';

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  
  
  async function signInWithEmail() {
    setLoading(true);
   // const { error } = await supabase.auth.signInWithPassword({
    //   email: email,
    //   password: password,
    // });

    // if (error) {
    //   Alert.alert('Login Failed', error.message);
    // } else {
      router.replace('/(tabs)/home')
    // }
    setLoading(false);


  }

  const signInWithFacebook = async () => {
    try {
      const redirectUrl = makeRedirectUri({
        scheme: 'gestura',
        path: 'auth-callback',
        useProxy: true, 
      });
  
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl,
        },
      });
  
      if (error) throw error; 
  
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
  
        if (result.type === 'success' && result.url) {
          const params = new URL(result.url).searchParams;
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
  
          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            router.replace('/(tabs)/home');
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong with Facebook login.');
    }
  };
  


  const handleCreateAccountPress = () => {
    router.push('/Register');
  };

  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

        <View className="z-10 px-5">
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
          />
            <Image
              source={showPassword ? icons.eyehide : icons.eyeopen} 
              className="w-6 h-6"
              resizeMode="contain"
            />


          <CustomButton
            title="LOG IN"
            handlePress={signInWithEmail}
            containerStyles="w-full"
            textStyles="text-2xl font-Osmedium text-gray-50 text-center"
            isLoading={loading}
          />

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-2 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <View className="flex-row justify-center gap-4">
            <Image
              source={icons.google}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
             <TouchableOpacity onPress={signInWithFacebook}>
              <Image
                source={icons.fb}
                className="w-[45px] h-[45px]"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="mt-3 flex-row justify-center">
            <Text className="text-purple-400 font-Osregular">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleCreateAccountPress}>
              <Text className="text-gray-200 font-Osregular underline">
                Create New Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="absolute bottom-0 h-[55%] w-full bg-violet-950" />
      </ScrollView>
    </SafeAreaView>
  );
}